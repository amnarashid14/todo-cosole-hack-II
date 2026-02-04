/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  // Specify the app directory location
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
}

module.exports = nextConfig