const Projects = require('../../data/schema/ProjectsSchema');
const { getCache, setCache } = require('../../core/redis');
const logger = require('../../utils/logger');

const CACHE_KEY = 'portfolio:projects';
const CACHE_TTL = 3600;

module.exports = {
    method: 'GET',
    requiresAuth: false,

    async run(req, res) {
        try {
            const cached = await getCache(CACHE_KEY);

            if (cached) {
                res.set('X-Cache', 'HIT');
                return res.status(200).json({
                    success: true,
                    data: cached,
                    source: 'cache'
                });
            }

            res.set('X-Cache', 'MISS');

            const projects = await Projects.getAllProjects();

            if (!projects || projects.length === 0) {
                return res.status(200).json({
                    success: true,
                    data: [],
                    message: 'Nenhum projeto encontrado'
                });
            }

            const formattedProjects = projects.map(project => ({
                id: project.projectId,
                name: project.name,
                url: project.url,
                fullUrl: project.fullUrl,
                shortDescription: project.shortDescription,
                description: project.description,
                tech: project.tech,
                status: project.status,
                tag: project.tag,
                tagColor: project.tagColor,
                logo: project.logo,
                hero: project.hero,
                accentColor: project.accentColor
            }));

            await setCache(CACHE_KEY, formattedProjects, CACHE_TTL);

            return res.status(200).json({
                success: true,
                data: formattedProjects,
                source: 'database'
            });

        } catch (error) {
            logger.error('[PROJECTS] Erro ao buscar projetos:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar projetos',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

