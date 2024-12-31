import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'i.pinimg.com',
      'lh3.googleusercontent.com',
      'itwolrshcebjdyoihbzg.supabase.co',
    ],
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'i.pinimg.com',
    //     pathname: '**',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'lh3.googleusercontent.com',
    //     pathname: '**',
    //   },
    //   {
    //     protocol: 'https',
    //     hostname: 'itwolrshcebjdyoihbzg.supabase.co',
    //     pathname: '**',
    //   },
    // ],
  },
  // webpack: (config, { webpack }) => {
  //   config.resolve.fallback = {
  //     ...config.resolve.fallback,
  //     punycode: false,
  //   };
  //   return config;
  // },
};

export default nextConfig;
