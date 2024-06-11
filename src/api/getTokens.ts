import { GraphQLClient } from 'graphql-request';

export interface Tokens {
  id: string;
  name: string;
  symbol: string;
  totalSupply: number;
  totalTax: number;
  tradeVolume: number;
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
    }
  }`;

  const client = new GraphQLClient(APIEndpoint);

  const data: TokenArray  = await client.request(query);
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

export async function fetchTokens(APIEndpoint: string) {
    const query = `query MyQuery {
        tokens(first: 100, where: {pair_not: "0x0000000000000000000000000000000000000000"}) {
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
