import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactCompiler: true,
  experimental: {
    authInterrupts: true,
    globalNotFound: true,
  },
}

export default nextConfig