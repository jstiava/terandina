/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://terandina.com',   // ← your domain
  generateRobotsTxt: true,
  exclude: ['/admin', '/checkout'],
  changefreq: 'daily',
  priority: 0.7,

  // Example: fine‑tune product URLs
  transform: async (config, path) => {
    // Give every /item/* page a higher priority
    if (path.startsWith('/item/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: new Date().toISOString(),
        alternateRefs: [],
      };
    }

    // fallback to default transform (if defined)
    return config.transform ? config.transform(config, path) : {
      loc: path,
      changefreq: config.changefreq || 'daily',
      priority: config.priority || 0.7,
      lastmod: new Date().toISOString(),
      alternateRefs: []
    };
  },
};

module.exports = config;
