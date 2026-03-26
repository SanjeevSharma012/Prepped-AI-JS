 /** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },

  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;