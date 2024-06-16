import { useContractWrite, useWalletClient } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, SetStateAction, Dispatch } from "react";

import TextField from "@/components/elements/TextField";
import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import Ownerabi from "../../../../ownerabi.json";

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
	const { isLoading, write } = useContractWrite({
		address: contractAddress,
		abi: Ownerabi.abi,
		functionName: "launchStaking",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
			callback(true);
			setSuccess("Staking was launched successfully");
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});

	// handle launch staking form.
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<StakingForm>();
	const onSubmit: SubmitHandler<StakingForm> = (formData) => {
		write({
			args: [formData.share, { owner: walletClient?.account.address, withdrawTimeout: formData.withdraw * 86400 }],
		});
	};
	return (
		<>
			{isLoading && <Loading msg="Launching staking..." />}
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
									required: true,
									min: 0,
									max: 20,
								})}
								isPercent={true}
								isError={errors.share ? true : false}
								error="Share can be of maximum 20%"
								width="w-24"
								labelWidth="grow lg:grow-0"
								containerWidth="w-full md:w-auto"
								margin="mb-4 lg:mb-0"
							/>
							<TextField
								label="Timeout"
								id="days"
								{...register("withdraw", {
									required: true,
									min: 2,
									max: 10,
								})}
								defaultValue={2}
								placeholder="10"
								isError={errors.withdraw ? true : false}
								error="Timeout should be within 2-10 days"
								width="w-20"
								labelWidth="grow lg:grow-0"
								containerWidth="w-full md:w-auto"
								margin="mb-4 lg:mb-0"
							/>
							<div className="w-full lg:w-auto flex justify-center flex-col">
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
