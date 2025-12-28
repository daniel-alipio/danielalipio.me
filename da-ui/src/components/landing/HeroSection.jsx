import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Code2, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import OptimizedImage from '../ui/OptimizedImage';
import ActivityDisplay from '../ui/ActivityDisplay';
import useSpotify from '../../hooks/useSpotify';
import useSteam from '../../hooks/useSteam';

const HeroSection = () => {
  const [currentRole, setCurrentRole] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState('spotify');

  const { nowPlaying: spotifyNowPlaying } = useSpotify();
  const { nowPlaying: steamNowPlaying } = useSteam();

  const hasSpotify = spotifyNowPlaying && spotifyNowPlaying.title;
  const hasSteam = steamNowPlaying && steamNowPlaying.is_playing;

  // Debug logs
  useEffect(() => {
    console.log('[HeroSection] Steam Now Playing:', steamNowPlaying);
    console.log('[HeroSection] Has Steam?', hasSteam);
    console.log('[HeroSection] Active View:', activeView);
  }, [steamNowPlaying, hasSteam, activeView]);

  const roles = [
    "Software Engineer",
    "System Architect",
    "Tech Founder",
    "CTO @FRAME3"
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (hasSteam && !hasSpotify) {
      setActiveView('steam');
    }
    else if (hasSpotify && !hasSteam) {
      setActiveView('spotify');
    }
  }, [hasSpotify, hasSteam]);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden py-12 sm:py-16 lg:py-0">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-slate-900" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">

          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono text-gray-400 border border-gray-800 rounded-full bg-zinc-900/50 backdrop-blur-sm">
                <Code2 className="w-4 h-4" />
                {"<"} Developer {"/>"}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-7xl font-bold leading-tight mb-2 lg:mb-4">
                Daniel Alípio
              </h1>

              <div className="h-10 sm:h-12 lg:h-20 flex items-center justify-center lg:justify-start">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={currentRole}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-xl sm:text-2xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 text-left"
                  >
                    {roles[currentRole]}
                  </motion.h2>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-base lg:text-xl text-gray-400 leading-relaxed max-w-xl text-center lg:text-left mx-auto lg:mx-0"
            >
              Transformando ideias complexas em{' '}
              <span className="text-white font-semibold">arquiteturas escaláveis</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="lg:hidden relative flex flex-col items-center justify-center gap-3"
            >
              {hasSpotify && hasSteam && (
                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveView('spotify')}
                    className={`p-3 rounded-full backdrop-blur-sm border-2 transition-all ${
                      activeView === 'spotify'
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                    title="Spotify"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveView('steam')}
                    className={`p-3 rounded-full backdrop-blur-sm border-2 transition-all ${
                      activeView === 'steam'
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                    title="Steam"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/>
                    </svg>
                  </motion.button>
                </div>
              )}

              <div className="relative group">
                <AnimatePresence mode="wait">
                  {(hasSpotify || hasSteam) ? (
                    activeView === 'spotify' && hasSpotify ? (
                      <ActivityDisplay key="spotify-mobile" activity={spotifyNowPlaying} platform="spotify" isMobile={true} />
                    ) : activeView === 'steam' && hasSteam ? (
                      <ActivityDisplay key="steam-mobile" activity={steamNowPlaying} platform="steam" isMobile={true} />
                    ) : (
                      <motion.div
                        key="default-mobile"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.6 }}
                        className="relative w-48 h-48 sm:w-56 sm:h-56"
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white via-gray-400 to-white opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" />

                        <div className="relative w-full h-full rounded-2xl border-4 border-white/10 overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:border-white/20 transition-colors duration-300">
                          <OptimizedImage
                            src="https://avatars.githubusercontent.com/u/245196751?v=4"
                            alt="Daniel Alípio"
                            className="w-full h-full"
                            priority={true}
                          />
                        </div>

                        <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-white/5 rounded-full blur-2xl" />
                        <div className="absolute -top-3 -left-3 w-24 h-24 bg-gray-500/5 rounded-full blur-2xl" />
                      </motion.div>
                    )
                  ) : (
                    <motion.div
                      key="default-mobile"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.6 }}
                      className="relative w-48 h-48 sm:w-56 sm:h-56"
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white via-gray-400 to-white opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" />

                      <div className="relative w-full h-full rounded-2xl border-4 border-white/10 overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:border-white/20 transition-colors duration-300">
                        <OptimizedImage
                          src="https://avatars.githubusercontent.com/u/245196751?v=4"
                          alt="Daniel Alípio"
                          className="w-full h-full"
                          priority={true}
                        />
                      </div>

                      <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-white/5 rounded-full blur-2xl" />
                      <div className="absolute -top-3 -left-3 w-24 h-24 bg-gray-500/5 rounded-full blur-2xl" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start"
            >
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-xs sm:text-sm font-medium text-gray-300">Batatais, SP</span>
              </div>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-gray-400" />
                <span className="text-xs sm:text-sm font-medium text-gray-300">18 Anos</span>
              </div>
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
                <Code2 className="w-4 h-4 text-gray-400" />
                <span className="text-xs sm:text-sm font-medium text-gray-300">+4 Anos</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={scrollToProjects}
                className="group relative inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-black bg-white cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:bg-gray-200"
              >
                <span className="relative z-10">Ver Projetos</span>
                <ChevronDown className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-y-1" />
              </button>

              <button
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white bg-white/5 border border-white/10 rounded-lg transition-all cursor-pointer duration-300 hover:border-white/30 hover:bg-white/10"
                onClick={scrollToProjects}
              >
                Entre em Contato
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hidden lg:flex relative items-center justify-center"
          >
            <div className="relative group flex flex-col items-center">
              {hasSpotify && hasSteam && (
                <div className="absolute -left-20 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveView('spotify')}
                    className={`p-3 rounded-full backdrop-blur-sm border-2 transition-all ${
                      activeView === 'spotify'
                        ? 'bg-green-500/20 border-green-500/50 text-green-400'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                    }`}
                    title="Ver Spotify"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveView('steam')}
                    className={`p-3 rounded-full backdrop-blur-sm border-2 transition-all ${
                      activeView === 'steam'
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                    }`}
                    title="Ver Steam"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/>
                    </svg>
                  </motion.button>
                </div>
              )}

              <AnimatePresence mode="wait">
                {(hasSpotify || hasSteam) ? (
                  activeView === 'spotify' && hasSpotify ? (
                    <ActivityDisplay key="spotify" activity={spotifyNowPlaying} platform="spotify" />
                  ) : activeView === 'steam' && hasSteam ? (
                    <ActivityDisplay key="steam" activity={steamNowPlaying} platform="steam" />
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="relative w-[450px] h-[450px]">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white via-gray-400 to-white opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" />

                        <div className="relative w-full h-full rounded-full border-4 border-white/10 overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:border-white/20 transition-colors duration-300">
                          <OptimizedImage
                            src="https://avatars.githubusercontent.com/u/245196751?v=4"
                            alt="Daniel Alípio"
                            className="w-full h-full"
                            priority={true}
                          />
                        </div>

                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                        <div className="absolute -top-4 -left-4 w-32 h-32 bg-gray-500/5 rounded-full blur-2xl" />
                      </div>

                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="absolute -bottom-6 -right-6 px-6 py-3 bg-black border-2 border-white/20 rounded-full backdrop-blur-sm"
                      >
                        <p className="text-sm font-bold text-white">Disponível para Projetos</p>
                      </motion.div>
                    </motion.div>
                  )
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="relative w-[450px] h-[450px]">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white via-gray-400 to-white opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500" />

                      <div className="relative w-full h-full rounded-full border-4 border-white/10 overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:border-white/20 transition-colors duration-300">
                        <OptimizedImage
                          src="https://avatars.githubusercontent.com/u/245196751?v=4"
                          alt="Daniel Alípio"
                          className="w-full h-full"
                          priority={true}
                        />
                      </div>

                      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
                      <div className="absolute -top-4 -left-4 w-32 h-32 bg-gray-500/5 rounded-full blur-2xl" />
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                      className="absolute -bottom-6 -right-6 px-6 py-3 bg-black border-2 border-white/20 rounded-full backdrop-blur-sm"
                    >
                      <p className="text-sm font-bold text-white">Disponível para Projetos</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer group"
          onClick={scrollToProjects}
        >
          {!isMobile ? (
            <>
              <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-1.5 group-hover:border-gray-500 transition-colors">
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1 h-2 bg-gray-600 rounded-full group-hover:bg-gray-500"
                />
              </div>
              <span className="text-xs font-mono text-gray-600 uppercase tracking-wider group-hover:text-gray-500 transition-colors">
                Scroll
              </span>
            </>
          ) : (
            <>
              <ChevronDown className="w-5 h-5 text-gray-600 group-hover:text-gray-500 transition-colors" />
              <span className="text-xs font-mono text-gray-600 uppercase tracking-wider group-hover:text-gray-500 transition-colors">
                Deslize
              </span>
            </>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 2 }}
        className="absolute top-1/4 left-10 w-96 h-96 bg-white rounded-full blur-[140px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-1/4 right-10 w-96 h-96 bg-gray-400 rounded-full blur-[140px]"
      />
    </section>
  );
};

export default HeroSection;

