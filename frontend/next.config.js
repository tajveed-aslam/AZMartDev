const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const apiOrigin = new URL(apiUrl);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Product/banner photos are self-hosted static assets in public/ — the
    // only remote images left are admin-uploaded ones served from the
    // backend's own origin (see getImageUrl in lib/formatters.ts).
    remotePatterns: [
      {
        protocol: apiOrigin.protocol.replace(":", ""),
        hostname: apiOrigin.hostname,
        port: apiOrigin.port,
      },
    ],
  },
};

module.exports = nextConfig;
