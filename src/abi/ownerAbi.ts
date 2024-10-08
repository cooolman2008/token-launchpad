export const ownerAbi = [
	{
		anonymous: false,
		inputs: [],
		name: "LockRetrieved",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "ldays",
				type: "uint256",
			},
		],
		name: "LockUpdated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [],
		name: "LpBurnt",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "string",
				name: "telegram",
				type: "string",
			},
			{
				indexed: false,
				internalType: "string",
				name: "twitter",
				type: "string",
			},
			{
				indexed: false,
				internalType: "string",
				name: "website",
				type: "string",
			},
		],
		name: "SocialsSet",
		type: "event",
	},
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
						internalType: "uint256",
						name: "withdrawTimeout",
						type: "uint256",
					},
				],
				indexed: false,
				internalType: "struct IStaking.StakingParams",
				name: "params",
				type: "tuple",
			},
		],
		name: "StakingArgs",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "stakingPool",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "owner",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "share",
				type: "uint256",
			},
		],
		name: "StakingLaunched",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "share",
				type: "uint256",
			},
		],
		name: "StakingShareIncreased",
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
		name: "TaxGiven",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256",
			},
		],
		name: "TokensClaimed",
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
		inputs: [],
		name: "burnLP",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "claimTokens",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "ldays",
				type: "uint256",
			},
		],
		name: "extendLock",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address",
			},
		],
		name: "getClaimAmount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getLPDetails",
		outputs: [
			{
				components: [
					{
						internalType: "address",
						name: "pair",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "buycount",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "taxBuy",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "taxSell",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "lockDays",
						type: "uint256",
					},
					{
						internalType: "bool",
						name: "isBurnt",
						type: "bool",
					},
					{
						internalType: "uint256",
						name: "tradingOpened",
						type: "uint256",
					},
					{
						internalType: "bool",
						name: "walletLimited",
						type: "bool",
					},
					{
						internalType: "address",
						name: "stakingContract",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "stakingShare",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxTx",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxWallet",
						type: "uint256",
					},
					{
						internalType: "address",
						name: "router",
						type: "address",
					},
					{
						internalType: "address",
						name: "presale",
						type: "address",
					},
				],
				internalType: "struct IOwnership.LPDetails",
				name: "",
				type: "tuple",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "share",
				type: "uint256",
			},
		],
		name: "increaseStakingShare",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "stakingShare",
				type: "uint256",
			},
			{
				components: [
					{
						internalType: "address",
						name: "owner",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "withdrawTimeout",
						type: "uint256",
					},
				],
				internalType: "struct IStaking.StakingParams",
				name: "params",
				type: "tuple",
			},
		],
		name: "launchStaking",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "owner_",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "retrieveLock",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "telegram",
				type: "string",
			},
			{
				internalType: "string",
				name: "twitter",
				type: "string",
			},
			{
				internalType: "string",
				name: "website",
				type: "string",
			},
		],
		name: "setSocials",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_newOwner",
				type: "address",
			},
		],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
] as const;
