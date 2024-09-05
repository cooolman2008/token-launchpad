import { GraphQLClient } from 'graphql-request';

interface PairToken {
  id: string;
}

interface DayData {
  dailyVolumeUSD: bigint;
}

export interface TeamMember {
  id: string;
  percent: string;
}

interface Bundles {
  ethPrice: number;
}

interface Pair {
  token0Price: number;
  token1Price: number;
  token0: PairToken;
  token1: PairToken;
}

export interface Token {
    name: string;
    totalSupply: number;
    isFree: boolean;
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
    pairBase: Pair[];
    pairQuote: Pair[];
    FDV: number;
    price: string;
    marketCap: number;
}

interface tokenResponse {
    token: Token
    bundles: Bundles[]
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
            isFree
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
            pairQuote {
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
          bundles {
            ethPrice
          }
        }`;
      
        const client = new GraphQLClient(api_endpoint,signal ? {signal: signal} : {});
      
        const data: tokenResponse = await client.request(query);

        if (data?.token) {
          let ethPrice = 0;
          const token = data?.token;
          if (data?.bundles.length > 0) {
            ethPrice = Number(data?.bundles[0].ethPrice);
          }
            let price = 0;
            if (token.pairBase.length >0) {
              if (token.pairBase[0].token0.id === id) {
                price = token.pairBase[0].token1Price;
              } else {
                price = token.pairBase[0].token0Price;
              }
            } else {
              if (token.pairQuote.length >0) {
                if (token.pairQuote[0].token0.id === id) {
                  price = token.pairQuote[0].token1Price;
                } else {
                  price = token.pairQuote[0].token0Price;
                }
            }}
            token.price = price !== 0 ? Number(price * ethPrice).toFixed(10) : "0";
            token.marketCap = price * token.totalSupply * 0.6 * ethPrice
            token.FDV = price * token.totalSupply * ethPrice
        }
        return data?.token;
    }
}
