/** @type {import('next').NextConfig} */
let withPWA = config => config;

try {
  withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development'
  });
} catch (e) {
  console.warn('Could not load next-pwa, continuing without it.');
}

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com', 'image.tmdb.org'],
  },
};

module.exports = withPWA(nextConfig); 