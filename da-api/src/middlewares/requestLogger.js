const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    logger.acess(req, res.statusCode);
    next();
};

module.exports = requestLogger;
