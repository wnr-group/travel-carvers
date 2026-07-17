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
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
      // Supabase Storage (public buckets) — production project + local dev instance.
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    // Serve modern formats when the browser supports them.
    formats: ['image/avif', 'image/webp'],
    //dangerouslyAllowLocalIP is enabled only for development
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
  },
};

module.exports = nextConfig;
