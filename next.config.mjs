import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const baseConfig = {
  output: 'export',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true, // Globally disable image optimization
  },
  basePath: '/<repository-name>', // Replace <repository-name> with your GitHub repo name
  trailingSlash: true, // Ensures all paths end with a slash
};

