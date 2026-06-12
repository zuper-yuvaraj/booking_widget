import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/roof_raiders',        // this does not work. need to manually change base after build
  assetPrefix: '/roof_raiders/',
  trailingSlash: true,
};

export default nextConfig;
