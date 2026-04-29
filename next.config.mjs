/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      // Google profile pictures
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      // Discord CDN avatars
      { protocol: "https", hostname: "cdn.discordapp.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
