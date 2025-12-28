import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

const SteamDisplay = ({ nowPlaying, isMobile = false }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6 }}
        className={isMobile ? "relative w-48 h-48 sm:w-56 sm:h-56" : "relative w-112.5 h-112.5"}
      >
        <div className={isMobile ? "absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500 via-blue-400 to-blue-500 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" : "absolute inset-0 rounded-lg md:rounded-full bg-linear-to-r from-blue-500 via-blue-400 to-blue-500 opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"} />

        <div className={isMobile ? "relative w-full h-full rounded-2xl border-4 border-blue-500/30 overflow-hidden bg-linear-to-br from-slate-800 to-slate-900 group-hover:border-blue-500/50 transition-colors duration-300 shadow-2xl shadow-blue-500/20" : "relative w-full h-full rounded-lg md:rounded-full border-4 border-blue-500/30 overflow-hidden bg-linear-to-br from-slate-800 to-slate-900 group-hover:border-blue-500/50 transition-colors duration-300 shadow-2xl shadow-blue-500/20"}>
          {nowPlaying?.game_image ? (
            <motion.img
              key={nowPlaying.game_image}
              src={nowPlaying.game_image}
              alt={nowPlaying.game_name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gamepad2 className={isMobile ? "w-20 h-20 text-blue-500/50" : "w-32 h-32 text-blue-500/50"} />
            </div>
          )}
        </div>

        <div className={isMobile ? "absolute -bottom-3 -right-3 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" : "absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-lg md:rounded-full blur-2xl"} />
        <div className={isMobile ? "absolute -top-3 -left-3 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl" : "absolute -top-4 -left-4 w-32 h-32 bg-blue-400/10 rounded-lg md:rounded-full blur-2xl"} />

        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className={isMobile ? "absolute inset-0 rounded-2xl border-2 border-blue-500/50" : "absolute inset-0 rounded-lg md:rounded-full border-2 border-blue-500/50"}
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
          href={nowPlaying?.game_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group/info"
        >
          <div className={isMobile ? "flex items-center justify-center gap-1.5 mb-2" : "flex items-center justify-center gap-2 mb-4"}>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Gamepad2 className={isMobile ? "w-3 h-3 text-blue-400" : "w-4 h-4 text-blue-400"} />
            </motion.div>
            <span className={isMobile ? "text-[10px] font-semibold text-blue-400 uppercase tracking-wider" : "text-xs font-semibold text-blue-400 uppercase tracking-wider"}>
              Jogando agora na Steam
            </span>
          </div>
          <h3 className={isMobile ? "text-base sm:text-lg font-bold text-white text-center mb-1 group-hover/info:text-blue-400 transition-colors truncate" : "text-2xl font-bold text-white text-center mb-2 group-hover/info:text-blue-400 transition-colors truncate"}>
            {nowPlaying?.game_name || 'Carregando...'}
          </h3>
          {nowPlaying?.player_name && (
            <p className={isMobile ? "text-sm text-gray-400 text-center mb-3 truncate" : "text-lg text-gray-400 text-center mb-6 truncate"}>
              {nowPlaying.player_name}
            </p>
          )}
          <div className={isMobile ? "mt-2 text-center" : "mt-4 text-center"}>
            <span className={isMobile ? "text-[10px] text-gray-600 group-hover/info:text-blue-500 transition-colors" : "text-xs text-gray-600 group-hover/info:text-blue-500 transition-colors"}>
              Clique para ver na Steam Store →
            </span>
          </div>
        </a>
      </motion.div>
    </>
  );
};

export default SteamDisplay;

