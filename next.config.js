const nextConfig = {
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === "production",
  // },
}

module.exports = nextConfig
