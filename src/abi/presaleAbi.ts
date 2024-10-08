export const presaleAbi = [
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
		name: "BurntTokens",
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
		name: "FeesSent",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "user",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "FundsClaimed",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "token",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "LiquiditySent",
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
				internalType: "uint256",
				name: "status",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "finishTs",
				type: "uint256",
			},
		],
		name: "PresaleEnded",
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
						internalType: "uint256",
						name: "softcap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "hardcap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "startTs",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "finishTs",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "duration",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "liqPercent",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "cliffPeriod",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "vestingPeriod",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "status",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "sold",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxEth",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxBag",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "fee",
						type: "uint256",
					},
				],
				indexed: false,
				internalType: "struct IPresale.PresaleParams",
				name: "presaleparams",
				type: "tuple",
			},
		],
		name: "PresaleSetup",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "user",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "PurchaseClaimed",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "user",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "PurchaseRefunded",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "user",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "TokensBought",
		type: "event",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_amount",
				type: "uint256",
			},
		],
		name: "buyTokens",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [],
		name: "claimEth",
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
		inputs: [],
		name: "finishPresale",
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
		name: "getClaimableTokens",
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
		name: "getPresaleDetails",
		outputs: [
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
						internalType: "uint256",
						name: "softcap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "hardcap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "startTs",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "finishTs",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "duration",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "liqPercent",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "cliffPeriod",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "vestingPeriod",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "status",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "sold",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxEth",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxBag",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "fee",
						type: "uint256",
					},
				],
				internalType: "struct IPresale.PresaleParams",
				name: "",
				type: "tuple",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getRefund",
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
		name: "refundPresale",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_address",
				type: "address",
			},
		],
		name: "rescueERC20",
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
						name: "token",
						type: "address",
					},
					{
						internalType: "uint256",
						name: "softcap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "hardcap",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "startTs",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "finishTs",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "duration",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "liqPercent",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "cliffPeriod",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "vestingPeriod",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "status",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "sold",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxEth",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "maxBag",
						type: "uint256",
					},
					{
						internalType: "uint256",
						name: "fee",
						type: "uint256",
					},
				],
				internalType: "struct IPresale.PresaleParams",
				name: "params",
				type: "tuple",
			},
		],
		name: "setupPresale",
		outputs: [],
		stateMutability: "nonpayable",
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
