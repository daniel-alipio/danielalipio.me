import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { useState, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { apiService } from '../../services/api';
import { enrichProjects } from '../../utils/projectEnricher';
import OptimizedImage from '../ui/OptimizedImage';

const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProjects();
        if (response.success) {
          const enrichedProjects = enrichProjects(response.data);
          setProjects(enrichedProjects);
        }
      } catch (err) {
        console.error('Erro ao carregar projetos:', err);
        setError('Não foi possível carregar os projetos');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);


  const ProjectCard = memo(({ project }) => (
    <div
      onClick={() => setSelectedProject(project)}
      className="group relative cursor-pointer h-full"
    >
      <div className="relative h-full rounded-2xl border border-gray-800 bg-black overflow-hidden hover:border-gray-700 transition-all duration-300">
        <div className="relative h-64 overflow-hidden">
          <OptimizedImage
            src={project.hero}
            alt={`${project.name} preview`}
            className="w-full h-full"
            imgClassName="object-top group-hover:scale-105 transition-transform duration-500"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          {project.status === 'In Progress' && (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-sm border border-amber-500/50 rounded-full">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-amber-400">Em Desenvolvimento</span>
            </div>
          )}
        </div>

        <div className="relative p-6">
          <div className="absolute -top-12 left-6">
            <div className="w-24 h-24 rounded-2xl border-4 border-black bg-black overflow-hidden shadow-xl">
              <OptimizedImage
                src={project.logo}
                alt={`${project.name} logo`}
                className="w-full h-full"
                priority={true}
              />
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <span className={`px-3 py-1 ${project.tagColor} text-white text-xs font-bold uppercase tracking-wider rounded-full`}>
              {project.tag}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gray-200 transition-colors">
            {project.name}
          </h3>

          <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
            <span className="font-mono">{project.url}</span>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 4).map((tech, index) => (
              <span
                key={index}
                className="px-2.5 py-1 text-xs font-mono text-gray-500 bg-zinc-900 border border-gray-800 rounded-md"
              >
                {tech}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="px-2.5 py-1 text-xs font-mono text-gray-600">
                +{project.tech.length - 4}
              </span>
            )}
          </div>

          <div className="mt-6 flex items-center gap-2 text-gray-600 group-hover:text-white transition-colors">
            <span className="text-sm font-medium">Ver detalhes</span>
            <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </div>

        <div className={`absolute -inset-1 bg-gradient-to-r ${project.accentColor} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10`} />
      </div>
    </div>
  ));

  ProjectCard.displayName = 'ProjectCard';

  ProjectCard.propTypes = {
    project: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      fullUrl: PropTypes.string.isRequired,
      shortDescription: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      tech: PropTypes.arrayOf(PropTypes.string).isRequired,
      status: PropTypes.string.isRequired,
      tag: PropTypes.string.isRequired,
      tagColor: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired,
      hero: PropTypes.string.isRequired,
      accentColor: PropTypes.string.isRequired,
    }).isRequired,
  };

  const ProjectModal = memo(({ project, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 rounded-2xl border border-gray-800 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full border border-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="relative h-60 overflow-hidden">
          <OptimizedImage
            src={project.hero}
            alt={`${project.name} preview`}
            className="w-full h-full"
            imgClassName="object-top"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

          <div className="absolute bottom-6 left-6">
            <div className="w-32 h-32 rounded-2xl border-4 border-zinc-900 bg-zinc-900 overflow-hidden shadow-2xl">
              <OptimizedImage
                src={project.logo}
                alt={`${project.name} logo`}
                className="w-full h-full"
                priority={true}
              />
            </div>
          </div>

          {project.status === 'In Progress' && (
            <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-sm border border-amber-500/50 rounded-full">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-amber-400">Em Desenvolvimento</span>
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-4xl font-bold text-white">{project.name}</h2>
                <span className={`px-3 py-1 ${project.tagColor} text-white text-xs font-bold uppercase tracking-wider rounded-full`}>
                  {project.tag}
                </span>
              </div>
              <a
                href={project.fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
              >
                <span className="font-mono">{project.url}</span>
                <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">Sobre o Projeto</h3>
            <p className="text-gray-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-3">Tecnologias Utilizadas</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 text-sm font-mono text-gray-300 bg-black/50 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <a
              href={project.fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${project.accentColor} text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300`}
            >
              <span>Visualizar Projeto</span>
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  ));

  ProjectModal.displayName = 'ProjectModal';

  ProjectModal.propTypes = {
    project: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      fullUrl: PropTypes.string.isRequired,
      shortDescription: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      tech: PropTypes.arrayOf(PropTypes.string).isRequired,
      status: PropTypes.string.isRequired,
      tag: PropTypes.string.isRequired,
      tagColor: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired,
      hero: PropTypes.string.isRequired,
      accentColor: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  return (
    <section id="projects" className="relative py-24 sm:py-32 bg-gradient-to-b from-black via-zinc-950 to-black">
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 text-xs font-mono text-gray-500 border border-gray-800 rounded-full bg-zinc-900/50 mb-6">
            $ git log --projects
          </span>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Projetos & Empresas
          </h2>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Soluções que criei do zero, cada uma resolvendo problemas reais com tecnologia de ponta
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-gray-500 motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-gray-500">Carregando projetos...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-20">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className="h-full"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 font-mono text-sm">
            Mais projetos e contribuições open-source no meu{' '}
            <a
              href="/github"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 underline underline-offset-4 transition-colors"
            >
              GitHub
            </a>
          </p>
        </motion.div>
      </div>

      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectsSection;

