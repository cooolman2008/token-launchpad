import { useWriteContract, useWalletClient, useReadContract } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { formatEther, parseEther } from "viem";
import { useEffect, useState } from "react";

import TextField from "@/components/elements/TextField";
import InformationTip from "@/components/elements/InformationTip";
import { helperAbi } from "@/abi/helperAbi";
import Modal from "@/components/elements/Modal";
import { tokenAbi } from "@/abi/tokenAbi";
import { LauncherData } from "@/components/Pages/TokenView";
import Loading from "@/components/elements/Loading";

interface PromoteForm {
	cost: number;
	times: bigint;
}

const Promote = ({
	contractAddress,
	safuAddress,
	address,
	launcher,
}: {
	contractAddress: `0x${string}`;
	safuAddress: `0x${string}`;
	address: `0x${string}`;
	launcher: LauncherData;
}) => {
	const { data: walletClient } = useWalletClient();
	const [price, setPrice] = useState(0);
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");
	const [promoEth, setPromoEth] = useState(0);
	const [allowance, setAllowance] = useState(BigInt("0"));

	const clear = () => {
		setError("");
	};

	// contract call to promote the token.
	const { isPending: promoting, writeContract: promote } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				setSuccess("Hurray! Your promotions will begin shortly!");
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});

	// get the allowance of the user
	// const { data: allowanceData, refetch: check } = useReadContract({
	// 	address: launcher.bridge,
	// 	abi: tokenAbi,
	// 	functionName: "allowance",
	// 	args: [address, safuAddress],
	// });

	// useEffect(() => {
	// 	console.log(allowanceData);
	// 	if (allowanceData) {
	// 		setAllowance(allowanceData);
	// 	}
	// }, [allowanceData]);

	// const { isPending: approving, writeContractAsync: approve } = useWriteContract({
	// 	mutation: {
	// 		onSuccess(res) {
	// 			console.log(res);
	// 		},
	// 		onError(error) {
	// 			setError("Something went wrong!");
	// 			console.log(error);
	// 		},
	// 	},
	// });

	// contract call to promote the token.
	// const { writeContract: set } = useWriteContract({
	// 	mutation: {
	// 		onSuccess(res) {
	// 			console.log(res);
	// 			setSuccess("Hurray! Your bridge is set!");
	// 		},
	// 		onError(error) {
	// 			console.log(error);
	// 			setError("Something went wrong!");
	// 		},
	// 	},
	// });

	// handle form & launch promote token utility with number of times to promote
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<PromoteForm>();
	const onSubmit: SubmitHandler<PromoteForm> = (formData) => {
		if (promoEth && safuAddress) {
			// approve({
			// 	address: launcher.bridge,
			// 	abi: tokenAbi,
			// 	functionName: "approve",
			// 	args: [safuAddress, launcher.promoCostSafu * BigInt(formData.times)],
			// });
			// promote({
			// 	address: safuAddress,
			// 	abi: helperAbi,
			// 	functionName: "promoteToken",
			// 	account: walletClient?.account,
			// 	args: [contractAddress, formData.times],
			// 	value: parseEther(promoEth.toString()) * BigInt(formData.times),
			// });
		}

		// set({
		// 	address: safuAddress,
		// 	abi: helperAbi,
		// 	functionName: "setBridge",
		// 	account: walletClient?.account,
		// 	args: ["0x12f33700ebedf1f05d2cb12781b915a684dbbb1f"],
		// });
		// if (promoEth && safuAddress) {
		// 	if (allowance >= launcher.promoCostSafu * BigInt(formData.times)) {
		// 		promote({
		// 			address: safuAddress,
		// 			abi: helperAbi,
		// 			functionName: "promoteTokenBridge",
		// 			account: walletClient?.account,
		// 			args: [contractAddress, formData.times],
		// 			// value: parseEther(promoCost.toString()) * BigInt(formData.times),
		// 		});
		// 	} else {
		// 		console.log(launcher.promoCostSafu * BigInt(formData.times));
		// 		console.log("approve");
		// 		approve({
		// 			address: launcher.bridge,
		// 			abi: tokenAbi,
		// 			functionName: "approve",
		// 			args: [safuAddress, launcher.promoCostSafu * BigInt(formData.times)],
		// 		}).then(() => {
		// 			promote({
		// 				address: safuAddress,
		// 				abi: helperAbi,
		// 				functionName: "promoteTokenBridge",
		// 				account: walletClient?.account,
		// 				args: [contractAddress, formData.times],
		// 				// value: parseEther(promoCost.toString()) * BigInt(formData.times),
		// 			});
		// 		});
		// 	}
		// }
	};

	useEffect(() => {
		if (launcher.promoCostEth) {
			setValue("cost", Number(formatEther(launcher.promoCostEth)));
			setPromoEth(Number(formatEther(launcher.promoCostEth)));
		}
	}, [launcher.promoCostEth, setValue]);

	return (
		<>
			{promoting && <Loading msg="Promoting your token..." />}
			{success && <Modal msg={success} />}
			{error && (
				<Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} callback={clear} />
			)}
			<div className="w-full py-8 border-b border-gray-700">
				<div className="flex mb-1">
					<h2 className="text-xl">Promote this token</h2>
					<InformationTip msg="The token will be highlighted on our channels for the selected frequency" />
				</div>
				<p className="text-sm text-gray-500 mb-4">Enter the frequency for displaying the ad to know the total cost.</p>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="w-full pb-4 rounded-xl mb-2">
						<div className="w-full flex flex-wrap justify-between">
							<TextField
								label="Cost (ETH)"
								id="cost"
								placeholder="30"
								{...register("cost", {
									valueAsNumber: true,
									disabled: true,
								})}
								width="w-20"
								labelWidth="grow lg:grow-0"
								containerWidth="w-full md:w-auto"
								margin="mb-4 md:mb-0"
							/>
							<TextField
								label="Times"
								id="times"
								placeholder="0"
								{...register("times", {
									required: { value: true, message: "Count can't be empty" },
									pattern: { value: /^[0-9]+$/i, message: "Count should be a number" },
									min: { value: 1, message: "Count shoud be minimum 1 time" },
								})}
								onKeyUp={() => {
									setPrice(Number((Number(getValues("times")) * promoEth).toFixed(4)));
								}}
								error={errors.times}
								width="w-20"
								labelWidth="grow lg:grow-0"
								containerWidth="w-full md:w-auto"
								margin="mb-4 md:mb-0"
							/>
							<div className="w-full md:w-auto flex justify-center flex-col">
								{/* <button className="safu-button-secondary disabled-button">Promote for {price} ETH</button> */}
								<input
									type="submit"
									value={"Promote for " + price + " ETH"}
									className="safu-button-secondary cursor-pointer disabled-button"
								/>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
};

export default Promote;
