const SteamService = require('../../../services/SteamService');
const { getCache, setCache } = require('../../../core/redis');
const logger = require('../../../utils/logger');

const clients = new Set();

let lastState = null;
let pollingInterval = null;

const POLLING_INTERVAL = 10000;
const HEARTBEAT_INTERVAL = 30000;

const detectEvent = (oldState, newState) => {
    if (!oldState) return { event: 'steam:update', data: newState };

    if (!newState) return null;

    if (!oldState.is_playing && !newState.is_playing) {
        if (oldState.status !== newState.status) {
            logger.info(`[STEAM] Status mudou: ${oldState.status} → ${newState.status}`);
            return { event: 'steam:statuschange', data: newState };
        }
        return null;
    }

    if (!oldState.is_playing && newState.is_playing) {
        logger.info(`[STEAM] 🎮 Começou a jogar: ${newState.game_name}`);
        return { event: 'steam:gamestart', data: newState };
    }

    if (oldState.is_playing && !newState.is_playing) {
        logger.info(`[STEAM] ⏹️ Parou de jogar: ${oldState.game_name}`);
        return { event: 'steam:gamestop', data: newState };
    }

    if (oldState.is_playing && newState.is_playing) {
        if (oldState.game_id !== newState.game_id) {
            logger.info(`[STEAM] 🔄 Trocou de jogo: ${oldState.game_name} → ${newState.game_name}`);
            return { event: 'steam:gamechange', data: newState };
        }
    }

    return null;
};

const broadcastToClients = (event, data) => {
    const deadClients = [];

    clients.forEach(client => {
        try {
            const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
            client.write(message);
        } catch (err) {
            logger.warn('[STEAM SSE] Cliente morto detectado, removendo...');
            deadClients.push(client);
        }
    });

    deadClients.forEach(client => clients.delete(client));

    return clients.size;
};

const startPolling = () => {
    if (pollingInterval) return;

    logger.info('[STEAM SSE] 🎮 Polling da Steam iniciado');

    pollingInterval = setInterval(async () => {
        if (clients.size === 0) {
            clearInterval(pollingInterval);
            pollingInterval = null;
            logger.info('[STEAM SSE] ⏸️ Polling parado (sem clientes)');
            return;
        }

        try {
            const currentState = await SteamService.getPlayerStatus();

            const eventData = detectEvent(lastState, currentState);

            if (eventData) {
                lastState = currentState;

                await setCache('steam:last_state', currentState, 3600);
                const sentTo = broadcastToClients(eventData.event, eventData.data);

                logger.debug(`[STEAM SSE] Evento '${eventData.event}' enviado para ${sentTo} cliente(s)`);
            } else {
                lastState = currentState;
            }
        } catch (error) {
            logger.error('[STEAM SSE] Erro ao buscar Steam:', error.message);
        }
    }, POLLING_INTERVAL);
};

module.exports = {
    method: 'GET',
    requiresAuth: false,

    async run(req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
            'Access-Control-Allow-Origin': req.headers.origin || '*',
            'Access-Control-Allow-Credentials': 'true'
        });

        res.write(': SSE Connected (Steam)\n\n');

        try {
            const cached = await getCache('steam:last_state');
            const initialState = cached || await SteamService.getPlayerStatus();

            if (initialState) {
                res.write(`event: steam:update\ndata: ${JSON.stringify(initialState)}\n\n`);

                if (!cached) {
                    await setCache('steam:last_state', initialState, 3600);
                }

                if (clients.size === 0) {
                    lastState = initialState;
                }
            }
        } catch (error) {
            logger.error('[STEAM SSE] Erro ao enviar estado inicial:', error.message);
        }

        clients.add(res);
        logger.info(`[STEAM SSE] ✅ Cliente conectado. Total: ${clients.size}`);

        if (clients.size === 1) {
            startPolling();
        }

        const heartbeat = setInterval(() => {
            try {
                res.write(': heartbeat\n\n');
            } catch (err) {
                clearInterval(heartbeat);
                clients.delete(res);
            }
        }, HEARTBEAT_INTERVAL);

        req.on('close', () => {
            clearInterval(heartbeat);
            clients.delete(res);
            logger.info(`[STEAM SSE] ❌ Cliente desconectado. Total: ${clients.size}`);
        });
    }
};

