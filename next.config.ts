import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production"
const basePath = isProd ? "/sales_demo_new_account" : ""

const nextConfig: NextConfig = {
  ...(isProd && { output: "export" }),
  basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
  trailingSlash: true,
};

export default nextConfig;
