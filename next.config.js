/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dv3jocelx/image/upload/**', // Cụ thể hơn
      }
    ]
  }
}

module.exports = nextConfig
