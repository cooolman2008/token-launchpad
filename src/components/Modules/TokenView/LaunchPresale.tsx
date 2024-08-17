import { useWriteContract, useWalletClient, useChainId } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, SetStateAction, Dispatch, useEffect } from "react";
import { parseEther } from "viem";

import TextField from "@/components/elements/TextField";
import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import { getContractAddress } from "@/utils/utils";
import { tokenAbi } from "@/abi/tokenAbi";
import { helperAbi } from "@/abi/helperAbi";

interface PresaleForm {
	percent: number;
	liqPercent: number;
	duration: number;
	cliffPeriod: number;
	vestingPeriod: number;
	maxEth: number;
	maxBag: number;
	softcap: number;
}

const LaunchPresale = ({
	contractAddress,
	presaleAddress,
	setSuccess,
	totalSupply,
}: {
	contractAddress: `0x${string}`;
	presaleAddress?: `0x${string}`;
	setSuccess: Dispatch<SetStateAction<string>>;
	totalSupply: number;
}) => {
	const { data: walletClient } = useWalletClient();
	const [error, setError] = useState("");

	const chainId = useChainId();
	const CONTRACT_ADDRESS = getContractAddress(chainId);

	const clear = () => {
		setError("");
	};

	// contract call to launch presale contract.
	const { isPending: launching, writeContract: launch } = useWriteContract({
		mutation: {
			onSuccess: (res) => {
				console.log(res);
				setTimeout(() => {
					setSuccess("Presale contract was launched successfully");
				}, 1000);
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});

	// contract call to setup & start presale.
	const { isPending: setting, writeContract: setup } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				setTimeout(() => {
					setSuccess("Presale setup was successful");
				}, 1000);
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});

	// handle presale setup form.
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<PresaleForm>();
	const onSubmit: SubmitHandler<PresaleForm> = (formData) => {
		if (presaleAddress && walletClient?.account.address) {
			setup({
				address: contractAddress,
				abi: tokenAbi,
				functionName: "addPresale",
				account: walletClient?.account,
				args: [
					presaleAddress,
					BigInt(formData.percent * 100),
					{
						owner: walletClient?.account.address,
						token: contractAddress,
						softcap: parseEther("1"),
						hardcap: parseEther("2"),
						startTs: BigInt(1718276705),
						finishTs: BigInt(1718276705),
						duration: BigInt(formData.duration),
						liqPercent: BigInt(formData.liqPercent),
						cliffPeriod: BigInt(formData.cliffPeriod),
						vestingPeriod: BigInt(formData.vestingPeriod),
						status: parseEther("0.01"),
						sold: parseEther("0.01"),
						maxEth: parseEther(formData.maxEth.toString()),
						maxBag: parseEther(formData.maxBag.toString()), // supply * percent /10
						fee: parseEther("0.01"),
					},
				],
			});
		}
	};

	useEffect(() => {
		setValue("maxBag", totalSupply * 0.01);
	}, [setValue, totalSupply]);
	return (
		<>
			{launching && <Loading msg="Launching a presale contract..." />}
			{setting && <Loading msg="Setting & starting your presales..." />}
			{error && (
				<Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} callback={clear} />
			)}
			<div className="w-full py-8 border-b border-gray-700">
				{presaleAddress !== "0x0000000000000000000000000000000000000000" ? (
					<>
						<div className="flex justify-between items-center">
							<h2 className="text-xl mb-1">Start your Presales</h2>
							{totalSupply > 0 && (
								<span className="text-xl font-medium text-gray-400">
									<b className="font-bold text-gray-500">Supply:</b> {Number(totalSupply)}
								</span>
							)}
						</div>
						<p className="text-sm text-gray-500 mb-4">
							Setup presale for your token.
							<br />
							Softcap will be 25% of your token hardcap.
						</p>
						<div className="w-full pb-4 rounded-xl">
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="w-full flex justify-between flex-wrap">
									<TextField
										label="Liquidity share"
										id="liqPercent"
										defaultValue="80"
										placeholder="0"
										{...register("liqPercent", {
											required: { value: true, message: "Liquidity share can't be empty" },
											pattern: { value: /^[0-9.]+$/i, message: "Liquidity share should be a number" },
											min: { value: 80, message: "Liquidity share should be minimum 80% of presale" },
											max: { value: 100, message: "Liquidity share should be below 100%" },
										})}
										isPercent={true}
										error={errors.liqPercent}
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
									/>
									<TextField
										label="Duration"
										id="duration"
										defaultValue={7}
										placeholder="10"
										{...register("duration", {
											required: { value: true, message: "Duration can't be empty" },
											pattern: { value: /^[0-9]+$/i, message: "Duration should be a number" },
											min: { value: 1, message: "Duration should be minimum 1 day" },
											max: { value: 30, message: "Duration should be below 30 days" },
										})}
										error={errors.duration}
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2 "
										padding="md:pr-0"
									/>
									<TextField
										label="Cliff period"
										id="cliffPeriod"
										placeholder="1"
										defaultValue={1}
										{...register("cliffPeriod", {
											required: { value: true, message: "Cliff period can't be empty" },
											pattern: { value: /^[0-9]+$/i, message: "Cliff period should be a number" },
											min: { value: 1, message: "Cliff period should be minimum 1 day" },
											max: { value: 30, message: "Cliff period should be below 30 days" },
										})}
										error={errors.cliffPeriod}
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
									/>
									<TextField
										label="Vesting period"
										id="vestingPeriod"
										placeholder="7"
										defaultValue={7}
										{...register("vestingPeriod", {
											required: { value: true, message: "Vesting period can't be empty" },
											pattern: { value: /^[0-9]+$/i, message: "Vesting period should be a number" },
											min: { value: 7, message: "Vesting period should be minimum 7 days" },
											max: { value: 30, message: "Vesting period should be below 30 days" },
										})}
										error={errors.vestingPeriod}
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2 "
										padding="md:pr-0"
									/>
									<TextField
										label="ETH hardcap"
										id="maxEth"
										defaultValue="1"
										placeholder="0"
										{...register("maxEth", {
											required: { value: true, message: "ETH hardcap can't be empty" },
											pattern: { value: /^[0-9.]+$/i, message: "ETH hardcap should be a number" },
											min: { value: 0, message: "ETH hardcap can't be negative" },
										})}
										error={errors.maxEth}
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
									/>
									<TextField
										label="Max bag"
										id="maxBag"
										defaultValue="10000"
										placeholder="0"
										{...register("maxBag", {
											required: { value: true, message: "Max bag can't be empty" },
											pattern: { value: /^[0-9.]+$/i, message: "Max bag should be a number" },
											min: { value: 0, message: "Max bag can't be negative" },
											validate: (value) =>
												value <= Number((getValues("percent") / 100) * totalSupply * 0.1) ||
												"Max bag should be below 10% of hardcap",
										})}
										error={errors.maxBag}
										width="w-32"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2 "
										padding="md:pr-0"
									/>
									<TextField
										label="Token hardcap"
										id="percent"
										defaultValue="10"
										placeholder="0"
										{...register("percent", {
											required: { value: true, message: "Token hardcap can't be empty" },
											pattern: { value: /^[0-9.]+$/i, message: "Token hardcap should be a number" },
											min: { value: 1, message: "Token hardcap can't be negative" },
											max: { value: 100, message: "Token hardcap should be below 100%" },
										})}
										isPercent={true}
										isError={errors.percent ? true : false}
										error={errors.percent}
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
										onKeyUp={() => {
											setValue("softcap", getValues("percent") * 0.25);
										}}
									/>
									<TextField
										label="Token softcap"
										id="softcap"
										defaultValue="2.5"
										placeholder="0"
										{...register("softcap", {
											disabled: true,
										})}
										isPercent={true}
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2 "
										padding="md:pr-0"
									/>
								</div>
								<div className="flex flex-col items-end">
									<input type="submit" value="Start Presale" className="safu-button-secondary cursor-pointer" />
								</div>
							</form>
						</div>
					</>
				) : (
					<div className="flex flex-wrap justify-between">
						<div className="">
							<h2 className="text-xl mb-1">Do you want to launch a presale?</h2>
							<p className="text-sm text-gray-500 mb-4">
								You can set up a presale after launching the presale contract for your token.
							</p>
						</div>
						<div className="flex justify-center flex-col max-md:w-full">
							<input
								type="button"
								value="Launch Presale"
								className="safu-button-secondary cursor-pointer"
								onClick={() => {
									if (CONTRACT_ADDRESS) {
										launch({
											address: CONTRACT_ADDRESS,
											abi: helperAbi,
											account: walletClient?.account,
											functionName: "launchPresale",
											args: [contractAddress],
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

export default LaunchPresale;
