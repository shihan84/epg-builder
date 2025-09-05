import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable strict mode for production builds
  reactStrictMode: true,
  
  // Environment-specific configurations
  typescript: {
    // Don't ignore build errors in production
    ignoreBuildErrors: false,
  },
  
  eslint: {
    // Don't ignore ESLint errors in production
    ignoreDuringBuilds: false,
  },
  
  // Handle static generation for API routes
  generateBuildId: async () => {
    return 'epg-manager-build-' + Date.now();
  },
  
  // Handle images optimization
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
};

export default nextConfig;
