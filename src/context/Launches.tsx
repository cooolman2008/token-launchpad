"use client";

import { useWalletClient, useContractRead, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import Link from "next/link";

import { fetchTokens } from "@/api/getTokens";
import { animate } from "motion";

// Abis
// import ManagerAbi from "../../managerabi.json";
import HelperAbi from "../../helperabi.json";

interface Tokens {
  id: string;
  name: string;
  symbol: string;
  totalSupply: number;
  totalTax: number;
  tradeVolume: number;
}

function Launches() {
  const { data: walletClient } = useWalletClient();
  const [isClient, setIsClient] = useState(false);
  const [tokens, setTokens] = useState<Tokens[]>([]);
  const { address } = useAccount();

  // get all launches by the wallet owner.
  // console.log(address);
  // const { data: tokenList } = useContractRead({
  //   address: "0x7A5EC257391817ef241ef8451642cC6b222d4f8C",
  //   abi: HelperAbi.abi,
  //   functionName: "getLaunches",
  //   account: walletClient?.account,
  //   args: [address],
  //   chainId: 31337,
  // });
  // console.log(tokenList);
  useEffect(() => {
    animate(
      "#box",
      { rotate: 90 },
      {
        duration: 0.5,
        easing: "ease-in-out",
        repeat: 3,
        direction: "alternate",
      }
    );
  }, []);

  useEffect(() => {
    animate(
      "#box",
      { rotate: [0, 35, -35, 0] },
      {
        duration: 0.5,
        offset: [0, 0.25, 0.75],
      }
    );
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchOwnedTokens() {
      if (address) {
        const tokensFetched = await fetchTokens(address?.toString());
        setTokens(tokensFetched);
      }
    }
    fetchOwnedTokens();
  }, []);

  return (
    <>
      {isClient && walletClient && (
        <>
          {tokens && (
            <>
              <h2 className="text-3xl py-4">My Launches</h2>
              <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                <div className="w-full overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Supply</th>
                        <th className="px-4 py-3">Trade</th>
                        <th className="px-4 py-3">Tax</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {Object.values(tokens).map((token) => (
                        <tr key={token.id} className="text-gray-700">
                          <td className="px-4 py-3 border">
                            <Link href={"/" + token.id} className="text-lg">
                              <div>
                                <p className="font-semibold text-black">
                                  {token.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {token.symbol}
                                </p>
                              </div>
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-ms font-semibold border">
                            {token.totalSupply}
                          </td>
                          <td className="px-4 py-3 text-xs border">
                            <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-red-200 rounded-sm">
                              {token.tradeVolume}{" "}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm border">
                            {token.tradeVolume}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          <Link
            href="/launch"
            className="px-6 py-2 select-none rounded-md text-white bg-indigo-500 hover:bg-indigo-600 me-2 mb-2"
          >
            Launch a token
          </Link>
        </>
      )}
    </>
  );
}
export default Launches;
