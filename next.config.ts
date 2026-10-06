import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/water-hardness/:outcode",
        destination: "/damp-risk/:outcode",
        permanent: true,
      },
      {
        source: "/water-hardness/:outcode/:sector",
        destination: "/damp-risk/:outcode",
        permanent: true,
      },
      {
        source: "/water-hardness",
        destination: "/damp-risk",
        permanent: true,
      },
      {
        source: "/suppliers",
        destination: "/damp-risk",
        permanent: true,
      },
      {
        source: "/suppliers/:slug",
        destination: "/damp-risk",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
