import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/crisp-website-485112_cloudbuild/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

export default bundleAnalyzer(nextConfig);
