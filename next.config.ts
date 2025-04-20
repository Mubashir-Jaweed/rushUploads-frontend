import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  async redirects() {
    return [
      {
        source: "/preview/:id",
        destination: "/:id",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
