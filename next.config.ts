import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  async redirects() {
    return [
      {
        source: "/tags/:tag",
        destination: "/prompts?tag=:tag",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
