import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DAIcon } from '../components/icons/BrandIcons';

export default function NotFoundPage() {

  return (
      <div className="min-h-screen relative overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl w-full text-center"
          >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
                className="mb-12"
            >
              <motion.div
                  className="relative inline-block"
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
              >
                <div className="relative p-4 rounded-2xl border border-white/10 bg-zinc-900/30 backdrop-blur-sm">
                  <DAIcon className="w-16 h-16 text-white/90" />
                </div>
              </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mb-8"
            >
              <div className="flex items-center justify-center gap-6 mb-6">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100px" }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="h-px bg-gradient-to-r from-transparent via-white to-white"
                />
                <h1 className="text-8xl md:text-9xl font-black text-white tracking-tighter">
                  404
                </h1>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100px" }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="h-px bg-gradient-to-l from-transparent via-white to-white"
                />
              </div>
              <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="h-px w-40 mx-auto bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="mb-16 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-light text-white tracking-wide">
                PÁGINA NÃO ENCONTRADA
              </h2>
              <p className="text-gray-400 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                A página que você está procurando não existe ou foi movida.
                Confira se o endereço está correto.
              </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/" className="w-full sm:w-auto">
                <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group w-full sm:w-auto relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-black font-semibold tracking-wide overflow-hidden transition-all rounded-lg"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Home className="w-5 h-5" />
                    VOLTAR AO INÍCIO
                  </span>
                </motion.button>
              </Link>

              <motion.button
                  onClick={() => window.history.back()}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 px-10 py-4 text-white font-semibold tracking-wide border-2 border-white/20 hover:border-white/60 transition-all rounded-lg backdrop-blur-sm"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>VOLTAR</span>
              </motion.button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.9, duration: 1 }}
                className="mt-20 flex items-center justify-center gap-3"
            >
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-white/20" />
              <span className="text-xs text-gray-600 tracking-widest font-mono">
                ERROR 404
              </span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-white/20" />
            </motion.div>
          </motion.div>

          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
              className="absolute bottom-8 text-center"
          >
            <div className="text-xs text-gray-600 tracking-widest font-semibold">
              DANIEL ALÍPIO
            </div>
            <div className="text-xs text-gray-700 mt-1">
                &copy; {new Date().getFullYear()}
            </div>
          </motion.div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500/5 rounded-full blur-[140px]" />
      </div>
  );
}