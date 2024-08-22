/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  // reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    CHAIN_ID: process.env.CHAIN_ID,
    API_BASE_URL: process.env.API_BASE_URL,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  output: "standalone",
};

module.exports = nextConfig;
