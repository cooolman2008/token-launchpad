import { useWriteContract, useWalletClient } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { parseEther } from "viem";
import { useEffect, useState } from "react";

import TextField from "@/components/elements/TextField";
import InformationTip from "@/components/elements/InformationTip";
import { helperAbi } from "@/abi/helperAbi";
import Modal from "@/components/elements/Modal";

interface PromoteForm {
	cost: number;
	times: bigint;
}

const Promote = ({
	contractAddress,
	safuAddress,
	promoCost,
}: {
	contractAddress: `0x${string}`;
	safuAddress: `0x${string}`;
	promoCost: number;
}) => {
	const { data: walletClient } = useWalletClient();
	const [price, setPrice] = useState(0);
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");

	const clear = () => {
		setError("");
	};

	// contract call to promote the token.
	const { writeContract: promote } = useWriteContract({
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
		if (promoCost) {
			setValue("cost", promoCost);
		}
	}, [promoCost, setValue]);

	return (
		<>
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
									setPrice(Number((Number(getValues("times")) * promoCost).toFixed(4)));
								}}
								error={errors.times}
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
		</>
	);
};

export default Promote;
