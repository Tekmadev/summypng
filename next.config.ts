import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Optimised images served from Supabase Storage public buckets. The host is
    // wildcarded because the Supabase project ref is provisioned later; tighten
    // to `<project-ref>.supabase.co` once the project exists.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // DEV ONLY: grayscale placeholder photos for the galleries before real
      // images land. Remove once Supabase image data is wired in.
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
    ],
    // Photography portfolio - allow higher-fidelity variants than the [75] default.
    qualities: [75, 90, 100],
    // Serve modern formats first.
    formats: ["image/avif", "image/webp"],
  },

  // Next.js 16 caching is opt-in. Once the data-fetching patterns settle
  // (Phase 3), consider enabling Cache Components for PPR on the static
  // marketing/gallery pages while keeping the contact action dynamic:
  //   cacheComponents: true,
};

export default nextConfig;
