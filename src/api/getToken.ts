import { GraphQLClient } from 'graphql-request';

const API_ENDPOINT = process.env.API_ENDPOINT;

interface Token {
    name: string;
    totalSupply: number;
    symbol: string;
}

interface tokenResponse {
    token: Token
}

export async function fetchToken(id: string) {
    if (id) {
        const query = `query MyQuery {
          token(id: "${id}") {
            name
            totalSupply
            symbol
          }
        }`;
      
        const client = new GraphQLClient(API_ENDPOINT);
      
        const data: tokenResponse = await client.request(query);
        return data?.token;
    }
}
