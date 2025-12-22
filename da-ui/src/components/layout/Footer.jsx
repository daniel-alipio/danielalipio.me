import { motion } from 'framer-motion';
import { Mail, ExternalLink, Coffee } from 'lucide-react';
import { DAIcon, InstagramIcon, XIcon } from '../icons/BrandIcons';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const projects = [
    { name: 'FRAME3', url: 'https://frame3.com.br' },
    { name: 'Viceratti Devs', url: 'https://vdevs.store' },
    { name: 'PlanPad', url: 'https://planpad.app' },
    { name: 'Campinas RP', url: 'https://campinas-rp.com' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      icon: InstagramIcon,
      url: '/instagram',
      color: 'hover:text-pink-400'
    },
    {
      name: 'GitHub',
      icon: FaGithub,
      url: '/github',
      color: 'hover:text-gray-300'
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      url: '/linkedin',
      color: 'hover:text-blue-400'
    }
  ];

  const quickLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projetos', href: '#projects' },
    { name: 'Contato', href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="relative bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-4"
            >
              <DAIcon className="w-10 h-10 text-white" />
              <span className="text-xl font-bold text-white">Daniel Alípio</span>
            </motion.div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Desenvolvedor Full Stack especializado em criar soluções digitais completas e inovadoras.
            </p>
            <a
              href="mailto:contato@danielalipio.me"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group"
            >
              <Mail className="w-4 h-4" />
              <span className="group-hover:underline">contato@danielalipio.me</span>
            </a>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-gray-400 hover:text-white transition-colors text-sm inline-block hover:translate-x-1 duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Principais Projetos</h3>
            <ul className="space-y-2">
              {projects.map((project) => (
                <li key={project.name}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    <span className="group-hover:underline">{project.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Redes Sociais</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-zinc-900 border border-gray-800 rounded-lg text-gray-400 ${social.color} transition-all duration-300 hover:scale-110`}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-gray-500 text-sm">
            <span>© {currentYear} - Daniel Alípio</span>
            <span className="hidden md:inline">|</span>
            <div className="flex items-center gap-2">
              <span>Feito com</span>
              <motion.span
                className="text-red-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                ♥
              </motion.span>
              <span>e muito</span>
              <Coffee className="w-4 h-4 inline-block text-shadow-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
    </footer>
  );
};

export default Footer;

