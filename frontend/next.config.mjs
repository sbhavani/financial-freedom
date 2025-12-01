/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Use environment variable or default to localhost
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8443';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/sanctum/csrf-cookie',
        destination: `${backendUrl}/sanctum/csrf-cookie`,
      }
    ]
  }
};

export default nextConfig;
