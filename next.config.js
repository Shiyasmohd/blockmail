/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // images: {
  //   loader: 'akamai',
  //   path: '',
  // },
  trailingSlash: true,
  reactStrictMode: true,
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
}

module.exports = nextConfig
