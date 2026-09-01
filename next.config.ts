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
      // The online-renewal overview was merged into the personal-area guide —
      // both covered the same flow, and the thin standalone page was stuck at
      // "crawled – currently not indexed". Preserve inbound links.
      // Absolute destination so a hit on the onrender host collapses to a
      // single hop instead of chaining into the host redirect below.
      {
        source: "/articles/online-renewal-overview",
        destination: "https://tavcheck.co.il/articles/ministry-personal-area-guide",
        permanent: true,
      },
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
