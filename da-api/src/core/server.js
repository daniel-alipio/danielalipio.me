const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const fs = require('fs');
const path = require('path'); 
const { connect, db } = require('../data/database');
const { connect: connectRedis, publishEvent } = require('./redis');
const logger = require('../utils/logger');
const requestLogger = require('../middlewares/requestLogger');
const authMiddleware = require('../middlewares/auth');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const compressionMiddleware = require('../middlewares/compression');
const { errorHandler, notFoundHandler, setupProcessHandlers } = require('../middlewares/errorHandler');
require('./passport');
require('dotenv').config({ path: path.join(__dirname, '..', 'config', '.env') });

const config = require('../config/config')();

const REQUIRED_ENV_VARS = [
    'USER_SECRET', 'ADMIN_SECRET', 'SESSION_SECRET', 'JWT_SECRET', 'JWT_SECRET_TEMP',
    'MYSQL_HOST', 'MYSQL_PORT', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE',
    'REDIS_URL', 'REDIS_HOST', 'REDIS_PORT', 'MONGODB_URI', 'MYSQL_URI'
];

function loadRoutes(app) {
    const routesPath = path.join(__dirname, '..', 'routes');
    const readDirectory = (directory, baseRoute = '') => {
        try {
            const files = fs.readdirSync(directory);
            files.forEach((file) => {
                const fullPath = path.join(directory, file);
                const stat = fs.statSync(fullPath);

                if (stat.isDirectory()) {
                    readDirectory(fullPath, `${baseRoute}/${file}`);
                } else if (file.endsWith('.js')) {
                    const routeModule = require(fullPath);
                    const { method, run } = routeModule;
                    const routeName = path.basename(file, '.js');
                    const routePathUrl = `${baseRoute}/${routeName === 'index' ? '' : routeName}`;
                    if (method && typeof run === 'function') {
                        const httpMethod = method.toLowerCase();
                        if (typeof app[httpMethod] === 'function') {
                            const auth = (req, res, next) => authMiddleware(req, res, next, routeModule);
                            const validation = routeModule.validate || ((req, res, next) => next());

                            const middlewares = [auth, validation];
                            if (routeModule.rateLimiter) {
                                middlewares.unshift(routeModule.rateLimiter);
                            }

                            app[httpMethod](routePathUrl, ...middlewares, run);
                            logger.info(`Rota [${httpMethod.toUpperCase()}] ${routePathUrl} do arquivo ${file} carregada.`);
                        } else {
                            logger.warn(`Método HTTP '${method}' inválido no arquivo de rota ${file}.`);
                        }
                    } else {
                        logger.warn(`O arquivo de rota ${file} não exporta um módulo válido (method, run).`);
                    }
                }
            });
        } catch (error) {
            logger.error(`Erro ao carregar rotas do diretório ${directory}:`, error);
        }
    };
    readDirectory(path.join(routesPath, 'v1'), '/api/v1');
}

const app = express();

const allowedOrigins = [
    'https://danielalipio.vercel.app',
    'https://www.danielalipio.me',
    'https://danielalipio.me'
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

if (process.env.NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:5173');
    allowedOrigins.push('http://localhost:4173');
    allowedOrigins.push('http://127.0.0.1:5173');
}

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.includes(origin);

        const allowedVercelDomains = [
            'danielalipio.vercel.app',
            'danielalipio-preview.vercel.app'
        ];

        const isVercelDomain = allowedVercelDomains.some(domain => origin.includes(domain));

        if (isAllowed || isVercelDomain) {
            return callback(null, true);
        }

        logger.warn(`CORS bloqueou origem não autorizada: ${origin}`);
        const msg = 'A política de CORS para este site não permite acesso da Origem especificada.';
        return callback(new Error(msg), false);
    },
    credentials: true,
};

const sessionStore = new MySQLStore({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    expiration: 1000 * 60 * 60 * 24 * 7,
    clearExpired: true,
    checkExpirationInterval: 900000,
    endConnectionOnClose: true,
});

let sessionStoreReconnecting = false;

sessionStore.on('error', error => {
    logger.error('MySQL Session Store Error:', error.message);

    if (!sessionStoreReconnecting) {
        sessionStoreReconnecting = true;
        logger.warn('Tentando reconectar ao MySQL Session Store...');

        setTimeout(() => {
            sessionStoreReconnecting = false;
        }, 60000);
    }
});

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
} else {
    app.set('trust proxy', false);
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(compressionMiddleware);

app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    } : false,
    hsts: process.env.NODE_ENV === 'production' ? {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    } : false,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production',
    crossOriginOpenerPolicy: process.env.NODE_ENV === 'production' ? { policy: "same-origin" } : false,
    crossOriginResourcePolicy: process.env.NODE_ENV === 'production' ? { policy: "same-origin" } : false,
}));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(requestLogger);
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW) || 900000;
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX) || 50;

const authLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW,
    max: Math.floor(RATE_LIMIT_MAX * 0.1),
    message: {
        success: false,
        description: 'Muitas tentativas de autenticação. Por favor, tente novamente em 15 minutos.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (req, res) => {
        logger.warn(`🚨 Rate limit excedido na autenticação - IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            description: 'Muitas tentativas de autenticação. Por favor, tente novamente em 15 minutos.'
        });
    }
});

const adminLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW,
    max: RATE_LIMIT_MAX,
    message: {
        success: false,
        description: 'Muitas requisições administrativas. Tente novamente em alguns minutos.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`🚨 Rate limit excedido em rota admin - IP: ${req.ip} - Rota: ${req.path}`);
        res.status(429).json({
            success: false,
            description: 'Muitas requisições administrativas. Tente novamente em alguns minutos.'
        });
    }
});

const apiLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW,
    max: RATE_LIMIT_MAX * 2,
    message: {
        success: false,
        description: 'Muitas requisições. Por favor, aguarde alguns minutos antes de tentar novamente.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const globalLimiter = rateLimit({
    windowMs: 60000,
    max: Math.floor(RATE_LIMIT_MAX * 1.2),
    message: 'Muitas requisições. Aguarde 1 minuto.'
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 2
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(globalLimiter);
app.use('/api/v1/session/login', authLimiter);
app.use('/api/v1/session/register', authLimiter);
app.use('/api/v1/admin', adminLimiter);
app.use('/api/v1', apiLimiter);

loadRoutes(app);

app.get('/api/health', async (req, res) => {
    const health = {
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mode: process.env.NODE_ENV || 'UNKNOWN',
        services: {
            mongodb: 'UNKNOWN',
            redis: 'UNKNOWN',
            mysql: 'UNKNOWN'
        }
    };

    try {
        if (db.mongodb && db.mongodb.connection) {
            try {
                await db.mongodb.connection.db.admin().ping();
                health.services.mongodb = 'UP';
            } catch (error) {
                health.services.mongodb = 'DOWN';
                health.status = 'DEGRADED';
                logger.warn('MongoDB health check falhou:', error.message);
            }
        } else {
            health.services.mongodb = 'NOT_CONFIGURED';
        }

        const redisClient = require('./redis').client;
        if (redisClient && redisClient.status === 'ready') {
            try {
                await redisClient.ping();
                health.services.redis = 'UP';
            } catch (error) {
                health.services.redis = 'DOWN';
                health.status = 'DEGRADED';
                logger.warn('Redis health check falhou:', error.message);
            }
        } else {
            health.services.redis = 'DOWN';
            health.status = 'DEGRADED';
        }

        if (db.mysql) {
            try {
                await db.mysql.query('SELECT 1');
                health.services.mysql = 'UP';
            } catch (error) {
                health.services.mysql = 'DOWN';
                health.status = 'DEGRADED';
                logger.warn('MySQL health check falhou:', error.message);
            }
        } else {
            health.services.mysql = 'NOT_CONFIGURED';
        }

        const statusCode = health.status === 'UP' ? 200 : 503;
        res.status(statusCode).json(health);

    } catch (error) {
        health.status = 'DOWN';
        logger.error('Health check geral falhou:', error.message);
        res.status(503).json(health);
    }
});

app.use(notFoundHandler);
app.use(errorHandler);
setupProcessHandlers();

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            const missing = REQUIRED_ENV_VARS.filter(v => !process.env[v]);

            if (missing.length > 0) {
                logger.error(`Variáveis de ambiente obrigatórias não definidas: ${missing.join(', ')}`);
                process.exit(1);
            }
        }

        logger.info('Iniciando conexões de infraestrutura...');
        
        await connect();
        await connectRedis();

        app.listen(PORT, () => {
            logger.info(`Servidor API rodando na porta ${PORT}`);
            
            publishEvent('OnApiReady', {
                uptime: process.uptime(),
                timestamp: new Date(),
                environment: config.state
            });
        });

    } catch (e) {
        logger.error('Falha crítica na inicialização do servidor:', e);
        process.exit(1);
    }
})();

module.exports = app;
