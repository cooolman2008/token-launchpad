import { mainnet, useAccount, useNetwork } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { animate, spring } from "motion";

import { useContractWrite } from "wagmi";
import { Token } from "@uniswap/sdk-core";
import { Pair } from "@uniswap/v2-sdk";
import { parseEther, formatEther } from "viem";

import tokenAbi from "../../../../newtokenabi.json";
import routerAbi from "../../../../routerabi.json";
import {
  createPair,
  getExchangeRate,
  getMinAmountOut,
  getReserves,
} from "@/utils/swapTokens";

const WETH_ADDRESS = process.env.WETH_ADDRESS;
const UNISWAP_ROUTER_ADDRESS = process.env.UNISWAP_ROUTER_ADDRESS;

interface SwapForm {
  pay: number;
  slippage: number;
  deadline: number;
}

const Swap = ({
  contractAddress,
  symbol,
  isLiquidity,
}: {
  contractAddress: `0x${string}`;
  symbol: string;
  isLiquidity: boolean;
}) => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [worstPrice, setWorstPrice] = useState("0");
  const [tokenIn, setTokenIn] = useState(new Token(31337, WETH_ADDRESS, 18));
  const [tokenOut, setTokenOut] = useState(
    new Token(31337, contractAddress, 18)
  );
  const [minAmountOut, setMinAmountOut] = useState<bigint>();
  const token0 = tokenIn.sortsBefore(tokenOut) ? tokenIn : tokenOut;
  const token1 = tokenIn.sortsBefore(tokenOut) ? tokenOut : tokenIn;

  const [reserves, setReserves] = useState<bigint[]>();
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

  let amountInMax = parseEther("1");
  const [pair, setPair] = useState<Pair>();

  useEffect(() => {
    if (isLiquidity) {
      getReserves(token0, token1, chain ? chain : mainnet).then((data) => {
        setReserves(data);
        if (data) {
          const pairs = createPair(token0, token1, data);
          setPair(pairs);
        }
      });
    }
  }, []);

  const setAmounts = () => {
    if (reserves) {
      getExchangeRate(
        tokenIn === token0 ? reserves : [reserves[1], reserves[0]],
        parseEther(getValues("pay").toString()),
        chain ? chain : mainnet
      ).then((data) => {
        const rate = parseFloat(formatEther(BigInt(data))).toLocaleString(
          "en",
          {
            minimumFractionDigits: 4,
          }
        );
        setWorstPrice(rate);
        setMinAmountOut(BigInt(data));
      });
    }
  };

  const {
    data: succress,
    isSuccess,
    write: swap,
  } = useContractWrite({
    address: UNISWAP_ROUTER_ADDRESS,
    abi: routerAbi.abi,
    functionName: "swapExactETHForTokens",
    onSuccess(res) {
      console.log(res);
    },
    onError(error) {
      console.log(error);
    },
  });

  const {
    data: success,
    isSuccess: isDone,
    write: swapToken,
  } = useContractWrite({
    address: UNISWAP_ROUTER_ADDRESS,
    abi: routerAbi.abi,
    functionName: "swapExactTokensForETH",
    onSuccess(res) {
      console.log(res);
    },
    onError(error) {
      console.log(error);
    },
  });

  const {
    data: suc,
    isSuccess: done,
    write: approve,
  } = useContractWrite({
    address: contractAddress,
    abi: tokenAbi.abi,
    functionName: "approve",
    onSuccess(res) {
      console.log(res);
    },
    onError(error) {
      console.log(error);
    },
  });

  // handle form & fire launch token with the form details
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SwapForm>();
  const onSubmit: SubmitHandler<SwapForm> = (formData) => {
    if (formData.pay && pair) {
      amountInMax = parseEther(formData.pay.toString());
      if (tokenIn.address.toUpperCase() === WETH_ADDRESS.toUpperCase()) {
        console.log("The Eth");
        // minAmountOut = getMinAmountOut(
        //   tokenIn === token0 ? token0 : token1,
        //   tokenIn === token0 ? token1 : token0,
        //   amountInMax,
        //   pair
        // );
        // console.log(minAmountOut);
        swap({
          args: [
            minAmountOut,
            [WETH_ADDRESS, contractAddress],
            address,
            deadline,
          ],
          value: amountInMax,
        });
      } else {
        console.log("Not Eth");
        // minAmountOut = getMinAmountOut(
        //   tokenIn === token0 ? token0 : token1,
        //   tokenIn === token0 ? token1 : token0,
        //   amountInMax,
        //   pair
        // );
        // console.log(formatEther(minAmountOut?.toString()));
        approve({
          args: [UNISWAP_ROUTER_ADDRESS, amountInMax],
        });
        swapToken({
          args: [
            amountInMax,
            minAmountOut,
            [contractAddress, WETH_ADDRESS],
            address,
            deadline,
          ],
        });
      }
    }
  };

  return (
    <>
      <div className="flex mb-4">
        <h2 className="text-3xl">Swap</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900">
          <label
            htmlFor="amount"
            className="block text-sm leading-6 text-gray-400"
          >
            Your pay
          </label>
          <div className="w-full flex">
            <input
              type="text"
              id="amount"
              placeholder="0"
              defaultValue={"0.01"}
              {...register("pay", {
                required: true,
                min: 0.0001,
              })}
              disabled={!isLiquidity}
              className="block w-full rounded-xl ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-4xl"
              onBlur={setAmounts}
            />
            <span className="block sm:text-4xl leading-6 text-gray-400 pt-1.5">
              {tokenIn.address.toUpperCase() === WETH_ADDRESS.toUpperCase()
                ? "ETH"
                : symbol}
            </span>
          </div>
        </div>
        <div
          className="w-full flex justify-end pr-8"
          style={{ margin: "-16px auto" }}
          onClick={() => {
            setTokenIn(tokenOut);
            setTokenOut(tokenIn);
            animate("#arrows", { rotate: [240, 90] }, { easing: spring() });
          }}
        >
          <div className="w-10 h-10 bg-neutral-900 flex items-center justify-center rounded-xl border-4 border-black cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="fill-gray-400 rotate-90"
              id="arrows"
              width="18px"
              height="18px"
              viewBox="0 0 912.191 912.191"
            >
              <g>
                <path d="M248.709,421.475c28.995,0,52.5-23.505,52.5-52.5s-23.505-52.5-52.5-52.5h-58.165   c20.598-38.935,49.764-73.439,85.14-100.095c52.277-39.393,114.623-60.214,180.296-60.214c34.612,0,68.514,5.831,100.764,17.331   c31.17,11.115,60.16,27.273,86.16,48.024c52.043,41.536,89.225,99.817,104.695,164.109c5.789,24.063,27.293,40.231,51,40.229   c4.062,0,8.199-0.477,12.324-1.469c28.189-6.783,45.545-35.135,38.762-63.325c-10.559-43.872-28.305-85.42-52.748-123.492   c-23.996-37.372-53.783-70.384-88.535-98.119c-35.098-28.012-74.258-49.833-116.393-64.858   c-43.6-15.547-89.367-23.431-136.03-23.431c-44.688,0-88.618,7.244-130.576,21.529c-40.568,13.813-78.557,33.942-112.908,59.827   c-33.947,25.58-63.55,56.175-87.985,90.936c-6.982,9.932-13.478,20.147-19.511,30.605v-83.971c0-28.995-23.505-52.5-52.5-52.5   S0,141.097,0,170.092v198.884c0,28.995,23.505,52.5,52.5,52.5L248.709,421.475L248.709,421.475z" />
                <path d="M859.691,490.717H663.48c-28.994,0-52.5,23.506-52.5,52.5c0,28.996,23.506,52.5,52.5,52.5h58.027   c-23.443,44.539-57.707,82.494-100.008,110.547c-49.053,32.531-106.244,49.738-165.397,49.762   c-34.575-0.012-68.441-5.842-100.657-17.33c-31.172-11.115-60.16-27.273-86.161-48.025   c-52.044-41.535-89.225-99.816-104.694-164.107c-6.782-28.189-35.132-45.543-63.325-38.762   c-28.19,6.783-45.544,35.135-38.761,63.324c10.556,43.873,28.303,85.422,52.748,123.492c23.995,37.373,53.782,70.385,88.534,98.119   c35.098,28.014,74.258,49.834,116.393,64.859c43.477,15.502,89.107,23.381,135.634,23.426c0.056,0,0.109,0.004,0.166,0.004   c0.042,0,0.083,0,0.125,0c0.036,0,0.07,0,0.106,0c0.043,0,0.086-0.002,0.13-0.002c79.779-0.07,156.951-23.322,223.195-67.256   c52.834-35.039,96.381-81.557,127.656-135.996v84.33c0,28.994,23.504,52.5,52.5,52.5c28.994,0,52.5-23.506,52.5-52.5V543.217   C912.191,514.223,888.686,490.717,859.691,490.717z" />
              </g>
            </svg>
          </div>
        </div>
        <div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900">
          <label className="block text-sm leading-6 text-gray-400">
            Your returns
          </label>
          <div className="w-full flex">
            <span className="block w-full ps-3 pe-3 my-3 text-gray-400 sm:leading-6 bg-neutral-900 sm:text-4xl">
              {worstPrice}
            </span>
            <span className="block sm:text-4xl leading-6 text-gray-400 pt-1.5">
              {tokenIn.address.toUpperCase() === WETH_ADDRESS.toUpperCase()
                ? symbol
                : "ETH"}
            </span>
          </div>
        </div>
        {isLiquidity && (
          <div className="flex justify-center flex-col mt-2">
            <input
              className="safu-button-primary cursor-pointer"
              type="submit"
              value="Swap"
            />
          </div>
        )}
      </form>
    </>
  );
};

export default Swap;
