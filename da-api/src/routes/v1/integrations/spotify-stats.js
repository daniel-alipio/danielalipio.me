const SpotifyService = require('../../../services/SpotifyService');
const logger = require('../../../utils/logger');

module.exports = {
    method: 'GET',
    requiresAuth: false,

    async run(req, res) {
        try {
            const stats = SpotifyService.getRateLimitStats();

            const response = {
                success: true,
                timestamp: new Date().toISOString(),
                data: {
                    rateLimit: {
                        current: stats.requestsLast30s,
                        limit: stats.limit,
                        safeLimit: stats.safeLimit,
                        percentage: stats.percentage,
                        status: stats.isHealthy ? 'healthy' : 'warning',
                        retryAfter: stats.retryAfter
                    },
                    token: {
                        cached: stats.tokenCached,
                        expiresAt: stats.tokenExpiresAt
                    },
                    cache: {
                        hasLastData: stats.hasLastData
                    }
                }
            };

            logger.debug('[SPOTIFY STATS] Stats solicitadas:', response.data);

            return res.status(200).json(response);

        } catch (error) {
            logger.error('[SPOTIFY STATS] Erro ao buscar stats:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar estatísticas',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

