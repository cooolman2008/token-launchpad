"use client";

import { useWalletClient, useContractRead, useAccount } from "wagmi";
import ManagerAbi from "../../managerabi.json";
import { useEffect, useState } from "react";
import Link from "next/link";

function Launches() {
  const { data: walletClient } = useWalletClient();
  const [isClient, setIsClient] = useState(false);

  // get all launches by the wallet owner.
  const { data: tokens } = useContractRead({
    address: "0xC3Ac34068AB853697df0391550f387034E89Cd57",
    abi: ManagerAbi.abi,
    functionName: "getMyLaunches",
    account: walletClient?.account,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && walletClient && (
        <>
          {tokens && (
            <>
              <h2>My Launches</h2>
              <ul role="list" className="divide-y divide-gray-100">
                {Object.values(tokens).map((token) => (
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
