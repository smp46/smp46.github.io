const fs = require('fs');
const path = require('path');

// Directory containing Markdown files for dynamic project pages
const projectDirectory = path.join(process.cwd(), 'src/projects');

// Function to dynamically generate project paths
const getProjectSlugs = () => {
  const files = fs.readdirSync(projectDirectory);
  return files.map((file) => `/projects/${file.replace('.mdx', '')}`);
};

// Define static routes explicitly
const staticRoutes = [
  '/',
  '/about-me',
  '/employment',
  '/projects',
];

// Sitemap configuration
module.exports = {
  siteUrl: 'https://smp46.me', // Replace with your domain
  generateRobotsTxt: true,    // Generate robots.txt
  generateIndexSitemap: false,
  additionalPaths: async (config) => {
    // Generate dynamic paths for the Markdown files
    const projectPaths = getProjectSlugs().map((slug) => ({
      loc: `${config.siteUrl}${slug}`, // Properly format URLs for dynamic projects
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.7,
    }));

    // Generate static paths explicitly
    const staticPaths = staticRoutes.map((route) => ({
      loc: `${config.siteUrl}${route}`, // Properly format URLs for static routes
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.7,
    }));

    return [...staticPaths, ...projectPaths];
  },
  exclude: staticRoutes, 
};

