import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/afrique/recrutement", destination: "/finab-afrique/index.html" },
      { source: "/programme-futurs-conseillers", destination: "/programme-futurs-conseillers.html" },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [50, 75, 85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "finablasolution.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
