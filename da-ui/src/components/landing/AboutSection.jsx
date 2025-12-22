import { motion } from 'framer-motion';
import { MapPin, Calendar, Code2, GraduationCap } from 'lucide-react';
import { DAIcon } from '../icons/BrandIcons';
import { useState, useEffect } from 'react';
import { apiLogger } from '../../utils/apiLogger';

const AboutSection = () => {
  const [apiLogs, setApiLogs] = useState([]);
  const maxLogs = 8;

  useEffect(() => {
    const unsubscribe = apiLogger.subscribe((log) => {
      setApiLogs(prev => {
        const newLogs = [log, ...prev].slice(0, maxLogs);
        return newLogs;
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const tags = [
    { icon: MapPin, label: 'Batatais, SP', color: 'text-gray-400' },
    { icon: Calendar, label: '18 Anos', color: 'text-gray-400' },
    { icon: Code2, label: 'Full Stack', color: 'text-white' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="about" className="relative py-24 sm:py-32 bg-gradient-to-b from-black via-zinc-950 to-black">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-12">
            <span className="inline-block px-4 py-2 text-xs font-mono text-gray-500 border border-gray-800 rounded-full bg-zinc-900/50">
              $ whoami
            </span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div variants={itemVariants}>
              <div className="relative group">
                <div className="bg-zinc-900/50 border border-gray-800 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 group-hover:border-gray-700">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black/30">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <div className="flex items-center gap-2">
                        <DAIcon className="w-4 h-4 text-gray-600" />
                        <span className="text-xs font-mono text-gray-500">~/</span>
                        <span className="text-xs font-mono text-white font-semibold">daniel-alipio</span>
                        <span className="text-xs font-mono text-gray-600">.profile</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-green-500"
                      />
                      <span className="text-xs font-mono text-gray-600">online</span>
                    </div>
                  </div>

                  <div className="p-6 font-mono text-xs space-y-2 min-h-[280px] max-h-[280px] overflow-hidden">
                    <div className="flex items-center gap-2 text-gray-500 mb-3">
                      <span>$</span>
                      <span>node api-server.js</span>
                    </div>

                    <div className="space-y-1.5">
                      {apiLogs.length === 0 ? (
                        <div className="text-gray-600">Aguardando requisições...</div>
                      ) : (
                        apiLogs.map((log) => (
                          <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-2"
                          >
                            {log.type === 'request' && (
                              <>
                                <span className="text-blue-400">→</span>
                                <span className="text-yellow-400">{log.method}</span>
                                <span className="text-gray-400">{log.endpoint}</span>
                              </>
                            )}
                            {log.type === 'response' && (
                              <>
                                <span className="text-green-400">←</span>
                                <span className="text-green-400">{log.status}</span>
                                <span className="text-gray-400">{log.message}</span>
                              </>
                            )}
                            {log.type === 'info' && (
                              <>
                                <span className="text-cyan-400">ℹ</span>
                                <span className="text-white">{log.message}</span>
                              </>
                            )}
                            {log.type === 'error' && (
                              <>
                                <span className="text-red-400">✗</span>
                                <span className="text-red-400">{log.status}</span>
                                <span className="text-gray-400">{log.message}</span>
                              </>
                            )}
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute -inset-1 bg-gradient-to-r from-gray-800/20 via-white/5 to-gray-800/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                {tags.map((tag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-gray-800 rounded-lg backdrop-blur-sm hover:border-gray-700 transition-colors"
                  >
                    <tag.icon className={`w-4 h-4 ${tag.color}`} />
                    <span className="text-sm font-medium text-gray-300">{tag.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                Desenvolvendo
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500">
                  desde os 14 anos
                </span>
              </h2>

              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p className="text-lg">
                  Sou Daniel Alípio, tenho 18 anos e desenvolvo APIs e sistemas complexos desde os 14 anos.
                  Atualmente graduando em <span className="text-white font-medium">Análise e Desenvolvimento de Sistemas</span> pela
                  Cruzeiro do Sul, com foco intensivo em <span className="text-white font-medium">Cibersegurança</span> e{' '}
                  <span className="text-white font-medium">Arquitetura de Software</span>.
                </p>

                <p className="text-lg">
                  Minha abordagem une a <span className="text-white font-medium">precisão do código</span> com a{' '}
                  <span className="text-white font-medium">visão de negócios</span>, criando soluções que não apenas funcionam,
                  mas que escalem e gerem valor real.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex items-start gap-4 p-4 bg-gradient-to-r from-zinc-900/80 to-black/50 border border-gray-800 rounded-lg"
              >
                <div className="p-2 bg-white/5 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Cruzeiro do Sul</h3>
                  <p className="text-sm text-gray-500">Análise e Desenvolvimento de Sistemas</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="absolute top-1/2 left-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-500/5 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2" />
    </section>
  );
};

export default AboutSection;

