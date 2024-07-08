export const getContractAddress = ( chainId: number | undefined) => {
    switch(chainId) {
        case 1: return "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        case 17000: return "0xe400683894f1835974a671886aca3525d0a4e59f"
        default: return "0x26df0ea798971a97ae121514b32999dfdb220e1f"
    }
}

export const getGraphUrl = ( chainId: number) => {
    switch(chainId) {
        case 1: return "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        case 17000: return "https://api.studio.thegraph.com/query/82166/safulauncher/0.0.4"
        default: return "http://localhost:8000/subgraphs/name/SAFUlauncher"
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
            value: "0x425141165d3DE9FEC831896C016617a52363b687",
            label: "Uniswap V2 Router"
        },{
            value: "0x425141165d3DE9FEC831896C016617a52363b687",
            label: "Sushiswap Router"
        },{
            value: "0x425141165d3DE9FEC831896C016617a52363b687",
            label: "Pancakeswap Router"
        }]
        default: return [{
            value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            label: "Uniswap V2 Router"
        },{
            value: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
            label: "Sushiswap Router"
        },{
            value: "0xEfF92A263d31888d860bD50809A8D171709b7b1c",
            label: "Pancakeswap Router"
        }]
    }
}

export const getRouterAddress = ( chainId: number) => {
    switch(chainId) {
        case 1: return "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        case 17000: return "0x425141165d3DE9FEC831896C016617a52363b687"
        default: return "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    }
}

export const getBaseCoin = ( chainId: number) => {
    switch(chainId) {
        case 1: return "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        case 17000: return "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        default: return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    }
}
