import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Compiler for better performance
  reactCompiler: true,
  
  // Optimize for production deployment
  experimental: {
    // Enable optimizations for faster builds
    optimizeCss: true,
  },
  
  // Image optimization for better performance
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  
  // Enable static optimization where possible  
  trailingSlash: false,
  
  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options', 
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },
  
  // Handle redirects
  async redirects() {
    return [];
  },
};

export default nextConfig;
