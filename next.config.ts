import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //output: 'standalone',
  images: {
    // domains: [
    //   'i.pinimg.com',
    //   'lh3.googleusercontent.com',
    //   'itwolrshcebjdyoihbzg.supabase.co',
    // ],
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'itwolrshcebjdyoihbzg.supabase.co',
        port: '',
        pathname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/supabase-images/:path*',
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=31536000, immutable',
  //         },
  //       ],
  //     },
  //   ];
  // },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/supabase-images/:path*',
  //       destination: 'https://itwolrshcebjdyoihbzg.supabase.co/storage/v1/object/public/:path*',
  //     },
  //   ];
  // },


  // webpack: (config, { webpack }) => {
  //   config.resolve.fallback = {
  //     ...config.resolve.fallback,
  //     punycode: false,
  //   };
  //   return config;
  // },
};

export default nextConfig;
