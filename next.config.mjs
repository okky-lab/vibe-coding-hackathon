import { createMDX } from "fumadocs-mdx/next";

/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.cdn.okky.kr",
        pathname: "/okky-web/public/**",
      },
      {
        protocol: "https",
        hostname: "file.okky.kr",
        pathname: "/images/**",
      },
    ],
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
