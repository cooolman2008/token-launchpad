"use client";

import {
  useAccount,
  useContractWrite,
  useWalletClient,
  useWaitForTransaction,
} from "wagmi";
import ManagerAbi from "../../managerabi.json";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  tax_wallet: string;
  team1p: number;
  team2p: number;
  team3p: number;
  team4p: number;
  team5p: number;
  team1: string;
  team2: string;
  team3: string;
  team4: string;
  team5: string;
  cliffPeriod: number;
  vestingPeriod: number;
}

function Launch() {
  const { data: walletClient } = useWalletClient();
  const [isClient, setIsClient] = useState(false);
  const { address } = useAccount();
  const router = useRouter();

  // contract call for token launch.
  const {
    data: response,
    write,
    error,
  } = useContractWrite({
    address: "0x7A5EC257391817ef241ef8451642cC6b222d4f8C",
    abi: ManagerAbi.abi,
    functionName: "launchTokenFree",
    onSuccess(res) {
      console.log(res);
    },
    onError(error) {
      console.log(error);
    },
  });

  // get the transaction details by waiting for the transaction.
  const {
    data: transaction,
    isError,
    isLoading,
  } = useWaitForTransaction({
    hash: response?.hash,
    onSuccess(res) {
      console.log(res);
    },
    onError(error) {
      console.log(error);
    },
  });

  // redirect to the token page once the address is aquired from the waitForTransaction hook.
  useEffect(() => {
    if (transaction?.logs[0]?.address) {
      console.log(transaction?.logs[0]?.address);
      router.push("/" + transaction?.logs[0]?.address);
    }
  }, [transaction]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // handle form & fire launch token with the form details
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
          minLiq: 0,
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
          preventSwap: 10,
          maxSwap: BigInt(10000),
          taxSwapThreshold: BigInt(1000),
          cliffPeriod: 30,
          vestingPeriod: 30,
          team1p: 0,
          team2p: 0,
          team3p: 0,
          team4p: 0,
          team5p: 0,
          team1: address,
          team2: address,
          team3: address,
          team4: address,
          team5: address,
          name: datas.coin_name,
          symbol: datas.symbol,
        },
      ],
    });
  };

  // TODO: Loading animation while waiting for the launch & redirect.
  // Error messages in case of redirection failure & display instructions to manually check the token from launches.
  // Create reusable components once the design comes in.
  // Handle redirection & async functions.

  return (
    <>
      {isClient && walletClient && (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-12">
              <div className="border-b border-gray-600 pb-12">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="template"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Choose from one of the templates
                  </label>
                  <div className="mt-2">
                    <select
                      id="template"
                      name="template"
                      defaultValue="USDCoin"
                      className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:max-w-xs sm:text-sm sm:leading-6 bg-neutral-800 outline-0 ps-2 pe-2 appearance-none"
                    >
                      <option>USDCoin</option>
                      <option>Ethetium</option>
                      <option>SAFU</option>
                    </select>
                  </div>
                </div>

                {/* <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Token Logo
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10">
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-300"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-semibold text-blue-500 outline-none border-0"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only outline-0"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-600">
                          PNG, JPG, GIF up to 40KB
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="border-b border-gray-600 pb-12">
                <h2 className="text-base font-semibold leading-7 text-white">
                  Tell us about your Token
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                  Information that you enter for token creation cannot be
                  changed after we deploy the token.
                  <br />
                  So, be careful when you fill this form.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="coin_name"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Coin name
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="coin_name"
                        defaultValue="USDCoin"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.coin_name
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="Safu Launcher"
                        {...register("coin_name", {
                          required: true,
                          maxLength: 20,
                          pattern: /^[A-Za-z]+$/i,
                        })}
                      />
                      {errors.coin_name && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-5 w-5 text-pink-600"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.coin_name && (
                      <p className="mt-2 text-pink-600 text-sm">
                        We need a alphabets only name to deploy the token.
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="symbol"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Symbol
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="symbol"
                        defaultValue="USDC"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.symbol
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="SAFU"
                        {...register("symbol", {
                          required: true,
                          maxLength: 4,
                          pattern: /^[A-Za-z]+$/i,
                        })}
                      />
                      {errors.symbol && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-5 w-5 text-pink-600"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.symbol && (
                      <p className="mt-2 text-pink-600 text-sm">
                        We need a 4 letter alphabets only symbol.
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="supply"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Supply
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="supply"
                        defaultValue="1000000"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.coin_name
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="1000000"
                        {...register("supply", {
                          required: true,
                          min: 1000000,
                        })}
                      />
                      {errors.supply && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-5 w-5 text-pink-600"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.supply && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Supply should be minimum 1Million.
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="tax_wallet"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Tax wallet
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="tax_wallet"
                        defaultValue={address}
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.tax_wallet
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
                        {...register("tax_wallet", {
                          required: true,
                          minLength: 42,
                          pattern: /^[A-Za-z0-9]+$/i,
                        })}
                      />
                      {errors.tax_wallet && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-5 w-5 text-pink-600"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.tax_wallet && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Tax wallet should be a valid wallet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-600 pb-12">
                <h2 className="text-base font-semibold leading-7 text-white">
                  Set your taxations
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                  Information that you enter for token creation cannot be
                  changed after we deploy the token.
                  <br />
                  So, be careful when you fill this form.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="maxbtax"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Max buy tax
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="maxbtax"
                        defaultValue="40"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.maxbtax
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="40"
                        {...register("maxbtax", {
                          required: true,
                          max: 20,
                          min: 0,
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span>%</span>
                      </div>
                    </div>
                    {errors.maxbtax && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Tax should be between 0 to 20.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="maxstax"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Max sell tax
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="maxstax"
                        defaultValue="40"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.maxstax
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="40"
                        {...register("maxstax", {
                          required: true,
                          max: 20,
                          min: 0,
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span>%</span>
                      </div>
                    </div>
                    {errors.maxstax && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Tax should be between 0 to 20.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="minbtax"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Final buy tax
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="minbtax"
                        defaultValue="0"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.minbtax
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="0"
                        {...register("minbtax", {
                          required: true,
                          max: 20,
                          min: 0,
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span>%</span>
                      </div>
                    </div>
                    {errors.minbtax && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Tax should be between 0 to 20.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="minstax"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Final sell tax
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="minstax"
                        defaultValue="0"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.minstax
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="0"
                        {...register("minstax", {
                          required: true,
                          max: 20,
                          min: 0,
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span>%</span>
                      </div>
                    </div>
                    {errors.minstax && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Tax should be between 0 to 20.
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2 sm:col-start-1">
                    <label
                      htmlFor="initTaxType"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Choose Tax Drop Style
                    </label>
                    <div className="mt-2">
                      <select
                        id="initTaxType"
                        name="initTaxType"
                        defaultValue="Hybrid"
                        className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:max-w-xs sm:text-sm sm:leading-6 bg-neutral-800 outline-0 ps-2 pe-2 appearance-none"
                      >
                        <option>Timestamp</option>
                        <option>Count</option>
                        <option>Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="initinterval"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Interval in Seconds
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="initinterval"
                        defaultValue="60"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.initinterval
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="60"
                        {...register("initinterval", {
                          required: true,
                          max: 60,
                          min: 0,
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        {errors.initinterval && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                              className="h-5 w-5 text-pink-600"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    {errors.initinterval && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Interval should be between 0-60.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="countinterval"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Count Interval
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="countinterval"
                        defaultValue="0"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.countinterval
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="0"
                        {...register("countinterval", {
                          required: true,
                          max: 60,
                          min: 0,
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        {errors.countinterval && (
                          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                              className="h-5 w-5 text-pink-600"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    {errors.countinterval && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Tax should be between 0 to 20.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="lptax"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Liquidity Pool tax
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="lptax"
                        defaultValue="0"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.lptax
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="20"
                        {...register("lptax", {
                          required: true,
                          max: 20,
                          min: 0,
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span>%</span>
                      </div>
                    </div>
                    {errors.lptax && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Tax should be between 0 to 20.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-600 pb-12">
                <h2 className="text-base font-semibold leading-7 text-white">
                  Do you have a team?
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                  Information that you enter for token creation cannot be
                  changed after we deploy the token.
                  <br />
                  So, be careful when you fill this form.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="cliffPeriod"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Cliff period
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="cliffPeriod"
                        defaultValue="30"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.cliffPeriod
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="30"
                        {...register("cliffPeriod", {
                          required: true,
                          min: 30,
                        })}
                      />
                      {errors.cliffPeriod && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-5 w-5 text-pink-600"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.cliffPeriod && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Minimum of 30 days Cliff period is suggested.
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="vestingPeriod"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Vesting period
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="vestingPeriod"
                        defaultValue="30"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.vestingPeriod
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="30"
                        {...register("vestingPeriod", {
                          required: true,
                          min: 30,
                        })}
                      />
                      {errors.vestingPeriod && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-5 w-5 text-pink-600"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.vestingPeriod && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Minimum of 30 days Vesting period is suggested.
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="team1"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Team wallet
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="team1"
                        defaultValue={address}
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.team1
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
                        {...register("team1", {
                          required: true,
                          minLength: 42,
                          pattern: /^[A-Za-z0-9]+$/i,
                        })}
                      />
                      {errors.team1 && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-5 w-5 text-pink-600"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.team1 && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Please provide a valid wallet address.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="team1p"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Percentage share
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="team1p"
                        defaultValue="1"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.team1p
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="1"
                        {...register("team1p", {
                          required: true,
                          max: 1,
                          min: 0,
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span>%</span>
                      </div>
                    </div>
                    {errors.team1p && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Share cannot be more than 1%.
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="team2"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Team wallet 2
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="team2"
                        defaultValue={address}
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.team2
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
                        {...register("team2", {
                          required: true,
                          minLength: 42,
                          pattern: /^[A-Za-z0-9]+$/i,
                        })}
                      />
                      {errors.team2 && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-5 w-5 text-pink-600"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.team2 && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Please provide a valid wallet address.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="team2p"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Percentage share
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="team2p"
                        defaultValue="1"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.team2p
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="1"
                        {...register("team2p", {
                          required: true,
                          max: 1,
                          min: 0,
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span>%</span>
                      </div>
                    </div>
                    {errors.team2p && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Share cannot be more than 1%.
                      </p>
                    )}
                  </div>
                  <Link
                    href="#"
                    className="px-6 py-2 select-none rounded-md text-white bg-blue-500 hover:bg-blue-600 me-2 mb-2"
                  >
                    Add Team member
                  </Link>
                </div>
              </div>

              <div className="border-b border-gray-600 pb-12">
                <h2 className="text-base font-semibold leading-7 text-white">
                  Advanced settings
                </h2>
                <p className="mt-1 text-sm leading-6 text-white">
                  This section is for advanced users.
                </p>
                <div className="relative flex gap-x-3 mt-4">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="comments"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 bg-gray-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="comments"
                      className="font-medium text-white"
                    >
                      Set advanced options
                    </label>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="maxbtax"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Max Transaction Limit
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="maxbtax"
                        defaultValue="1"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.maxbtax
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="1"
                        {...register("maxbtax", {
                          required: true,
                          max: 100,
                          min: 0,
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span>%</span>
                      </div>
                    </div>
                    {errors.maxbtax && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Tax should be between 0 to 20.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="maxstax"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Max Wallet Limit
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="maxstax"
                        defaultValue="1"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.maxstax
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="1"
                        {...register("maxstax", {
                          required: true,
                          max: 100,
                          min: 0,
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span>%</span>
                      </div>
                    </div>
                    {errors.maxstax && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Tax should be between 0 to 20.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="minbtax"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Tax Swap Threshold
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="minbtax"
                        defaultValue="0.1"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.minbtax
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="0.1"
                        {...register("minbtax", {
                          required: true,
                          max: 1,
                          min: 0.01,
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span>%</span>
                      </div>
                    </div>
                    {errors.minbtax && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Tax should be between 0 to 20.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="minstax"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Max Tax Swap
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="minstax"
                        defaultValue="1"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.minstax
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="1"
                        {...register("minstax", {
                          required: true,
                          max: 2,
                          min: 1,
                        })}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span>%</span>
                      </div>
                    </div>
                    {errors.minstax && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Tax should be between 0 to 20.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="lptax"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Prevent Swap Before
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="lptax"
                        defaultValue="20"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.lptax
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="20"
                        {...register("lptax", {
                          required: true,
                          max: 20,
                          min: 0,
                        })}
                      />
                      {errors.lptax && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-5 w-5 text-pink-600"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.lptax && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Tax should be between 0 to 20.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-600 pb-12">
                <h2 className="text-base font-semibold leading-7 text-white">
                  Payment methods
                </h2>
                <p className="mt-1 text-sm leading-6 text-white">
                  You can either go for a free tier, or pay us with wither ETH
                  or SAFU tokens.
                </p>
                <div className="sm:col-span-3 mt-4">
                  <label
                    htmlFor="template"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    Choose the tier
                  </label>
                  <div className="mt-2">
                    <select
                      id="tier"
                      name="tier"
                      defaultValue="Premium"
                      className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:max-w-xs sm:text-sm sm:leading-6 bg-neutral-800 outline-0 ps-2 pe-2 appearance-none"
                    >
                      <option>Premium</option>
                      <option>Free</option>
                    </select>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="lptax"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Amount
                    </label>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        id="lptax"
                        defaultValue="20"
                        className={
                          "block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
                          (errors.lptax
                            ? "border border-pink-600"
                            : "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
                        }
                        placeholder="20"
                        {...register("lptax", {
                          required: true,
                          max: 20,
                          min: 0,
                        })}
                      />
                      {errors.lptax && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                            className="h-5 w-5 text-pink-600"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    {errors.lptax && (
                      <p className="mt-2 text-pink-600 text-sm">
                        Tax should be between 0 to 20.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="template"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Choose currency
                    </label>
                    <div className="mt-2">
                      <select
                        id="tier"
                        name="tier"
                        defaultValue="SAFU"
                        className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:max-w-xs sm:text-sm sm:leading-6 bg-neutral-800 outline-0 ps-2 pe-2 appearance-none"
                      >
                        <option>SAFU</option>
                        <option>Etherium</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-2.5">
              {error && <span>There has been an error in the launch</span>}
            </div>
            <input
              type="submit"
              value="Launch"
              className="px-6 py-2 select-none rounded-md text-white bg-blue-500 hover:bg-blue-600 me-2 mb-2 cursor-pointer"
            />
          </form>
        </div>
      )}
    </>
  );
}
export default Launch;
