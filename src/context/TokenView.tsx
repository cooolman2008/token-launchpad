"use client";

import { useWalletClient, useContractRead, useContractWrite } from "wagmi";
import Tokenabi from "../../newtokenabi.json";
import { useEffect, useState } from "react";
import { parseEther } from "viem";

function TokenView({ params }: { params: { slug: `0x${string}` } }) {
  const { data: walletClient } = useWalletClient();
  const [isClient, setIsClient] = useState(false);

  // get token details from the ERC20 token abi.
  const { data: token } = useContractRead({
    address: params.slug,
    abi: Tokenabi.abi,
    functionName: "name",
  });

  const { data: symbol } = useContractRead({
    address: params.slug,
    abi: Tokenabi.abi,
    functionName: "symbol",
  });

  // contract call to start trading of the launched token.
  const { data, isSuccess, write } = useContractWrite({
    address: params.slug,
    abi: Tokenabi.abi,
    functionName: "startTrading",
    onSuccess(res) {
      console.log(res);
    },
    onError(error) {
      console.log(error);
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && walletClient && (
        <>
          <span>Address: {params.slug}</span>
          {typeof token === "string" && <span>Name: {token}</span>}
          {typeof symbol === "string" && <span>Symbol: {symbol}</span>}

          <button
            onClick={() =>
              write({
                value: parseEther("0.0001"),
              })
            }
            className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2"
          >
            Start Trading
          </button>
          <button className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2">
            Remove Limits
          </button>
          <button className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 me-2 mb-2">
            Verify on Etherscan
          </button>
        </>
      )}
    </>
  );
}
export default TokenView;
