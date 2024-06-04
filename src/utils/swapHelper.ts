import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import { Pair, Trade, Route } from "@uniswap/v2-sdk";
import routerAbi from "../../routerabi.json";
import uniswapv2abi from "../../uniswapv2abi.json";
import {
    Chain,
    getAddress,
    createPublicClient,
    http,
    parseUnits,
    formatEther
} from "viem";

const UNISWAP_ROUTER_ADDRESS = process.env.UNISWAP_ROUTER_ADDRESS;

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

export const getReserves = (
    tokenA: Token, tokenB: Token, chain: Chain
): Promise<bigint[]> => {
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });
    const pairAddress = getAddress(Pair.getAddress(tokenA, tokenB));

    return new Promise((resolve, reject) => {
        publicClient
        .readContract({
          address: pairAddress,
          abi: uniswapv2abi.abi,
          functionName: "getReserves",
        })
        .then((data) => {
            if (Array.isArray(data) && data[0] && data[1]) {
                const [reserve0, reserve1] = [data[0], data[1]];
                return resolve([reserve0, reserve1]);
              }
        }).catch(()=> {
            return reject(undefined);
        });
    });
}

export const getExchangeRate = (reserves:bigint[], amount: bigint, chain: Chain): Promise<string> => {
    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    return new Promise((resolve, reject) => {
        publicClient
        .readContract({
        address: UNISWAP_ROUTER_ADDRESS,
        abi: routerAbi.abi,
        functionName: "getAmountOut",
        args: [
            amount,
            reserves[0],
            reserves[1],
        ],
        })
        .then((value) => {
        if(typeof value === 'bigint'){

            const rate = parseFloat(formatEther(BigInt(value))).toLocaleString(
            "en",
            {
              minimumFractionDigits: 4,
            }
          );
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
    console.log(
      "worst execution price",
      trade.worstExecutionPrice(slippageTolerance).toSignificant(18)
    );
    const amountOut = trade.minimumAmountOut(slippageTolerance).toFixed(18); // needs to be converted to e.g. hex
    const minAmountOut = parseUnits(amountOut, 18);

    return minAmountOut;
}
