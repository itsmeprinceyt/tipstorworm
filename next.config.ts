import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: true,
  devIndicators: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },/*
      {
        protocol: "https",
        hostname: "ik.imagekit.io", // your previous pattern
        pathname: "/ragyatech/**",
      },*/
    ],
  },
};

export default nextConfig;