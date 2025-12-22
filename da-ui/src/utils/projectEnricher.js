
const STATUS_COLORS = {
  'Live': 'bg-green-500',
  'In Progress': 'bg-amber-500',
  'Archived': 'bg-gray-500'
};

const TECH_ACCENT_COLORS = {
  'React': 'from-blue-400 to-cyan-500',
  'Node.js': 'from-green-500 to-emerald-600',
  'Discord.js': 'from-indigo-500 to-purple-600',
  'MongoDB': 'from-green-600 to-teal-700',
  'MySQL': 'from-blue-500 to-sky-600',
  'C#': 'from-purple-500 to-violet-600',
  'Java': 'from-orange-500 to-red-600',
  'PHP': 'from-indigo-600 to-blue-700',
  'default': 'from-gray-500 to-slate-600'
};

const PROJECT_TAGS = {
  'SaaS': { label: 'SaaS', color: 'bg-blue-500' },
  'Founder': { label: 'Founder', color: 'bg-gray-500' },
  'Productivity': { label: 'Productivity', color: 'bg-cyan-500' },
  'Gaming': { label: 'Gaming', color: 'bg-gradient-to-r from-red-500 to-red-600' },
  'Enterprise': { label: 'Enterprise', color: 'bg-purple-500' },
  'Open Source': { label: 'Open Source', color: 'bg-green-500' },
  'default': { label: 'Project', color: 'bg-gray-600' }
};

const generateFullUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

const generateShortDescription = (description) => {
  if (!description) return '';
  const maxLength = 150;
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength).trim() + '...';
};

const determineAccentColor = (tech) => {
  if (!tech || tech.length === 0) return TECH_ACCENT_COLORS.default;

  for (const technology of tech) {
    if (TECH_ACCENT_COLORS[technology]) {
      return TECH_ACCENT_COLORS[technology];
    }
  }

  return TECH_ACCENT_COLORS.default;
};

const determineTag = (tag, status) => {
  if (tag && PROJECT_TAGS[tag]) {
    return PROJECT_TAGS[tag];
  }

  return {
    label: status || 'Project',
    color: STATUS_COLORS[status] || STATUS_COLORS['In Progress']
  };
};

const generateLogoPath = (projectId, name) => {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  return `/projects/${slug}/logo.png`;
};

const generateHeroPath = (projectId, name) => {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  return `/projects/${slug}/hero.png`;
};

export const enrichProject = (project) => {
  const enriched = { ...project };

  if (!enriched.fullUrl && enriched.url) {
    enriched.fullUrl = generateFullUrl(enriched.url);
  }

  if (!enriched.shortDescription && enriched.description) {
    enriched.shortDescription = generateShortDescription(enriched.description);
  }

  if (!enriched.accentColor) {
    enriched.accentColor = determineAccentColor(enriched.tech);
  }

  const tagInfo = determineTag(enriched.tag, enriched.status);
  if (!enriched.tag) {
    enriched.tag = tagInfo.label;
  }
  if (!enriched.tagColor) {
    enriched.tagColor = tagInfo.color;
  }

  if (!enriched.logo) {
    enriched.logo = generateLogoPath(enriched.projectId || enriched.id, enriched.name);
  }
  if (!enriched.hero) {
    enriched.hero = generateHeroPath(enriched.projectId || enriched.id, enriched.name);
  }

  if (!enriched.id && enriched.projectId) {
    enriched.id = enriched.projectId;
  }

  return enriched;
};

export const enrichProjects = (projects) => {
  if (!Array.isArray(projects)) return [];
  return projects.map(enrichProject);
};

export const addTechAccentColor = (tech, accentColor) => {
  TECH_ACCENT_COLORS[tech] = accentColor;
};

export const addProjectTag = (tagName, tagLabel, tagColor) => {
  PROJECT_TAGS[tagName] = { label: tagLabel, color: tagColor };
};

