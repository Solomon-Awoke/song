import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "bcryptjs"],

  // Vercel deployment optimizations
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(nextConfig);
