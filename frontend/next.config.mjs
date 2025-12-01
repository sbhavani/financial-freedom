/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Use environment variable or default to mac-mini-i7.local (works for both local and remote)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://mac-mini-i7.local:8443';

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
