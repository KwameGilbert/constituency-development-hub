import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "app.comdevhub-api.com",
      },
      {
        protocol: "https",
        hostname: "app.comdevhub-api.com",
      },
    ],
  },
};

export default nextConfig;
