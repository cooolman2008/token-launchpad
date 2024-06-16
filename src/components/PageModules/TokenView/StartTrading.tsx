import { useContractWrite, useWalletClient, useBalance } from "wagmi";
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
	const [balance, setBalance] = useState(0);
	const [error, setError] = useState("");

	const { data } = useBalance({
		address: contractAddress,
		onSuccess(data) {
			console.log("Success", data);
			setBalance(Number(data.formatted));
		},
		onError(error) {
			console.log("Error", error);
		},
	});

	const clear = () => {
		setError("");
	};

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
			{error && (
				<Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} callback={clear} />
			)}
			<div className="w-full py-8 border-b border-gray-700">
				<div className="bg-gradient-to-r from-red-800/20 mb-2 p-4 rounded-xl border border-red-900/50">
					<div className="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18px"
							height="18px"
							viewBox="0 0 24 24"
							className="stroke-red-600 mr-1"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
							<line x1="12" y1="9" x2="12" y2="13"></line>
							<line x1="12" y1="17" x2="12.01" y2="17"></line>
						</svg>
						<p className="font-bold text-red-600">Warning!</p>
					</div>
					<span className=" font-medium text-red-700 text-sm">
						Make sure you have set your team wallet details before enabling the trade.
					</span>
				</div>
				<div className="flex justify-between items-center">
					<h2 className="text-xl mb-1 text-slate-200">Start trading!</h2>
					<span className="text-xl font-medium text-slate-200">
						<b className="font-bold text-gray-500">Available:</b> {balance} ETH
					</span>
				</div>
				<p className="text-sm text-gray-500 mb-4">
					Start trading your tokens by creating a liquidity pool
					<br />
					You can either Burn the LP tokens or Lock them for a period of time.
				</p>
				<div className="w-full pb-4 rounded-xl">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="w-full flex justify-between flex-wrap items-center">
							<TextField
								label="Liquidity in ETH"
								id="liq"
								defaultValue="0.1"
								placeholder="0"
								{...register("liq", {
									valueAsNumber: true,
									required: {
										value: true,
										message: "Value needed",
									},
									validate: (value) => value + balance > 0.1 || "Min liq needed",
								})}
								isError={errors.liq ? true : false}
								error={errors.liq?.message ? errors.liq?.message : "Some error"}
								width="w-20"
								labelWidth="grow lg:grow-0"
								containerWidth="w-full md:w-auto"
								margin="mb-4 lg:mb-0"
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
								containerWidth="w-full md:w-auto"
								margin="mb-4 lg:mb-0"
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
