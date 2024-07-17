import { GraphQLClient } from 'graphql-request';

interface Token {
  id: string;
}

interface Bundles {
  ethPrice: number;
}

interface Pair {
  token0Price: number;
  token1Price: number;
  token0: Token;
  token1: Token;
}

export interface Tokens {
  id: string;
  name: string;
  symbol: string;
  totalSupply: number;
  totalTax: number;
  FDV: number;
  tradeVolumeUSD: number;
  pairBase: Pair[];
  pairQuote: Pair[];
  price: string;
}

interface TokenArray {
    tokens: Tokens[]
    bundles: Bundles[]
}

export async function fetchMyTokens(owner: string, APIEndpoint: string) {
  const query = `query MyQuery {
    tokens(first: 100, where: {owner: "${owner}"}) {
      id
      name
      symbol
      totalSupply
      totalTax
      tradeVolume
      pairBase {
        token0Price
        token1Price
        token0 {
          id
        }
        token1 {
          id
        }
      }
      pairQuote {
        token0Price
        token1Price
        token0 {
          id
        }
        token1 {
          id
        }
      }
      }
      bundles {
        ethPrice
      }
  }`;

  const client = new GraphQLClient(APIEndpoint);

  const data: TokenArray  = await client.request(query);

  if (data?.tokens.length > 0) {
    let ethPrice = 0;
    if (data?.bundles.length > 0) {
      ethPrice = Number(data?.bundles[0].ethPrice);
    }
    data?.tokens.forEach((token, index, tokens)=>{
      let price = 0;
      let FDV = 0;
      if (token.pairBase.length >0) {
        if (token.pairBase[0].token0.id === token.id) {
          price = token.pairBase[0].token1Price;
          FDV = token.pairBase[0].token1Price * token.totalSupply;
        } else {
          price = token.pairBase[0].token0Price;
          FDV = token.pairBase[0].token0Price * token.totalSupply;
        }
      } else {
        if (token.pairQuote.length >0) {
          if (token.pairQuote[0].token0.id === token.id) {
            price = token.pairQuote[0].token1Price;
            FDV = token.pairQuote[0].token1Price * token.totalSupply;
          } else {
            price = token.pairQuote[0].token0Price;
            FDV = token.pairQuote[0].token0Price * token.totalSupply;
          }
      }}
      tokens[index].price = Number(price * ethPrice).toFixed(10);
      tokens[index].FDV = FDV * ethPrice
    });
  }

  return data?.tokens;
}

export async function fetchStealthTokens(APIEndpoint: string, usdc: string, base: string) {
    const query = `query MyQuery {
      tokens(first: 100, where: {pair: "0x0000000000000000000000000000000000000000", id_not_in: ["${usdc.toLowerCase()}", "${base.toLowerCase()}"] }) {
        id
        name
        symbol
        totalSupply
        totalTax
        tradeVolume
      }
    }`;
  
    const client = new GraphQLClient(APIEndpoint);
  
    const data: TokenArray  = await client.request(query);
    return data?.tokens;
  }

  export async function fetchPresalesTokens(APIEndpoint: string) {
      const query = `query MyQuery {
        tokens(first: 100, where: {presaleStatus: "1"}) {
          id
          name
          symbol
          totalSupply
          totalTax
          tradeVolume
        }
      }`;
    
      const client = new GraphQLClient(APIEndpoint);
    
      const data: TokenArray  = await client.request(query);
      return data?.tokens;
    }

export async function fetchTokens(id: string, APIEndpoint: string) {
    let query = `query safuQuery {
        tokens(first: 1, where: {id: "${id.toLowerCase()}"}) {
        id
        name
        symbol
        totalSupply
        totalTax
        tradeVolume
        pairBase {
          token0Price
          token1Price
          token0 {
            id
          }
          token1 {
            id
          }
        }
        pairQuote {
          token0Price
          token1Price
          token0 {
            id
          }
          token1 {
            id
          }
        }
      }
      bundles {
        ethPrice
      }
    }`;

    const client = new GraphQLClient(APIEndpoint);

    let data: TokenArray  = await client.request(query);
    query = `query MyQuery {
        tokens(first: 100, where: {pair_not: "0x0000000000000000000000000000000000000000", id_not: "${id.toLowerCase()}"}) {
        id
        name
        symbol
        totalSupply
        totalTax
        tradeVolume
        pairBase {
          token0Price
          token1Price
          token0 {
            id
          }
          token1 {
            id
          }
        }
        pairQuote {
          token0Price
          token1Price
          token0 {
            id
          }
          token1 {
            id
          }
        }
        }
    }`;

    const data2: TokenArray  = await client.request(query);
    data.tokens = data.tokens.concat(data2.tokens);

    if (data?.tokens.length > 0) {
      let ethPrice = 0;
      if (data?.bundles.length > 0) {
        ethPrice = data?.bundles[0].ethPrice;
      }
      data?.tokens.forEach((token, index, tokens) => {
        let price = 0;
        let FDV = 0;
        if (token.pairBase.length >0) {
          if (token.pairBase[0].token0.id === token.id) {
            price = token.pairBase[0].token1Price;
            FDV = token.pairBase[0].token1Price * token.totalSupply;
          } else {
            price = token.pairBase[0].token0Price;
            FDV = token.pairBase[0].token0Price * token.totalSupply;
          }
        } else {
        if (token.pairQuote.length >0) {
          if (token.pairQuote[0].token0.id === token.id) {
            price = token.pairQuote[0].token1Price;
            FDV = token.pairQuote[0].token1Price * token.totalSupply;
          } else {
            price = token.pairQuote[0].token0Price;
            FDV = token.pairQuote[0].token0Price * token.totalSupply;
          }
        }}
        tokens[index].price = price !== 0 ? Number(price * ethPrice).toFixed(10) : "0";
        tokens[index].FDV = FDV * ethPrice;
      });
    }

    return data?.tokens;
}
