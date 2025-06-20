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
       {
        source: '/admin/products',
        destination: '/admin',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
