"use client";

import { useWalletClient } from "wagmi";
import { useEffect, useState } from "react";
import Link from "next/link";

import { animate } from "motion";
import Explore from "@/components/PageModules/Launches/Explore";
import MyTokens from "@/components/PageModules/Launches/MyTokens";
import Stealth from "@/components/PageModules/Launches/Stealth";
import Details from "@/components/PageModules/Launches/Details";

function Launches() {
  const { data: walletClient } = useWalletClient();
  const [isClient, setIsClient] = useState(false);
  const [tab, setTab] = useState("Explore");

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
          <div className="w-full flex my-12 justify-between">
            <Details />
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
          <Link href="/launch" className="safu-button-secondary">
            Launch a token
          </Link>
        </>
      )}
    </>
  );
}
export default Launches;
