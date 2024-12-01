const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? '/smp46.me/' : '',
  basePath: process.env.DEPLOYED_GITHUB_PATH || isProd ? '/smp46.me' : '',
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;
