import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Next stops auto-picking the parent directory
  // when it finds a stray lockfile higher up the filesystem.
  outputFileTracingRoot: path.join(__dirname),

  // Run ESLint separately via `npm run lint` (avoids deprecated next lint)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 308-redirect the Render-assigned hostname to the canonical custom domain
  // so the onrender.com host doesn't compete in search results or serve a
  // sitemap whose URLs live on a different host.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "badgecheck.onrender.com" }],
        destination: "https://tavcheck.co.il/:path*",
        permanent: true,
      },
    ];
  },

  // Stub optional peer deps from @standard-community/standard-json
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      effect: false,
      sury: false,
      "@valibot/to-json-schema": false,
    };
    return config;
  },
};

export default nextConfig;
