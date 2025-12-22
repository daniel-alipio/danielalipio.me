const compression = require('compression');
const logger = require('../utils/logger');

const compressionMiddleware = compression({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }

        return compression.filter(req, res);
    },
    level: 6,
    threshold: 1024,
});

logger.info(`Middleware de compressão configurado (nível 6, threshold 1KB)`);

module.exports = compressionMiddleware;

