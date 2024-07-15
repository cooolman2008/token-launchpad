import { useWriteContract, useWalletClient, useReadContract } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { parseEther, formatEther } from "viem";
import { useEffect, useState } from "react";

import TextField from "@/components/elements/TextField";
import InformationTip from "@/components/elements/InformationTip";
import { helperAbi } from "@/abi/helperAbi";

interface PromoteForm {
	cost: number;
	times: bigint;
}

const Promote = ({ contractAddress, safuAddress }: { contractAddress: `0x${string}`; safuAddress: `0x${string}` }) => {
	const { data: walletClient } = useWalletClient();
	const [promoCost, setPromoCost] = useState(0);
	const [price, setPrice] = useState(0);

	// get LP details.
	const { data: launcherData, refetch } = useReadContract({
		address: safuAddress,
		abi: helperAbi,
		functionName: "getLauncherDetails",
	});

	// contract call to promote the token.
	const { writeContract: promote } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
			},
			onError(error) {
				console.log(error);
			},
		},
	});

	// handle form & launch promote token utility with number of times to promote
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<PromoteForm>();
	const onSubmit: SubmitHandler<PromoteForm> = (formData) => {
		if (promoCost && safuAddress) {
			promote({
				address: safuAddress,
				abi: helperAbi,
				functionName: "promoteToken",
				account: walletClient?.account,
				args: [contractAddress, formData.times],
				value: parseEther(promoCost.toString()) * BigInt(formData.times),
			});
		}
	};

	useEffect(() => {
		if (launcherData) {
			setPromoCost(Number(formatEther(launcherData.promoCostEth)));
			setValue("cost", Number(formatEther(launcherData.promoCostEth)));
		}
	}, [launcherData, setValue]);

	return (
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
							isError={errors.cost ? true : false}
							error="Minimum 30 days required"
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
								required: true,
								pattern: /^[0-9]+$/i,
								min: 1,
							})}
							onKeyUp={() => {
								setPrice(Number((Number(getValues("times")) * promoCost).toFixed(4)));
							}}
							isError={errors.times ? true : false}
							error="Minimum 30 days required"
							width="w-20"
							labelWidth="grow lg:grow-0"
							containerWidth="w-full md:w-auto"
							margin="mb-4 md:mb-0"
						/>
						<div className="w-full md:w-auto flex justify-center flex-col">
							<input
								type="submit"
								value={"Promote for " + price + " ETH"}
								className="safu-button-secondary cursor-pointer"
							/>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default Promote;