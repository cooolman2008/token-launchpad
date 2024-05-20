import { GraphQLClient } from 'graphql-request';
import { cache } from 'react'

const API_ENDPOINT = process.env.API_ENDPOINT;

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

export const fetchTokens =  cache( async() => {
  const query = `query MyQuery {
    tokens(first: 10, where: {pair_not: "0x0000000000000000000000000000000000000000"}) {
      id
      name
      symbol
      totalSupply
      totalTax
      tradeVolume
    }
  }`;

  const client = new GraphQLClient(API_ENDPOINT);

  const data: TokenArray  = await client.request(query);
  return data?.tokens;
})
