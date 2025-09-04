// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint errors on Vercel build
  },
};

module.exports = nextConfig;
