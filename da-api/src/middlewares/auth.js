const { sendResponse } = require('../utils/common');
const logger = require('../utils/logger');

const authMiddleware = (req, res, next, routeModule) => {
    if (!routeModule.authRequired) {
        return next();
    }

    if (!req.session || !req.session.user) {
        logger.warn(`🚨 Acesso não autenticado bloqueado - IP: ${req.ip} - Rota: ${req.path}`);
        return sendResponse(res, 401, 'Autenticação necessária.');
    }

    const SESSION_MAX_AGE = 2 * 60 * 60 * 1000;
    const sessionAge = Date.now() - new Date(req.session.user.loginTime).getTime();

    if (sessionAge > SESSION_MAX_AGE) {
        req.session.destroy();
        logger.warn(`🚨 Sessão expirada - User: ${req.session.user.id} - IP: ${req.ip}`);
        return sendResponse(res, 401, 'Sessão expirada. Faça login novamente.');
    }

    if (routeModule.role === 'admin') {
        if (!req.session.user.role || req.session.user.role !== 'admin') {
            logger.error(`🚨 TENTATIVA DE ACESSO ADMIN NÃO AUTORIZADO - User: ${req.session.user.id} - Role: ${req.session.user.role} - IP: ${req.ip} - Rota: ${req.path}`);
            return sendResponse(res, 403, 'Acesso negado. Privilégios de administrador necessários.');
        }
    }

    req.session.user.lastActivity = new Date();

    req.user = req.session.user;

    next();
};

module.exports = authMiddleware;
