const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'USER_SECRET',
    'ADMIN_SECRET'
];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`Variável de ambiente ${varName} não definida`);
    }
});

module.exports = () => {
    const NODE_ENV = process.env.NODE_ENV || 'development';
    return {
        state: NODE_ENV,

        handler: {
            mongodb: {
                uri: process.env.MONGODB_URI,
                connected: false
            },
            mysql: {
                uri: process.env.MYSQL_URI,
                connected: false,
                active: false
            },
            redis: {
                host: process.env.REDIS_HOST || '127.0.0.1',
                port: process.env.REDIS_PORT,
                password: process.env.REDIS_PASSWORD || undefined,
                active: process.env.REDIS_ACTIVE || false
            }
        },

        logs_settings: {
            ALL_DEBUG: true,
            DB_DEBUG: true,
            EVENT_DEBUG: false,
            COMMAND_DEBUG: true,
            APP_DEBUG: true
        },

        auth_settings: {
            userSecret: process.env.USER_SECRET,
            adminSecret: process.env.ADMIN_SECRET,
            jwtSecret: process.env.JWT_SECRET
        },

        github: {
            username: process.env.GITHUB_USERNAME,
            token: process.env.GITHUB_TOKEN
        },

        IS_DEV: NODE_ENV === 'development'
    };
};
