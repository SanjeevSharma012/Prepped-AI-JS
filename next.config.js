/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname, // ensures Turbopack uses this project folder as the root
  },
};

module.exports = nextConfig;