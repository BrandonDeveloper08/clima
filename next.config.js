/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MET_USER: process.env.MET_USER,
    MET_PASS: process.env.MET_PASS,
  },
  images: {
    domains: ['api.meteomatics.com'],
  },
}

module.exports = nextConfig
