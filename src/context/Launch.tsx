"use client";

import { useAccount, useContractWrite, useWalletClient } from "wagmi";
import ManagerAbi from "../../managerabi.json";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  coin_name: string;
  symbol: string;
  supply: bigint;
  initinterval: number;
  countinterval: number;
  maxbtax: number;
  minbtax: number;
  maxstax: number;
  minstax: number;
  lptax: number;
}

type Inputs = {
  example: string;
  exampleRequired: string;
};

function Launch() {
  const { data: walletClient } = useWalletClient();
  const [isClient, setIsClient] = useState(false);
  const { address } = useAccount();

  const { data: result, write } = useContractWrite({
    address: "0xbC9201678945bE971c7E30aD80dEFdFdab66B3E0",
    abi: ManagerAbi.abi,
    functionName: "launchTokenFree",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (datas) => {
    write({
      args: [
        {
          owner: address,
          taxWallet: address,
          isFreeTier: true,
          isUniswap: true,
          isStrict: false,
          supply: BigInt(datas.supply),
          initTaxType: 0,
          initInterval: datas.initinterval,
          countInterval: datas.countinterval,
          maxBuyTax: datas.maxbtax,
          minBuyTax: datas.minbtax,
          maxSellTax: datas.maxstax,
          minSellTax: datas.minstax,
          lpTax: datas.lptax,
          maxWallet: 1,
          maxTx: 1,
          name: datas.coin_name,
          symbol: datas.symbol,
        },
      ],
    });
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && walletClient && (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6 mb-6 md:grid-cols-2 pl-3">
              <div>
                <label
                  htmlFor="coin_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Coin Name
                </label>
                <input
                  type="text"
                  id="coin_name"
                  defaultValue="SAFUTesttoken"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Safu Launcher"
                  {...register("coin_name", {
                    required: true,
                    maxLength: 20,
                    pattern: /^[A-Za-z]+$/i,
                  })}
                />
                {errors.coin_name && <span>This field is required</span>}
              </div>
              <div>
                <label
                  htmlFor="symbol"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Symbol
                </label>
                <input
                  type="text"
                  id="symbol"
                  defaultValue="SATT"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="SAFU"
                  {...register("symbol", {
                    required: true,
                    maxLength: 4,
                    pattern: /^[A-Za-z]+$/i,
                  })}
                />
                {errors.symbol && (
                  <span>Symbol can only be 4 letter alphabets</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="supply"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Supply
                </label>
                <input
                  type="number"
                  id="supply"
                  defaultValue="1000000000000000000000000"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="1000000000000000000000000"
                  {...register("supply", {
                    required: true,
                    min: 1000000000000000000000000,
                  })}
                />
                {errors.supply && <span>Supply should be min 25 digits</span>}
              </div>
              <div>
                <label
                  htmlFor="lptax"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  LP tax
                </label>
                <input
                  type="number"
                  id="lptax"
                  defaultValue="20"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="20"
                  {...register("lptax", {
                    required: true,
                    max: 20,
                    min: 0,
                  })}
                />
                {errors.lptax && <span>Tax should be between 0-20</span>}
              </div>
              <div>
                <label
                  htmlFor="maxbtax"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Max Buy Tax
                </label>
                <input
                  type="number"
                  id="maxbtax"
                  defaultValue="20"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="20"
                  {...register("maxbtax", {
                    required: true,
                    max: 20,
                    min: 0,
                  })}
                />
                {errors.maxbtax && <span>Tax should be between 0-20</span>}
              </div>
              <div>
                <label
                  htmlFor="minbtax"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Min Buy Tax
                </label>
                <input
                  type="number"
                  id="minbtax"
                  defaultValue="1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="1"
                  {...register("minbtax", {
                    required: true,
                    max: 20,
                    min: 0,
                  })}
                />
                {errors.minbtax && <span>Tax should be between 0-20</span>}
              </div>
              <div>
                <label
                  htmlFor="maxstax"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Max Sell Tax
                </label>
                <input
                  type="number"
                  id="maxstax"
                  defaultValue="20"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="20"
                  {...register("maxstax", {
                    required: true,
                    max: 20,
                    min: 0,
                  })}
                />
                {errors.maxstax && <span>Tax should be between 0-20</span>}
              </div>
              <div>
                <label
                  htmlFor="minstax"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Min Sell Tax
                </label>
                <input
                  type="number"
                  id="minstax"
                  defaultValue="1"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="1"
                  {...register("minstax", {
                    required: true,
                    max: 20,
                    min: 0,
                  })}
                />
                {errors.minstax && <span>Tax should be between 0-20</span>}
              </div>
              <div>
                <label
                  htmlFor="initinterval"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Initial Interval
                </label>
                <input
                  type="number"
                  id="initinterval"
                  defaultValue="60"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="60"
                  {...register("initinterval", {
                    required: true,
                    max: 60,
                    min: 0,
                  })}
                />
                {errors.initinterval && (
                  <span>Interval should be between 0-60</span>
                )}
              </div>
              <div>
                <label
                  htmlFor="countinterval"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Count Interval
                </label>
                <input
                  type="number"
                  id="countinterval"
                  defaultValue="0"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="0"
                  {...register("countinterval", {
                    required: true,
                    max: 60,
                    min: 0,
                  })}
                />
                {errors.countinterval && (
                  <span>Count should be between 0-60</span>
                )}
              </div>
            </div>
            <input
              type="submit"
              value="Launch"
              className="text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 me-2 mb-2"
            />
          </form>
        </div>
      )}
    </>
  );
}
export default Launch;
