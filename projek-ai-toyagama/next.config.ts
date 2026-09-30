// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {}, // silence turbopack error
  // webpack(config: any) {
  //   config.module.rules.push({
  //     test: /\.svg$/i,
  //     issuer: /\.[jt]sx?$/,
  //     use: ['@svgr/webpack'],
  //   });
  //   return config;
  // },
};

export default nextConfig;