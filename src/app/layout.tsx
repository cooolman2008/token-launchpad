import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Web3Modal from "../context/Web3Modal";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";
import logo from "../../public/safu.svg";
const plus_Jakarta_Sans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SAFU Launcher",
  description: "Fully on chain erc20 token launcher",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={plus_Jakarta_Sans.className + ""}>
        <nav className="flex px-8 py-5 h-20 text-gray-400">
          <Link href={"/"} className="pr-8">
            <Image
              id="box"
              src={logo}
              style={{ width: "auto", height: "100%" }}
              alt="SAFU Launcher Logo"
            />
          </Link>
          <Link href={"/"} className="self-center pr-8">
            <span className="text-white">Explore</span>
          </Link>
          <Link href={"/"} className="self-center">
            <span className="hover:text-white">Swap</span>
          </Link>
          <div className="w-1/4 flex mx-auto rounded-3xl border border-neutral-700 hover:border-neutral-600">
            <div className="w-full flex">
              <div className="inset-y-0 right-0 flex items-center pl-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  className="fill-gray-400"
                >
                  <path d="M21.53 20.47L17.689 16.629C18.973 15.106 19.75 13.143 19.75 11C19.75 6.175 15.825 2.25 11 2.25C6.175 2.25 2.25 6.175 2.25 11C2.25 15.825 6.175 19.75 11 19.75C13.143 19.75 15.106 18.973 16.629 17.689L20.47 21.53C20.616 21.676 20.808 21.75 21 21.75C21.192 21.75 21.384 21.677 21.53 21.53C21.823 21.238 21.823 20.763 21.53 20.47ZM3.75 11C3.75 7.002 7.002 3.75 11 3.75C14.998 3.75 18.25 7.002 18.25 11C18.25 14.998 14.998 18.25 11 18.25C7.002 18.25 3.75 14.998 3.75 11Z"></path>
                </svg>
              </div>
              <input
                type="text"
                id="amount"
                placeholder="Search Tokens"
                className="block w-full rounded-xl ps-3 pe-3 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-transparent outline-0 sm:text-md pb-0.5"
              />
            </div>
          </div>
          <div>
            <w3m-button />
          </div>
        </nav>
        <main className="container mx-auto flex min-h-screen flex-col items-center px-24">
          <Web3Modal>{children}</Web3Modal>
        </main>
      </body>
    </html>
  );
}
