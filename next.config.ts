import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/collections/:path*',
        destination: '/products',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
