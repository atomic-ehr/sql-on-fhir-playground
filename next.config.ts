import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use different directories for dev and production builds
  // This prevents conflicts when running build while dev server is active
  distDir: process.env.NODE_ENV === 'production' ? '.next-prod' : '.next',
};

export default nextConfig;
