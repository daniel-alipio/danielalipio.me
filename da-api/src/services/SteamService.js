const axios = require('axios');
const logger = require('../utils/logger');

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_ID = process.env.STEAM_ID;

if (!STEAM_API_KEY || !STEAM_ID) {
    logger.warn('[STEAM] Variáveis de ambiente não configuradas. Serviço da Steam não estará disponível.');
}

const PLAYER_SUMMARIES_ENDPOINT = 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/';

const rateLimitState = {
    requests: [],
    lastPlayerData: null
};

const STEAM_RATE_LIMIT = 200;
const RATE_LIMIT_WINDOW = 5 * 60 * 1000;
const RATE_LIMIT_SAFETY_MARGIN = 0.8;

const cleanOldRequests = () => {
    const now = Date.now();
    rateLimitState.requests = rateLimitState.requests.filter(
        timestamp => now - timestamp < RATE_LIMIT_WINDOW
    );
};

const canMakeRequest = () => {
    cleanOldRequests();

    const currentCount = rateLimitState.requests.length;
    const safeLimit = Math.floor(STEAM_RATE_LIMIT * RATE_LIMIT_SAFETY_MARGIN);

    if (currentCount >= safeLimit) {
        logger.warn(`[STEAM] ⚠️ Aproximando do rate limit (${currentCount}/${STEAM_RATE_LIMIT} nos últimos 5min)`);
        return false;
    }

    return true;
};

const trackRequest = () => {
    rateLimitState.requests.push(Date.now());
    cleanOldRequests();

    if (rateLimitState.requests.length % 20 === 0) {
        logger.debug(`[STEAM] 📊 ${rateLimitState.requests.length} requests nos últimos 5min`);
    }
};

const getPersonaStateLabel = (state) => {
    const stateMap = {
        0: 'offline',
        1: 'online',
        2: 'busy',
        3: 'away',
        4: 'snooze',
        5: 'looking_to_trade',
        6: 'looking_to_play'
    };
    return stateMap[state] || 'offline';
};

const getPlayerStatus = async () => {

    if (!STEAM_API_KEY || !STEAM_ID) {
        logger.warn('[STEAM] Serviço não configurado. Retornando estado "not playing".');
        return {
            is_playing: false,
            error: 'Steam service not configured'
        };
    }

    if (!canMakeRequest()) {
        logger.warn('[STEAM] ⚠️ Rate limit preventivo - usando último estado conhecido');

        if (rateLimitState.lastPlayerData) {
            return rateLimitState.lastPlayerData;
        }

        return {
            is_playing: false,
            error: 'Rate limit protection active'
        };
    }

    try {
        trackRequest();

        const response = await axios.get(PLAYER_SUMMARIES_ENDPOINT, {
            params: {
                key: STEAM_API_KEY,
                steamids: STEAM_ID
            }
        });

        const players = response.data?.response?.players;

        if (!players || players.length === 0) {
            logger.warn('[STEAM] Nenhum jogador encontrado');
            const notFoundData = { is_playing: false, error: 'Player not found' };
            rateLimitState.lastPlayerData = notFoundData;
            return notFoundData;
        }

        const user = players[0];

        if (user.gameextrainfo && user.gameid) {
            const playingData = {
                is_playing: true,
                status: 'playing',
                game_name: user.gameextrainfo,
                game_id: user.gameid,
                game_url: `https://store.steampowered.com/app/${user.gameid}/`,
                game_image: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${user.gameid}/header.jpg`,
                player_name: user.personaname,
                player_avatar: user.avatarfull || user.avatarmedium,
                player_url: user.profileurl,
                persona_state: getPersonaStateLabel(user.personastate)
            };

            logger.debug(`[STEAM] 🎮 Jogando: ${user.gameextrainfo}`);
            rateLimitState.lastPlayerData = playingData;
            return playingData;
        }

        const onlineData = {
            is_playing: false,
            status: getPersonaStateLabel(user.personastate),
            player_name: user.personaname,
            player_avatar: user.avatarfull || user.avatarmedium,
            player_url: user.profileurl,
            last_logoff: user.lastlogoff ? new Date(user.lastlogoff * 1000).toISOString() : null
        };

        rateLimitState.lastPlayerData = onlineData;
        return onlineData;

    } catch (error) {
        logger.error(`[STEAM] ❌ Erro ao buscar status: ${error.message}`);

        if (rateLimitState.lastPlayerData) {
            logger.warn('[STEAM] Retornando último estado conhecido devido a erro');
            return rateLimitState.lastPlayerData;
        }

        return {
            is_playing: false,
            error: 'Failed to fetch player status',
            details: error.message
        };
    }
};

const getRateLimitStats = () => {
    cleanOldRequests();

    return {
        requestsLast5min: rateLimitState.requests.length,
        limit: STEAM_RATE_LIMIT,
        safeLimit: Math.floor(STEAM_RATE_LIMIT * RATE_LIMIT_SAFETY_MARGIN),
        percentage: ((rateLimitState.requests.length / STEAM_RATE_LIMIT) * 100).toFixed(1) + '%',
        hasLastData: !!rateLimitState.lastPlayerData,
        isHealthy: rateLimitState.requests.length < (STEAM_RATE_LIMIT * 0.6)
    };
};

module.exports = {
    getPlayerStatus,
    getRateLimitStats
};

