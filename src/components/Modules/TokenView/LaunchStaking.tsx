import { useWriteContract, useWalletClient } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, SetStateAction, Dispatch } from "react";

import TextField from "@/components/elements/TextField";
import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import { ownerAbi } from "@/abi/ownerAbi";

interface StakingForm {
	share: number;
	withdraw: number;
}

const LaunchStaking = ({
	contractAddress,
	callback,
	setSuccess,
}: {
	contractAddress: `0x${string}`;
	callback: Dispatch<SetStateAction<boolean>>;
	setSuccess: Dispatch<SetStateAction<string>>;
}) => {
	const { data: walletClient } = useWalletClient();
	const [error, setError] = useState("");

	const clear = () => {
		setError("");
	};

	// contract call to launch staking.
	const { isPending, writeContract } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				callback(true);
				setSuccess("Staking was launched successfully");
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});

	// handle launch staking form.
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<StakingForm>();
	const onSubmit: SubmitHandler<StakingForm> = (formData) => {
		if (walletClient?.account.address) {
			writeContract({
				address: contractAddress,
				abi: ownerAbi,
				functionName: "launchStaking",
				account: walletClient?.account,
				args: [
					BigInt(formData.share),
					{ owner: walletClient?.account.address, withdrawTimeout: BigInt(formData.withdraw * 86400) },
				],
			});
		}
	};
	return (
		<>
			{isPending && <Loading msg="Launching staking..." />}
			{error && (
				<Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} callback={clear} />
			)}
			<div className="w-full py-8 border-b border-gray-700">
				<h2 className="text-xl mb-1">Launch Staking</h2>
				<p className="text-sm text-gray-500 mb-4">Launch staking for your token.</p>
				<div className="w-full pb-4 rounded-xl">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="w-full flex justify-between flex-wrap">
							<TextField
								label="Share"
								id="share"
								defaultValue="10"
								placeholder="0"
								{...register("share", {
									required: { value: true, message: "Share can't be empty" },
									pattern: { value: /^[0-9.]+$/i, message: "Share should be a number" },
									min: { value: 0, message: "Share can't be negative" },
									max: { value: 20, message: "Share should be below 20%" },
								})}
								isPercent={true}
								error={errors.share}
								width="w-24"
								labelWidth="grow lg:grow-0"
								containerWidth="w-full md:w-auto"
								margin="mb-4 md:mb-0"
							/>
							<TextField
								label="Timeout"
								id="days"
								{...register("withdraw", {
									required: { value: true, message: "Timeout can't be empty" },
									pattern: { value: /^[0-9]+$/i, message: "Timeout should be a number" },
									min: { value: 2, message: "Timeout should be minimum 2 days" },
									max: { value: 10, message: "Timeout should be below 10 days" },
								})}
								defaultValue={2}
								placeholder="10"
								error={errors.withdraw}
								width="w-20"
								labelWidth="grow lg:grow-0"
								containerWidth="w-full md:w-auto"
								margin="mb-4 md:mb-0"
							/>
							<div className="w-full md:w-auto flex justify-center flex-col">
								<input type="submit" value="Launch Staking" className="safu-button-secondary cursor-pointer" />
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default LaunchStaking;
