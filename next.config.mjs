const nextConfig = {
  // output: 'export',  // Disabled for dev server - enable for static export builds
  // basePath: '/sobo_telecom',  // Disabled for dev server
  // assetPrefix: '/sobo_telecom',  // Disabled for dev server
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
