import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: process.cwd(),
  },
  // Increase timeout for PDF generation API route
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Mark these packages as external to prevent bundling issues on Vercel
  // This ensures the packages are available at runtime with all their files
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  
  // Webpack configuration to handle Chromium binary files
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure Chromium binary files are not processed by webpack
      config.externals = [...(config.externals || []), '@sparticuz/chromium'];
    }
    return config;
  },
};

export default nextConfig;
