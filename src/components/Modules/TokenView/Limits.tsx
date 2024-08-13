import { useWriteContract, useWalletClient } from "wagmi";
import { useState, SetStateAction, Dispatch } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import TextField from "@/components/elements/TextField";
import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";
import { tokenAbi } from "@/abi/tokenAbi";

interface LimitsForm {
	maxwallet: bigint;
	maxtx: bigint;
}

const Limits = ({
	contractAddress,
	setSuccess,
	txLimit,
	walletLimit,
}: {
	contractAddress: `0x${string}`;
	setSuccess: Dispatch<SetStateAction<string>>;
	txLimit: number;
	walletLimit: number;
}) => {
	const { data: walletClient } = useWalletClient();
	const [error, setError] = useState("");

	// contract call to Increase Limits.
	const { isPending, writeContract: increase } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				setSuccess("Limits have been increased successfully!");
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});

	const clear = () => {
		setError("");
	};

	// handle form to extend the lock period.
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LimitsForm>();
	const onSubmit: SubmitHandler<LimitsForm> = (formData) => {
		increase({
			address: contractAddress,
			abi: tokenAbi,
			functionName: "increaseLimits",
			account: walletClient?.account,
			args: [formData.maxwallet, formData.maxtx],
		});
	};
	return (
		<>
			{isPending && <Loading msg="Increasing Limits..." />}
			{error && (
				<Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} callback={clear} />
			)}
			<div className="w-full py-8 border-b border-gray-700">
				<h2 className="text-xl mb-1">Increase Limits</h2>
				<p className="text-sm text-gray-500 mb-4">Increase Limits to allow people to trade more.</p>
				<form onSubmit={handleSubmit(onSubmit)} className="w-full md:w-auto flex justify-between">
					<div className="w-full pb-4 rounded-xl mb-2">
						<div className="w-full flex flex-wrap justify-between">
							<TextField
								label="Max Transactions"
								id="maxtx"
								isPercent={true}
								placeholder="30"
								defaultValue={txLimit}
								{...register("maxtx", {
									required: { value: true, message: "New limit can't be empty" },
									pattern: { value: /^[0-9.]+$/i, message: "New limit should be a number" },
									min: { value: txLimit, message: "New limit should be more than current limit" },
									max: { value: 100, message: "New limit should be below 100%" },
								})}
								error={errors.maxtx}
								width="w-20"
								labelWidth="grow lg:grow-0"
								containerWidth="w-full md:w-auto"
								margin="mb-4 lg:mb-0"
							/>
							<TextField
								label="Max Wallet"
								id="maxwallet"
								isPercent={true}
								placeholder="30"
								defaultValue={walletLimit}
								{...register("maxwallet", {
									required: { value: true, message: "New limit can't be empty" },
									pattern: { value: /^[0-9.]+$/i, message: "New limit should be a number" },
									min: { value: walletLimit, message: "New limit should be more than current limit" },
									max: { value: 100, message: "New limit should be below 100%" },
								})}
								error={errors.maxwallet}
								width="w-20"
								labelWidth="grow lg:grow-0"
								containerWidth="w-full md:w-auto"
								margin="mb-4 lg:mb-0"
							/>
							<div className="flex justify-center flex-col">
								<input type="submit" value="Increase" className="safu-button-secondary cursor-pointer" />
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
};

export default Limits;
