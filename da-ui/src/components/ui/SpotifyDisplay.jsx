import { motion } from 'framer-motion';
import { Music2, Disc3, Play, Pause } from 'lucide-react';
import { useState, useEffect } from 'react';

const SpotifyDisplay = ({ nowPlaying, isMobile = false }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!nowPlaying?.is_playing || !nowPlaying?.duration_ms || !nowPlaying?.progress_ms) {
      return;
    }

    const progressPercentage = (nowPlaying.progress_ms / nowPlaying.duration_ms) * 100;
    setProgress(progressPercentage);
  }, [nowPlaying]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6 }}
        className={isMobile ? "relative w-48 h-48 sm:w-56 sm:h-56" : "relative w-112.5 h-112.5"}
      >
        <div className={isMobile ? "absolute inset-0 rounded-2xl bg-linear-to-r from-green-500 via-green-400 to-green-500 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" : "absolute inset-0 rounded-lg md:rounded-full bg-linear-to-r from-green-500 via-green-400 to-green-500 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"} />

        <div className={isMobile ? "relative w-full h-full rounded-2xl border-4 border-green-500/30 overflow-hidden bg-linear-to-br from-zinc-800 to-zinc-900 group-hover:border-green-500/50 transition-colors duration-300 shadow-2xl shadow-green-500/20" : "relative w-full h-full rounded-lg md:rounded-full border-4 border-green-500/30 overflow-hidden bg-linear-to-br from-zinc-800 to-zinc-900 group-hover:border-green-500/50 transition-colors duration-300 shadow-2xl shadow-green-500/20"}>
          {nowPlaying?.albumImageUrl ? (
            <motion.img
              key={nowPlaying.albumImageUrl}
              src={nowPlaying.albumImageUrl}
              alt={nowPlaying.album}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music2 className={isMobile ? "w-20 h-20 text-green-500/50" : "w-32 h-32 text-green-500/50"} />
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-green-500/90 backdrop-blur-sm rounded-full p-4 pointer-events-none"
            >
              {nowPlaying?.is_playing ? (
                <Pause className={isMobile ? "w-8 h-8 text-white fill-white" : "w-12 h-12 text-white fill-white"} />
              ) : (
                <Play className={isMobile ? "w-8 h-8 text-white fill-white" : "w-12 h-12 text-white fill-white"} />
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className={isMobile
              ? "absolute bottom-2 right-2 bg-green-500/95 backdrop-blur-sm rounded-full p-1.5 shadow-lg border-2 border-white/20"
              : "absolute bottom-3 right-3 bg-green-500/95 backdrop-blur-sm rounded-full p-2 shadow-lg border-2 border-white/20"
            }
          >
            {nowPlaying?.is_playing ? (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Pause className={isMobile ? "w-3 h-3 text-white fill-white" : "w-4 h-4 text-white fill-white"} />
              </motion.div>
            ) : (
              <Play className={isMobile ? "w-3 h-3 text-white fill-white" : "w-4 h-4 text-white fill-white"} />
            )}
          </motion.div>
        </div>

        <div className={isMobile ? "absolute -bottom-3 -right-3 w-20 h-20 bg-green-500/10 rounded-full blur-2xl" : "absolute -bottom-4 -right-4 w-24 h-24 bg-green-500/10 rounded-lg md:rounded-full blur-2xl"} />
        <div className={isMobile ? "absolute -top-3 -left-3 w-24 h-24 bg-green-400/10 rounded-full blur-2xl" : "absolute -top-4 -left-4 w-32 h-32 bg-green-400/10 rounded-lg md:rounded-full blur-2xl"} />

        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className={isMobile ? "absolute inset-0 rounded-2xl border-2 border-green-500/50" : "absolute inset-0 rounded-lg md:rounded-full border-2 border-green-500/50"}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={isMobile ? "mt-4 w-full max-w-56 sm:max-w-64" : "mt-8 w-full max-w-112.5"}
      >
        <a
          href={nowPlaying?.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block group/info"
        >
          <div className={isMobile ? "flex items-center justify-center gap-1.5 mb-2" : "flex items-center justify-center gap-2 mb-4"}>
            <motion.div
              animate={nowPlaying?.is_playing ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 1.5, repeat: nowPlaying?.is_playing ? Infinity : 0 }}
            >
              <Disc3 className={isMobile ? "w-3 h-3 text-green-400" : "w-4 h-4 text-green-400"} />
            </motion.div>
            <span className={isMobile ? "text-[10px] font-semibold text-green-400 uppercase tracking-wider" : "text-xs font-semibold text-green-400 uppercase tracking-wider"}>
              {nowPlaying?.is_playing ? 'Ouvindo agora no Spotify' : 'Pausado no Spotify'}
            </span>
          </div>

          <h3 className={isMobile ? "text-base sm:text-lg font-bold text-white text-center mb-1 group-hover/info:text-green-400 transition-colors truncate" : "text-2xl font-bold text-white text-center mb-2 group-hover/info:text-green-400 transition-colors truncate"}>
            {nowPlaying?.title || 'Carregando...'}
          </h3>

          <p className={isMobile ? "text-sm text-gray-400 text-center mb-3 truncate" : "text-lg text-gray-400 text-center mb-6 truncate"}>
            {nowPlaying?.artist || ''}
          </p>

          <div className="space-y-2">
            <div className={isMobile ? "h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm" : "h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm"}>
              <motion.div
                className="h-full bg-linear-to-r from-green-500 to-green-400 shadow-lg shadow-green-500/50"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className={isMobile ? "flex justify-between text-xs text-gray-500" : "flex justify-between text-sm text-gray-500"}>
              <span>{formatTime(nowPlaying?.progress_ms || 0)}</span>
              <span>{formatTime(nowPlaying?.duration_ms || 0)}</span>
            </div>
          </div>

          <div className={isMobile ? "mt-2 text-center" : "mt-4 text-center"}>
            <span className={isMobile ? "text-[10px] text-gray-600 group-hover/info:text-green-500 transition-colors" : "text-xs text-gray-600 group-hover/info:text-green-500 transition-colors"}>
              Clique para abrir no Spotify →
            </span>
          </div>
        </a>
      </motion.div>
    </>
  );
};

export default SpotifyDisplay;

