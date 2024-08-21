import { useWriteContract, useWalletClient, useBalance, useReadContract, useChainId } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, SetStateAction, Dispatch, useEffect } from "react";
import { formatEther, parseEther } from "viem";

import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import { getNumber } from "@/utils/math";
import { stakingAbi } from "@/abi/stakingAbi";
import { tokenAbi } from "@/abi/tokenAbi";
import { getSymbol } from "@/utils/utils";

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
	address,
	setSuccess,
}: {
	symbol: string;
	contractAddress: `0x${string}`;
	stakingAddress: `0x${string}`;
	address: `0x${string}`;
	setSuccess: Dispatch<SetStateAction<string>>;
}) => {
	const { data: walletClient } = useWalletClient();

	const [allowance, setAllowance] = useState(BigInt("0"));
	const [error, setError] = useState("");
	const [balance, setBalance] = useState("");
	const [user, setUser] = useState<User>();
	// Current chain & wallet address
	const chain = useChainId();

	const clear = () => {
		setError("");
	};

	const { data } = useBalance({
		address: address,
		token: contractAddress,
	});

	// get user details
	const { data: userData, refetch } = useReadContract({
		address: stakingAddress,
		abi: stakingAbi,
		functionName: "getUserDetails",
		args: [address],
	});

	useEffect(() => {
		if (userData) {
			setUser(userData);
		}
	}, [userData]);

	// get the allowance of the user
	const { data: allowanceData, refetch: check } = useReadContract({
		address: contractAddress,
		abi: tokenAbi,
		functionName: "allowance",
		args: [address, stakingAddress],
	});

	useEffect(() => {
		if (allowanceData) {
			setAllowance(allowanceData);
		}
	}, [allowanceData]);

	// contract call to stake tokens.
	const { isPending: staking, writeContract: stake } = useWriteContract({
		mutation: {
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
		},
	});

	// contract call to unstake tokens.
	const { isPending: unstaking, writeContract: unstake } = useWriteContract({
		mutation: {
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
		},
	});

	// contract call to withdraw unstaked tokens.
	const { isPending: withdrawing, writeContract: withdraw } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				setSuccess("Withdraw successfull!");
				refetch();
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});

	// contract call to withdraw unstaked tokens.
	const { isPending: claiming, writeContract: claim } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				setSuccess("Claim successfull!");
				refetch();
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});

	const { writeContractAsync: approve } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
			},
			onError(error) {
				console.log(error);
			},
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

		allowance >= amount
			? stake({
					address: stakingAddress,
					abi: stakingAbi,
					functionName: "stake",
					account: walletClient?.account,
					args: [amount],
			  })
			: approve({
					address: contractAddress,
					abi: tokenAbi,
					functionName: "approve",
					args: [stakingAddress, amount],
			  }).then(() => {
					stake({
						address: stakingAddress,
						abi: stakingAbi,
						functionName: "stake",
						account: walletClient?.account,
						args: [amount],
					});
			  });
	};

	useEffect(() => {
		if (data?.value) {
			setBalance(formatEther(data?.value));
		}
	}, [data]);

	const handleUnstake = () => {
		const amount = parseEther(getValues("amount").toString());
		unstake({
			address: stakingAddress,
			abi: stakingAbi,
			functionName: "unstake",
			account: walletClient?.account,
			args: [amount],
		});
	};

	const handleWithdraw = () => {
		withdraw({
			address: stakingAddress,
			abi: stakingAbi,
			functionName: "withdraw",
			account: walletClient?.account,
		});
	};

	return (
		<>
			{staking && <Loading msg="Staking..." />}
			{unstaking && <Loading msg="Unstaking..." />}
			{withdrawing && <Loading msg="Withdrawing..." />}
			{error && (
				<Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} callback={clear} />
			)}
			<div className="stake-container mb-12">
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
							{getSymbol(chain)}
						</span>
						<div className="flex justify-center flex-col mt-2">
							<input
								className="safu-button-primary cursor-pointer"
								type="button"
								value="Claim"
								onClick={() => {
									if (stakingAddress) {
										claim({
											address: stakingAddress,
											abi: stakingAbi,
											functionName: "claimRewards",
											account: walletClient?.account,
										});
									}
								}}
							/>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default Staking;
