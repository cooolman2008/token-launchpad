import { useContractWrite, useWalletClient, useBalance, useAccount, useContractRead } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, SetStateAction, Dispatch, useEffect } from "react";
import { parseEther } from "viem";

import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

// token & staking abis
import tokenAbi from "../../../../newtokenabi.json";
import stakingabi from "../../../../stakingabi.json";

interface StakingForm {
	amount: number;
}

const Staking = ({
	symbol,
	contractAddress,
	stakingAddress,
	callback,
	setSuccess,
}: {
	symbol: string;
	contractAddress: `0x${string}`;
	stakingAddress: `0x${string}`;
	callback: Dispatch<SetStateAction<boolean>>;
	setSuccess: Dispatch<SetStateAction<string>>;
}) => {
	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();

	const [allowance, setAllowance] = useState(BigInt("0"));
	const [error, setError] = useState("");
	const [balance, setBalance] = useState("");

	const { data } = useBalance({
		address: address,
		token: contractAddress,
	});

	// get the allowance of the user
	useContractRead({
		address: contractAddress,
		abi: tokenAbi.abi,
		functionName: "allowance",
		args: [address, stakingAddress],
		onSuccess(data) {
			if (data && typeof data === "bigint") {
				setAllowance(data);
			}
		},
	});

	// contract call to start trading of the launched token.
	const { isLoading, write: stake } = useContractWrite({
		address: stakingAddress,
		abi: stakingabi.abi,
		functionName: "stake",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});

	// contract call to get user details.
	// const { isLoading: userLoading, data: result } = useContractRead({
	// 	address: stakingAddress,
	// 	abi: stakingabi.abi,
	// 	functionName: "getUserDetails",
	// 	args: [address],
	// 	account: walletClient?.account,
	// 	onSuccess(res) {
	// 		console.log(res);
	// 	},
	// 	onError(error) {
	// 		console.log(error);
	// 	},
	// });

	const { writeAsync: approve } = useContractWrite({
		address: contractAddress,
		abi: tokenAbi.abi,
		functionName: "approve",
		onSuccess(res) {
			console.log(res);
		},
		onError(error) {
			console.log(error);
		},
	});

	// handle trading form.
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<StakingForm>();
	const onSubmit: SubmitHandler<StakingForm> = (formData) => {
		const amount = parseEther(formData.amount.toString());

		if (allowance >= amount) {
			stake({
				args: [amount],
			});
		} else {
			approve({ args: [stakingAddress, amount] }).then(() => {
				stake({
					args: [amount],
				});
			});
		}
	};

	useEffect(() => {
		if (data?.formatted) {
			setBalance(data?.formatted);
		}
	}, [data]);

	return (
		<>
			{isLoading && <Loading msg="Staking..." />}
			{error && <Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} />}
			<div className="stake-container mt-12">
				<div className="flex justify-between mb-2 items-center relative">
					<h2 className="text-2xl">Stake</h2>
					<span className="text-xs font-medium text-gray-400">
						Balance: {Number(balance).toFixed(2)} {symbol}
					</span>
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900">
						<div className="flex justify-between mb-2">
							<span className="text-xs font-medium text-gray-400">
								<b className="font-bold text-gray-500">Staked:</b> {Number(balance).toFixed(2)}
							</span>
							<span className="text-xs font-medium text-gray-400">
								<b className="font-bold text-gray-500">Unstaked:</b> {Number(balance).toFixed(2)}
							</span>
						</div>
						<div className="w-full flex">
							<input
								type="text"
								id="amount"
								placeholder="0"
								{...register("amount", {
									required: true,
									min: 0.0001,
								})}
								className="block w-full rounded-xl pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-3xl"
							/>
							<span className="block sm:text-3xl leading-6 text-gray-400 pt-1.5">{symbol}</span>
						</div>
					</div>
					<div className="flex justify-between flex-wrap">
						<div className="flex justify-center flex-col mt-2">
							<input className="safu-button-primary cursor-pointer" type="submit" value="Stake" />
						</div>
						<div className="flex justify-center flex-col mt-2">
							<input className="safu-button-primary cursor-pointer" type="button" value="Unstake" />
						</div>
						<div className="flex justify-center flex-col mt-2">
							<input className="safu-button-primary cursor-pointer" type="button" value="Withdraw" />
						</div>
					</div>
					<div className="flex justify-center flex-col mt-2">
						<input className="safu-button-primary cursor-pointer" type="button" value="Claim 12000 WBTC" />
					</div>
				</form>
			</div>
		</>
	);
};

export default Staking;
