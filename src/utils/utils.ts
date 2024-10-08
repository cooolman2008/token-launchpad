import { getAddress } from "viem";

export const getContractAddress = (chainId: number | undefined) => {
	switch (chainId) {
		case 1:
			return getAddress("0xdCA7905C38F15d5E653f76e956109BF5A4F43FbB"); //mainnet
		case 42161:
			return undefined; // arbitrum
		case 10:
			return undefined; // optimism
		case 137:
			return undefined; // polygon
		case 8453:
			return getAddress("0x16Ef580a9cd6cf149E95dC5e2CCB641e2E11b39c"); // base
		case 56:
			return getAddress("0xe3D10e06333500d2c0D842Bf262DE1E10d195640"); // bsc
		case 43113:
			return undefined; // avalancheFuji
		case 81457:
			return undefined; // blast
		case 17000:
			return getAddress("0xcc6c791a1898a1fe4818de6501e2320aa067f0ff"); // holeskey
		case 421614:
			return undefined; // arbitrumSepolia
		case 11155420:
			return undefined; // optimismSepolia
		case 80002:
			return getAddress("0x003E2F04d655076ADAA0eDa95cb5D77d1FD43146"); // polygonAmoy
		case 84532:
			return getAddress("0x216A1CB8644ea7Fac5B7f73989e45C745D131E9E"); // baseSepolia
		case 97:
			return getAddress("0x9e79EFab101E9F8d2B0F5DdDA46Ae8CB6f1D3A45"); // bscTestnet
		case 43114:
			return undefined; // avalanche
		case 168587773:
			return undefined; // blastSepolia
		case 1337:
			return getAddress("0x71d2ebf08bf4fcb82db5dde46677263f4c534ef3");
		default:
			return undefined;
	}
};

export const getGraphUrl = (chainId: number) => {
	switch (chainId) {
		case 1:
			return "https://gateway-arbitrum.network.thegraph.com/api/fb12cdbd9bb3db019954b86d90c276a3/subgraphs/id/64xsi3LbrmC8bJ3VaM6PBpL5em766BthJkdWTnAd6cMH"; //mainnet
		case 42161:
			return undefined; // arbitrum
		case 10:
			return undefined; // optimism
		case 137:
			return undefined; // polygon
		case 8453:
			return "https://gateway-arbitrum.network.thegraph.com/api/fb12cdbd9bb3db019954b86d90c276a3/subgraphs/id/7JDywCQFpuDAdEgWWLrFA61gEQYVGJ3ihLVooDrFP9eL"; // base
		case 56:
			return "https://gateway-arbitrum.network.thegraph.com/api/fb12cdbd9bb3db019954b86d90c276a3/subgraphs/id/AfiDzotDpUBQuFtgrfanA8b3UHi4AcYvYMdjTAuZzqDu"; // bsc
		case 43113:
			return undefined; // avalancheFuji
		case 81457:
			return undefined; // blast
		case 17000:
			return "https://api.studio.thegraph.com/query/82166/safulauncher/0.0.18"; // holeskey
		case 421614:
			return undefined; // arbitrumSepolia
		case 11155420:
			return undefined; // optimismSepolia
		case 80002:
			return "https://api.studio.thegraph.com/query/82166/safupolygontest/0.0.17"; // polygonAmoy
		case 84532:
			return "https://api.studio.thegraph.com/query/82166/safubasesepolia/0.1.0"; // baseSepolia
		case 97:
			return "https://api.studio.thegraph.com/query/82166/safubsctest/0.0.17"; // bscTestnet
		case 43114:
			return undefined; // avalanche
		case 168587773:
			return undefined; // blastSepolia
		case 1337:
			return "http://localhost:8000/subgraphs/name/SAFUlauncher";
		default:
			return undefined;
	}
};

export const getRouters = (chainId: number) => {
	switch (chainId) {
		case 1:
			return [
				{
					value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
					label: "Uniswap V2 Router",
				},
				{
					value: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
					label: "Sushiswap Router",
				},
				{
					value: "0xEfF92A263d31888d860bD50809A8D171709b7b1c",
					label: "Pancakeswap Router",
				},
			]; //mainnet
		case 42161:
			return []; // arbitrum
		case 10:
			return []; // optimism
		case 137:
			return []; // polygon
		case 8453:
			return [
				{
					value: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
					label: "Uniswap V2 Router",
				},
				{
					value: "0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891",
					label: "Sushiswap Router",
				},
				{
					value: "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb",
					label: "Pancakeswap Router",
				},
			]; // base
		case 56:
			return [
				{
					value: "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
					label: "Uniswap V2 Router",
				},
				{
					value: "0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891",
					label: "Sushiswap Router",
				},
				{
					value: "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb",
					label: "Pancakeswap Router",
				},
			]; // bsc
		case 43113:
			return []; // avalancheFuji
		case 81457:
			return []; // blast
		case 17000:
			return [
				{
					value: "0xe75850fc641b0930a3b6e6dbf1d0926ee9898645",
					label: "Uniswap V2 Router",
				},
				{
					value: "0xe75850fc641b0930a3b6e6dbf1d0926ee9898645",
					label: "Sushiswap Router",
				},
				{
					value: "0xe75850fc641b0930a3b6e6dbf1d0926ee9898645",
					label: "Pancakeswap Router",
				},
			]; // holeskey
		case 421614:
			return []; // arbitrumSepolia
		case 11155420:
			return []; // optimismSepolia
		case 80002:
			return [
				{
					value: "0x51f0dbdfc17bdf9c2a7b68937c1b9925a35232c3",
					label: "Uniswap V2 Router",
				},
				{
					value: "0x51f0dbdfc17bdf9c2a7b68937c1b9925a35232c3",
					label: "Sushiswap Router",
				},
				{
					value: "0x51f0dbdfc17bdf9c2a7b68937c1b9925a35232c3",
					label: "Pancakeswap Router",
				},
			]; // polygonAmoy
		case 84532:
			return [
				{
					value: "0x1689E7B1F10000AE47eBfE339a4f69dECd19F602",
					label: "Uniswap V2 Router",
				},
				{
					value: "0x1689E7B1F10000AE47eBfE339a4f69dECd19F602",
					label: "Sushiswap Router",
				},
				{
					value: "0x1689E7B1F10000AE47eBfE339a4f69dECd19F602",
					label: "Pancakeswap Router",
				},
				{
					value: "0xde472CFDC852c45FA8AC082A07662cA4846bD9A2",
					label: "X7 Finance",
				},
			]; // baseSepolia
		case 97:
			return [
				{
					value: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
					label: "Uniswap V2 Router",
				},
				{
					value: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
					label: "Sushiswap Router",
				},
				{
					value: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1",
					label: "Pancakeswap Router",
				},
			]; // bscTestnet
		case 43114:
			return []; // avalanche
		case 168587773:
			return []; // blastSepolia
		case 1337:
			return [
				{
					value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
					label: "Uniswap V2 Router",
				},
				{
					value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
					label: "Sushiswap Router",
				},
				{
					value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
					label: "Pancakeswap Router",
				},
			];
		default:
			return [];
	}
};

export const getRouterAddress = (chainId: number) => {
	switch (chainId) {
		case 1:
			return getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"); //mainnet
		case 42161:
			return undefined; // arbitrum
		case 10:
			return undefined; // optimism
		case 137:
			return undefined; // polygon
		case 8453:
			return getAddress("0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24"); // base
		case 56:
			return getAddress("0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24"); // bsc
		case 43113:
			return undefined; // avalancheFuji
		case 81457:
			return undefined; // blast
		case 17000:
			return getAddress("0xe75850fc641b0930a3b6e6dbf1d0926ee9898645"); // holeskey
		case 421614:
			return undefined; // arbitrumSepolia
		case 11155420:
			return undefined; // optimismSepolia
		case 80002:
			return getAddress("0x51f0dbdfc17bdf9c2a7b68937c1b9925a35232c3"); // polygonAmoy
		case 84532:
			return getAddress("0x1689E7B1F10000AE47eBfE339a4f69dECd19F602"); // baseSepolia
		case 97:
			return getAddress("0xD99D1c33F9fC3444f8101754aBC46c52416550D1"); // bscTestnet
		case 43114:
			return undefined; // avalanche
		case 168587773:
			return undefined; // blastSepolia
		case 1337:
			return getAddress("0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D");
		default:
			return undefined;
	}
};

export const getBaseCoin = (chainId: number) => {
	switch (chainId) {
		case 1:
			return getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"); //mainnet
		case 42161:
			return undefined; // arbitrum
		case 10:
			return undefined; // optimism
		case 137:
			return undefined; // polygon
		case 8453:
			return getAddress("0x4200000000000000000000000000000000000006"); // base
		case 56:
			return getAddress("0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"); // bsc
		case 43113:
			return undefined; // avalancheFuji
		case 81457:
			return undefined; // blast
		case 17000:
			return getAddress("0x94373a4919b3240d86ea41593d5eba789fef3848"); // holeskey
		case 421614:
			return undefined; // arbitrumSepolia
		case 11155420:
			return undefined; // optimismSepolia
		case 80002:
			return getAddress("0xdcac497cde43919298ac2a7dd25e4c6e55a9fa0c"); // polygonAmoy
		case 84532:
			return getAddress("0x4200000000000000000000000000000000000006"); // baseSepolia
		case 97:
			return getAddress("0xae13d989dac2f0debff460ac112a837c89baa7cd"); // bscTestnet
		case 43114:
			return undefined; // avalanche
		case 168587773:
			return undefined; // blastSepolia
		case 1337:
			return getAddress("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2");
		default:
			return undefined;
	}
};

export const getUSDC = (chainId: number) => {
	switch (chainId) {
		case 1:
			return getAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"); //mainnet
		case 42161:
			return undefined; // arbitrum
		case 10:
			return undefined; // optimism
		case 137:
			return undefined; // polygon
		case 8453:
			return getAddress("0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"); // base
		case 56:
			return getAddress("0x55d398326f99059ff775485246999027b3197955"); // bsc
		case 43113:
			return undefined; // avalancheFuji
		case 81457:
			return undefined; // blast
		case 17000:
			return getAddress("0xc76d5911607fa20f742202a806944d9e1c198725"); // holeskey
		case 421614:
			return undefined; // arbitrumSepolia
		case 11155420:
			return undefined; // optimismSepolia
		case 80002:
			return "0xf95f74ad5b4249e25e6be64787872c88bc28d531"; // polygonAmoy
		case 84532:
			return getAddress("0x036cbd53842c5426634e7929541ec2318f3dcf7e"); // baseSepolia
		case 97:
			return getAddress("0x78867bbeef44f2326bf8ddd1941a4439382ef2a7"); // bscTestnet
		case 43114:
			return undefined; // avalanche
		case 168587773:
			return undefined; // blastSepolia
		case 1337:
			return getAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48");
		default:
			return undefined;
	}
};

export const getEtherscan = (chainId: number) => {
	switch (chainId) {
		case 1:
			return "https://etherscan.io/token/"; //mainnet
		case 42161:
			return undefined; // arbitrum
		case 10:
			return undefined; // optimism
		case 137:
			return undefined; // polygon
		case 8453:
			return "https://basescan.org/token/"; // base
		case 56:
			return "https://bscscan.com/token/"; // bsc
		case 43113:
			return undefined; // avalancheFuji
		case 81457:
			return undefined; // blast
		case 17000:
			return "https://holesky.etherscan.io/token/"; // holeskey
		case 421614:
			return undefined; // arbitrumSepolia
		case 11155420:
			return undefined; // optimismSepolia
		case 80002:
			return "https://amoy.polygonscan.com/token/"; // polygonAmoy
		case 84532:
			return "https://sepolia.basescan.org/token/"; // baseSepolia
		case 97:
			return "https://testnet.bscscan.com/token/"; // bscTestnet
		case 43114:
			return undefined; // avalanche
		case 168587773:
			return undefined; // blastSepolia
		case 1337:
			return "https://etherscan.io/token/";
		default:
			return "https://etherscan.io/token/";
	}
};

export const getSymbol = (chainId: number) => {
	switch (chainId) {
		case 1:
			return "ETH"; //mainnet
		case 42161:
			return undefined; // arbitrum
		case 10:
			return undefined; // optimism
		case 137:
			return undefined; // polygon
		case 8453:
			return "ETH"; // base
		case 56:
			return "BNB"; // bsc
		case 43113:
			return undefined; // avalancheFuji
		case 81457:
			return undefined; // blast
		case 17000:
			return "ETH"; // holeskey
		case 421614:
			return undefined; // arbitrumSepolia
		case 11155420:
			return undefined; // optimismSepolia
		case 80002:
			return "MATIC"; // polygonAmoy
		case 84532:
			return "ETH"; // baseSepolia
		case 97:
			return "BNB"; // bscTestnet
		case 43114:
			return "AVAX"; // avalanche
		case 168587773:
			return undefined; // blastSepolia
		case 1337:
			return "ETH";
		default:
			return "ETH";
	}
};
