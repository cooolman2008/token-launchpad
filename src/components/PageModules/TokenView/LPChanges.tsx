import { useContractWrite, useWalletClient } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, SetStateAction, Dispatch } from "react";

import TextField from "@/components/elements/TextField";
import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import Ownerabi from "../../../../ownerabi.json";

interface LockForm {
	ldays: number;
}

const LPChanges = ({
	contractAddress,
	setSuccess,
	lplockDays,
	lplockStart,
}: {
	contractAddress: `0x${string}`;
	setSuccess: Dispatch<SetStateAction<string>>;
	lplockDays: number;
	lplockStart: number;
}) => {
	const { data: walletClient } = useWalletClient();
	const [error, setError] = useState("");

	const endDate = lplockStart + lplockDays * 86400;
	const today = Math.floor(Date.now() / 1000);
	const remaining = Math.floor((endDate - today) / 86400);

	const clear = () => {
		setError("");
	};

	// contract call to extend the lock period for LP tokens.
	const {
		isLoading,
		isSuccess,
		write: extend,
	} = useContractWrite({
		address: contractAddress,
		abi: Ownerabi.abi,
		functionName: "extendLock",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
			setSuccess("Your lock period has been extended successfully!");
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});

	// contract call to burn the LP tokens.
	const { isSuccess: isBurnt, write: burn } = useContractWrite({
		address: contractAddress,
		abi: Ownerabi.abi,
		functionName: "burnLP",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
			setSuccess("Liquidity tokens have been burnt successfully!");
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});

	// handle form to extend the lock period.
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<LockForm>();
	const onSubmit: SubmitHandler<LockForm> = (formData) => {
		extend({
			args: [formData.ldays],
		});
	};
	return (
		<>
			{isLoading && <Loading msg="Increasing Limits..." />}
			{error && (
				<Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} callback={clear} />
			)}
			<div className="w-full py-8 border-b border-gray-700">
				<div className="flex mb-1 justify-between">
					<h2 className="text-xl">Lock or Burn!</h2>
					<span className="text-sm font-medium text-gray-400">
						{remaining > 0 ? remaining + " days lock remaining" : "Lock period has expired!"}
					</span>
				</div>
				<p className="text-sm text-gray-500 mb-4">
					You can either<b className="font-bold text-gray-400"> Burn LP </b>tokens or
					<b className="font-bold text-gray-400"> Extend </b>the lock period.
				</p>
				<div className="w-full flex pb-4 rounded-xl justify-between flex-wrap">
					<div className="flex flex-col justify-center">
						<button
							type="button"
							onClick={() => {
								burn();
							}}
							className="safu-button-primary"
						>
							Burn LP tokens
						</button>
					</div>
					<form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-auto flex justify-between">
						<TextField
							label="Lock"
							id="lock"
							{...register("ldays", {
								required: true,
								min: 30,
							})}
							placeholder="30"
							defaultValue="30"
							isError={errors.ldays ? true : false}
							error="Minimum 30 days required"
							width="w-20"
							labelWidth="grow lg:grow-0"
							containerWidth="w-full md:w-auto"
							margin="mr-2 md:mr-0"
						/>
						<div className="flex justify-center flex-col">
							<input type="submit" value="Extend" className="safu-button-secondary cursor-pointer" />
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default LPChanges;
