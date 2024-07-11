import { Chain, getAddress } from "viem"

export const getContractAddress = ( chainId: number | undefined) => {
    switch(chainId) {
        case 17000: return getAddress("0x61cc0c851c75e26712892b9fbe619d75d3e62d7e")
        case 1337: return getAddress("0x26df0ea798971a97ae121514b32999dfdb220e1f")
        default: return undefined;
    }
}

export const getChains = ( chains: Chain[]) => {
    // return chains.
}

export const getGraphUrl = ( chainId: number) => {
    switch(chainId) {
        case 17000: return "https://api.studio.thegraph.com/query/82166/safulauncher/0.0.10"
        case 1337: return "http://localhost:8000/subgraphs/name/SAFUlauncher"
        default: return undefined;
    }
}

export const getRouters = ( chainId: number) => {
    switch(chainId) {
        case 17000: return[{
            value: "0xe75850fc641b0930a3b6e6dbf1d0926ee9898645",
            label: "Uniswap V2 Router"
        },{
            value: "0xe75850fc641b0930a3b6e6dbf1d0926ee9898645",
            label: "Sushiswap Router"
        },{
            value: "0xe75850fc641b0930a3b6e6dbf1d0926ee9898645",
            label: "Pancakeswap Router"
        }]
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
        case 17000: return getAddress("0xe75850fc641b0930a3b6e6dbf1d0926ee9898645")
        case 1337: return getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D")
        default: return undefined;
    }
}

export const getBaseCoin = ( chainId: number) => {
    switch(chainId) {
        case 17000: return getAddress("0x94373a4919b3240d86ea41593d5eba789fef3848")
        case 1337: return getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
        default: return undefined;
    }
}

export const getUSDC = ( chainId: number) => {
    switch(chainId) {
        case 17000: return getAddress("0xc76d5911607fa20f742202a806944d9e1c198725")
        case 1337: return getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
        default: return undefined;
    }
}
