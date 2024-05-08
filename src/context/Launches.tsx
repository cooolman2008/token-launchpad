"use client";

import { useWalletClient } from "wagmi";
import { useEffect, useState } from "react";
import Link from "next/link";

import { animate } from "motion";
import Explore from "@/components/Modules/Launches/Explore";
import MyTokens from "@/components/Modules/Launches/MyTokens";
import Stealth from "@/components/Modules/Launches/Stealth";
import { fetchSafu } from "@/api/getSafu";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

function Launches() {
  const { data: walletClient } = useWalletClient();
  const [isClient, setIsClient] = useState(false);
  const [tab, setTab] = useState("Explore");
  const [safuTVL, setSafuTVL] = useState(0);
  const [safuVolume, setSafuVolume] = useState(0);
  const [safuLaunches, setSafuLaunches] = useState(0);

  useEffect(() => {
    async function fetchSafuDetails() {
      const safuDetails = await fetchSafu(CONTRACT_ADDRESS);
      setSafuTVL(
        Math.round(
          (safuDetails?.totalLiquidityUSD
            ? safuDetails?.totalLiquidityUSD
            : 0) * 100
        ) / 100
      );
      setSafuVolume(
        Math.round(
          (safuDetails?.totalVolumeUSD ? safuDetails?.totalVolumeUSD : 0) * 100
        ) / 100
      );
      setSafuLaunches(safuDetails?.launchCount ? safuDetails?.launchCount : 0);
    }
    fetchSafuDetails();
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

  return (
    <>
      {isClient && walletClient && (
        <>
          <div className="flex my-12">
            <div className="flex flex-col px-12">
              <span className="text-lg mb-2 text-gray-400">SAFU TVL</span>
              <h2 className="text-5xl">${safuTVL.toFixed(2)}</h2>
            </div>
            <div className="flex flex-col px-12">
              <span className="text-lg mb-2 text-gray-400">SAFU Volume</span>
              <h2 className="text-5xl">${safuVolume.toFixed(2)}</h2>
            </div>
            <div className="flex flex-col px-12">
              <span className="text-lg mb-2 text-gray-400">SAFU Launches</span>
              <h2 className="text-5xl">{safuLaunches}</h2>
            </div>
          </div>
          <div className="flex self-start my-4 min-w-full px-3">
            <h2
              className={
                "transition-colors duration-200 ease-in text-2xl pr-8 cursor-pointer " +
                (tab === "Explore" ? "text-pink-600" : "text-gray-400")
              }
              onClick={() => setTab("Explore")}
            >
              Explore
            </h2>
            <h2
              className={
                "transition-colors duration-200 ease-in text-2xl px-8 cursor-pointer " +
                (tab === "Launches" ? "text-pink-600" : "text-gray-400")
              }
              onClick={() => setTab("Launches")}
            >
              My Launches
            </h2>
            <h2
              className={
                "transition-colors duration-200 ease-in text-2xl px-8 cursor-pointer " +
                (tab === "Stealth" ? "text-pink-600" : "text-gray-400")
              }
              onClick={() => setTab("Stealth")}
            >
              Stealth Launches
            </h2>
            <h2 className="self-end ml-auto p-2 border rounded-lg border-slate-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21.53 20.47L17.689 16.629C18.973 15.106 19.75 13.143 19.75 11C19.75 6.175 15.825 2.25 11 2.25C6.175 2.25 2.25 6.175 2.25 11C2.25 15.825 6.175 19.75 11 19.75C13.143 19.75 15.106 18.973 16.629 17.689L20.47 21.53C20.616 21.676 20.808 21.75 21 21.75C21.192 21.75 21.384 21.677 21.53 21.53C21.823 21.238 21.823 20.763 21.53 20.47ZM3.75 11C3.75 7.002 7.002 3.75 11 3.75C14.998 3.75 18.25 7.002 18.25 11C18.25 14.998 14.998 18.25 11 18.25C7.002 18.25 3.75 14.998 3.75 11Z"
                  fill="#9B9B9B"
                />
              </svg>
            </h2>
          </div>
          <div className="w-full mb-8 overflow-hidden rounded-2xl shadow-lg border border-gray-600">
            <div className="w-full overflow-x-auto">
              {tab === "Explore" && <Explore />}
              {tab === "Launches" && <MyTokens />}
              {tab === "Stealth" && <Stealth />}
            </div>
          </div>
          <Link
            href="/launch"
            className="px-6 py-2 select-none rounded-3xl text-white bg-blue-500 text-xl font-medium hover:bg-blue-600 me-2 mb-2"
          >
            Launch token
          </Link>
        </>
      )}
    </>
  );
}
export default Launches;
