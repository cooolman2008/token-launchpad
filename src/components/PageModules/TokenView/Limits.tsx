import { useContractWrite, useWalletClient } from "wagmi";
import { useState, SetStateAction, Dispatch } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import TextField from "@/components/elements/TextField";
import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import Tokenabi from "../../../../newtokenabi.json";

interface LimitsForm {
	maxwallet: number;
	maxtx: number;
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
	const { isLoading, write: increase } = useContractWrite({
		address: contractAddress,
		abi: Tokenabi.abi,
		functionName: "increaseLimits",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
			setSuccess("Limits have been increased successfully!");
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
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
			args: [formData.maxtx, formData.maxwallet],
		});
	};
	return (
		<>
			{isLoading && <Loading msg="Increasing Limits..." />}
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
								label="Max transactions"
								id="maxtx"
								isPercent={true}
								placeholder="30"
								defaultValue={txLimit}
								{...register("maxtx", {
									required: true,
									min: txLimit,
									max: 100,
								})}
								isError={errors.maxtx ? true : false}
								error="New limit should be within current limit & 100"
								width="w-20"
								labelWidth="grow lg:grow-0"
								containerWidth="w-full md:w-auto"
								margin="mb-4 lg:mb-0"
							/>
							<TextField
								label="Max wallet"
								id="maxwallet"
								isPercent={true}
								placeholder="30"
								defaultValue={walletLimit}
								{...register("maxwallet", {
									required: true,
									min: walletLimit,
									max: 100,
								})}
								isError={errors.maxwallet ? true : false}
								error="New limit should be within current limit & 100"
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
