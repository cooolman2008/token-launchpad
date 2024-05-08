import { GraphQLClient } from 'graphql-request';

const API_ENDPOINT = process.env.API_ENDPOINT;

export interface Token {
    name: string;
    totalSupply: number;
    pair: string;
    lplockDays: number;
    isLpRetrieved: boolean;
    isLpBurnt: boolean;
    lplockStart: string;
    isLimited: boolean;
    symbol: string;
    owner: string;
    team1: string;
    team2: string;
    team3: string;
    team4: string;
    team5: string;
    telegram: string;
    website: string;
    twitter: string;
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
            pair
            lplockDays
            isLpRetrieved
            isLpBurnt
            lplockStart
            isLimited
            symbol
            owner
            team1
            team2
            team3
            team4
            team5
            telegram
            website
            twitter
          }
        }`;
      
        const client = new GraphQLClient(API_ENDPOINT);
      
        const data: tokenResponse = await client.request(query);
        return data?.token;
    }
}
