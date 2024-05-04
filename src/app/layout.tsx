import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Web3Modal from "../context/Web3Modal";
import Link from "next/link";
import "./globals.css";
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
      <body className={plus_Jakarta_Sans.className + " pt-4"}>
        <nav
          className="flex justify-between px-24 py-4"
          style={{ height: "100px" }}
        >
          <Link href={"/"}>
            <img
              id="box"
              src="/safu.svg"
              style={{ width: "auto", height: "100%" }}
            />
          </Link>
          <div className="wallet-details">
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
