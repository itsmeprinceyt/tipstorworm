import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  trailingSlash: true,

  devIndicators: false,

  // Disable this when doing testing like production otherwise keep it enabled for development purposes.
  //reactStrictMode: false
  /*images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/ragyatech/**',
      },
    ],
  },*/
};

export default nextConfig;
