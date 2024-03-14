"use client";

import { useWalletClient, useContractRead, useAccount } from "wagmi";
import ManagerAbi from "../../managerabi.json";
import { useEffect, useState } from "react";
import Link from "next/link";

function Launches() {
  const { data: walletClient } = useWalletClient();
  const [isClient, setIsClient] = useState(false);
  const { address, isConnecting, isDisconnected } = useAccount();

  useEffect(() => {
    setIsClient(true);
  }, []);
  const { data: tokens } = useContractRead({
    address: "0xbC9201678945bE971c7E30aD80dEFdFdab66B3E0",
    abi: ManagerAbi.abi,
    functionName: "getMyLaunches",
    account: walletClient?.account,
  });
  console.log(tokens);

  return (
    <>
      {isClient && walletClient && (
        <>
          {tokens && (
            <>
              <h2>My Launches</h2>
              <ul role="list" className="divide-y divide-gray-100">
                {tokens.map((token) => (
                  <li key={token} className="flex justify-between gap-x-6 py-5">
                    <div className="flex min-w-0 gap-x-4">
                      <div className="min-w-0 flex-auto">
                        <Link href={"/" + token}>{token}</Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
          <Link
            href="/launch"
            className="text-white bg-[#050708] hover:bg-[#050708]/80 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#050708]/40 dark:focus:ring-gray-600 me-2 mb-2"
          >
            Launch a token
          </Link>
        </>
      )}
    </>
  );
}
export default Launches;
