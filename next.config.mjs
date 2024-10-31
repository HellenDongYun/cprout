/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "1h3.googleusercontent.com" },
      { protocol: "https", hostname: "avatar.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
