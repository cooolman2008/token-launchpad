"use client";

import { useWalletClient, useContractRead, useContractWrite } from "wagmi";
import { useEffect, useState } from "react";
import { fetchToken } from "@/api/getToken";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";
import Tokenabi from "../../newtokenabi.json";
import EtherscanBadge from "@/components/images/EtherscanBadge";
import XBadge from "@/components/images/XBadge";
import DextoolsBadge from "@/components/images/DextoolsBadge";

interface Token {
  name: string;
  totalSupply: number;
  symbol: string;
}

function TokenView({ params }: { params: { slug: `0x${string}` } }) {
  const { data: walletClient } = useWalletClient();
  const [isClient, setIsClient] = useState(false);
  let isSymbol = false;
  const [token, setToken] = useState<Token>();
  const router = useRouter();

  useEffect(() => {
    if (!isAddress(params?.slug)) {
      router.push("/");
    }
    async function fetchTheToken() {
      const data = await fetchToken(params?.slug?.toString());
      setToken(data);
    }
    fetchTheToken();
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && walletClient && (
        <>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12 w-full">
            <div className="sm:col-span-8">
              <h2 className="text-xl text-gray-400 mb-4">[ {params?.slug} ]</h2>
              <div className="w-full flex mb-12">
                <div className="flex flex-1">
                  <img
                    id="box"
                    src="/coin.svg"
                    style={{ width: "auto", height: "40px" }}
                  />
                  <h2 className="text-3xl mx-4">{token?.name}</h2>
                  <h2 className="text-3xl text-gray-400">{token?.symbol}</h2>
                </div>
                <div>
                  <EtherscanBadge url="google.com" />
                  {/* <XBadge url="google.com" /> */}
                  <DextoolsBadge url="google.com" />
                </div>
              </div>
              <div className="w-full">
                <div className="w-full">
                  <div className="flex my-4 font-thin">
                    <h2 className="text-2xl">Statistics</h2>
                  </div>
                </div>
                <div className="flex mb-12 mt-4">
                  <div className="flex flex-col flex-1">
                    <span className="text-sm mb-2 text-gray-400">TVL</span>
                    <h2 className="text-3xl">$662.28M</h2>
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm mb-2 text-gray-400">
                      Market cap
                    </span>
                    <h2 className="text-3xl">$33.5B</h2>
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm mb-2 text-gray-400">FDV</span>
                    <h2 className="text-3xl">$1.25B</h2>
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm mb-2 text-gray-400">
                      1 day Volume
                    </span>
                    <h2 className="text-3xl">$321.4BM</h2>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <h2 className="block text-2xl my-4 font-thin">
                  Take what's yours!
                </h2>
                <div className="flex mb-12 mt-4">
                  <div className="flex flex-col">
                    <span className="block text-sm mb-2 text-gray-400">
                      Vested Tokens
                    </span>
                    <button className="px-6 py-2 select-none rounded-md text-white bg-blue-500 hover:bg-blue-600 me-2 mb-2 cursor-pointer">
                      Claim $62.02M
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full mb-12">
                <h2 className="block text-2xl my-4 font-thin">
                  Get your token to the moon!
                </h2>
                <div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900 mb-2">
                  <label className="block text-sm leading-6 text-gray-400">
                    Start Trading
                  </label>
                  <div className="w-full flex">
                    <input
                      type="text"
                      id="liq"
                      name="liq"
                      placeholder="Liquid ETH"
                      className="block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-900 outline-0 sm:text-4xl border-x border-gray-400"
                    />
                    <div className="w-full rounded-md flex items-center">
                      <span className="text-xl text-gray-400 px-4">
                        Should Burn
                      </span>
                      <input
                        type="checkbox"
                        id="burn"
                        name="burn"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                    </div>
                    <div className="w-full rounded-md flex items-center">
                      <span className="text-xl text-gray-400 pr-4">
                        Lock days
                      </span>
                      <input
                        type="text"
                        id="days"
                        name="days"
                        placeholder="30"
                        className="block w-16 rounded-md ps-2 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-900 outline-0 sm:text-4xl border border-gray-400"
                      />
                    </div>
                    <button className="px-6 py-2 select-none rounded-md text-white bg-blue-500 hover:bg-blue-600 me-2 mb-2 cursor-pointer">
                      Start
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full mb-12">
                <h2 className="block text-2xl my-4 font-thin">
                  Change the game!
                </h2>
                <div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900 mb-2">
                  <div className="w-full flex">
                    <button className="w-full px-6 py-2 select-none rounded-md text-white bg-blue-500 hover:bg-blue-600 me-2 mb-2 cursor-pointer">
                      Remove Limits
                    </button>
                    <button className="w-full px-6 py-2 select-none rounded-md text-white bg-blue-500 hover:bg-blue-600 me-2 mb-2 cursor-pointer">
                      Burn LP
                    </button>
                    <div className="w-full rounded-md flex items-center">
                      <span className="text-xl text-gray-400 pr-4">Lock</span>
                      <input
                        type="text"
                        id="lock"
                        name="lock"
                        placeholder="30"
                        className="block w-16 rounded-md ps-2 py-1.5 mr-4 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-900 outline-0 sm:text-4xl border border-gray-400"
                      />
                    </div>
                    <button className="px-6 py-2 select-none rounded-md text-white bg-blue-500 hover:bg-blue-600 me-2 mb-2 cursor-pointer">
                      Extend
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <div className="flex mb-4">
                  <h2 className="text-2xl font-thin">Promote this token!</h2>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 fill-gray-600 hover:fill-gray-400 cursor-pointer ml-1"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12.02 17.5C11.468 17.5 11.0149 17.052 11.0149 16.5C11.0149 15.948 11.458 15.5 12.01 15.5H12.02C12.573 15.5 13.02 15.948 13.02 16.5C13.02 17.052 12.572 17.5 12.02 17.5ZM13.603 12.5281C12.872 13.0181 12.7359 13.291 12.7109 13.363C12.6059 13.676 12.314 13.874 12 13.874C11.921 13.874 11.841 13.862 11.762 13.835C11.369 13.703 11.1581 13.278 11.2891 12.885C11.4701 12.345 11.9391 11.836 12.7671 11.281C13.7881 10.597 13.657 9.84707 13.614 9.60107C13.501 8.94707 12.95 8.38988 12.303 8.27588C11.811 8.18588 11.3301 8.31488 10.9541 8.62988C10.5761 8.94688 10.3589 9.41391 10.3589 9.90991C10.3589 10.3239 10.0229 10.6599 9.60889 10.6599C9.19489 10.6599 8.85889 10.3239 8.85889 9.90991C8.85889 8.96891 9.27099 8.08396 9.98999 7.48096C10.702 6.88496 11.639 6.63605 12.564 6.80005C13.831 7.02405 14.8701 8.07097 15.0911 9.34497C15.3111 10.607 14.782 11.7381 13.603 12.5281Z"></path>
                  </svg>
                </div>
                <div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900 mb-2">
                  <label className="block text-sm leading-6 text-gray-400">
                    Start Promoting
                  </label>
                  <div className="w-full flex">
                    <div className="w-full rounded-md flex items-center">
                      <span className="text-xl text-gray-400 pr-4">Cost</span>
                      <input
                        type="text"
                        id="cost"
                        name="cost"
                        placeholder="30"
                        className="block w-16 rounded-md ps-2 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-900 outline-0 sm:text-4xl border-l border-gray-400"
                      />
                    </div>
                    <div className="w-full rounded-md flex items-center">
                      <span className="text-xl text-gray-400 pr-4">Hours</span>
                      <input
                        type="text"
                        id="hours"
                        name="hours"
                        placeholder="30"
                        className="block w-16 rounded-md ps-2 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-900 outline-0 sm:text-4xl border-l border-gray-400"
                      />
                    </div>
                    <button className="px-6 py-2 select-none rounded-md text-white bg-blue-500 hover:bg-blue-600 me-2 mb-2 cursor-pointer">
                      Promote
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="sm:col-span-4">
              <div className="swap-container">
                <div className="flex mb-4">
                  <h2 className="text-3xl">Swap</h2>
                </div>
                <div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900 mb-2">
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
                      name="amount"
                      placeholder="0"
                      className="block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-900 outline-0 sm:text-4xl"
                    />
                    <span className="block sm:text-4xl leading-6 text-gray-400 pt-1.5">
                      ETH
                    </span>
                  </div>
                </div>
                <div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900">
                  <label className="block text-sm leading-6 text-gray-400">
                    Your returns
                  </label>
                  <div className="w-full flex">
                    <span className="block w-full ps-3 pe-3 my-3 text-gray-400 sm:leading-6 bg-neutral-900 sm:text-4xl">
                      0
                    </span>
                    <span className="block sm:text-4xl leading-6 text-gray-400 pt-1.5">
                      {token?.symbol}
                    </span>
                  </div>
                </div>
              </div>
              <div className="socials-container mt-12">
                <div className="flex mb-4">
                  <h2 className="text-3xl">Set Socials</h2>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 fill-gray-600 hover:fill-gray-400 cursor-pointer ml-1"
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12.02 17.5C11.468 17.5 11.0149 17.052 11.0149 16.5C11.0149 15.948 11.458 15.5 12.01 15.5H12.02C12.573 15.5 13.02 15.948 13.02 16.5C13.02 17.052 12.572 17.5 12.02 17.5ZM13.603 12.5281C12.872 13.0181 12.7359 13.291 12.7109 13.363C12.6059 13.676 12.314 13.874 12 13.874C11.921 13.874 11.841 13.862 11.762 13.835C11.369 13.703 11.1581 13.278 11.2891 12.885C11.4701 12.345 11.9391 11.836 12.7671 11.281C13.7881 10.597 13.657 9.84707 13.614 9.60107C13.501 8.94707 12.95 8.38988 12.303 8.27588C11.811 8.18588 11.3301 8.31488 10.9541 8.62988C10.5761 8.94688 10.3589 9.41391 10.3589 9.90991C10.3589 10.3239 10.0229 10.6599 9.60889 10.6599C9.19489 10.6599 8.85889 10.3239 8.85889 9.90991C8.85889 8.96891 9.27099 8.08396 9.98999 7.48096C10.702 6.88496 11.639 6.63605 12.564 6.80005C13.831 7.02405 14.8701 8.07097 15.0911 9.34497C15.3111 10.607 14.782 11.7381 13.603 12.5281Z"></path>
                  </svg>
                </div>
                <div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900 mb-2">
                  <label
                    htmlFor="twitter"
                    className="block text-sm leading-6 text-gray-400"
                  >
                    Twitter
                  </label>
                  <div className="w-full flex">
                    <input
                      type="text"
                      id="twitter"
                      name="twitter"
                      placeholder="safu_coin"
                      className="block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-900 outline-0 sm:text-2xl"
                    />
                    <span className="block sm:text-4xl leading-6 text-gray-400 pt-1.5">
                      <svg
                        width="40px"
                        height="40px"
                        viewBox="0 0 18 18"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="transparent"
                        className="fill-gray-400"
                      >
                        <path d="M12.8761 3H14.9451L10.4251 8.16609L15.7425 15.196H11.579L8.31797 10.9324L4.58662 15.196H2.51644L7.35104 9.67026L2.25 3H6.51922L9.46689 6.89708L12.8761 3ZM12.15 13.9576H13.2964L5.89628 4.17332H4.66605L12.15 13.9576Z"></path>
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900 mb-2">
                  <label
                    htmlFor="site"
                    className="block text-sm leading-6 text-gray-400"
                  >
                    Website
                  </label>
                  <div className="w-full flex">
                    <input
                      type="text"
                      id="site"
                      name="site"
                      placeholder="http://www.w3.org"
                      className="block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-900 outline-0 sm:text-2xl"
                    />
                    <span className="block sm:text-4xl leading-6 text-gray-400 pt-1.5">
                      <svg
                        width="40px"
                        height="40px"
                        viewBox="0 0 18 18"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="transparent"
                        className="fill-gray-400"
                      >
                        <path d="M5.12245 9.5625C5.23495 11.8725 6.01495 14.2275 7.37245 16.32C4.19245 15.615 1.76996 12.8925 1.52246 9.5625H5.12245ZM7.37245 1.67999C4.19245 2.38499 1.76996 5.1075 1.52246 8.4375H5.12245C5.23495 6.1275 6.01495 3.77249 7.37245 1.67999ZM9.14997 1.5H8.84995L8.62496 1.82249C7.19996 3.84749 6.36745 6.1725 6.24745 8.4375H11.7525C11.6325 6.1725 10.8 3.84749 9.37496 1.82249L9.14997 1.5ZM6.24745 9.5625C6.36745 11.8275 7.19996 14.1525 8.62496 16.1775L8.84995 16.5H9.14997L9.37496 16.1775C10.8 14.1525 11.6325 11.8275 11.7525 9.5625H6.24745ZM12.8775 9.5625C12.765 11.8725 11.985 14.2275 10.6275 16.32C13.8075 15.615 16.23 12.8925 16.4775 9.5625H12.8775ZM16.4775 8.4375C16.23 5.1075 13.8075 2.38499 10.6275 1.67999C11.985 3.77249 12.765 6.1275 12.8775 8.4375H16.4775Z"></path>
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900 mb-2">
                  <label
                    htmlFor="telegram"
                    className="block text-sm leading-6 text-gray-400"
                  >
                    Telegram
                  </label>
                  <div className="w-full flex">
                    <input
                      type="text"
                      id="telegram"
                      name="telegram"
                      placeholder="@codeevolution"
                      className="block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-900 outline-0 sm:text-2xl"
                    />
                    <span className="block sm:text-4xl leading-6 text-gray-400 pt-1.5">
                      <svg
                        width="40px"
                        height="40px"
                        viewBox="0 0 24 24"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-gray-400"
                      >
                        <path d="M23.91 3.79L20.3 20.84c-.25 1.21-.98 1.5-2 .94l-5.5-4.07-2.66 2.57c-.3.3-.55.56-1.1.56-.72 0-.6-.27-.84-.95L6.3 13.7l-5.45-1.7c-1.18-.35-1.19-1.16.26-1.75l21.26-8.2c.97-.43 1.9.24 1.53 1.73z" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="flex justify-center w-full mb-4">
                  <button className="px-6 py-2 select-none rounded-md text-white bg-blue-500 hover:bg-blue-600 me-2 mb-2 cursor-pointer">
                    Set
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default TokenView;
