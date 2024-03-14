"use client";

import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import { arbitrum, mainnet, goerli } from "viem/chains";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "1b68748d8eb8fb69865da49234fd799d";

// 2. Create wagmiConfig
const metadata = {
  name: "SAFU Launcher",
  description: "SAFU Launcher connect",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const chains = [mainnet, arbitrum, goerli];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains });

function Web3Modal({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
export default Web3Modal;
