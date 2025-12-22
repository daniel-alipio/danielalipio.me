const Redis = require('ioredis');
const config = require('../config/config')();
const logger = require('../utils/logger');

const sanitizePayloadForLog = (payload) => {
    const sensitiveFields = [
        'password', 'senha', 'token', 'secret', 'key',
        'cpf', 'rg', 'ssn', 'credit_card', 'cvv',
        'api_key', 'private_key', 'sessionToken',
        'email', 'telefone', 'phone'
    ];

    if (typeof payload !== 'object' || payload === null) {
        return `<${typeof payload}>`;
    }

    const sanitized = {};

    for (const [key, value] of Object.entries(payload)) {
        const isSensitive = sensitiveFields.some(field =>
            key.toLowerCase().includes(field.toLowerCase())
        );

        if (isSensitive) {
            sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = '<object>';
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized;
};

let redisClient = null;

const connect = async () => {
    if (config.handler.redis.active === false) {
        logger.warn('[REDIS] Redis desativado nas configurações (active: false).');
        return null;
    }

    return new Promise((resolve) => {
        try {
            const retryStrategy = (times) => {
                const MAX_RETRIES = config.IS_DEV ? 5 : 10;

                if (times > MAX_RETRIES) {
                    logger.error(`[REDIS] Máximo de ${MAX_RETRIES} tentativas atingido.`);
                    return null;
                }

                return Math.min(times * 50, 2000);
            };

            const options = {
                retryStrategy,
                maxRetriesPerRequest: 3
            };

            if (config.handler.redis.url) {
                logger.info('[REDIS] Usando conexão via Connection String (URL).');
                redisClient = new Redis(config.handler.redis.url, options);
            } else {
                logger.info('[REDIS] Usando conexão via Host/Port.');
                redisClient = new Redis({
                    host: config.handler.redis.host,
                    port: config.handler.redis.port,
                    password: config.handler.redis.password,
                    db: config.handler.redis.db || 1,
                    ...options
                });
            }

            redisClient.on('connect', () => {
                logger.info('[REDIS] Conexão estabelecida (Publisher). Aguardando prontidão...');
            });

            redisClient.on('ready', () => {
                logger.info('[REDIS] Cliente pronto para publicar mensagens.');
                resolve(redisClient);
            });

            redisClient.on('error', (err) => {
                if (err.code === 'ECONNREFUSED') {
                    logger.warn(`[REDIS] Não foi possível conectar ao Redis. Verifique se o servidor está rodando.`);
                } else {
                    logger.error('[REDIS] Erro na conexão:', err);
                }
            });

            setTimeout(() => {
                if (redisClient.status !== 'ready') {
                    logger.warn('[REDIS] Timeout na inicialização. API iniciará sem Redis.');
                    resolve(null);
                }
            }, 3000);

        } catch (error) {
            logger.error('[REDIS] Falha crítica ao inicializar:', error);
            resolve(null);
        }
    });
};

const publishEvent = async (eventName, payload) => {
    if (!redisClient || redisClient.status !== 'ready') {
        logger.warn(`[REDIS] Cliente não pronto. Evento '${eventName}' não publicado.`);
        return;
    }

    try {
        const message = JSON.stringify({
            event: eventName,
            data: payload,
            timestamp: new Date()
        });

        await redisClient.publish('dasys:sync', message);

        if (config.logs_settings.ALL_DEBUG) {
            const safePayload = sanitizePayloadForLog(payload);
            logger.debug(`[REDIS] Evento publicado: ${eventName}`, safePayload);
        } else {
            logger.debug(`[REDIS] Evento publicado: ${eventName}`);
        }

    } catch (error) {
        if (config.IS_DEV) {
            logger.error(`[REDIS] Erro ao publicar evento ${eventName}:`, error);
        } else {
            logger.error(`[REDIS] Erro ao publicar evento ${eventName}:`, error.message);
        }
    }
};

const getCache = async (key) => {
    if (!redisClient || redisClient.status !== 'ready') {
        logger.debug(`[REDIS] Tentativa de buscar cache para '${key}' falhou: Cliente não conectado.`);
        return null;
    }

    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        logger.error(`[REDIS] Erro ao obter cache para '${key}':`, e);
        return null;
    }
}

const setCache = async(key, data, ttlSeconds = 3600) => {
    if (!redisClient || redisClient.status !== 'ready') {
        logger.debug(`[REDIS] Tentativa de definir cache para '${key}' falhou: Cliente não conectado.`);
        return;
    }

    try {
        await redisClient.set(key, JSON.stringify(data), 'EX', ttlSeconds);
        logger.debug(`[REDIS] Cache definido para '${key}' com TTL de ${ttlSeconds} segundos.`);
    } catch (e) {
        logger.error(`[REDIS] Erro ao definir cache para '${key}':`, e);
    }
}

const invalidateCache = async (key) => {
    if (!redisClient || redisClient.status !== 'ready') {
        logger.debug(`[REDIS] Tentativa de invalidar cache para '${key}' falhou: Cliente não conectado.`);
        return;
    }

    try {
        await redisClient.del(key);
        logger.debug(`[REDIS] Cache invalidado para '${key}'.`);
    } catch (e) {
        logger.error(`[REDIS] Erro ao invalidar cache para '${key}':`, e);
    }
}

module.exports = {
    connect,
    publishEvent,
    getCache,
    setCache,
    invalidateCache
};
