export const managerAbi = [
	{
		anonymous: false,
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "facetAddress",
						type: "address",
					},
					{
						internalType: "enum IDiamondCut.FacetCutAction",
						name: "action",
						type: "uint8",
					},
					{
						internalType: "bytes4[]",
						name: "functionSelectors",
						type: "bytes4[]",
					},
				],
				indexed: false,
				internalType: "struct IDiamondCut.FacetCut[]",
				name: "_diamondCut",
				type: "tuple[]",
			},
			{
				components: [
					{
						internalType: "address",
						name: "owner",
						type: "address",
					},
					{
						internalType: "address",
						name: "taxWallet",
						type: "address",
					},
					{
						internalType: "address",
						name: "stakingFacet",
						type: "address",
					},
					{
						internalType: "address",
						name: "v2router",
						type: "address",
					},
					{
						internalType: "bool",
						name: "isFreeTier",
						type: "bool",
					},
					{
						internalType: "uint256",
						name: "minLiq",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "supply",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "initTaxType",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "initInterval",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "countInterval",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxBuyTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "minBuyTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxSellTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "minSellTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "lpTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxWallet",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxTx",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "preventSwap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxSwap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "taxSwapThreshold",
						type: "uint256",
					},
					{
						internalType: "string",
						name: "name",
						type: "string",
					},
					{
						internalType: "string",
						name: "symbol",
						type: "string",
					},
				],
				indexed: false,
				internalType: "struct INewToken.InitParams",
				name: "params",
				type: "tuple",
			},
		],
		name: "LaunchedArgs",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "StakingMade",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "TaxMade",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "owner",
						type: "address",
					},
					{
						internalType: "address",
						name: "token",
						type: "address",
					},
					{
						internalType: "bool",
						name: "isFree",
						type: "bool",
					},
					{
						internalType: "bool",
						name: "isEthPaid",
						type: "bool",
					},
					{
						internalType: "uint256",
						name: "cost",
						type: "uint256",
					},
					{
						internalType: "string",
						name: "name",
						type: "string",
					},
					{
						internalType: "string",
						name: "symbol",
						type: "string",
					},
					{
						internalType: "uint256",
						name: "supply",
						type: "uint256",
					},
					{
						internalType: "address",
						name: "router",
						type: "address",
					},
				],
				indexed: false,
				internalType: "struct ManagerFacet.TokParams",
				name: "params",
				type: "tuple",
			},
		],
		name: "TokenLaunched",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256",
			},
		],
		name: "Transfer",
		type: "event",
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "owner",
						type: "address",
					},
					{
						internalType: "address",
						name: "taxWallet",
						type: "address",
					},
					{
						internalType: "address",
						name: "stakingFacet",
						type: "address",
					},
					{
						internalType: "address",
						name: "v2router",
						type: "address",
					},
					{
						internalType: "bool",
						name: "isFreeTier",
						type: "bool",
					},
					{
						internalType: "uint256",
						name: "minLiq",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "supply",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "initTaxType",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "initInterval",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "countInterval",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxBuyTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "minBuyTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxSellTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "minSellTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "lpTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxWallet",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxTx",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "preventSwap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxSwap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "taxSwapThreshold",
						type: "uint256",
					},
					{
						internalType: "string",
						name: "name",
						type: "string",
					},
					{
						internalType: "string",
						name: "symbol",
						type: "string",
					},
				],
				internalType: "struct INewToken.InitParams",
				name: "params",
				type: "tuple",
			},
		],
		name: "launchTokenBridge",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "owner",
						type: "address",
					},
					{
						internalType: "address",
						name: "taxWallet",
						type: "address",
					},
					{
						internalType: "address",
						name: "stakingFacet",
						type: "address",
					},
					{
						internalType: "address",
						name: "v2router",
						type: "address",
					},
					{
						internalType: "bool",
						name: "isFreeTier",
						type: "bool",
					},
					{
						internalType: "uint256",
						name: "minLiq",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "supply",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "initTaxType",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "initInterval",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "countInterval",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxBuyTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "minBuyTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxSellTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "minSellTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "lpTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxWallet",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxTx",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "preventSwap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxSwap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "taxSwapThreshold",
						type: "uint256",
					},
					{
						internalType: "string",
						name: "name",
						type: "string",
					},
					{
						internalType: "string",
						name: "symbol",
						type: "string",
					},
				],
				internalType: "struct INewToken.InitParams",
				name: "params",
				type: "tuple",
			},
		],
		name: "launchTokenEth",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "owner",
						type: "address",
					},
					{
						internalType: "address",
						name: "taxWallet",
						type: "address",
					},
					{
						internalType: "address",
						name: "stakingFacet",
						type: "address",
					},
					{
						internalType: "address",
						name: "v2router",
						type: "address",
					},
					{
						internalType: "bool",
						name: "isFreeTier",
						type: "bool",
					},
					{
						internalType: "uint256",
						name: "minLiq",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "supply",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "initTaxType",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "initInterval",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "countInterval",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxBuyTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "minBuyTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxSellTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "minSellTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "lpTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxWallet",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxTx",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "preventSwap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxSwap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "taxSwapThreshold",
						type: "uint256",
					},
					{
						internalType: "string",
						name: "name",
						type: "string",
					},
					{
						internalType: "string",
						name: "symbol",
						type: "string",
					},
				],
				internalType: "struct INewToken.InitParams",
				name: "params",
				type: "tuple",
			},
		],
		name: "launchTokenFree",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				components: [
					{
						internalType: "address",
						name: "owner",
						type: "address",
					},
					{
						internalType: "address",
						name: "taxWallet",
						type: "address",
					},
					{
						internalType: "address",
						name: "stakingFacet",
						type: "address",
					},
					{
						internalType: "address",
						name: "v2router",
						type: "address",
					},
					{
						internalType: "bool",
						name: "isFreeTier",
						type: "bool",
					},
					{
						internalType: "uint256",
						name: "minLiq",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "supply",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "initTaxType",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "initInterval",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "countInterval",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxBuyTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "minBuyTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxSellTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "minSellTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "lpTax",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxWallet",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxTx",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "preventSwap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxSwap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "taxSwapThreshold",
						type: "uint256",
					},
					{
						internalType: "string",
						name: "name",
						type: "string",
					},
					{
						internalType: "string",
						name: "symbol",
						type: "string",
					},
				],
				internalType: "struct INewToken.InitParams",
				name: "params",
				type: "tuple",
			},
		],
		name: "launchTokenSafu",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
] as const;
