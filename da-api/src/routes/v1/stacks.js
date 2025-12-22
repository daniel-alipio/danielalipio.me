const Stack = require('../../data/schema/StackSchema');
const { getCache, setCache } = require('../../core/redis');
const logger = require('../../utils/logger');

const CACHE_KEY = 'portfolio:stacks';
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

            const stacks = await Stack.getAllStacks();

            if (!stacks || Object.keys(stacks).length === 0) {
                return res.status(200).json({
                    success: true,
                    data: {
                        frontend: [],
                        backend: [],
                        devops: []
                    },
                    message: 'Nenhuma stack encontrada'
                });
            }

            await setCache(CACHE_KEY, stacks, CACHE_TTL);

            return res.status(200).json({
                success: true,
                data: stacks,
                source: 'database'
            });

        } catch (error) {
            logger.error('[STACKS] Erro ao buscar stacks:', error);

            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar stacks',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

