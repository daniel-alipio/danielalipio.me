const { getCache, setCache } = require('../../core/redis');
const logger = require('../../utils/logger');
const config = require('../../config/config')();

const CACHE_KEY = 'github:activity';
const CACHE_TTL = 3600;

const CONTRIBUTION_LEVELS = {
    'NONE': 0,
    'FIRST_QUARTILE': 1,
    'SECOND_QUARTILE': 2,
    'THIRD_QUARTILE': 3,
    'FOURTH_QUARTILE': 4
};

const MONTHS_TO_FETCH = 6;

async function fetchGitHubContributions() {
    const { username, token } = config.github;

    if (!username || !token) {
        throw new Error('GitHub username ou token não configurados');
    }

    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - MONTHS_TO_FETCH);

    const query = `
        query($userName:String!, $from:DateTime!, $to:DateTime!) {
            user(login: $userName) {
                contributionsCollection(from: $from, to: $to) {
                    contributionCalendar {
                        totalContributions
                        weeks {
                            contributionDays {
                                contributionCount
                                date
                                contributionLevel
                            }
                        }
                    }
                }
            }
        }
    `;

    const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: {
                userName: username,
                from: startDate.toISOString(),
                to: today.toISOString()
            }
        })
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors) {
        throw new Error(`GitHub GraphQL errors: ${JSON.stringify(data.errors)}`);
    }

    return data.data.user.contributionsCollection.contributionCalendar;
}

function getLevelNumber(contributionLevel) {
    return CONTRIBUTION_LEVELS[contributionLevel] || 0;
}

function processGitHubData(calendar) {
    const activities = [];

    calendar.weeks.forEach(week => {
        week.contributionDays.forEach(day => {
            activities.push({
                date: day.date,
                count: day.contributionCount,
                level: getLevelNumber(day.contributionLevel)
            });
        });
    });

    return activities;
}

function calculateCurrentStreak(activities) {
    let streak = 0;
    for (let i = activities.length - 1; i >= 0; i--) {
        if (activities[i].count > 0) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

function calculateLongestStreak(activities) {
    let longest = 0;
    let current = 0;

    for (const day of activities) {
        if (day.count > 0) {
            current++;
            longest = Math.max(longest, current);
        } else {
            current = 0;
        }
    }

    return longest;
}

function calculateStats(activities) {
    const total = activities.reduce((sum, day) => sum + day.count, 0);
    const daysWithActivity = activities.filter(day => day.count > 0).length;
    const currentStreak = calculateCurrentStreak(activities);
    const longestStreak = calculateLongestStreak(activities);

    return {
        total,
        daysWithActivity,
        currentStreak,
        longestStreak,
        averagePerDay: Math.round((total / activities.length) * 10) / 10,
        totalDays: activities.length
    };
}

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

            const calendar = await fetchGitHubContributions();
            const activities = processGitHubData(calendar);
            const stats = calculateStats(activities);

            const data = {
                activities,
                stats,
                totalContributions: calendar.totalContributions
            };

            await setCache(CACHE_KEY, data, CACHE_TTL);

            return res.status(200).json({
                success: true,
                data
            });

        } catch (error) {
            logger.error('Erro ao buscar dados de atividade do GitHub:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao buscar dados de atividade do GitHub',
                error: error.message
            });
        }
    }
};

