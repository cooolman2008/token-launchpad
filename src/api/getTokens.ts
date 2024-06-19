import { GraphQLClient } from 'graphql-request';

interface Token {
  id: string;
}

interface PairBase {
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
  pairBase: PairBase[];
  price: number;
}

interface TokenArray {
    tokens: Tokens[]
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
    }
  }`;

  const client = new GraphQLClient(APIEndpoint);

  const data: TokenArray  = await client.request(query);

  if (data?.tokens.length > 0) {
    data?.tokens.forEach((token, index, tokens)=>{
      if (token.pairBase.length >0) {
        if (token.pairBase[0].token0.id === token.id) {
          tokens[index].price = token.pairBase[0].token1Price;
          tokens[index].FDV = token.pairBase[0].token1Price * token.totalSupply;
        } else {
          tokens[index].price = token.pairBase[0].token0Price;
          tokens[index].FDV = token.pairBase[0].token0Price * token.totalSupply;
        }
      }
    });
  }

  return data?.tokens;
}

export async function fetchStealthTokens(APIEndpoint: string) {
    const query = `query MyQuery {
      tokens(first: 100, where: {pair: "0x0000000000000000000000000000000000000000"}) {
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

  export async function fetchPrelaunchTokens(APIEndpoint: string) {
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

export async function fetchTokens(APIEndpoint: string) {
    const query = `query MyQuery {
        tokens(first: 100, where: {pair_not: "0x0000000000000000000000000000000000000000"}) {
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
        }
    }`;

    const client = new GraphQLClient(APIEndpoint);

    const data: TokenArray  = await client.request(query);

    if (data?.tokens.length > 0) {
      data?.tokens.forEach((token, index, tokens)=>{
        if (token.pairBase.length >0) {
          if (token.pairBase[0].token0.id === token.id) {
            tokens[index].price = token.pairBase[0].token1Price;
            tokens[index].FDV = token.pairBase[0].token1Price * token.totalSupply;
          } else {
            tokens[index].price = token.pairBase[0].token0Price;
            tokens[index].FDV = token.pairBase[0].token0Price * token.totalSupply;
          }
        }
      });
    }

    return data?.tokens;
}
