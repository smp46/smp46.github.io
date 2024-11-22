const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? '/smp46.github.io/' : '',
  basePath: isProd ? '/smp46.github.io' : '',
  output: 'export'
};

export default nextConfig;

