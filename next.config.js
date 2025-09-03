/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
  eslint: {
    // 🚀 Build ke waqt ESLint errors ignore karega
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 🚀 Build ke waqt TypeScript errors ignore karega
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
