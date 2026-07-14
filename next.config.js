/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      // Add your Supabase storage domain here when deployed
      // Example: { protocol: 'https', hostname: 'abcdefghijklmnop.supabase.co', pathname: '/storage/**' }
    ],
  },
};

module.exports = nextConfig;
