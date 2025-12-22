const Contact = require('../../data/schema/ContactSchema');
const { sendContactNotification, sendConfirmationEmail } = require('../../utils/mailer');
const { sendResponse } = require('../../utils/common');
const logger = require('../../utils/logger');
const validate = require('../../middlewares/validate');
const { contactSchema } = require('../../validators/contactValidator');
const rateLimit = require('express-rate-limit');

const contactRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        description: 'Muitas tentativas de envio. Por favor, aguarde 15 minutos antes de tentar novamente.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    handler: (req, res) => {
        logger.warn(`🚨 Rate limit de contato excedido - IP: ${req.ip}, Email: ${req.body?.email}`);
        return sendResponse(res, 429, 'Muitas tentativas de envio. Por favor, aguarde 15 minutos antes de tentar novamente.');
    }
});

module.exports = {
    method: 'POST',
    requiresAuth: false,
    validate: validate(contactSchema, 'body'),

    async run(req, res) {
        try {
            const { name, email, phone, subject } = req.body;
            const ipAddress = req.ip || req.connection.remoteAddress;

            logger.info(`📬 Nova tentativa de contato de: ${name} <${email}> - IP: ${ipAddress}`);

            const recentContactsByEmail = await Contact.countRecentByEmail(email, 24);
            if (recentContactsByEmail >= 3) {
                logger.warn(`🚨 Email ${email} já enviou ${recentContactsByEmail} mensagens nas últimas 24h`);
                return sendResponse(res, 429, 'Você já enviou várias mensagens recentemente. Por favor, aguarde antes de enviar novamente.');
            }

            const recentContactsByIP = await Contact.findRecentByIP(ipAddress, 60);
            if (recentContactsByIP.length >= 2) {
                logger.warn(`🚨 IP ${ipAddress} já enviou ${recentContactsByIP.length} mensagens na última hora`);
                return sendResponse(res, 429, 'Muitas mensagens enviadas deste dispositivo. Por favor, aguarde um pouco.');
            }

            const suspiciousPatterns = [
                /\b(viagra|cialis|lottery|casino|crypto|bitcoin)\b/i,
                /\b(click here|limited time|act now)\b/i,
                /(http:\/\/|https:\/\/|www\.)[^\s]{30,}/gy
            ];

            const isSuspicious = suspiciousPatterns.some(pattern =>
                pattern.test(subject) || pattern.test(name)
            );

            if (isSuspicious) {
                logger.warn(`🚨 Conteúdo suspeito detectado de ${email}`);
                return sendResponse(res, 400, 'Não foi possível processar sua mensagem. Por favor, revise o conteúdo.');
            }

            const contactData = {
                name,
                email,
                phone: phone || null,
                subject,
                ipAddress,
                status: 'new',
                emailSent: false,
                confirmationSent: false
            };

            const contact = await Contact.createContact(contactData);
            logger.info(`✅ Contato salvo no banco de dados - ID: ${contact._id}`);

            try {
                await sendContactNotification({
                    name,
                    email,
                    phone,
                    subject,
                    ipAddress
                });

                contact.emailSent = true;
                await contact.save();

                logger.info(`✅ E-mail de notificação enviado com sucesso para ${process.env.ADMIN_EMAIL}`);
            } catch (emailError) {
                logger.error('❌ Erro ao enviar e-mail de notificação:', emailError);
            }

            try {
                await sendConfirmationEmail(email, name);
                contact.confirmationSent = true;
                await contact.save();
            } catch (confirmError) {
                logger.error('❌ Erro ao enviar e-mail de confirmação:', confirmError);
            }

            return sendResponse(res, 200, 'Mensagem enviada com sucesso! Retornaremos em breve.', {
                contactId: contact._id,
                sentAt: contact.createdAt
            });

        } catch (error) {
            logger.error('[CONTACT] Erro ao processar contato:', error);

            return sendResponse(
                res,
                500,
                'Erro ao enviar mensagem. Por favor, tente novamente mais tarde.',
                process.env.NODE_ENV === 'development' ? { error: error.message } : undefined
            );
        }
    },

    rateLimiter: contactRateLimiter
};

