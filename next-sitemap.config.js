// Sitemap configuration
module.exports = {
  siteUrl: 'https://smp46.me', // Replace with your domain
  generateRobotsTxt: true,    // Generate robots.txt
  generateIndexSitemap: false,
  // additionalPaths: (config) => {
  //   // Generate dynamic paths for the Markdown files
  //   const projectPaths = getProjectSlugs().map((slug) => ({
  //     loc: `${config.siteUrl}${slug}`, // Properly format URLs for dynamic projects
  //     lastmod: new Date().toISOString(),
  //     changefreq: 'daily',
  //     priority: 0.7,
  //   }));
  //
  //   return projectPaths;
  // },
};
