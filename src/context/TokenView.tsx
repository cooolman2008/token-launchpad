"use client";

import { useWalletClient, useContractRead, useContractWrite } from "wagmi";
import { useEffect, useState } from "react";
import { fetchToken } from "@/api/getToken";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";
import Tokenabi from "../../newtokenabi.json";
// import { parseEther } from "viem";

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

  // get token details from the ERC20 token abi.
  // const { data: token } = useContractRead({
  //   address: params.slug,
  //   abi: Tokenabi.abi,
  //   functionName: "name",
  // });
  // console.log(token);

  // // contract call to start trading of the launched token.
  // const { data, isSuccess, write } = useContractWrite({
  //   address: params.slug,
  //   abi: Tokenabi.abi,
  //   functionName: "startTrading",
  //   onSuccess(res) {
  //     console.log(res);
  //   },
  //   onError(error) {
  //     console.log(error);
  //   },
  // });

  // if (!isSymbol) {
  //   const { data: symbol } = useContractRead({
  //     address: params?.slug,
  //     abi: Tokenabi.abi,
  //     functionName: "symbol",
  //   });
  //   isSymbol = true;
  //   console.log(symbol);
  // }

  useEffect(() => {
    if (!isAddress(params?.slug)) {
      router.push("/");
    }
    async function fetchTheToken() {
      const data = await fetchToken(params?.slug?.toString());
      setToken(data);
    }
    console.log("here");
    fetchTheToken();
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && walletClient && (
        <>
          <div className="flex p-4">
            <span className="p-4">
              Name:
              <br />
              {token?.name}
            </span>
            <span className="p-4">
              Symbol:
              <br />
              {token?.symbol}
            </span>
            <span className="p-4">
              Supply:
              <br />
              {token?.totalSupply}
            </span>
          </div>
          <div className="flex p-4">
            <button
              // onClick={() =>
              //   write({
              //     value: parseEther("0.0001"),
              //   })
              // }
              className="px-6 py-2 select-none rounded-md text-white bg-indigo-500 hover:bg-indigo-600 me-2 mb-2"
            >
              Start Trading
            </button>
            <button className="px-6 py-2 select-none rounded-md text-white bg-indigo-500 hover:bg-indigo-600 me-2 mb-2">
              Remove Limits
            </button>
            <button className="px-6 py-2 select-none rounded-md text-white bg-indigo-500 hover:bg-indigo-600 me-2 mb-2">
              Verify on Etherscan
            </button>
          </div>
        </>
      )}
    </>
  );
}
export default TokenView;
