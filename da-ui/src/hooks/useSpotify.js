import { useState, useEffect, useRef } from 'react';

const useSpotify = () => {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [localProgress, setLocalProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const eventSourceRef = useRef(null);
  const lastUpdateTimestamp = useRef(Date.now());
  const progressIntervalRef = useRef(null);
  const fastSyncTimeoutRef = useRef(null);

  const performFastSync = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/v1/integrations/spotify`, {
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          console.log('[SPOTIFY] ⚡ Fast-sync realizado');
          syncState(result.data, 'spotify:fastsync');
        }
      }
    } catch (err) {
      console.warn('[SPOTIFY] Erro no fast-sync:', err.message);
    }
  };

  const syncState = (data, eventType = 'update') => {
    if (!data) return;

    const eventEmojis = {
      'spotify:changemusic': '🎵 Nova música',
      'spotify:play': '▶️ Play',
      'spotify:pause': '⏸️ Pause',
      'spotify:seek': '⏩ Seek',
      'spotify:update': '🔄 Update',
      'spotify:fastsync': '⚡ FastSync'
    };

    const emoji = eventEmojis[eventType] || '📡';
    console.log(`[SPOTIFY] ${emoji}:`, data.title || 'N/A');

    setNowPlaying(data);
    setLocalProgress(data.progress_ms || 0);
    lastUpdateTimestamp.current = Date.now();
    setIsLoading(false);

    if (fastSyncTimeoutRef.current) {
      clearTimeout(fastSyncTimeoutRef.current);
      fastSyncTimeoutRef.current = null;
    }

    if (eventType === 'spotify:play') {
      fastSyncTimeoutRef.current = setTimeout(() => {
        console.log('[SPOTIFY] 🔍 Verificando sincronia pós-play...');
        performFastSync();
      }, 2000);
    }
  };

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '/api';
    const streamUrl = `${apiUrl}/v1/integrations/spotify-stream`;

    console.log('[SPOTIFY] 📡 Conectando ao Stream:', streamUrl);

    const eventSource = new EventSource(streamUrl, {
      withCredentials: true
    });

    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('[SPOTIFY] ✅ Stream conectado');
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        syncState(data, 'spotify:update');
      } catch (err) {
        console.error('[SPOTIFY] Erro ao parsear dados:', err);
      }
    };

    eventSource.addEventListener('spotify:update', (event) => {
      try {
        const data = JSON.parse(event.data);
        syncState(data, 'spotify:update');
      } catch (err) {
        console.error('[SPOTIFY] Erro em update:', err);
      }
    });

    eventSource.addEventListener('spotify:changemusic', (event) => {
      try {
        const data = JSON.parse(event.data);
        syncState(data, 'spotify:changemusic');
      } catch (err) {
        console.error('[SPOTIFY] Erro em changemusic:', err);
      }
    });

    eventSource.addEventListener('spotify:play', (event) => {
      try {
        const data = JSON.parse(event.data);
        syncState(data, 'spotify:play');
      } catch (err) {
        console.error('[SPOTIFY] Erro em play:', err);
      }
    });

    eventSource.addEventListener('spotify:pause', (event) => {
      try {
        const data = JSON.parse(event.data);
        syncState(data, 'spotify:pause');
      } catch (err) {
        console.error('[SPOTIFY] Erro em pause:', err);
      }
    });

    eventSource.addEventListener('spotify:seek', (event) => {
      try {
        const data = JSON.parse(event.data);
        syncState(data, 'spotify:seek');
      } catch (err) {
        console.error('[SPOTIFY] Erro em seek:', err);
      }
    });

    eventSource.onerror = (err) => {
      console.error('[SPOTIFY] ❌ Erro no stream:', err);
      setIsConnected(false);
      setError(err);
      setIsLoading(false);
    };

    return () => {
      if (eventSourceRef.current) {
        console.log('[SPOTIFY] 🔌 Desconectando stream...');
        eventSourceRef.current.close();
      }
      if (fastSyncTimeoutRef.current) {
        clearTimeout(fastSyncTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    if (!nowPlaying?.is_playing) {
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      const timePassed = Date.now() - lastUpdateTimestamp.current;
      const estimatedProgress = (nowPlaying.progress_ms || 0) + timePassed;

      const clampedProgress = Math.min(estimatedProgress, nowPlaying.duration_ms || 0);
      setLocalProgress(clampedProgress);

      const isNearEnd = nowPlaying.duration_ms && (nowPlaying.duration_ms - clampedProgress) < 3000;
      const noUpdateRecently = timePassed > 5000;

      if (isNearEnd && noUpdateRecently) {
        console.log('[SPOTIFY] 🔍 Música próxima do fim, verificando mudança...');
        performFastSync();
      }
    }, 1000);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [nowPlaying]);

  return {
    nowPlaying: nowPlaying ? { ...nowPlaying, progress_ms: localProgress } : null,
    isPlaying: nowPlaying?.is_playing || false,
    isConnected,
    isLoading,
    error,
  };
};

export default useSpotify;

