import { useContractWrite, useWalletClient } from "wagmi";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import Tokenabi from "../../../../newtokenabi.json";
import Ownerabi from "../../../../ownerabi.json";

interface LockForm {
	ldays: number;
}

const Changes = ({
	contractAddress,
	isLimited,
	isLpBurnt,
}: {
	contractAddress: `0x${string}`;
	isLimited: boolean;
	isLpBurnt: boolean;
}) => {
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

	// contract call to remove Limits of the launched token.
	const { isSuccess: removed, write: remove } = useContractWrite({
		address: contractAddress,
		abi: Tokenabi.abi,
		functionName: "removeLimits",
		account: walletClient?.account,
		onSuccess(res) {
			isLimited = false;
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
		<>
			<h2 className="text-2xl mb-1">Changes to your token!</h2>
			<p className="text-sm text-gray-400 mb-4 font-thin">
				You can either<b className="font-bold"> Burn LP </b>tokens or<b className="font-bold"> Extend </b>the lock
				period.
				<br />
				You can<b className="font-bold"> Remove Limits </b>to allow people to buy bigger chunks.
			</p>
			<div className="w-full pb-4 rounded-xl">
				<div className="w-full flex justify-between">
					<div className="flex justify-center">
						{isLimited && (
							<button
								onClick={() => {
									remove();
								}}
								className="safu-button-secondary mr-4"
							>
								Remove limits
							</button>
						)}
						{!lpBurnt && (
							<button
								onClick={() => {
									burn();
								}}
								className="safu-button-primary"
							>
								Burn LP tokens
							</button>
						)}
					</div>
					{!lpBurnt && (
						<form onSubmit={handleSubmit(onSubmit)} className="flex items-center">
							<div className="w-full rounded-3xl flex items-center mr-4">
								<span className="text-xl text-gray-400 pr-4">Lock</span>
								<input
									type="text"
									id="lock"
									{...register("ldays", {
										required: true,
										min: 30,
									})}
									placeholder="30"
									defaultValue="30"
									className={
										"block w-20 rounded-xl ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-2xl " +
										(errors.ldays ? "border-x border-pink-500" : "border-l border-gray-400")
									}
								/>
							</div>
							<div className="flex justify-center flex-col">
								<input type="submit" value="Extend" className="safu-button-secondary cursor-pointer" />
							</div>
						</form>
					)}
				</div>
			</div>
		</>
	);
};

export default Changes;
