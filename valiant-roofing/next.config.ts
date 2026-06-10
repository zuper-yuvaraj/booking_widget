import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/roofing_booking_widget',        // this does not work. need to manually change base after build
  assetPrefix: '/roofing_booking_widget/',
  trailingSlash: true,
};

export default nextConfig;
