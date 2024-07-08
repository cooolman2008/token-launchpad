import { GraphQLClient } from 'graphql-request';

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

export async function fetchSafu(id: string, api_endpoint: string) {
    if (id) {
        const query = `query MyQuery {
          safulauncher(id: "${id}") {
            launchCount
            totalVolumeUSD
            totalLiquidityUSD
          }
        }`;
      
        const client = new GraphQLClient(api_endpoint);
      
        const data: safuResponse = await client.request(query);
        return data?.safulauncher;
    }
}

export async function fetchPromoCost(id: string, api_endpoint: string) {
  console.log(id);
    if (id) {
        const query = `query MyQuery {
          safulauncher(id: "${id}") {
            promoCostEth
          }
        }`;
        const client = new GraphQLClient(api_endpoint);
        const data: promoResponse = await client.request(query);

        return data?.safulauncher.promoCostEth;
    }
}
