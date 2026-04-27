import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/equity_roofing',        // this does not work. need to manually change base after build
  trailingSlash: true,
};

export default nextConfig;
