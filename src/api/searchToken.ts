import { GraphQLClient } from 'graphql-request';

export interface Tokens {
  id: string;
  name: string;
  symbol: string;
}

interface TokenArray {
  tokens: Tokens[]
}

export async function searchTokens(param: string, APIEndpoint: string) {
  const query = `query MyQuery {
    tokens(where: {name_contains_nocase: "u"}) {
      id
      name
      symbol
  }`;

  const client = new GraphQLClient(APIEndpoint);

  const data: TokenArray  = await client.request(query);

  return data?.tokens;
}
