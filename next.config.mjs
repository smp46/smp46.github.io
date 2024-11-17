import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const baseConfig = {
  output: 'export',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true, // Globally disable image optimization
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/, // Match .md and .mdx files
  options: {
    // Add any desired remark or rehype plugins here
  },
});

export default withMDX(baseConfig);

