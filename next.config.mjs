/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/api/**", // match any path under /api/
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
        pathname: "/v1/**", // match any path under /api/
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false }; // Ignore `fs` in browser
    return config;
  },
};

export default nextConfig;
