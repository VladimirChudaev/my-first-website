import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hdrxoowpnhrschlonivc.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
