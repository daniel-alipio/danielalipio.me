const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error('Erro não tratado:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        url: req.url,
        method: req.method,
        ip: req.ip || req.connection?.remoteAddress || 'unknown',
        body: process.env.NODE_ENV === 'development' ? req.body : undefined
    });

    const statusCode = err.statusCode || err.status || 500;

    const message = process.env.NODE_ENV === 'production'
        ? 'Erro interno do servidor' 
        : err.message;

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { 
            stack: err.stack,
            error: err 
        })
    });
};

const notFoundHandler = (req, res) => {
    logger.warn(`Rota não encontrada: ${req.method} ${req.url}`, {
        method: req.method,
        url: req.url,
        ip: req.ip
    });
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        path: req.url
    });
};

const setupProcessHandlers = () => {
    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled Rejection detectada:', {
            reason: reason instanceof Error ? reason.message : reason,
            stack: reason instanceof Error ? reason.stack : undefined,
            promise
        });

        if (process.env.NODE_ENV === 'production') {
            console.error('Unhandled Rejection! Shutting down...');
            process.exit(1);
        }
    });

    process.on('uncaughtException', (error) => {
        logger.error('Uncaught Exception detectada:', {
            message: error.message,
            stack: error.stack
        });

        console.error('Uncaught Exception! Shutting down...');
        setTimeout(() => process.exit(1), 1000);
    });

    const gracefulShutdown = (signal) => {
        logger.info(`${signal} recebido. Encerrando gracefully...`);

        setTimeout(() => {
            logger.info('Processo encerrado');
            process.exit(0);
        }, 5000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};
module.exports = {
    errorHandler,
    notFoundHandler,
    setupProcessHandlers
};
