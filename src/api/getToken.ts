import { GraphQLClient } from 'graphql-request';

interface DayData {
  dailyVolumeUSD: bigint;
}

export interface Token {
    name: string;
    totalSupply: number;
    pair: string;
    staking: string;
    presale: string;
    presaleStatus: string;
    lplockDays: number;
    isLpRetrieved: boolean;
    isLpBurnt: boolean;
    lplockStart: string;
    txLimit: number;
    walletLimit: number;
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
    totalLiquidity: number;
    tokenDayData:  DayData[];
}

interface tokenResponse {
    token: Token
}

export async function fetchToken(id: string, api_endpoint: string) {
    if (id) {
        const query = `query MyQuery {
          token(id: "${id}") {
            name
            totalSupply
            pair
            staking
            presale
            presaleStatus
            lplockDays
            isLpRetrieved
            isLpBurnt
            lplockStart
            txLimit
            walletLimit
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
            totalLiquidity
            tokenDayData {
              dailyVolumeUSD
            }
          }
        }`;
      
        const client = new GraphQLClient(api_endpoint);
      
        const data: tokenResponse = await client.request(query);
        return data?.token;
    }
}
