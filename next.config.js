const nextConfig = {
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  env: {
    CONTRACT_ADDRESS: "0x870526b7973b56163a6997bb7c886f5e4ea53638",
    WETH_ADDRESS: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    UNISWAP_ROUTER_ADDRESS: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    API_ENDPOINT: 'http://localhost:8000/subgraphs/name/SAFUlauncher'
  }
}

module.exports = nextConfig
