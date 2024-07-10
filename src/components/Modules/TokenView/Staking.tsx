import { useContractWrite, useWalletClient, useBalance, useAccount, useContractRead } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, SetStateAction, Dispatch, useEffect } from "react";
import { parseEther } from "viem";

import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

// token & staking abis
import tokenAbi from "../../../../newtokenabi.json";
import stakingabi from "../../../../stakingabi.json";
import { getNumber } from "@/utils/math";

interface StakingForm {
	amount: number;
}

interface User {
	claimable: bigint;
	stakedAmount: bigint;
	timeToWithdraw: bigint;
	totalRewards: bigint;
	unstakedAmount: bigint;
	withdrawable: bigint;
}

const Staking = ({
	symbol,
	contractAddress,
	stakingAddress,
	setSuccess,
}: {
	symbol: string;
	contractAddress: `0x${string}`;
	stakingAddress: `0x${string}`;
	setSuccess: Dispatch<SetStateAction<string>>;
}) => {
	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();

	const [allowance, setAllowance] = useState(BigInt("0"));
	const [error, setError] = useState("");
	const [balance, setBalance] = useState("");
	const [user, setUser] = useState<User>();

	const clear = () => {
		setError("");
	};

	const { data } = useBalance({
		address: address,
		token: contractAddress,
	});

	// get user details
	const { refetch } = useContractRead({
		address: stakingAddress,
		abi: stakingabi.abi,
		functionName: "getUserDetails",
		args: [address],
		onSuccess(data: User) {
			if (data) {
				setUser(data);
			}
		},
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

	// contract call to stake tokens.
	const { isLoading: staking, writeContract: stake } = useContractWrite({
		address: stakingAddress,
		abi: stakingabi.abi,
		functionName: "stake",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
			setSuccess("Staking successfull!");
			setValue("amount", 0);
			refetch();
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});

	// contract call to unstake tokens.
	const { isLoading: unstaking, writeContract: unstake } = useContractWrite({
		address: stakingAddress,
		abi: stakingabi.abi,
		functionName: "unstake",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
			setSuccess("Unstaking successfull!");
			setValue("amount", 0);
			refetch();
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});

	// contract call to withdraw unstaked tokens.
	const { isLoading: withdrawing, writeContract: withdraw } = useContractWrite({
		address: stakingAddress,
		abi: stakingabi.abi,
		functionName: "withdraw",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
			setSuccess("Withdraw successfull!");
			refetch();
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});

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
		getValues,
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

	const handleUnstake = () => {
		const amount = parseEther(getValues("amount").toString());
		unstake({
			args: [amount],
		});
	};

	const handleWithdraw = () => {
		withdraw();
	};

	return (
		<>
			{staking && <Loading msg="Staking..." />}
			{unstaking && <Loading msg="Unstaking..." />}
			{withdrawing && <Loading msg="Withdrawing..." />}
			{error && (
				<Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} callback={clear} />
			)}
			<div className="stake-container mt-12">
				<div className="flex justify-between mb-2 items-center relative">
					<h2 className="text-2xl">Stake</h2>
					<span className="text-sm font-medium text-gray-400">
						Balance: {Number(balance).toFixed(2)} {symbol}
					</span>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="mb-4">
					<div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900">
						<div className="flex justify-between mb-2">
							<span className="text-sm font-medium text-gray-400">
								<b className="font-bold text-gray-500">Staked:</b>{" "}
								{user?.stakedAmount ? getNumber(user?.stakedAmount) : "0"}
							</span>
							<span className="text-sm font-medium text-gray-400">
								<b className="font-bold text-gray-500">Unstaked:</b>{" "}
								{user?.stakedAmount ? getNumber(user?.unstakedAmount) : "0"}
							</span>
						</div>
						<div className="w-full flex">
							<input
								type="text"
								id="amount"
								placeholder="0"
								{...register("amount", {
									required: true,
									pattern: /^[0-9.]+$/i,
									min: 0.0001,
								})}
								className="block w-full rounded-xl pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-3xl"
							/>
							<span className="block sm:text-3xl leading-6 text-gray-400 pt-1.5">{symbol}</span>
						</div>
					</div>
					<div className="flex justify-between flex-wrap">
						<div className="flex justify-center flex-col mt-2 mr-2 grow">
							<input className="safu-button-primary cursor-pointer" type="submit" value="Stake" />
						</div>
						{user?.stakedAmount !== BigInt(0) && (
							<div className="flex justify-center flex-col mt-2 ml-2 grow">
								<input
									className="safu-button-primary cursor-pointer"
									type="button"
									value="Unstake"
									onClick={() => {
										handleUnstake();
									}}
								/>
							</div>
						)}
					</div>
				</form>
				{user?.withdrawable !== BigInt(0) && (
					<div className="flex justify-between items-center mb-2">
						<span className="text-base font-medium text-gray-400">
							<b className="font-normal text-gray-500">Withdrawable:</b>{" "}
							{user?.withdrawable ? getNumber(user?.withdrawable) : "0"}
						</span>
						<div className="flex justify-center flex-col mt-2">
							<input
								className="safu-button-primary cursor-pointer"
								type="button"
								value="Withdraw"
								onClick={() => {
									handleWithdraw();
								}}
							/>
						</div>
					</div>
				)}
				{user?.claimable !== BigInt(0) && (
					<div className="flex justify-between items-center">
						<span className="text-base font-medium text-gray-400">
							<b className="font-normal text-gray-500">Reward:</b> {user?.claimable ? getNumber(user?.claimable) : "0"}
						</span>
						<div className="flex justify-center flex-col mt-2">
							<input className="safu-button-primary cursor-pointer" type="button" value="Claim" />
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Staking;
