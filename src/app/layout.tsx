import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Web3Modal from "../context/Web3Modal";
import Link from "next/link";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <nav
          className="flex justify-between px-24 py-4 mt-4"
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
