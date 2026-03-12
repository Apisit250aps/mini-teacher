import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactCompiler: true,
  transpilePackages: ['@uiw/react-md-editor', '@uiw/react-markdown-preview'],
  experimental: {
    authInterrupts: true,
    globalNotFound: true,
  },
}

export default nextConfig
