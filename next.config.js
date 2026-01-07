/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.exchangerate-api.com'],
  },
  // 域名配置 - 支持公开访问
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
  // 支持自定义域名
  async rewrites() {
    return []
  },
}

module.exports = nextConfig

