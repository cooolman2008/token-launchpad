import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import {
	mainnet,
	arbitrum,
	optimism,
	polygon,
	base,
	bsc,
	avalancheFuji,
	blast,
	holesky,
	arbitrumSepolia,
	optimismSepolia,
	polygonAmoy,
	baseSepolia,
	bscTestnet,
	avalanche,
	blastSepolia,
} from "wagmi/chains";
import { defineChain } from "viem";

// Get projectId from https://cloud.walletconnect.com
export const projectId = "1b68748d8eb8fb69865da49234fd799d";

if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
	name: "SAFU Launcher",
	description: "SAFU Launcher connect",
	url: "https://app.safulauncher.com",
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// export const local = defineChain({
// 	id: 1337,
// 	name: "Local",
// 	network: "Local",
// 	nativeCurrency: {
// 		decimals: 18,
// 		name: "Ether",
// 		symbol: "ETH",
// 	},
// 	rpcUrls: {
// 		default: {
// 			http: ["http://0.0.0.0:8545"],
// 		},
// 		public: {
// 			http: ["http://0.0.0.0:8545"],
// 		},
// 	},
// 	blockExplorers: {
// 		default: { name: "Etherscan", url: "https://etherscan.io" },
// 	},
// });

// Create wagmiConfig
// const chains = [holesky, mainnet, arbitrum, sepolia, local] as const;
const chains = [mainnet, base, bsc, holesky, bscTestnet, polygonAmoy] as const;
export const config = defaultWagmiConfig({
	chains,
	projectId,
	metadata,
	ssr: true,
});
