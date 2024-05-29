"use client";

import { useAccount, useContractWrite, useWalletClient, useWaitForTransaction } from "wagmi";
import ManagerAbi from "../../managerabi.json";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Select from "react-select";
import { useRouter } from "next/navigation";
import TextField from "@/components/elements/TextField/TextField";
import { animate, spring } from "motion";
import Tax from "@/components/PageModules/Launch/Tax";
import Team from "@/components/PageModules/Launch/Team";
import Advanced from "@/components/PageModules/Launch/Advanced";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

export interface LaunchForm {
	name: string;
	symbol: string;
	supply: bigint;
	initinterval: number;
	countinterval: number;
	maxbtax: number;
	minbtax: number;
	maxstax: number;
	minstax: number;
	lptax: number;
	taxWallet: string;
	team1p: number;
	team2p: number;
	team3p: number;
	team4p: number;
	team5p: number;
	team1: string;
	team2: string;
	team3: string;
	team4: string;
	team5: string;
	cliffPeriod: number;
	vestingPeriod: number;
	maxWallet: number;
	maxTx: number;
	preventSwap: number;
	maxSwap: number;
	taxSwapThreshold: number;
	amount: number;
}

function Launch() {
	const { data: walletClient } = useWalletClient();
	const [isClient, setIsClient] = useState(false);
	const [tax, setTax] = useState(false);
	const [team, setTeam] = useState(false);
	const [advanced, setAdvanced] = useState(false);
	const [premium, setPremium] = useState(true);
	const { address } = useAccount();
	const router = useRouter();

	// contract call for token launch.
	const {
		data: response,
		write,
		error,
	} = useContractWrite({
		address: CONTRACT_ADDRESS,
		abi: ManagerAbi.abi,
		functionName: "launchTokenFree",
		onSuccess(res) {
			console.log(res);
		},
		onError(error) {
			console.log(error);
		},
	});

	// get the transaction details by waiting for the transaction.
	const {
		data: transaction,
		isError,
		isLoading,
	} = useWaitForTransaction({
		hash: response?.hash,
		onSuccess(res) {
			console.log(res);
		},
		onError(error) {
			console.log(error);
		},
	});

	// redirect to the token page once the address is aquired from the waitForTransaction hook.
	useEffect(() => {
		if (transaction?.logs[0]?.address) {
			console.log(transaction?.logs[0]?.address);
			setTimeout(() => {
				router.push("/" + transaction?.logs[0]?.address);
			}, 1000);
		}
	}, [transaction, router]);

	useEffect(() => {
		setIsClient(true);
	}, []);

	// handle form & fire launch token with the form details
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<LaunchForm>();
	const onSubmit: SubmitHandler<LaunchForm> = (formData) => {
		const args = {
			owner: address,
			taxWallet: formData.taxWallet,
			stakingFacet: CONTRACT_ADDRESS,
			isFreeTier: true,
			minLiq: 0,
			supply: BigInt(formData.supply),
			initTaxType: 0,
			initInterval: formData.initinterval ? formData.initinterval : 0,
			countInterval: formData.countinterval ? formData.countinterval : 0,
			maxBuyTax: formData.maxbtax,
			minBuyTax: formData.minbtax,
			maxSellTax: formData.maxstax,
			minSellTax: formData.minstax,
			lpTax: formData.lptax,
			maxWallet: formData.maxWallet ? formData.maxWallet : 1,
			maxTx: formData.maxTx ? formData.maxTx : 1,
			preventSwap: formData.preventSwap ? formData.preventSwap : 10,
			maxSwap: formData.maxSwap ? BigInt(formData.maxSwap) : BigInt(10000),
			taxSwapThreshold: formData.taxSwapThreshold ? BigInt(formData.taxSwapThreshold) : BigInt(1000),
			cliffPeriod: formData.cliffPeriod ? formData.cliffPeriod : 30,
			vestingPeriod: formData.vestingPeriod ? formData.vestingPeriod : 30,
			team1p: formData.team1p ? formData.team1p : 0,
			team2p: formData.team2p ? formData.team2p : 0,
			team3p: formData.team3p ? formData.team3p : 0,
			team4p: formData.team4p ? formData.team4p : 0,
			team5p: formData.team5p ? formData.team5p : 0,
			team1: formData.team1 ? formData.team1 : address,
			team2: formData.team2 ? formData.team2 : address,
			team3: formData.team3 ? formData.team3 : address,
			team4: formData.team4 ? formData.team4 : address,
			team5: formData.team5 ? formData.team5 : address,
			name: formData.name,
			symbol: formData.symbol,
		};
		console.log(args);
		write({
			args: [
				{
					owner: address,
					taxWallet: formData.taxWallet,
					stakingFacet: CONTRACT_ADDRESS,
					isFreeTier: true,
					minLiq: 0,
					supply: BigInt(formData.supply),
					initTaxType: 0,
					initInterval: formData.initinterval ? formData.initinterval : 0,
					countInterval: formData.countinterval ? formData.countinterval : 0,
					maxBuyTax: formData.maxbtax,
					minBuyTax: formData.minbtax,
					maxSellTax: formData.maxstax,
					minSellTax: formData.minstax,
					lpTax: formData.lptax,
					maxWallet: formData.maxWallet ? formData.maxWallet : 1,
					maxTx: formData.maxTx ? formData.maxTx : 1,
					preventSwap: formData.preventSwap ? formData.preventSwap : 10,
					maxSwap: formData.maxSwap ? BigInt(formData.maxSwap) : BigInt(10000),
					taxSwapThreshold: formData.taxSwapThreshold ? BigInt(formData.taxSwapThreshold) : BigInt(1000),
					cliffPeriod: formData.cliffPeriod ? formData.cliffPeriod : 30,
					vestingPeriod: formData.vestingPeriod ? formData.vestingPeriod : 30,
					team1p: formData.team1p ? formData.team1p : 0,
					team2p: formData.team2p ? formData.team2p : 0,
					team3p: formData.team3p ? formData.team3p : 0,
					team4p: formData.team4p ? formData.team4p : 0,
					team5p: formData.team5p ? formData.team5p : 0,
					team1: formData.team1 ? formData.team1 : address,
					team2: formData.team2 ? formData.team2 : address,
					team3: formData.team3 ? formData.team3 : address,
					team4: formData.team4 ? formData.team4 : address,
					team5: formData.team5 ? formData.team5 : address,
					name: formData.name,
					symbol: formData.symbol,
				},
			],
		});
	};
	const options = [
		{ value: "usd", label: "USDCoin" },
		{ value: "eth", label: "Ethetium" },
		{ value: "safu", label: "SAFU" },
	];
	const payOptions = [
		{ value: "eth", label: "Etherium" },
		{ value: "safu", label: "Safu" },
	];

	// TODO: Loading animation while waiting for the launch & redirect.
	// Error messages in case of redirection failure & display instructions to manually check the token from launches.

	return (
		<>
			{isClient && walletClient && (
				<>
					<form onSubmit={handleSubmit(onSubmit)} className="w-full">
						<h2 className="block text-4xl lg:text-5xl font-thin safu-grad-text text-center uppercase py-8 lg:py-24">
							Launch your token in 60 seconds
						</h2>
						<div className="border-b border-gray-700 py-8">
							<h3 className="text-2xl mb-1">Pick a template, get creative & launch</h3>
							<p className="text-sm text-gray-400 mb-4 font-thin">
								You can launch inspired tokens by selecting a <b className="font-bold"> preexisting</b> token.
								<br />
								You can either launch directly or <b className="font-bold"> modify</b> the details.
							</p>
							<div className="w-80 lg:w-80">
								<Select
									unstyled={true}
									defaultValue={options[0]}
									classNames={{
										control: (state) => "bg-neutral-800 p-2 rounded-xl border-l border-gray-400",
										menuList: (state) => "bg-neutral-800 mt-1 rounded-xl",
										option: (state) => " flex flex-col justify-center px-4 py-2 cursor-pointer",
									}}
									options={options}
								/>
							</div>
						</div>
						<div className="border-b border-gray-700 py-8">
							<h3 className="text-2xl mb-1">Customise token</h3>
							<p className="text-sm text-gray-400 mb-4 font-thin">
								Give us some <b className="font-bold"> basic</b> details of your token.
								<br />
								You can also give a <b className="font-bold"> splitter</b> contract address for tax wallet to split your
								tax.
							</p>
							<div className="flex flex-wrap">
								<TextField
									label="Coin name"
									id="name"
									defaultValue="USDCoin"
									placeholder="Safu Launcher"
									{...register("name", {
										required: true,
										maxLength: 20,
										pattern: /^[A-Za-z ]+$/i,
									})}
									isError={errors.name ? true : false}
									error="We need an alphabets only name to deploy the token."
									width="w-56"
									labelWidth="grow"
								/>
								<TextField
									label="Symbol"
									id="symbol"
									defaultValue="USDC"
									placeholder="USDC"
									{...register("symbol", {
										required: true,
										maxLength: 8,
										pattern: /^[A-Za-z]+$/i,
									})}
									isError={errors.symbol ? true : false}
									error="We need a 4 letter alphabets only symbol."
									width="w-48"
									labelWidth="grow"
								/>
								<TextField
									label="Supply"
									id="supply"
									defaultValue="1000000"
									placeholder="1000000"
									{...register("supply", {
										required: true,
										min: 1000000,
									})}
									isError={errors.supply ? true : false}
									error="Supply should be minimum 1Million."
									width="w-64"
									labelWidth="grow"
								/>
								<TextField
									label="Tax wallet"
									id="taxWallet"
									defaultValue={address}
									placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
									{...register("taxWallet", {
										required: true,
										minLength: 42,
										pattern: /^[A-Za-z0-9]+$/i,
									})}
									isError={errors.taxWallet ? true : false}
									error="Tax wallet should be a valid wallet."
									width="w-64 md:w-56"
									labelWidth="grow"
								/>
							</div>
						</div>
						<div className="border-b border-gray-700 py-8">
							<div className="flex mb-1">
								<label className="switch mr-4">
									<input
										type="checkbox"
										onChange={() => {
											if (tax) {
												animate("#tax", { maxHeight: 0 }, { easing: "ease-in-out" });
												setTimeout(() => {
													setTax(!tax);
												}, 300);
											} else {
												setTax(!tax);
											}
										}}
										checked={tax}
									/>
									<span className="slider round"></span>
								</label>
								<h3 className="text-2xl mb-1">Modify taxations</h3>
							</div>
							<p className="text-sm text-gray-400 mb-4 font-thin">
								Tax Information that you <b className="font-bold">set</b> on token creation{" "}
								<b className="font-bold">cannot be changed</b> after we deploy the token.
								<br />
								So, be <b className="font-bold">careful</b> when you set your taxes.
							</p>
							{tax && <Tax register={register} errors={errors} />}
						</div>
						<div className="border-b border-gray-700 py-8">
							<div className="flex mb-1">
								<label className="switch mr-4">
									<input
										type="checkbox"
										onChange={() => {
											if (team) {
												animate("#team", { maxHeight: 0 }, { easing: "ease-in-out" });
												setTimeout(() => {
													setTeam(!team);
												}, 200);
											} else {
												setTeam(!team);
											}
										}}
										checked={team}
									/>
									<span className="slider round"></span>
								</label>
								<h3 className="text-2xl mb-1">I have a team</h3>
							</div>
							<p className="text-sm text-gray-400 mb-4 font-thin">
								Team Information that you <b className="font-bold">set</b> before token creation
								<b className="font-bold">cannot be changed</b> after we deploy the token.
								<br />
								You can set <b className="font-bold">cliff & vesting</b> periods for your team members & ditribute the
								allocations here.
							</p>
							{team && <Team register={register} errors={errors} />}
						</div>
						<div className="border-b border-gray-700 py-8">
							<div className="flex mb-1">
								<label className="switch mr-4">
									<input
										type="checkbox"
										onChange={() => {
											if (advanced) {
												animate("#advanced", { maxHeight: 0 }, { easing: "ease-in-out" });
												setTimeout(() => {
													setAdvanced(!advanced);
												}, 200);
											} else {
												setAdvanced(!advanced);
											}
										}}
										checked={advanced}
									/>
									<span className="slider round"></span>
								</label>
								<h3 className="text-2xl mb-1">I know this</h3>
							</div>
							<p className="text-sm text-gray-400 mb-4 font-thin">
								This section is for <b className="font-bold">advanced</b> users.
								<br />
								You tweak these settings <b className="font-bold"> if you know what you are doing</b>.
							</p>
							{advanced && <Advanced register={register} errors={errors} />}
						</div>
						<div className="border-b border-gray-700 py-8">
							<h3 className="text-2xl mb-1">Go premium or go free</h3>
							<p className="text-sm text-gray-400 mb-4 font-thin">
								You can either <b className="font-bold">pay once</b> & be done.
								<br />
								Or launch for <b className="font-bold">free</b> & share taxes.
							</p>
							<div className="flex mb-1">
								<label className="switch mr-4">
									<input
										type="checkbox"
										onChange={() => {
											setPremium(!premium);
										}}
										checked={!premium}
									/>
									<span className="slider round"></span>
								</label>
								<h3 className="text-xl mb-1">Free</h3>
							</div>
							{premium && (
								<div className="flex flex-wrap">
									<TextField
										label="Amount"
										id="amount"
										placeholder="10"
										defaultValue={0.02}
										disabled={true}
										{...register("amount", {
											max: 10,
											min: 0,
										})}
										isError={errors.preventSwap ? true : false}
										error="Please provide a valid limit."
										width="w-24"
										labelWidth="grow"
									/>
									<div className="w-full flex lg:mr-4 items-center flex-wrap mb-8">
										<label htmlFor="" className="text-xl text-gray-400 pr-4 grow">
											Currency
										</label>
										<Select
											unstyled={true}
											defaultValue={payOptions[0]}
											classNames={{
												control: (state) => "bg-neutral-800 p-2 rounded-xl border-l border-gray-400",
												menuList: (state) => "bg-neutral-800 mt-1 rounded-xl",
												option: (state) => " flex flex-col justify-center px-4 py-2 cursor-pointer",
											}}
											options={payOptions}
										/>
									</div>
								</div>
							)}
						</div>
						<div className="w-full flex justify-center mt-4">
							<input type="submit" value="Launch" className="safu-button-primary" />
						</div>
					</form>
				</>
			)}
		</>
	);
}
export default Launch;
