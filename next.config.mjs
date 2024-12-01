const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? '/smp46.github.io/' : '',
  basePath:
    process.env.DEPLOYED_GITHUB_PATH || isProd ? '/smp46.github.io' : '',
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;
