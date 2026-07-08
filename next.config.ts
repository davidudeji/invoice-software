import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Tell Next.js not to bundle these server-only packages
  // This is critical for Vercel deployment with Neon/Prisma
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-neon",
    "@neondatabase/serverless",
    "nodemailer",
    "tesseract.js",
    "bcryptjs",
  ],
};

export default nextConfig;
