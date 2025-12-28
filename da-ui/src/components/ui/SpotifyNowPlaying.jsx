import { motion, AnimatePresence } from 'framer-motion';
import { Music2, Headphones } from 'lucide-react';
import { useState, useEffect } from 'react';

const SpotifyNowPlaying = ({ nowPlaying }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!nowPlaying?.is_playing || !nowPlaying?.duration_ms || !nowPlaying?.progress_ms) {
      return;
    }

    const initialProgress = (nowPlaying.progress_ms / nowPlaying.duration_ms) * 100;
    setProgress(initialProgress);

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + (100 / (nowPlaying.duration_ms / 1000));
        return newProgress >= 100 ? 100 : newProgress;
      });
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <a
          href={nowPlaying.songUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative bg-linear-to-br from-green-500/10 via-black/40 to-black/60 backdrop-blur-md border border-green-500/20 rounded-2xl p-4 overflow-hidden hover:border-green-500/40 transition-all duration-300">
            <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent opacity-50" />
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex items-center gap-4">
              {nowPlaying.albumImageUrl && (
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="relative shrink-0"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-green-500/30 shadow-lg shadow-green-500/20">
                    <img
                      src={nowPlaying.albumImageUrl}
                      alt={nowPlaying.album}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-xl border-2 border-green-500/50"
                  />
                </motion.div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Headphones className="w-4 h-4 text-green-400" />
                  </motion.div>
                  <span className="text-xs font-medium text-green-400 uppercase tracking-wider">
                    Ouvindo agora
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-green-400 transition-colors">
                  {nowPlaying.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-400 truncate">
                  {nowPlaying.artist}
                </p>

                <div className="mt-3 space-y-1">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-linear-to-r from-green-500 to-green-400"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>{formatTime(nowPlaying.progress_ms)}</span>
                    <span>{formatTime(nowPlaying.duration_ms)}</span>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block shrink-0">
                <Music2 className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 h-8 opacity-20 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-green-500 rounded-t"
                  animate={{
                    height: ['20%', '100%', '20%'],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </div>
        </a>
      </motion.div>
    </AnimatePresence>
  );
};

export default SpotifyNowPlaying;

