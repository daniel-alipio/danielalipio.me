import { motion } from 'framer-motion';
import { Gamepad2, Music2, Youtube, MessageCircle } from 'lucide-react';

const ActivityDisplay = ({ activity, platform, isMobile = false }) => {
  if (!activity) return null;

  const platformConfig = {
    spotify: {
      color: {
        primary: 'green-500',
        secondary: 'green-400',
        glow: 'from-green-500 via-green-400 to-green-500'
      },
      icon: Music2,
      badge: activity.is_playing ? 'Ouvindo agora no Spotify' : 'Pausado no Spotify',
      title: activity.title,
      subtitle: activity.artist,
      image: activity.albumImageUrl,
      link: activity.songUrl,
      linkText: 'Clique para abrir no Spotify →',
      showProgress: true
    },
    steam: {
      color: {
        primary: 'blue-500',
        secondary: 'blue-400',
        glow: 'from-blue-500 via-blue-400 to-blue-500'
      },
      icon: Gamepad2,
      badge: 'Jogando agora na Steam',
      title: activity.game_name,
      subtitle: activity.player_name,
      image: activity.game_image,
      link: activity.game_url,
      linkText: 'Clique para ver na Steam Store →',
      showProgress: false
    }
  };

  const config = platformConfig[platform];
  if (!config) return null;

  const Icon = config.icon;
  const colorClasses = {
    border: `border-${config.color.primary}/30`,
    borderHover: `group-hover:border-${config.color.primary}/50`,
    glow: `bg-linear-to-r ${config.color.glow}`,
    glowBg: `bg-${config.color.primary}/10`,
    badge: `text-${config.color.secondary}`,
    titleHover: `group-hover/info:text-${config.color.secondary}`,
    linkHover: `group-hover/info:text-${config.color.primary}`,
    progressBg: `bg-linear-to-r from-${config.color.primary} to-${config.color.secondary}`,
    shadowColor: `shadow-${config.color.primary}/20`
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = config.showProgress && activity.duration_ms
    ? (activity.progress_ms / activity.duration_ms) * 100
    : 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.6 }}
        className={isMobile ? "relative w-48 h-48 sm:w-56 sm:h-56" : "relative w-112.5 h-112.5"}
      >
        <div className={`absolute inset-0 ${isMobile ? 'rounded-2xl' : 'rounded-lg md:rounded-full'} ${colorClasses.glow} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500`} />

        <div className={`relative w-full h-full ${isMobile ? 'rounded-2xl' : 'rounded-lg md:rounded-full'} border-4 ${colorClasses.border} ${colorClasses.borderHover} overflow-hidden bg-linear-to-br from-zinc-800 to-zinc-900 transition-colors duration-300 shadow-2xl ${colorClasses.shadowColor}`}>
          {config.image ? (
            <motion.img
              key={config.image}
              src={config.image}
              alt={config.title}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon className={`${isMobile ? 'w-20 h-20' : 'w-32 h-32'} text-${config.color.primary}/50`} />
            </div>
          )}
        </div>

        <div className={`absolute ${isMobile ? '-bottom-3 -right-3 w-20 h-20' : '-bottom-4 -right-4 w-24 h-24'} ${colorClasses.glowBg} ${isMobile ? 'rounded-full' : 'rounded-lg md:rounded-full'} blur-2xl`} />
        <div className={`absolute ${isMobile ? '-top-3 -left-3 w-24 h-24' : '-top-4 -left-4 w-32 h-32'} ${colorClasses.glowBg} ${isMobile ? 'rounded-full' : 'rounded-lg md:rounded-full'} blur-2xl`} />

        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className={`absolute inset-0 ${isMobile ? 'rounded-2xl' : 'rounded-lg md:rounded-full'} border-2 border-${config.color.primary}/50`}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={isMobile ? "mt-4 w-full max-w-56 sm:max-w-64" : "mt-8 w-full max-w-112.5"}
      >
        {config.link ? (
          <a
            href={config.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block group/info"
          >
            <ActivityContent
              config={config}
              activity={activity}
              isMobile={isMobile}
              colorClasses={colorClasses}
              formatTime={formatTime}
              progressPercentage={progressPercentage}
            />
          </a>
        ) : (
          <div className="block">
            <ActivityContent
              config={config}
              activity={activity}
              isMobile={isMobile}
              colorClasses={colorClasses}
              formatTime={formatTime}
              progressPercentage={progressPercentage}
            />
          </div>
        )}
      </motion.div>
    </>
  );
};

const ActivityContent = ({ config, activity, isMobile, colorClasses, formatTime, progressPercentage }) => {
  const Icon = config.icon;

  return (
    <>
      <div className={isMobile ? "flex items-center justify-center gap-1.5 mb-2" : "flex items-center justify-center gap-2 mb-4"}>
        <motion.div
          animate={activity.is_playing ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 1.5, repeat: activity.is_playing ? Infinity : 0 }}
        >
          <Icon className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} ${colorClasses.badge}`} />
        </motion.div>
        <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-semibold ${colorClasses.badge} uppercase tracking-wider`}>
          {config.badge}
        </span>
      </div>

      <h3 className={`${isMobile ? 'text-base sm:text-lg' : 'text-2xl'} font-bold text-white text-center mb-${isMobile ? '1' : '2'} ${colorClasses.titleHover} transition-colors truncate`}>
        {config.title || 'Carregando...'}
      </h3>

      {config.subtitle && (
        <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-gray-400 text-center mb-${isMobile ? '3' : '6'} truncate`}>
          {config.subtitle}
        </p>
      )}

      {config.showProgress && activity.duration_ms && (
        <div className="space-y-2">
          <div className={`${isMobile ? 'h-1.5' : 'h-2'} bg-white/10 rounded-full overflow-hidden backdrop-blur-sm`}>
            <motion.div
              className={`h-full ${colorClasses.progressBg} shadow-lg shadow-${config.color.primary}/50`}
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
            <span>{formatTime(activity.progress_ms || 0)}</span>
            <span>{formatTime(activity.duration_ms || 0)}</span>
          </div>
        </div>
      )}

      {config.linkText && (
        <div className={isMobile ? "mt-2 text-center" : "mt-4 text-center"}>
          <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-gray-600 ${colorClasses.linkHover} transition-colors`}>
            {config.linkText}
          </span>
        </div>
      )}
    </>
  );
};

export default ActivityDisplay;

