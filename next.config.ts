import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  cacheComponents: true,
  typescript: { ignoreBuildErrors: true },
  serverExternalPackages: ['pocketbase'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "db.kernelgallery.com",
        pathname: "/api/files/**",
      },
    ],
  },
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

export default withNextIntl(nextConfig);
