import { GraphQLClient } from 'graphql-request';

const API_ENDPOINT = process.env.API_ENDPOINT;

export interface SAFU {
  launchCount: number
  totalVolumeUSD: number
  totalLiquidityUSD: number
}

export interface Promo {
    promoCostEth: bigint
}

interface safuResponse {
    safulauncher: SAFU
}

interface promoResponse {
    safulauncher: Promo
}

export async function fetchSafu(id: string) {
    if (id) {
        const query = `query MyQuery {
          safulauncher(id: "${id}") {
            launchCount
            totalVolumeUSD
            totalLiquidityUSD
          }
        }`;
      
        const client = new GraphQLClient(API_ENDPOINT);
      
        const data: safuResponse = await client.request(query);
        return data?.safulauncher;
    }
}

export async function fetchPromoCost(id: string) {
    if (id) {
        const query = `query MyQuery {
          safulauncher(id: "${id}") {
            promoCostEth
          }
        }`;
        const client = new GraphQLClient(API_ENDPOINT);
        const data: promoResponse = await client.request(query);

        return data?.safulauncher.promoCostEth;
    }
}
