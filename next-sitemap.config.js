/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://terandina.com',
  generateRobotsTxt: true,
  exclude: ['/admin', '/checkout'],
  changefreq: 'daily',
  priority: 0.7,

  transform: async (config, path) => {
    const base = {
      loc: path,
      changefreq: config.changefreq || 'daily',
      priority: config.priority || 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    };

    if (path.startsWith('/item/')) {
      return {
        ...base,
        changefreq: 'weekly',
        priority: 1.0,
      };
    }

    return base;
  },
};

module.exports = config;
