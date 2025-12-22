import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';
import { memo, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { apiService } from '../../services/api';
import { SiReact, SiNodedotjs, SiDocker, SiRedis, SiMongodb, SiMysql, SiJavascript, SiExpress, SiTailwindcss, SiGithub, SiDigitalocean, SiSharp, SiPhp, SiNginx } from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { Terminal } from 'lucide-react';

const iconMap = {
  'React': SiReact,
  'JavaScript': SiJavascript,
  'Tailwind CSS': SiTailwindcss,
  'Node.js': SiNodedotjs,
  'Express': SiExpress,
  'C#': SiSharp,
  'Redis': SiRedis,
  'MongoDB': SiMongodb,
  'MySQL': SiMysql,
  'WebSocket': Terminal,
  'Java': FaJava,
  'PHP': SiPhp,
  'GitHub': SiGithub,
  'Docker': SiDocker,
  'Nginx': SiNginx,
};

const StacksSection = () => {
  const [techStack, setTechStack] = useState({ frontend: [], backend: [], devops: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({
    frontend: true,
    backend: true,
    devops: true,
  });

  const toggleCategory = useCallback((category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  }, []);

  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        setLoading(true);
        const response = await apiService.getStacks();
        if (response.success) {
          const mappedStack = {};
          Object.keys(response.data).forEach(category => {
            mappedStack[category] = response.data[category].map(tech => ({
              ...tech,
              icon: iconMap[tech.name] || Terminal
            }));
          });
          setTechStack(mappedStack);
        }
      } catch (err) {
        console.error('Erro ao carregar tech stack:', err);
        setError('Não foi possível carregar as tecnologias');
      } finally {
        setLoading(false);
      }
    };

    fetchTechStack();
  }, []);

  const toggleFrontend = useCallback(() => toggleCategory('frontend'), [toggleCategory]);
  const toggleBackend = useCallback(() => toggleCategory('backend'), [toggleCategory]);
  const toggleDevops = useCallback(() => toggleCategory('devops'), [toggleCategory]);


  const TechCard = memo(({ tech }) => (
    <div className="group relative hover:-translate-y-2 transition-transform duration-200">
      <div className="relative h-full p-6 rounded-2xl border border-gray-800 bg-gradient-to-br from-zinc-900/80 to-black/80 backdrop-blur-sm hover:border-gray-700 transition-all duration-300 overflow-hidden">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-2xl"
          style={{ backgroundColor: tech.color }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-zinc-800/50 to-black/50 border border-gray-800 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            >
              <tech.icon
                className="w-10 h-10 transition-all duration-300"
                style={{ color: tech.color }}
              />
            </div>

            {tech.isLearning && (
              <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-600/90 to-orange-600/90 border border-yellow-500/50 rounded-full shadow-lg">
                <motion.div
                  key={`sparkle-${tech.name}`}
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </motion.div>
                <span className="text-xs font-semibold text-white">Learning</span>
              </div>
            )}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            {tech.name}
          </h3>

          <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
            {tech.description}
          </p>

          <div className="mt-4 w-12 h-0.5 rounded-full bg-gradient-to-r from-transparent via-gray-700 to-transparent group-hover:via-gray-500 transition-colors duration-300" />
        </div>
      </div>
    </div>
  ));

  TechCard.displayName = 'TechCard';

  TechCard.propTypes = {
    tech: PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      color: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      isLearning: PropTypes.bool,
    }).isRequired,
  };

  const CategorySection = memo(({ title, icon: Icon, techs, iconColor, isExpanded, onToggle }) => {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg bg-gradient-to-br from-zinc-800 to-black border border-gray-800 hover:border-gray-700 transition-all duration-300 group"
            aria-label={isExpanded ? `Recolher ${title}` : `Expandir ${title}`}
          >
            <Icon className="w-5 h-5 transition-colors duration-300" style={{ color: iconColor }} />
          </button>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-800 to-transparent" />
          <button
            onClick={onToggle}
            className="p-2 rounded-lg bg-gradient-to-br from-zinc-800 to-black border border-gray-800 hover:border-gray-700 transition-all duration-300 group"
            aria-label={isExpanded ? `Recolher ${title}` : `Expandir ${title}`}
          >
            <motion.div
              key={`chevron-${title}`}
              initial={false}
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
            </motion.div>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key={`content-${title}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: 'auto',
                opacity: 1,
                transition: {
                  height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                  opacity: { duration: 0.3, ease: "easeInOut" },
                }
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
                  opacity: { duration: 0.2, ease: "easeInOut" },
                }
              }}
              className="overflow-hidden"
            >
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-2"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                    }
                  },
                  hidden: {
                    transition: {
                      staggerChildren: 0.02,
                      staggerDirection: -1,
                    }
                  }
                }}
              >
                {techs.map((tech, index) => (
                  <motion.div
                    key={`${title}-${tech.name}-${index}`}
                    variants={{
                      hidden: { opacity: 0, y: 20, scale: 0.95 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                          duration: 0.3,
                          ease: [0.04, 0.62, 0.23, 0.98]
                        }
                      }
                    }}
                  >
                    <TechCard tech={tech} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }, (prevProps, nextProps) => {
    return (
      prevProps.title === nextProps.title &&
      prevProps.isExpanded === nextProps.isExpanded &&
      prevProps.techs === nextProps.techs &&
      prevProps.iconColor === nextProps.iconColor &&
      prevProps.onToggle === nextProps.onToggle
    );
  });

  CategorySection.displayName = 'CategorySection';

  CategorySection.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.elementType.isRequired,
    techs: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      color: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      isLearning: PropTypes.bool,
    })).isRequired,
    iconColor: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
  };

  return (
    <section id="skills" className="relative py-24 sm:py-32 bg-black overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 text-xs font-mono text-gray-500 border border-gray-800 rounded-full bg-zinc-900/50 mb-6">
            $ tech --stack --list
          </span>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Stack Tecnológica
          </h2>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Tecnologias que domino e ferramentas que utilizo no dia a dia
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-gray-500 motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-gray-500">Carregando tecnologias...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <CategorySection
              title="Frontend Development"
              icon={SiReact}
              iconColor="#61DAFB"
              techs={techStack.frontend}
              isExpanded={expandedCategories.frontend}
              onToggle={toggleFrontend}
            />

            <CategorySection
              title="Backend & Database"
              icon={SiNodedotjs}
              iconColor="#339933"
              techs={techStack.backend}
              isExpanded={expandedCategories.backend}
              onToggle={toggleBackend}
            />

            <CategorySection
              title="DevOps & Infrastructure"
              icon={SiDocker}
              iconColor="#2496ED"
              techs={techStack.devops}
              isExpanded={expandedCategories.devops}
              onToggle={toggleDevops}
            />
          </>
        )}


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20"
        >
          <div className="relative p-8 sm:p-12 rounded-2xl border border-gray-800 bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px]" />
            <div className="relative">
              <div className="text-6xl text-gray-800 font-serif mb-4">"</div>
              <p className="text-xl sm:text-2xl font-light text-gray-300 italic max-w-3xl">
                A maestria não vem de saber tudo, mas de dominar o essencial e ter fome constante por aprender.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-mono text-gray-600">~$ while true; do learn; done</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StacksSection;

