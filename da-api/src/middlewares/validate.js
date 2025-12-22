const { sendResponse } = require('../utils/common');
const logger = require('../utils/logger');

const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            logger.warn(`🚨 Validação falhou [${property}] - IP: ${req.ip}`, { errors });

            return sendResponse(res, 400, 'Dados inválidos', { errors });
        }

        req[property] = value;
        next();
    };
};

module.exports = validate;
