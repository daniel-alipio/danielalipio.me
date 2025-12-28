const spotifyService = require('../../../services/SpotifyService');
const logger = require('../../../utils/logger');

module.exports = {
    method: 'GET',
    requiresAuth: false,

    async run(req, res) {
        try {
            if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.SPOTIFY_REFRESH_TOKEN) {
                logger.warn('[SPOTIFY] Credenciais não configuradas.');
                return res.status(503).json({
                    success: false,
                    message: 'Serviço do Spotify não configurado',
                    data: { is_playing: false }
                });
            }

            const currentSong = await spotifyService.getNowPlaying();

            res.set('Cache-Control', 'public, max-age=5');
            res.set('X-Source', 'Spotify-API');

            if (currentSong.error) {
                logger.warn('[SPOTIFY] Erro ao buscar status:', currentSong.error);
                return res.status(200).json({
                    success: true,
                    data: { is_playing: false },
                    source: 'cache',
                    message: currentSong.error
                });
            }

            return res.status(200).json({
                success: true,
                data: currentSong,
                source: 'api'
            });

        } catch (error) {
            logger.error('[SPOTIFY] Erro ao buscar status:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar música',
                data: { is_playing: false },
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};