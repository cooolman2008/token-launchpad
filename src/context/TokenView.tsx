"use client";

import { useWalletClient, useContractReads, useContractWrite } from "wagmi";
import Tokenabi from "../../newtokenabi.json";
import { useEffect, useState } from "react";
import { parseEther } from "viem";

function TokenView({ params }: { params: { slug: `0x${string}` } }) {
  const { data: walletClient } = useWalletClient();
  const [isClient, setIsClient] = useState(false);
  console.log(params.slug);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const theContract = {
    address: params.slug,
    abi: Tokenabi.abi,
  };

  const {
    data: token,
    isError,
    isLoading,
  } = useContractReads({
    contracts: [
      {
        ...theContract,
        functionName: "name",
      },
      {
        ...theContract,
        functionName: "symbol",
      },
      {
        ...theContract,
        functionName: "totalSupply",
      },
    ],
  });
  console.log(token);

  const { data, isSuccess, write } = useContractWrite({
    address: params.slug,
    abi: Tokenabi.abi,
    functionName: "startTrading",
  });

  return (
    <>
      {isClient && walletClient && (
        <>
          <span>Address: {params.slug}</span>
          <span>Name: {token[0].result}</span>
          <span>Symbol: {token[1].result}</span>
          {/* <span>Supply: {BigInt(token[2].result).toString()}</span> */}

          <button
            onClick={() =>
              write({
                value: parseEther("0.01"),
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
