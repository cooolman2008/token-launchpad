import { getAddress } from "viem"

export const getContractAddress = ( chainId: number | undefined) => {
    switch(chainId) {
        case 1: return getAddress("0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
        case 17000: return getAddress("0xe400683894f1835974a671886aca3525d0a4e59f")
        case 1337: return getAddress("0x26df0ea798971a97ae121514b32999dfdb220e1f")
        default: return undefined;
    }
}

export const getGraphUrl = ( chainId: number) => {
    switch(chainId) {
        case 1: return "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        case 17000: return "https://api.studio.thegraph.com/query/82166/safulauncher/0.0.6"
        case 1337: return "http://localhost:8000/subgraphs/name/SAFUlauncher"
        default: return undefined;
    }
}

export const getRouters = ( chainId: number) => {
    switch(chainId) {
        case 1: return [{
            value: "0x425141165d3DE9FEC831896C016617a52363b687",
            label: "Uniswap V2 Router"
        },{
            value: "0x425141165d3DE9FEC831896C016617a52363b687",
            label: "Sushiswap Router"
        },{
            value: "0x425141165d3DE9FEC831896C016617a52363b687",
            label: "Pancakeswap Router"
        }]
        case 17000: return[{
            value: "0xb88DC5aA222358E5511bd1fCA3201663d3E3b4dF",
            label: "Uniswap V2 Router"
        },{
            value: "0xb88DC5aA222358E5511bd1fCA3201663d3E3b4dF",
            label: "Sushiswap Router"
        },{
            value: "0xb88DC5aA222358E5511bd1fCA3201663d3E3b4dF",
            label: "Pancakeswap Router"
        }]
        case 1337: return [{
            value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            label: "Uniswap V2 Router"
        },{
            value: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
            label: "Sushiswap Router"
        },{
            value: "0xEfF92A263d31888d860bD50809A8D171709b7b1c",
            label: "Pancakeswap Router"
        }]
        default: return []
    }
}

export const getRouterAddress = ( chainId: number) => {
    switch(chainId) {
        case 1: return "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        case 17000: return "0xb88DC5aA222358E5511bd1fCA3201663d3E3b4dF"
        case 1337: return "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
        default: return undefined;
    }
}

export const getBaseCoin = ( chainId: number) => {
    switch(chainId) {
        case 1: return "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        case 17000: return "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        case 1337: return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
        default: return undefined;
    }
}
