const nodemailer = require('nodemailer');
const logger = require('./logger');

if (!process.env.BREVO_FROM_EMAIL) {
    logger.error('❌ ERRO: BREVO_FROM_EMAIL não está definido no arquivo .env');
    throw new Error('BREVO_FROM_EMAIL não configurado');
}

if (!process.env.ADMIN_EMAIL) {
    logger.error('❌ ERRO: ADMIN_EMAIL não está definido no arquivo .env');
    throw new Error('ADMIN_EMAIL não configurado');
}

if (!process.env.BREVO_SMTP_USER && !process.env.BREVO_FROM_EMAIL) {
    logger.error('❌ ERRO: BREVO_SMTP_USER não está definido no arquivo .env');
    throw new Error('BREVO_SMTP_USER não configurado');
}

if (!process.env.BREVO_SMTP_PASSWORD && !process.env.BREVO_API_KEY) {
    logger.error('❌ ERRO: BREVO_SMTP_PASSWORD não está definido no arquivo .env');
    throw new Error('BREVO_SMTP_PASSWORD não configurado');
}

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.BREVO_SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USER || process.env.BREVO_FROM_EMAIL,
        pass: process.env.BREVO_SMTP_PASSWORD || process.env.BREVO_API_KEY,
    },
});

transporter.verify((error, success) => {
    if (error) {
        logger.error('❌ Erro ao conectar com Brevo SMTP:', error.message);
    } else {
        logger.info('✅ Servidor de e-mail (Brevo) pronto para enviar mensagens');
    }
});

const getContactNotificationTemplate = (data) => {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novo Contato - Portfolio</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="padding: 40px 40px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                                    📬 Novo Contato Recebido
                                </h1>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="padding: 40px;">
                                <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                                    Você recebeu uma nova mensagem através do seu portfólio:
                                </p>
                                
                                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                                    <tr>
                                        <td style="padding: 12px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                                            <strong style="color: #333333;">👤 Nome:</strong>
                                        </td>
                                        <td style="padding: 12px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; color: #555555;">
                                            ${data.name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px; background-color: #ffffff; border-bottom: 1px solid #e9ecef;">
                                            <strong style="color: #333333;">📧 E-mail:</strong>
                                        </td>
                                        <td style="padding: 12px; background-color: #ffffff; border-bottom: 1px solid #e9ecef;">
                                            <a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">
                                                ${data.email}
                                            </a>
                                        </td>
                                    </tr>
                                    ${data.phone ? `
                                    <tr>
                                        <td style="padding: 12px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef;">
                                            <strong style="color: #333333;">📱 Telefone:</strong>
                                        </td>
                                        <td style="padding: 12px; background-color: #f8f9fa; border-bottom: 1px solid #e9ecef; color: #555555;">
                                            ${data.phone}
                                        </td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 12px; background-color: #ffffff; border-bottom: 1px solid #e9ecef;">
                                            <strong style="color: #333333;">🌐 IP:</strong>
                                        </td>
                                        <td style="padding: 12px; background-color: #ffffff; border-bottom: 1px solid #e9ecef; color: #555555;">
                                            ${data.ipAddress || 'N/A'}
                                        </td>
                                    </tr>
                                </table>
                                
                                <div style="margin: 30px 0;">
                                    <strong style="color: #333333; font-size: 16px; display: block; margin-bottom: 10px;">
                                        💬 Mensagem:
                                    </strong>
                                    <div style="padding: 20px; background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px; color: #555555; line-height: 1.6; white-space: pre-wrap;">
                                        ${data.subject}
                                    </div>
                                </div>
                               
                                <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e9ecef;">
                                    <a href="mailto:${data.email}?subject=Re: Contato via Portfolio" 
                                       style="display: inline-block; padding: 12px 24px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500;">
                                        Responder E-mail
                                    </a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                                <p style="margin: 0; color: #999999; font-size: 12px;">
                                    Enviado automaticamente do seu portfólio em ${new Date().toLocaleString('pt-BR')}
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

const getConfirmationTemplate = (name) => {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mensagem Recebida - Daniel Alipio</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <tr>
                            <td style="padding: 40px 40px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                                    ✅ Mensagem Recebida!
                                </h1>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="padding: 40px;">
                                <p style="margin: 0 0 20px; color: #333333; font-size: 18px; font-weight: 500;">
                                    Olá, ${name}!
                                </p>
                                
                                <p style="margin: 0 0 15px; color: #666666; font-size: 16px; line-height: 1.6;">
                                    Obrigado por entrar em contato! Recebi sua mensagem e vou analisá-la com atenção.
                                </p>
                                
                                <p style="margin: 0 0 15px; color: #666666; font-size: 16px; line-height: 1.6;">
                                    Retornarei o mais breve possível, geralmente em até 24-48 horas.
                                </p>
                                
                                <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px;">
                                    <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.6;">
                                        💡 <strong>Dica:</strong> Enquanto isso, fique à vontade para explorar meus projetos e conhecer mais sobre meu trabalho!
                                    </p>
                                </div>
                                
                                <p style="margin: 30px 0 0; color: #666666; font-size: 16px; line-height: 1.6;">
                                    Atenciosamente,<br>
                                    <strong style="color: #333333;">Daniel Alipio</strong>
                                </p>
                            </td>
                        </tr>
                        
                        <tr>
                            <td style="padding: 20px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                                <p style="margin: 0 0 10px; color: #999999; font-size: 12px;">
                                    Este é um e-mail automático, por favor não responda.
                                </p>
                                <p style="margin: 0; color: #999999; font-size: 12px;">
                                    © ${new Date().getFullYear()} - Daniel Alipio.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

async function sendContactNotification(contactData) {
    try {
        const mailOptions = {
            from: `"Daniel Alípio" <${process.env.BREVO_FROM_EMAIL}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `🔔 Novo contato de ${contactData.name}`,
            html: getContactNotificationTemplate(contactData),
            text: `
Novo contato recebido!

Nome: ${contactData.name}
E-mail: ${contactData.email}
Telefone: ${contactData.phone || 'Não informado'}
IP: ${contactData.ipAddress || 'N/A'}

Mensagem:
${contactData.subject}

---
Enviado em ${new Date().toLocaleString('pt-BR')}
            `.trim(),
        };

        const info = await transporter.sendMail(mailOptions);

        logger.info(`✅ E-mail de notificação enviado para ${process.env.ADMIN_EMAIL} - ID: ${info.messageId}`);

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        logger.error('❌ Erro ao enviar e-mail de notificação:', error);
        throw error;
    }
}

async function sendConfirmationEmail(userEmail, userName) {
    try {
        logger.info(`📤 Preparando envio de e-mail de confirmação...`);
        logger.info(`   From: ${process.env.BREVO_FROM_EMAIL}`);
        logger.info(`   To: ${userEmail}`);

        const mailOptions = {
            from: `"Daniel Alípio" <${process.env.BREVO_FROM_EMAIL}>`,
            to: userEmail,
            subject: '✅ Mensagem recebida - Daniel Alipio',
            html: getConfirmationTemplate(userName),
            text: `
Olá, ${userName}!

Obrigado por entrar em contato! Recebi sua mensagem e vou analisá-la com atenção.

Retornarei o mais breve possível, geralmente em até 24-48 horas.

Atenciosamente,
Daniel Alipio

---
Este é um e-mail automático, por favor não responda.
            `.trim(),
        };

        const info = await transporter.sendMail(mailOptions);

        logger.info(`✅ E-mail de confirmação enviado para ${userEmail} - ID: ${info.messageId}`);

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        logger.error(`❌ Erro ao enviar e-mail de confirmação para ${userEmail}:`, error);
        return {
            success: false,
            error: error.message,
        };
    }
}

module.exports = {
    transporter,
    sendContactNotification,
    sendConfirmationEmail,
};

