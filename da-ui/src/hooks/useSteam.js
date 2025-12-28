import { useState, useEffect, useRef } from 'react';

const useSteam = () => {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const eventSourceRef = useRef(null);

  const syncState = (data, eventType = 'update') => {
    if (!data) return;

    const eventEmojis = {
      'steam:gamestart': '🎮 Começou a jogar',
      'steam:gamestop': '⏹️ Parou de jogar',
      'steam:gamechange': '🔄 Trocou de jogo',
      'steam:statuschange': '🔵 Status mudou',
      'steam:update': '🔄 Update'
    };

    const emoji = eventEmojis[eventType] || '📡';
    console.log(`[STEAM] ${emoji}:`, data.game_name || data.status || 'N/A');

    setNowPlaying(data);
    setIsLoading(false);
  };

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    const streamUrl = `${apiUrl}/v1/integrations/steam-stream`;

    console.log('[STEAM] 📡 Conectando ao Stream:', streamUrl);

    const eventSource = new EventSource(streamUrl, {
      withCredentials: true
    });

    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('[STEAM] ✅ Stream conectado');
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        syncState(data, 'steam:update');
      } catch (err) {
        console.error('[STEAM] Erro ao parsear dados:', err);
      }
    };

    eventSource.addEventListener('steam:update', (event) => {
      try {
        const data = JSON.parse(event.data);
        syncState(data, 'steam:update');
      } catch (err) {
        console.error('[STEAM] Erro em update:', err);
      }
    });

    eventSource.addEventListener('steam:gamestart', (event) => {
      try {
        const data = JSON.parse(event.data);
        syncState(data, 'steam:gamestart');
      } catch (err) {
        console.error('[STEAM] Erro em gamestart:', err);
      }
    });

    eventSource.addEventListener('steam:gamestop', (event) => {
      try {
        const data = JSON.parse(event.data);
        syncState(data, 'steam:gamestop');
      } catch (err) {
        console.error('[STEAM] Erro em gamestop:', err);
      }
    });

    eventSource.addEventListener('steam:gamechange', (event) => {
      try {
        const data = JSON.parse(event.data);
        syncState(data, 'steam:gamechange');
      } catch (err) {
        console.error('[STEAM] Erro em gamechange:', err);
      }
    });

    eventSource.addEventListener('steam:statuschange', (event) => {
      try {
        const data = JSON.parse(event.data);
        syncState(data, 'steam:statuschange');
      } catch (err) {
        console.error('[STEAM] Erro em statuschange:', err);
      }
    });

    eventSource.onerror = (err) => {
      console.error('[STEAM] ❌ Erro no stream:', err);
      setIsConnected(false);
      setError(err);
      setIsLoading(false);
    };

    return () => {
      if (eventSourceRef.current) {
        console.log('[STEAM] 🔌 Desconectando stream...');
        eventSourceRef.current.close();
      }
    };
  }, []);

  return {
    nowPlaying,
    isPlaying: nowPlaying?.is_playing || false,
    isConnected,
    isLoading,
    error,
  };
};

export default useSteam;

