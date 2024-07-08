import { GraphQLClient } from 'graphql-request';

interface DayData {
  dailyVolumeUSD: bigint;
}

export interface TeamMember {
  id: string;
  percent: string;
}

export interface Token {
    name: string;
    totalSupply: number;
    pair: string;
    staking: string;
    presale: string;
    presaleStatus: string;
    cliffPeriod:number; 
    vestingPeriod: number;
    lplockDays: number;
    isLpRetrieved: boolean;
    isLpBurnt: boolean;
    lplockStart: string;
    txLimit: number;
    walletLimit: number;
    symbol: string;
    owner: string;
    telegram: string;
    website: string;
    twitter: string;
    totalLiquidity: number;
    tokenDayData:  DayData[];
    teamMembers: TeamMember[];
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
            cliffPeriod
            vestingPeriod
            lplockDays
            isLpRetrieved
            isLpBurnt
            lplockStart
            txLimit
            walletLimit
            symbol
            owner
            telegram
            website
            twitter
            totalLiquidity
            tokenDayData {
              dailyVolumeUSD
            }
            teamMembers {
              id
              percent
            }
          }
        }`;
      
        const client = new GraphQLClient(api_endpoint);
      
        const data: tokenResponse = await client.request(query);
        return data?.token;
    }
}
