import { motion, AnimatePresence } from 'framer-motion';
import { Music2, Disc3 } from 'lucide-react';
import { useState, useEffect } from 'react';

const SpotifyBadge = ({ nowPlaying }) => {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!nowPlaying?.is_playing || !nowPlaying?.duration_ms || !nowPlaying?.progress_ms) {
      return;
    }

    const initialProgress = (nowPlaying.progress_ms / nowPlaying.duration_ms) * 100;
    setProgress(initialProgress);
    setCurrentTime(nowPlaying.progress_ms);

    const startTime = Date.now();
    const initialProgressMs = nowPlaying.progress_ms;

    const interval = setInterval(() => {
      const elapsedSinceStart = Date.now() - startTime;
      const newProgressMs = initialProgressMs + elapsedSinceStart;

      if (newProgressMs >= nowPlaying.duration_ms) {
        setProgress(100);
        setCurrentTime(nowPlaying.duration_ms);
        clearInterval(interval);
        return;
      }

      const newProgress = (newProgressMs / nowPlaying.duration_ms) * 100;
      setProgress(newProgress);
      setCurrentTime(newProgressMs);
    }, 1000);

    return () => clearInterval(interval);
  }, [nowPlaying]);

  if (!nowPlaying?.is_playing) {
    return null;
  }

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.a
        key="spotify-badge"
        href={nowPlaying.songUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute -bottom-6 -right-6 group cursor-pointer"
      >
        <div className="relative bg-linear-to-br from-green-500/10 via-black/90 to-black border-2 border-green-500/30 rounded-2xl px-6 py-4 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300 shadow-xl shadow-green-500/10">
          <div className="absolute -inset-1 bg-linear-to-r from-green-500/20 to-green-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative flex items-center gap-4 min-w-70">
            {nowPlaying.albumImageUrl && (
              <div className="relative shrink-0">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-14 h-14 rounded-lg overflow-hidden border-2 border-green-500/30 shadow-lg shadow-green-500/20"
                >
                  <img
                    src={nowPlaying.albumImageUrl}
                    alt={nowPlaying.album}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-lg border-2 border-green-500/50"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Disc3 className="w-3.5 h-3.5 text-green-400" />
                </motion.div>
                <span className="text-[10px] font-semibold text-green-400 uppercase tracking-wider">
                  Ouvindo agora
                </span>
              </div>

              <h3 className="text-sm font-bold text-white truncate group-hover:text-green-400 transition-colors max-w-45">
                {nowPlaying.title}
              </h3>

              <p className="text-xs text-gray-400 truncate max-w-45">
                {nowPlaying.artist}
              </p>

              <div className="mt-2 space-y-0.5">
                <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-linear-to-r from-green-500 to-green-400"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-gray-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(nowPlaying.duration_ms)}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <Music2 className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-0.5 h-6 opacity-10 pointer-events-none overflow-hidden rounded-b-2xl">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-green-500"
                animate={{
                  height: ['10%', '100%', '10%'],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </div>
      </motion.a>
    </AnimatePresence>
  );
};

export default SpotifyBadge;

