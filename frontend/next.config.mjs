/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://mac-mini-i7.local:8443/api/:path*',
      },
      {
        source: '/sanctum/csrf-cookie',
        destination: 'https://mac-mini-i7.local:8443/sanctum/csrf-cookie',
      }
    ]
  }
};

export default nextConfig;
