import { useWriteContract, useWalletClient, useBalance, useChainId } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { getAddress, parseEther } from "viem";
import Select from "react-select";

import TextField from "@/components/elements/TextField";
import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import { getRouters } from "@/utils/utils";
import { tokenAbi } from "@/abi/tokenAbi";

interface TradingForm {
	liq: number;
	lockPeriod: bigint;
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
	const [balance, setBalance] = useState(BigInt(0));
	const [error, setError] = useState("");

	const chainId = useChainId();
	const routers = getRouters(chainId);

	const [router, setRouter] = useState(routers[0].value);

	const { data: balanceData } = useBalance({
		address: contractAddress,
	});

	useEffect(() => {
		if (balanceData) {
			setBalance(balanceData.value);
		}
	}, [balanceData]);

	const clear = () => {
		setError("");
	};

	// contract call to start trading of the launched token.
	const { isPending, writeContract: write } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				callback(true);
				setSuccess("Trading has been enabled successfully");
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
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
		const routerAddr = getAddress(router);
		write({
			address: contractAddress,
			abi: tokenAbi,
			functionName: "startTrading",
			account: walletClient?.account,
			args: [formData.lockPeriod, formData.shouldBurn, routerAddr],
			value: parseEther(formData.liq.toString()),
		});
	};
	return (
		<>
			{isPending && <Loading msg="Enabling trading..." />}
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
					<h2 className="text-xl mb-1">Start trading!</h2>
					{balance > 0 && (
						<span className="text-xl font-medium text-slate-200">
							<b className="font-bold text-gray-500">Available:</b> {Number(balance)} ETH
						</span>
					)}
				</div>
				<p className="text-sm text-gray-500 mb-4">
					Create a liquidity pool to begin trading your tokens.
					<br />
					You can either burn the LP tokens or lock them for a set duration.
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
									validate: (value) => value + Number(balance) > 0.1 || "Min liq needed",
								})}
								isError={errors.liq ? true : false}
								error={errors.liq?.message ? errors.liq?.message : "Some error"}
								width="w-20"
								labelWidth="grow lg:grow-0"
								containerWidth="w-full md:w-auto"
								margin="mb-4"
							/>
							<TextField
								label="Lock Days"
								id="days"
								{...register("lockPeriod", {
									required: showLock,
									pattern: /^[0-9]+$/i,
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
								margin="mb-4"
								padding=" pr-4 lg:pr-0 xl:pr-4 "
							/>
							<div className="flex flex-col justify-center mr-4 md:mr-0 mb-4 lg:mb-0 xl:mb-4">
								<div className="flex items-center">
									<span className="text-xl text-gray-400 pb-0.5 mr-4">Burn Liquidity</span>
									<label className="switch">
										<input
											type="checkbox"
											{...register("shouldBurn")}
											onChange={() => {
												setShowLock((showLock) => !showLock);
												setValue("lockPeriod", BigInt(0));
											}}
											defaultChecked={false}
										/>
										<span className="slider round"></span>
									</label>
								</div>
							</div>
							<div className="w-full md:w-auto flex md:pr-4 2xl:pr-12 items-center flex-wrap mb-4">
								<label htmlFor="type" className="text-xl text-gray-400 pr-4 grow">
									Router
								</label>
								<Select
									unstyled={true}
									defaultValue={routers[0]}
									inputId="type"
									minMenuHeight={0}
									classNames={{
										control: (state) =>
											"select-control bg-neutral-900 ps-3 pe-3 py-1.5 rounded-xl border-l border-gray-600 2xl:text-sm",
										menuList: (state) => "bg-neutral-900 mt-1 rounded-xl 2xl:text-sm  border-l border-gray-600",
										option: (state) => " flex flex-col justify-center px-4 py-2 cursor-pointer select-options",
									}}
									options={routers}
									isSearchable={false}
									onChange={(value) => {
										if (value?.value) {
											setRouter(value?.value);
										}
									}}
								/>
							</div>
							<div className="flex justify-center flex-col ml-auto 2xl:ml-0">
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
