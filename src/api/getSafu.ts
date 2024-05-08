import { GraphQLClient } from 'graphql-request';

const API_ENDPOINT = process.env.API_ENDPOINT;

export interface SAFU {
  launchCount: number
  totalVolumeUSD: number
  totalLiquidityUSD: number
}

interface safuResponse {
    safulauncher: SAFU
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
