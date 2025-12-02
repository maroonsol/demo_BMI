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
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
};

export default nextConfig;
