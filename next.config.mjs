import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      'cloudflare:workers': './lib/cloudflare-shim.ts',
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'cloudflare:workers': path.resolve(__dirname, 'lib/cloudflare-shim.ts'),
    };
    return config;
  },
};

export default nextConfig;
