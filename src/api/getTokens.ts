import { GraphQLClient } from 'graphql-request';

const API_ENDPOINT = 'http://localhost:8000/subgraphs/name/SAFUlauncher';

interface Tokens {
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

export async function fetchTokens(owner: string) {
  const query = `query MyQuery {
    tokens(where: {owner: "${owner}"}) {
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
}