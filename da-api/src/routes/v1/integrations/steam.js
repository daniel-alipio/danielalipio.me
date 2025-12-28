const steamService = require('../../../services/SteamService');
const logger = require('../../../utils/logger');

module.exports = {
    method: 'GET',
    requiresAuth: false,

    async run(req, res) {
        try {
            if (!process.env.STEAM_API_KEY || !process.env.STEAM_ID) {
                logger.warn('[STEAM] Credenciais não configuradas.');
                return res.status(503).json({
                    success: false,
                    message: 'Serviço da Steam não configurado',
                    data: { is_playing: false }
                });
            }

            const playerStatus = await steamService.getPlayerStatus();

            res.set('Cache-Control', 'public, max-age=10');
            res.set('X-Source', 'Steam-API');

            if (playerStatus.error) {
                logger.warn('[STEAM] Erro ao buscar status:', playerStatus.error);
                return res.status(200).json({
                    success: true,
                    data: { is_playing: false },
                    source: 'cache',
                    message: playerStatus.error
                });
            }

            return res.status(200).json({
                success: true,
                data: playerStatus,
                source: 'api'
            });

        } catch (error) {
            logger.error('[STEAM] Erro ao buscar status:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar status da Steam',
                data: { is_playing: false },
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

