import { getAddress } from "viem"

export const getContractAddress = ( chainId: number | undefined) => {
    switch(chainId) {
        case 1: undefined //mainnet
        case 42161: undefined // arbitrum
        case 10: undefined // optimism
        case 137: undefined // polygon
        case 8453: undefined // base
        case 56: undefined // bsc
        case 43113: undefined // avalancheFuji
        case 81457: undefined // blast
        case 17000: return getAddress("0xe165a1453bedcc0a33c2e2f04bca5231f6775a82") // holskey
        case 421614: return undefined // arbitrumSepolia
        case 11155420: return undefined // optimismSepolia
        case 80002: return undefined // polygonAmoy
        case 84532: return getAddress("0x6bde6c9e1a71fdae91c475a740b1d4ab36c26ae8") // baseSepolia
        case 97: return undefined // bscTestnet
        case 43114: return undefined // avalanche
        case 168587773: return undefined // blastSepolia
        case 1337: return getAddress("0x26df0ea798971a97ae121514b32999dfdb220e1f")
        default: return undefined;
    }
}

export const getGraphUrl = ( chainId: number) => {
    switch(chainId) {
        case 1: undefined //mainnet
        case 42161: undefined // arbitrum
        case 10: undefined // optimism
        case 137: undefined // polygon
        case 8453: undefined // base
        case 56: undefined // bsc
        case 43113: undefined // avalancheFuji
        case 81457: undefined // blast
        case 17000: return "https://api.studio.thegraph.com/query/82166/safulauncher/0.0.11" // holskey
        case 421614: return undefined // arbitrumSepolia
        case 11155420: return undefined // optimismSepolia
        case 80002: return undefined // polygonAmoy
        case 84532: return "https://api.studio.thegraph.com/query/82166/safubasesepolia/0.0.2" // baseSepolia
        case 97: return undefined // bscTestnet
        case 43114: return undefined // avalanche
        case 168587773: return undefined // blastSepolia
        case 1337: return "http://localhost:8000/subgraphs/name/SAFUlauncher"
        default: return undefined;
    }
}

export const getRouters = ( chainId: number) => {
    switch(chainId) {
        case 1: [] //mainnet
        case 42161: [] // arbitrum
        case 10: [] // optimism
        case 137: [] // polygon
        case 8453: [] // base
        case 56: [] // bsc
        case 43113: [] // avalancheFuji
        case 81457: [] // blast
        case 17000: return[{
            value: "0xe75850fc641b0930a3b6e6dbf1d0926ee9898645",
            label: "Uniswap V2 Router"
        },{
            value: "0xe75850fc641b0930a3b6e6dbf1d0926ee9898645",
            label: "Sushiswap Router"
        },{
            value: "0xe75850fc641b0930a3b6e6dbf1d0926ee9898645",
            label: "Pancakeswap Router"
        }] // holskey
        case 421614: return [] // arbitrumSepolia
        case 11155420: return [] // optimismSepolia
        case 80002: return [] // polygonAmoy
        case 84532: return[{
            value: "0x1689E7B1F10000AE47eBfE339a4f69dECd19F602",
            label: "Uniswap V2 Router"
        },{
            value: "0x1689E7B1F10000AE47eBfE339a4f69dECd19F602",
            label: "Sushiswap Router"
        },{
            value: "0x1689E7B1F10000AE47eBfE339a4f69dECd19F602",
            label: "Pancakeswap Router"
        }] // baseSepolia
        case 97: return [] // bscTestnet
        case 43114: return [] // avalanche
        case 168587773: return [] // blastSepolia
        case 1337: return [{
            value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            label: "Uniswap V2 Router"
        },{
            value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            label: "Sushiswap Router"
        },{
            value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            label: "Pancakeswap Router"
        }]
        default: return []
    }
}

export const getRouterAddress = ( chainId: number) => {
    switch(chainId) {
        case 1: undefined //mainnet
        case 42161: undefined // arbitrum
        case 10: undefined // optimism
        case 137: undefined // polygon
        case 8453: undefined // base
        case 56: undefined // bsc
        case 43113: undefined // avalancheFuji
        case 81457: undefined // blast
        case 17000: return getAddress("0xe75850fc641b0930a3b6e6dbf1d0926ee9898645") // holskey
        case 421614: return undefined // arbitrumSepolia
        case 11155420: return undefined // optimismSepolia
        case 80002: return undefined // polygonAmoy
        case 84532: return getAddress("0x1689E7B1F10000AE47eBfE339a4f69dECd19F602") // baseSepolia
        case 97: return undefined // bscTestnet
        case 43114: return undefined // avalanche
        case 168587773: return undefined // blastSepolia
        case 1337: return getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
        default: return undefined;
    }
}

export const getBaseCoin = ( chainId: number) => {
    switch(chainId) {
        case 1: undefined //mainnet
        case 42161: undefined // arbitrum
        case 10: undefined // optimism
        case 137: undefined // polygon
        case 8453: undefined // base
        case 56: undefined // bsc
        case 43113: undefined // avalancheFuji
        case 81457: undefined // blast
        case 17000: return getAddress("0x94373a4919b3240d86ea41593d5eba789fef3848") // holskey
        case 421614: return undefined // arbitrumSepolia
        case 11155420: return undefined // optimismSepolia
        case 80002: return undefined // polygonAmoy
        case 84532: return getAddress("0x4200000000000000000000000000000000000006") // baseSepolia
        case 97: return undefined // bscTestnet
        case 43114: return undefined // avalanche
        case 168587773: return undefined // blastSepolia
        case 1337: return getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
        default: return undefined;
    }
}

export const getUSDC = ( chainId: number) => {
    switch(chainId) {
        case 1: undefined //mainnet
        case 42161: undefined // arbitrum
        case 10: undefined // optimism
        case 137: undefined // polygon
        case 8453: undefined // base
        case 56: undefined // bsc
        case 43113: undefined // avalancheFuji
        case 81457: undefined // blast
        case 17000: return getAddress("0xc76d5911607fa20f742202a806944d9e1c198725") // holskey
        case 421614: return undefined // arbitrumSepolia
        case 11155420: return undefined // optimismSepolia
        case 80002: return undefined // polygonAmoy
        case 84532: return getAddress("0x036cbd53842c5426634e7929541ec2318f3dcf7e") // baseSepolia
        case 97: return undefined // bscTestnet
        case 43114: return undefined // avalanche
        case 168587773: return undefined // blastSepolia
        case 1337: return getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
        default: return undefined;
    }
}

export const getEtherscan = ( chainId: number) =>{
    switch(chainId) {
        case 1: undefined //mainnet
        case 42161: undefined // arbitrum
        case 10: undefined // optimism
        case 137: undefined // polygon
        case 8453: undefined // base
        case 56: undefined // bsc
        case 43113: undefined // avalancheFuji
        case 81457: undefined // blast
        case 17000: return "https://holesky.etherscan.io/token/" // holskey
        case 421614: return undefined // arbitrumSepolia
        case 11155420: return undefined // optimismSepolia
        case 80002: return undefined // polygonAmoy
        case 84532: return "https://sepolia.basescan.org/token/" // baseSepolia
        case 97: return undefined // bscTestnet
        case 43114: return undefined // avalanche
        case 168587773: return undefined // blastSepolia
        case 1337: return "https://etherscan.io/token/"
        default: return "https://etherscan.io/token/";
    }
}
