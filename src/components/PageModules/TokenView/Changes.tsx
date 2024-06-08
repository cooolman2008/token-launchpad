import { useContractWrite, useWalletClient } from "wagmi";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import TextField from "@/components/elements/TextField";
import Ownerabi from "../../../../ownerabi.json";

interface LockForm {
	ldays: number;
}

const Changes = ({ contractAddress, isLpBurnt }: { contractAddress: `0x${string}`; isLpBurnt: boolean }) => {
	const { data: walletClient } = useWalletClient();
	const [lpBurnt, setLpBurnt] = useState(isLpBurnt);

	// contract call to extend the lock period for LP tokens.
	const {
		data,
		isSuccess,
		write: extend,
	} = useContractWrite({
		address: contractAddress,
		abi: Ownerabi.abi,
		functionName: "extendLock",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
		},
		onError(error) {
			console.log(error);
		},
	});

	// contract call to burn the LP tokens.
	const { isSuccess: isBurnt, write: burn } = useContractWrite({
		address: contractAddress,
		abi: Ownerabi.abi,
		functionName: "burnLP",
		account: walletClient?.account,
		onSuccess(res) {
			setLpBurnt(true);
			console.log(res);
		},
		onError(error) {
			console.log(error);
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
		<div className="w-full py-8 border-b border-gray-700">
			<h2 className="text-2xl mb-1">Changes to your token!</h2>
			<p className="text-sm text-gray-500 mb-4">
				You can either<b className="font-bold text-gray-400"> Burn LP </b>tokens or
				<b className="font-bold text-gray-400"> Extend </b>the lock period.
			</p>
			<div className="w-full flex pb-4 rounded-xl justify-between flex-wrap">
				{!lpBurnt && (
					<>
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
					</>
				)}
			</div>
		</div>
	);
};

export default Changes;
