import { useContractWrite, useWalletClient } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { parseEther } from "viem";

import Tokenabi from "../../../../newtokenabi.json";
import { useState } from "react";

interface TradingForm {
	liq: number;
	lockPeriod: number;
	shouldBurn: boolean;
}

const StartTrading = ({ contractAddress }: { contractAddress: `0x${string}` }) => {
	const { data: walletClient } = useWalletClient();
	const [showLock, setShowLock] = useState(true);

	// contract call to start trading of the launched token.
	const { data, isSuccess, write } = useContractWrite({
		address: contractAddress,
		abi: Tokenabi.abi,
		functionName: "startTrading",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
		},
		onError(error) {
			console.log(error);
		},
	});

	// handle extend lock form.
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<TradingForm>();
	const onSubmit: SubmitHandler<TradingForm> = (formData) => {
		write({
			args: [formData.lockPeriod, formData.shouldBurn],
			value: parseEther("1"),
		});
	};
	return (
		<>
			<h2 className="text-2xl mb-1">Start trading!</h2>
			<p className="text-sm text-gray-400 mb-4 font-thin">
				Start trading your tokens by creating a liquidity pool
				<br />
				You can either <b className="font-bold">Burn</b> the LP tokens or <b className="font-bold">Lock</b> them for a
				period of time.
			</p>
			<div className="w-full pb-4 rounded-xl">
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="w-full flex justify-between">
						<div className="flex mr-4 items-center">
							<span className="text-xl text-gray-400 mr-4">Liquidity in ETH</span>
							<input
								type="text"
								id="liq"
								defaultValue="0"
								placeholder="0"
								className={
									"block w-20 rounded-xl ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-2xl " +
									(errors.liq ? "border-x border-pink-500" : "border-l border-gray-400")
								}
								{...register("liq", {
									required: true,
									min: 1,
								})}
							/>
						</div>
						<div className="flex mr-4 items-center">
							<span className="text-xl text-gray-400 mr-4">Lock days</span>
							<input
								type="text"
								id="days"
								{...register("lockPeriod", {
									required: showLock,
									min: !showLock ? 0 : 30,
								})}
								disabled={!showLock}
								placeholder="0"
								className={
									"block w-20 rounded-xl ps-3 pe-3 py-1.5 shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-2xl " +
									(showLock
										? "text-white " + (errors.lockPeriod ? "border-x border-pink-500" : "border-l border-gray-400")
										: "text-gray-400")
								}
							/>
						</div>
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
		</>
	);
};

export default StartTrading;
