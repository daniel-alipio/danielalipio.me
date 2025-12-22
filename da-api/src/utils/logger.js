const { colors } = require('./common.js');
const config = require('../config/config')();
const path = require('path');

let winstonLogger = null;
if (process.env.NODE_ENV === 'production') {
    const winston = require('winston');
    const DailyRotateFile = require('winston-daily-rotate-file');

    const logDir = process.env.LOG_DIR || 'logs';

    const customFormat = winston.format.combine(
        winston.format.timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    );

    const transports = [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
                    return `[${timestamp}] ${level}: ${message} ${metaStr}`;
                })
            )
        }),

        new DailyRotateFile({
            filename: path.join(logDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: '20m',
            maxFiles: '14d',
            format: customFormat
        }),

        new DailyRotateFile({
            filename: path.join(logDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d',
            format: customFormat
        })
    ];

    winstonLogger = winston.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        format: customFormat,
        transports,
        exitOnError: false
    });
}

function getData() {
    const now = new Date();
    const pad = (num) => num.toString().padStart(2, '0');
    return `[${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} - ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}]`;
}

const logger = {
    debug: (message, type = 'GENERAL') => {
        if (config.logs_settings.ALL_DEBUG) {
            console.log(`${getData()} ${colors.CYAN}[DEBUG - ${type}]${colors.RESET}: ${message}`);
            if (winstonLogger) winstonLogger.debug(message, { type });
        }
    },
    discord: (message) => {
        if (config.logs_settings.ALL_DEBUG || config.logs_settings.CLIENT_DEBUG) {
            console.log(`${getData()} ${colors.BLUE}[CLIENT]${colors.RESET}: ${message}`);
            if (winstonLogger) winstonLogger.debug(message, { category: 'CLIENT' });
        }
    },
    commands: (message) => {
        if (config.logs_settings.ALL_DEBUG || config.logs_settings.COMMAND_DEBUG) {
            console.log(`${getData()} ${colors.MAGENTA}[COMMAND]${colors.RESET}: ${message}`);
            if (winstonLogger) winstonLogger.debug(message, { category: 'COMMAND' });
        }
    },
    events: (message) => {
        if (config.logs_settings.ALL_DEBUG || config.logs_settings.EVENT_DEBUG) {
            console.log(`${getData()} ${colors.GREEN}[EVENT]${colors.RESET}: ${message}`);
            if (winstonLogger) winstonLogger.debug(message, { category: 'EVENT' });
        }
    },
    database: (message) => {
        if (config.logs_settings.ALL_DEBUG || config.logs_settings.DB_DEBUG) {
            console.log(`${getData()} ${colors.YELLOW}[DATABASE]${colors.RESET}: ${message}`);
            if (winstonLogger) winstonLogger.debug(message, { category: 'DATABASE' });
        }
    },
    info: (message, meta = {}) => {
        console.log(`${getData()} ${colors.WHITE}[INFO]${colors.RESET}: ${message}`);
        if (winstonLogger) winstonLogger.info(message, meta);
    },
    components: (message, meta = {}) => {
        console.log(`${getData()} ${colors.CYAN}[COMPONENT]${colors.RESET}: ${message}`);
        if (winstonLogger) winstonLogger.info(message, { ...meta, category: 'COMPONENT' });
    },
    warn: (message, meta = {}) => {
        console.warn(`${getData()} ${colors.YELLOW}[WARN]${colors.RESET}: ${message}`);
        if (winstonLogger) winstonLogger.warn(message, meta);
    },
    error: (message, error = '') => {
        console.error(`${getData()} ${colors.RED}[ERROR]${colors.RESET}: ${message}`, error);
        if (winstonLogger) {
            winstonLogger.error(message, {
                error: error?.stack || error?.message || error,
                stack: error?.stack
            });
        }
    },
    acess: (req, status) => {
        const { method, url } = req;
        const sanitizedUrl = url.split('?')[0];
        const ip = (req.ip || req.connection.remoteAddress || '').replace(/:\d+$/, '');
        console.log(`${getData()} [ACESSO]: ${method} ${sanitizedUrl} - ${status} - IP: ${ip}`);
        if (winstonLogger) {
            winstonLogger.info('Request', {
                category: 'ACCESS',
                method,
                url: sanitizedUrl,
                status,
                ip
            });
        }
    },
    redis: (message, meta = {}) => {
        console.log(`${getData()} ${colors.BGMAGENTA}[REDIS]${colors.RESET}: ${message}`);
        if (winstonLogger) winstonLogger.info(message, { ...meta, category: 'REDIS' });
    }
};

module.exports = logger;
