const axios = require('axios');
const querystring = require('querystring');
const logger = require('../utils/logger');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    logger.warn('[SPOTIFY] Variáveis de ambiente não configuradas. Serviço do Spotify não estará disponível.');
}

const BASIC_AUTH = CLIENT_ID && CLIENT_SECRET ? Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64') : null;
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';

const rateLimitState = {
    requests: [],
    tokenCache: null,
    tokenExpiresAt: null,
    retryAfter: null,
    lastNowPlayingData: null
};

// (baseado em https://developer.spotify.com/documentation/web-api/concepts/rate-limits)
const SPOTIFY_RATE_LIMIT = 180; // 180 requests por 30 segundos
const RATE_LIMIT_WINDOW = 30 * 1000; // 30 segundos em ms
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutos de buffer antes de expirar
const RATE_LIMIT_SAFETY_MARGIN = 0.9; // Usa apenas 90% do limite (162/180)

const cleanOldRequests = () => {
    const now = Date.now();
    rateLimitState.requests = rateLimitState.requests.filter(
        timestamp => now - timestamp < RATE_LIMIT_WINDOW
    );
};

const canMakeRequest = () => {
    if (rateLimitState.retryAfter && Date.now() < rateLimitState.retryAfter) {
        const waitTime = Math.ceil((rateLimitState.retryAfter - Date.now()) / 1000);
        logger.warn(`[SPOTIFY] 🚫 Rate limit ativo. Aguardar ${waitTime}s`);
        return false;
    }

    cleanOldRequests();

    const currentCount = rateLimitState.requests.length;
    const safeLimit = Math.floor(SPOTIFY_RATE_LIMIT * RATE_LIMIT_SAFETY_MARGIN);

    if (currentCount >= safeLimit) {
        logger.warn(`[SPOTIFY] ⚠️ Aproximando do rate limit (${currentCount}/${SPOTIFY_RATE_LIMIT} nos últimos 30s)`);
        return false;
    }

    return true;
};

const trackRequest = () => {
    rateLimitState.requests.push(Date.now());
    cleanOldRequests();

    if (rateLimitState.requests.length % 50 === 0) {
        logger.debug(`[SPOTIFY] 📊 ${rateLimitState.requests.length} requests nos últimos 30s`);
    }
};

const handleRateLimitHeaders = (response) => {
    if (response.status === 429) {
        const retryAfter = parseInt(response.headers['retry-after']) || 30;
        rateLimitState.retryAfter = Date.now() + (retryAfter * 1000);
        logger.error(`[SPOTIFY] ❌ Rate limit excedido! Retry após ${retryAfter}s`);
    }
};

const getAccessToken = async () => {
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN || !BASIC_AUTH) {
        logger.error('[SPOTIFY] Credenciais não configuradas. Configure SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET e SPOTIFY_REFRESH_TOKEN.');
        return null;
    }

    if (rateLimitState.tokenCache && rateLimitState.tokenExpiresAt > Date.now()) {
        const minutesLeft = Math.floor((rateLimitState.tokenExpiresAt - Date.now()) / 60000);
        return rateLimitState.tokenCache;
    }

    if (!canMakeRequest()) {
        logger.warn('[SPOTIFY] ⚠️ Rate limit preventivo - usando último token conhecido');
        return rateLimitState.tokenCache;
    }

    try {
        trackRequest();

        const response = await axios.post(TOKEN_ENDPOINT, querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: REFRESH_TOKEN
        }), {
            headers: {
                Authorization: `Basic ${BASIC_AUTH}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        handleRateLimitHeaders(response);

        const expiresIn = response.data.expires_in || 3600;
        rateLimitState.tokenCache = response.data.access_token;
        rateLimitState.tokenExpiresAt = Date.now() + ((expiresIn * 1000) - TOKEN_EXPIRY_BUFFER);

        const validMinutes = Math.floor((expiresIn - TOKEN_EXPIRY_BUFFER / 1000) / 60);
        logger.info(`[SPOTIFY] ✅ Token renovado. Válido por ~${validMinutes} minutos`);

        return response.data.access_token;
    } catch (error) {
        logger.error(`[SPOTIFY] ❌ Erro ao renovar token: ${error.message}`);
        if (error.response) {
            handleRateLimitHeaders(error.response);
            logger.error(`[SPOTIFY] Status: ${error.response.status}, Data:`, error.response.data);
        }

        return rateLimitState.tokenCache;
    }
};

const getNowPlaying = async () => {
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
        logger.warn('[SPOTIFY] Serviço não configurado. Retornando estado "not playing".');
        return {
            is_playing: false,
            error: 'Spotify service not configured'
        };
    }

    if (!canMakeRequest()) {
        logger.warn('[SPOTIFY] ⚠️ Rate limit preventivo - usando último estado conhecido');

        if (rateLimitState.lastNowPlayingData) {
            return rateLimitState.lastNowPlayingData;
        }

        return {
            is_playing: false,
            error: 'Rate limit protection active'
        };
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
        if (rateLimitState.lastNowPlayingData) {
            logger.warn('[SPOTIFY] Sem token, usando cache');
            return rateLimitState.lastNowPlayingData;
        }
        return { is_playing: false, error: 'Failed to get access token' };
    }

    try {
        trackRequest();

        const response = await axios.get(NOW_PLAYING_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        handleRateLimitHeaders(response);

        if (response.status === 204 || !response.data) {
            const notPlayingData = { is_playing: false };
            rateLimitState.lastNowPlayingData = notPlayingData;
            return notPlayingData;
        }

        const song = response.data;

        if (song.currently_playing_type !== 'track') {
            const podcastData = {
                is_playing: false,
                message: 'Playing Podcast/Unknown'
            };
            rateLimitState.lastNowPlayingData = podcastData;
            return podcastData;
        }

        const data = {
            is_playing: song.is_playing,
            title: song.item.name,
            artist: song.item.artists.map(_artist => _artist.name).join(', '),
            album: song.item.album.name,
            albumImageUrl: song.item.album.images[0]?.url || null,
            songUrl: song.item.external_urls.spotify,
            progress_ms: song.progress_ms,
            duration_ms: song.item.duration_ms
        };

        rateLimitState.lastNowPlayingData = data;

        return data;

    } catch (error) {
        if (error.response) {
            handleRateLimitHeaders(error.response);

            if (error.response.status === 204) {
                const notPlayingData = { is_playing: false };
                rateLimitState.lastNowPlayingData = notPlayingData;
                return notPlayingData;
            }

            logger.error(`[SPOTIFY] ❌ Status: ${error.response.status}`);
        }

        logger.error(`[SPOTIFY] ❌ Erro ao buscar música: ${error.message}`);

        if (rateLimitState.lastNowPlayingData) {
            logger.warn('[SPOTIFY] Retornando último estado conhecido devido a erro');
            return rateLimitState.lastNowPlayingData;
        }

        return { is_playing: false, error: 'Failed to fetch current song' };
    }
};

const getRateLimitStats = () => {
    cleanOldRequests();

    return {
        requestsLast30s: rateLimitState.requests.length,
        limit: SPOTIFY_RATE_LIMIT,
        safeLimit: Math.floor(SPOTIFY_RATE_LIMIT * RATE_LIMIT_SAFETY_MARGIN),
        percentage: ((rateLimitState.requests.length / SPOTIFY_RATE_LIMIT) * 100).toFixed(1) + '%',
        retryAfter: rateLimitState.retryAfter ? new Date(rateLimitState.retryAfter).toISOString() : null,
        tokenCached: !!rateLimitState.tokenCache,
        tokenExpiresAt: rateLimitState.tokenExpiresAt ? new Date(rateLimitState.tokenExpiresAt).toISOString() : null,
        hasLastData: !!rateLimitState.lastNowPlayingData,
        isHealthy: rateLimitState.requests.length < (SPOTIFY_RATE_LIMIT * 0.8) && !rateLimitState.retryAfter
    };
};

module.exports = {
    getNowPlaying,
    getRateLimitStats
};
