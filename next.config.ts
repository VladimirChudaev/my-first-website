import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co', // Шаблон для доменов Supabase Storage
      },
    ],
    localPatterns: [
      {
        pathname: '/api/supabase',
        search: '*',
      },
      {
        pathname: '/photo/**',
      },
      {
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;