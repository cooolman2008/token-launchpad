import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Web3Modal from "../context/Web3Modal";
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
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="wallet-details">
            <w3m-button />
          </div>
          <Web3Modal>{children}</Web3Modal>
        </main>
      </body>
    </html>
  );
}
