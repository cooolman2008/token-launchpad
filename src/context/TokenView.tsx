"use client";

import { useWalletClient, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { fetchToken, Token } from "@/api/getToken";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";
import EtherscanBadge from "@/components/images/EtherscanBadge";
import DextoolsBadge from "@/components/images/DextoolsBadge";
import StartTrading from "@/components/Modules/TokenView/StartTrading";
import Changes from "@/components/Modules/TokenView/Changes";
import SetSocials from "@/components/Modules/TokenView/SetSocials";

function TokenView({ params }: { params: { slug: `0x${string}` } }) {
  const { data: walletClient } = useWalletClient();
  const [isClient, setIsClient] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isTeam, setIsTeam] = useState(false);
  const [token, setToken] = useState<Token>();
  const { address } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isAddress(params?.slug)) {
      router.push("/");
    }
    async function fetchTheToken() {
      const data = await fetchToken(params?.slug?.toString());
      if (data?.pair === "0x0000000000000000000000000000000000000000") {
        data.pair = "";
      }
      setToken(data);
      if (data?.owner.toLowerCase() === address?.toLowerCase()) {
        setIsOwner(true);
      }
      if (
        data?.team1 === address ||
        data?.team2 === address ||
        data?.team3 === address ||
        data?.team4 === address ||
        data?.team5 === address
      ) {
        setIsTeam(true);
      }
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
                  <EtherscanBadge
                    url={"https://etherscan.io/token/" + params?.slug}
                  />
                  <DextoolsBadge url="https://info.dextools.io/" />
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
              {isTeam && (
                <div className="w-full">
                  <h2 className="block text-2xl my-4 font-thin">
                    Take what's yours!
                  </h2>
                  <div className="flex mb-12 mt-4">
                    <div className="flex flex-col">
                      <span className="block text-sm mb-2 text-gray-400">
                        Vested Tokens
                      </span>
                      <button className="safu-button-primary">
                        Claim $62.02M
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {isOwner && (
                <>
                  {!token?.pair && (
                    <div className="w-full mb-12">
                      <StartTrading contractAddress={params?.slug} />
                    </div>
                  )}
                  {token?.pair && (
                    <div className="w-full mb-12">
                      <Changes
                        contractAddress={params?.slug}
                        isLimited={token?.isLimited}
                        isLpBurnt={token?.isLpBurnt}
                        isLpRetrieved={token?.isLpRetrieved}
                      />
                    </div>
                  )}
                </>
              )}
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
                    <div className="w-full rounded-3xl flex items-center">
                      <span className="text-xl text-gray-400 pr-4">Cost</span>
                      <input
                        type="text"
                        id="cost"
                        name="cost"
                        placeholder="30"
                        className="block w-20 rounded-xl ps-2 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-4xl border-l border-gray-400"
                      />
                    </div>
                    <div className="w-full rounded-3xl flex items-center">
                      <span className="text-xl text-gray-400 pr-4">Hours</span>
                      <input
                        type="text"
                        id="hours"
                        name="hours"
                        placeholder="30"
                        className="block w-20 rounded-xl ps-2 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-4xl border-l border-gray-400"
                      />
                    </div>
                    <div className="flex justify-center flex-col">
                      <button className="safu-button-primary">Promote</button>
                    </div>
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
                      className="block w-full rounded-xl ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-4xl"
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
              {isOwner && (
                <div className="socials-container mt-12">
                  <SetSocials
                    contractAddress={params?.slug}
                    telegram={token?.telegram ? token?.telegram : ""}
                    twitter={token?.twitter ? token?.twitter : ""}
                    website={token?.website ? token?.website : ""}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default TokenView;
