const nextConfig = {
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  env: {
    CONTRACT_ADDRESS: "0x798f111c92E38F102931F34D1e0ea7e671BDBE31",
    API_ENDPOINT: 'http://localhost:8000/subgraphs/name/SAFUlauncher'
  }
}

module.exports = nextConfig
