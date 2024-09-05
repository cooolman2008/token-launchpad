import { GraphQLClient } from 'graphql-request';

export interface SAFU {
  launchCount: number
  totalVolumeUSD: number
  totalLiquidityUSD: number
}

export interface Promo {
    promoCostEth: bigint
}

interface SAFUResponse {
    safulauncher: SAFU
}

export interface LauncherDetails {
  bridge: string
  ethCost: bigint
  minLiq: bigint
  promoCostEth: bigint
  promoCostSafu: bigint
  safuCost: bigint
}

export async function fetchSafu(id: string, api_endpoint: string) {
    if (id) {
        const query = `query MyQuery {
          safulauncher(id: "${id.toLowerCase()}") {
            launchCount
            totalVolumeUSD
            totalLiquidityUSD
          }
        }`;
      
        const client = new GraphQLClient(api_endpoint);
      
        const data: SAFUResponse = await client.request(query);
        return data?.safulauncher;
    }
}
