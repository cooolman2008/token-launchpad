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

export interface LPDetails {
	buycount: bigint;
	isBurnt: boolean;
	lockDays: bigint;
	maxTx: bigint;
	maxWallet: bigint;
	pair: string;
	router: string;
	stakingContract: string;
	stakingShare: bigint;
	taxBuy: bigint;
	taxSell: bigint;
	tradingOpened: bigint;
	walletLimited: boolean;
}

export async function fetchToken(id: string, api_endpoint: string, signal?: AbortSignal) {
    if (id) {
        const query = `query MyQuery {
          token(id: "${id.toLowerCase()}") {
            name
            totalSupply
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
      
        const client = new GraphQLClient(api_endpoint,signal ? {signal: signal} : {});
      
        const data: tokenResponse = await client.request(query);
        return data?.token;
    }
}
