const SpotifyService = require('../../../services/SpotifyService');
const { getCache, setCache } = require('../../../core/redis');
const logger = require('../../../utils/logger');

const clients = new Set();

let lastState = null;
let pollingInterval = null;

const POLLING_INTERVAL = 1000;
const HEARTBEAT_INTERVAL = 15000;
const SEEK_THRESHOLD = 2000;

const detectEvent = (oldState, newState) => {
  if (!oldState) return { event: 'spotify:update', data: newState };
  if (!newState) return null;
  if (!oldState.is_playing && !newState.is_playing) return null;

  if (oldState.title !== newState.title || oldState.artist !== newState.artist) {
    logger.info(`[SSE] 🎵 Música mudou: ${newState.title} - ${newState.artist}`);
    return { event: 'spotify:changemusic', data: newState };
  }

  if (oldState.is_playing !== newState.is_playing) {
    const action = newState.is_playing ? 'Play ▶️' : 'Pause ⏸️';
    logger.info(`[SSE] ${action} detectado`);
    return {
      event: newState.is_playing ? 'spotify:play' : 'spotify:pause',
      data: newState
    };
  }

  if (newState.is_playing && oldState.progress_ms && newState.progress_ms) {
    const expectedProgress = oldState.progress_ms + POLLING_INTERVAL;
    const diff = Math.abs(newState.progress_ms - expectedProgress);

    if (diff > SEEK_THRESHOLD) {
      const direction = newState.progress_ms > expectedProgress ? 'Avançou ⏩' : 'Retrocedeu ⏪';
      logger.info(`[SSE] Seek: ${direction} ${Math.floor(diff / 1000)}s`);
      return { event: 'spotify:seek', data: newState };
    }
  }

  logger.debug(`[SSE] ⏭️ Progresso normal, não enviando (${Math.floor(newState.progress_ms / 1000)}s)`);
  return null;
};

const broadcastToClients = (event, data) => {
  const deadClients = [];

  clients.forEach(client => {
    try {
      const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
      client.write(message);
    } catch (err) {
      logger.warn('[SSE] Cliente morto detectado, removendo...');
      deadClients.push(client);
    }
  });

  deadClients.forEach(client => clients.delete(client));

  return clients.size;
};

const startPolling = () => {
  if (pollingInterval) return;

  logger.info('[SSE] 🎵 Polling do Spotify iniciado');

  pollingInterval = setInterval(async () => {
    if (clients.size === 0) {
      clearInterval(pollingInterval);
      pollingInterval = null;
      logger.info('[SSE] ⏸️ Polling parado (sem clientes)');
      return;
    }

    try {
      const currentState = await SpotifyService.getNowPlaying();

      const eventData = detectEvent(lastState, currentState);

      if (eventData) {
        lastState = currentState;

        await setCache('spotify:last_state', currentState, 3600);

        const sentTo = broadcastToClients(eventData.event, eventData.data);

        logger.debug(`[SSE] Evento '${eventData.event}' enviado para ${sentTo} cliente(s)`);
      } else {
        lastState = currentState;
      }
    } catch (error) {
      logger.error('[SSE] Erro ao buscar Spotify:', error.message);
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

    res.write(': SSE Connected\n\n');

    try {
      const cached = await getCache('spotify:last_state');
      const initialState = cached || await SpotifyService.getNowPlaying();

      if (initialState) {
        res.write(`event: spotify:update\ndata: ${JSON.stringify(initialState)}\n\n`);

        if (!cached) {
          await setCache('spotify:last_state', initialState, 60);
        }

        if (clients.size === 0) {
          lastState = initialState;
        }
      }
    } catch (error) {
      logger.error('[SSE] Erro ao enviar estado inicial:', error.message);
    }

    clients.add(res);
    logger.info(`[SSE] ✅ Cliente conectado. Total: ${clients.size}`);

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
      logger.info(`[SSE] ❌ Cliente desconectado. Total: ${clients.size}`);
    });
  }
};



