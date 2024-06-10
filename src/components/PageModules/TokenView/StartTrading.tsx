import { useContractWrite, useWalletClient } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, SetStateAction, Dispatch } from "react";
import { parseEther } from "viem";

import TextField from "@/components/elements/TextField";
import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import Tokenabi from "../../../../newtokenabi.json";

interface TradingForm {
	liq: number;
	lockPeriod: number;
	shouldBurn: boolean;
}

const StartTrading = ({
	contractAddress,
	callback,
	setSuccess,
}: {
	contractAddress: `0x${string}`;
	callback: Dispatch<SetStateAction<boolean>>;
	setSuccess: Dispatch<SetStateAction<string>>;
}) => {
	const { data: walletClient } = useWalletClient();
	const [showLock, setShowLock] = useState(true);
	const [error, setError] = useState("");

	// contract call to start trading of the launched token.
	const { isLoading, write } = useContractWrite({
		address: contractAddress,
		abi: Tokenabi.abi,
		functionName: "startTrading",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
			callback(true);
			setSuccess("Trading has been enabled successfully");
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});

	// handle trading form.
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<TradingForm>();
	const onSubmit: SubmitHandler<TradingForm> = (formData) => {
		write({
			args: [formData.lockPeriod, formData.shouldBurn],
			value: parseEther(formData.liq.toString()),
		});
	};
	return (
		<>
			{isLoading && <Loading msg="Enabling trading..." />}
			{error && <Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} />}
			<div className="w-full py-8 border-b border-gray-700">
				<h2 className="text-xl mb-1">Start trading!</h2>
				<p className="text-sm text-gray-500 mb-4">
					Start trading your tokens by creating a <b className="font-bold text-gray-400">liquidity pool</b>
					<br />
					You can either <b className="font-bold text-gray-400">Burn</b> the LP tokens or{" "}
					<b className="font-bold text-gray-400">Lock</b> them for a period of time.
				</p>
				<div className="w-full pb-4 rounded-xl">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="w-full flex justify-between flex-wrap">
							<TextField
								label="Liquidity in ETH"
								id="liq"
								defaultValue="0.1"
								placeholder="0"
								{...register("liq", {
									required: true,
									min: 0.1,
								})}
								isError={errors.liq ? true : false}
								error="Please enter minimum liquidity"
								width="w-20"
								labelWidth="grow lg:grow-0"
								margin="mb-4 2xl:mb-0"
							/>
							<TextField
								label="Lock days"
								id="days"
								{...register("lockPeriod", {
									required: showLock,
									min: !showLock ? 0 : 30,
								})}
								defaultValue={30}
								disabled={!showLock}
								placeholder="0"
								isError={errors.lockPeriod ? true : false}
								error="Minimum 30 days required"
								width="w-20"
								labelWidth="grow lg:grow-0"
								margin="mb-4 2xl:mb-0"
							/>
							<div className="flex flex-col mr-4 justify-center">
								<div className="flex items-center">
									<span className="text-xl text-gray-400 pb-0.5 mr-4">Burn liquidity</span>
									<label className="switch">
										<input
											type="checkbox"
											{...register("shouldBurn")}
											onChange={() => {
												setShowLock((showLock) => !showLock);
												setValue("lockPeriod", 0);
											}}
											defaultChecked={false}
										/>
										<span className="slider round"></span>
									</label>
								</div>
							</div>
							<div className="flex justify-center flex-col">
								<input type="submit" value="Start" className="safu-button-secondary cursor-pointer" />
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default StartTrading;
