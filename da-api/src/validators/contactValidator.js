const Joi = require('joi');
const disposableDomains = require('disposable-email-domains');

const validateNotDisposableEmail = (value, helpers) => {
    const domain = value.split('@')[1];

    if (disposableDomains.includes(domain)) {
        return helpers.error('any.invalid', {
            message: 'E-mails temporários ou descartáveis não são permitidos'
        });
    }

    return value;
};

const validatePhone = (value, helpers) => {
    if (!value) return value;

    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length < 10 || cleaned.length > 11) {
        return helpers.error('any.invalid', {
            message: 'Telefone deve ter formato válido (10 ou 11 dígitos)'
        });
    }

    return value;
};

const contactSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Nome é obrigatório',
            'string.min': 'Nome deve ter no mínimo 2 caracteres',
            'string.max': 'Nome deve ter no máximo 100 caracteres',
            'any.required': 'Nome é obrigatório'
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: true } })
        .max(100)
        .required()
        .custom(validateNotDisposableEmail, 'validação de e-mail descartável')
        .messages({
            'string.empty': 'E-mail é obrigatório',
            'string.email': 'E-mail deve ser válido',
            'string.max': 'E-mail deve ter no máximo 100 caracteres',
            'any.required': 'E-mail é obrigatório',
            'any.invalid': 'E-mails temporários ou descartáveis não são permitidos'
        }),

    phone: Joi.string()
        .trim()
        .max(20)
        .allow('', null)
        .optional()
        .custom(validatePhone, 'validação de telefone')
        .messages({
            'string.max': 'Telefone deve ter no máximo 20 caracteres',
            'any.invalid': 'Telefone deve ter formato válido'
        }),

    subject: Joi.string()
        .trim()
        .min(10)
        .max(2000)
        .required()
        .messages({
            'string.empty': 'Assunto é obrigatório',
            'string.min': 'Assunto deve ter no mínimo 10 caracteres',
            'string.max': 'Assunto deve ter no máximo 2000 caracteres',
            'any.required': 'Assunto é obrigatório'
        })
});

module.exports = {
    contactSchema,
};

