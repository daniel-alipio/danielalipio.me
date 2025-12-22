import { motion } from 'framer-motion';
import { Instagram, Github, Linkedin, Mail } from 'lucide-react';
import ContactForm from '../forms/ContactForm';

const ContactSection = () => {

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: '/instagram',
      handle: '@danielhs',
      color: 'hover:text-pink-400',
      bgColor: 'hover:bg-pink-500/10',
      borderColor: 'hover:border-pink-500/30',
    },
    {
      name: 'GitHub',
      icon: Github,
      url: '/github',
      handle: 'daniel-alipio',
      color: 'hover:text-gray-300',
      bgColor: 'hover:bg-gray-500/10',
      borderColor: 'hover:border-gray-500/30',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: '/linkedin',
      handle: 'in/danielalipio',
      color: 'hover:text-blue-400',
      bgColor: 'hover:bg-blue-500/10',
      borderColor: 'hover:border-blue-500/30',
    },
  ];


  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-gradient-to-b from-black via-slate-950 to-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 text-xs font-mono text-gray-500 border border-gray-800 rounded-full bg-zinc-900/50 mb-6">
            $ contact --me
          </span>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Vamos Construir Algo Juntos?
          </h2>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Estou sempre aberto para discutir novos projetos, ideias criativas ou oportunidades de parceria
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">
                Me encontre nas redes
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Siga meu trabalho e conecte-se comigo nas plataformas onde compartilho
                conteúdo e projetos.
              </p>
            </div>

            <div className="space-y-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  className={`
                    group flex items-center gap-4 p-6 rounded-xl border border-gray-800 
                    bg-zinc-900/50 backdrop-blur-sm transition-all duration-300
                    ${social.bgColor} ${social.borderColor}
                  `}
                >
                  <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-black/50 border border-gray-700 transition-colors group-hover:border-gray-600">
                    <social.icon className={`w-7 h-7 text-gray-400 transition-colors ${social.color}`} />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {social.name}
                    </h4>
                    <p className="text-sm font-mono text-gray-500">
                      {social.handle}
                    </p>
                  </div>

                  <div className="text-gray-600 group-hover:text-gray-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-6 rounded-xl border border-gray-800 bg-gradient-to-br from-zinc-900/80 to-black/50 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 rounded-lg">
                  <Mail className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Email Direto</h4>
                  <a
                    href="mailto:contato@danielalipio.me"
                    className="text-gray-400 hover:text-white transition-colors font-mono text-sm"
                  >
                    contato@danielalipio.me
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[140px]" />
    </section>
  );
};

export default ContactSection;

