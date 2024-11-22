import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const baseConfig = {
  output: 'export',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true, // Globally disable image optimization
  },
};

