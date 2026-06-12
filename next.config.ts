import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/toiturescossette',        // this does not work. need to manually change base after build
  assetPrefix: '/toiturescossette/',
  trailingSlash: true,
};

export default nextConfig;
