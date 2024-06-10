export const getContractAddress = ( chainId: number | undefined) => {
    switch(chainId) {
        case 1: return "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        default: return "0x716473Fb4E7cD49c7d1eC7ec6d7490A03d9dA332"
    }
}

export const getGraphUrl = ( chainId: number) => {
    switch(chainId) {
        case 1: return "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        default: return "http://localhost:8000/subgraphs/name/SAFUlauncher"
    }
}

export const getRouterAddr = ( chainId: number) => {
    switch(chainId) {
        case 1: return "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        default: return "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
    }
}

export const getBaseCoin = ( chainId: number) => {
    switch(chainId) {
        case 1: return "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
        default: return "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    }
}
