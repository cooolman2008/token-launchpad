"use client";

import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWalletClient,
} from "wagmi";
import ManagerAbi from "../../managerabi.json";
import { useEffect, useState } from "react";

function Displays() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: walletClient } = useWalletClient();
  const { address, isConnected } = useAccount();

  const {
    data: result,
    isLoading,
    isSuccess,
    write,
  } = useContractWrite({
    address: "0xbC9201678945bE971c7E30aD80dEFdFdab66B3E0",
    abi: ManagerAbi.abi,
    functionName: "launchTokenFree",
    args: [
      {
        owner: address,
        taxWallet: address,
        isFreeTier: true,
        isUniswap: true,
        isStrict: false,
        supply: 10000000,
        initTaxType: 0,
        initInterval: 60,
        countInterval: 0,
        maxBuyTax: 20,
        minBuyTax: 0,
        maxSellTax: 20,
        minSellTax: 0,
        lpTax: 20,
        maxWallet: 1,
        name: "DAADVB",
        symbol: "DVB",
      },
    ],
  });
  console.log(result);
  const { data } = useContractRead({
    address: "0xbC9201678945bE971c7E30aD80dEFdFdab66B3E0",
    abi: ManagerAbi.abi,
    functionName: "getLaunchCost",
  });
  console.log(data);
  return (
    <>
      {isClient && (
        <div>
          <h1>Connected to {walletClient?.account.address}</h1>
          <h1>Coin name {typeof data === "object" ?? JSON.stringify(data)} </h1>
          <button onClick={() => write()}>Feed</button>
          {isLoading && <div>Check Wallet</div>}
          {isSuccess && <div>Transaction: {JSON.stringify(result)}</div>}
          <span>{isSuccess}</span>
        </div>
      )}
    </>
  );
}
export default Displays;
