import {
  mainnet,
  useAccount,
  useNetwork,
  useContractWrite,
  useContractRead,
} from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { animate, spring } from "motion";
import { Token } from "@uniswap/sdk-core";
import { Pair } from "@uniswap/v2-sdk";
import { parseEther, formatEther } from "viem";

// token & router abis
import tokenAbi from "../../../../newtokenabi.json";
import routerAbi from "../../../../routerabi.json";

// internal utils
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
  tradingEnabled,
}: {
  contractAddress: `0x${string}`;
  symbol: string;
  tradingEnabled: boolean;
}) => {
  // Current chain & wallet address
  const { chain } = useNetwork();
  const { address } = useAccount();

  const [allowance, setAllowance] = useState(BigInt("0"));
  const [worstPrice, setWorstPrice] = useState("0");
  const [reserves, setReserves] = useState<bigint[]>();
  const [pair, setPair] = useState<Pair>();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const settingRef = useRef<SVGSVGElement>(null);

  // states to dictate the
  const [tokenIn, setTokenIn] = useState(new Token(31337, WETH_ADDRESS, 18));
  const [tokenOut, setTokenOut] = useState(
    new Token(31337, contractAddress, 18)
  );

  // sort tokens by hex value
  const token0 = tokenIn.sortsBefore(tokenOut) ? tokenIn : tokenOut;
  const token1 = tokenIn.sortsBefore(tokenOut) ? tokenOut : tokenIn;

  useEffect(() => {
    if (tradingEnabled) {
      getReserves(token0, token1, chain ? chain : mainnet).then((data) => {
        setReserves(data);
        if (data) {
          const newPair = createPair(token0, token1, data);
          setPair(newPair);
        }
      });
    }
  }, []);

  // get the allowance of the user
  useContractRead({
    address: contractAddress,
    abi: tokenAbi.abi,
    functionName: "allowance",
    args: [address, UNISWAP_ROUTER_ADDRESS],
    onSuccess(data) {
      if (data && typeof data === "bigint") {
        setAllowance(data);
      }
    },
  });

  // sets the tokens to recieve on swap
  const setAmounts = () => {
    const amount = getValues("pay");
    if (reserves && amount) {
      // gets the tokens to recieve on swap
      getExchangeRate(
        tokenIn === token0 ? reserves : [reserves[1], reserves[0]],
        parseEther(amount.toString()),
        chain ? chain : mainnet
      ).then((data) => {
        setWorstPrice(data);
      });
    }
  };

  useEffect(() => {
    setAmounts();
  }, [tokenIn]);

  // router function to swap ETH for tokens
  const {
    data: theSwap,
    isLoading: loadingSwap,
    isSuccess: swapDone,
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

  // swap function for ETH to tokens
  const {
    data: theTokenSwap,
    isLoading: loadingTokenSwap,
    isSuccess: tokenSwapDone,
    write: tokenSwap,
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
    writeAsync: approve,
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

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SwapForm>();
  const onSubmit: SubmitHandler<SwapForm> = (formData) => {
    if (formData.pay && pair) {
      const amountInMax = parseEther(formData.pay.toString());
      const slippage = formData.slippage.toString();
      const deadline = Math.floor(Date.now() / 1000) + 60 * formData.deadline;
      const minAmountOut = getMinAmountOut(
        tokenIn === token0 ? token0 : token1,
        tokenIn === token0 ? token1 : token0,
        amountInMax,
        pair,
        slippage
      );

      if (tokenIn.address.toUpperCase() === WETH_ADDRESS.toUpperCase()) {
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
        const args = {
          args: [
            amountInMax,
            minAmountOut,
            [contractAddress, WETH_ADDRESS],
            address,
            deadline,
          ],
        };

        if (allowance >= amountInMax) {
          tokenSwap(args);
        } else {
          approve({ args: [UNISWAP_ROUTER_ADDRESS, amountInMax] }).then(() => {
            tokenSwap(args);
          });
        }
      }
    }
  };

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    const wrapper = wrapperRef.current;
    if (
      wrapper instanceof HTMLElement &&
      settingRef.current instanceof SVGSVGElement &&
      !wrapper.contains(event.target as Node) &&
      !settingRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
      document.removeEventListener("mouseup", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    }
  };

  const handleSettings = () => {
    if (!isOpen) {
      document.addEventListener("mouseup", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
      setIsOpen(true);
    } else {
      setIsOpen(false);
      document.removeEventListener("mouseup", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4 items-center relative">
        <h2 className="text-3xl">Swap</h2>
        <svg
          ref={settingRef}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-gray-400 cursor-pointer"
          onClick={handleSettings}
        >
          <path d="M20.83 14.6C19.9 14.06 19.33 13.07 19.33 12C19.33 10.93 19.9 9.93999 20.83 9.39999C20.99 9.29999 21.05 9.1 20.95 8.94L19.28 6.06C19.22 5.95 19.11 5.89001 19 5.89001C18.94 5.89001 18.88 5.91 18.83 5.94C18.37 6.2 17.85 6.34 17.33 6.34C16.8 6.34 16.28 6.19999 15.81 5.92999C14.88 5.38999 14.31 4.41 14.31 3.34C14.31 3.15 14.16 3 13.98 3H10.02C9.83999 3 9.69 3.15 9.69 3.34C9.69 4.41 9.12 5.38999 8.19 5.92999C7.72 6.19999 7.20001 6.34 6.67001 6.34C6.15001 6.34 5.63001 6.2 5.17001 5.94C5.01001 5.84 4.81 5.9 4.72 6.06L3.04001 8.94C3.01001 8.99 3 9.05001 3 9.10001C3 9.22001 3.06001 9.32999 3.17001 9.39999C4.10001 9.93999 4.67001 10.92 4.67001 11.99C4.67001 13.07 4.09999 14.06 3.17999 14.6H3.17001C3.01001 14.7 2.94999 14.9 3.04999 15.06L4.72 17.94C4.78 18.05 4.89 18.11 5 18.11C5.06 18.11 5.12001 18.09 5.17001 18.06C6.11001 17.53 7.26 17.53 8.19 18.07C9.11 18.61 9.67999 19.59 9.67999 20.66C9.67999 20.85 9.82999 21 10.02 21H13.98C14.16 21 14.31 20.85 14.31 20.66C14.31 19.59 14.88 18.61 15.81 18.07C16.28 17.8 16.8 17.66 17.33 17.66C17.85 17.66 18.37 17.8 18.83 18.06C18.99 18.16 19.19 18.1 19.28 17.94L20.96 15.06C20.99 15.01 21 14.95 21 14.9C21 14.78 20.94 14.67 20.83 14.6ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15Z"></path>
        </svg>
        {isOpen && (
          <div
            className="absolute top-10 right-0 rounded-xl bg-black p-4 border-2 border-neutral-800 w-80 z-10 flex"
            ref={wrapperRef}
          >
            <div className="mr-8">
              <label
                htmlFor="slippage"
                className="block text-sm leading-6 text-white mb-2"
              >
                Max.slippage
              </label>
              <div className="mt-2 relative">
                <input
                  type="text"
                  id="slippage"
                  placeholder="0.5"
                  defaultValue="6"
                  {...register("slippage", {
                    required: true,
                    min: 0.005,
                    max: 6,
                  })}
                  className="block w-20 rounded-xl ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 border border-gray-600 outline-0 sm:text-md"
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:text-md text-gray-400">
                  %
                </div>
              </div>
            </div>
            <div className="">
              <label
                htmlFor="deadline"
                className="block text-sm leading-6 text-white mb-2"
              >
                Deadline
              </label>
              <input
                type="text"
                id="deadline"
                placeholder="10"
                defaultValue={10}
                {...register("deadline", {
                  required: true,
                  min: 10,
                  max: 20,
                })}
                className="block w-20 rounded-xl ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-md"
              />
            </div>
          </div>
        )}
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
              disabled={!tradingEnabled}
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
        {tradingEnabled && (
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
