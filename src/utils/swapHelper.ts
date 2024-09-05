import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import { Pair, Trade, Route } from "@uniswap/v2-sdk";
import { parseUnits, PublicClient } from "viem";
import { getNumber } from "./math";
import { uniswapV2Abi } from "@/abi/uniswapV2Abi";
import { routerAbi } from "@/abi/routerAbi";

export const createPair = (
    tokenA: Token, tokenB: Token,
    reserves: bigint[]
): Pair => {
    const pair = new Pair(
      CurrencyAmount.fromRawAmount(tokenA, reserves[0].toString()),
      CurrencyAmount.fromRawAmount(tokenB, reserves[1].toString())
    );

    return pair
}

export const getReserves = (client: PublicClient, pairAddress: `0x${string}`
): Promise<bigint[]> => {

    return new Promise((resolve, reject) => {
        client
        .readContract({
          address: pairAddress,
          abi: uniswapV2Abi,
          functionName: "getReserves",
        })
        .then((data) => {
            if (Array.isArray(data) && data[0] && data[1]) {
                const [reserve0, reserve1] = [data[0], data[1]];
                return resolve([reserve0, reserve1]);
              }
        }).catch((error)=> {
            return reject(error);
        });
    });
}

export const getExchangeRate = (reserves:bigint[], amount: bigint, client: PublicClient, router: `0x${string}`): Promise<string> => {

    return new Promise((resolve, reject) => {
        client
        .readContract({
        address: router,
        abi: routerAbi,
        functionName: "getAmountOut",
        args: [
            amount,
            reserves[0],
            reserves[1],
        ],
        })
        .then((value) => {
        if(typeof value === 'bigint'){
            const rate = getNumber(value, 4).toString();
            return resolve(rate);
        }
        }).catch(()=> {
            return reject(undefined);
        });
    });
}

export const getMinAmountOut = (
    tokenA: Token, tokenB: Token, amountInMax: bigint, pair: Pair, slippage = '6'): bigint => {
    const route = new Route([pair], tokenA, tokenB);
    const tokenAmount = CurrencyAmount.fromRawAmount(
      tokenA,
      amountInMax.toString()
    );
    const trade = new Trade(route, tokenAmount, TradeType.EXACT_INPUT);
    const slippageTolerance = new Percent(slippage, "10000"); // 50 bips, or 0.50% - Slippage tolerance
    const amountOut = trade.minimumAmountOut(slippageTolerance).toFixed(18); // needs to be converted to e.g. hex
    const minAmountOut = parseUnits(amountOut, 18);

    return minAmountOut;
}
