"use client";

import { useAccount, useContractWrite, useWalletClient, useWaitForTransaction } from "wagmi";
import ManagerAbi from "../../managerabi.json";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TextField from "@/components/elements/TextField/TextField";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

interface IFormInput {
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
}

function Launch() {
	const { data: walletClient } = useWalletClient();
	const [isClient, setIsClient] = useState(false);
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
			console.log("waiting start");
			const wait = setTimeout(function () {
				console.log("waited!");
			}, 10 * 1000);
			console.log("waiting ends");
			clearTimeout(wait);
			console.log("waited ends");
			console.log(transaction?.logs[0]?.address);
			router.push("/" + transaction?.logs[0]?.address);
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
	} = useForm<IFormInput>();
	const onSubmit: SubmitHandler<IFormInput> = (formData) => {
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

	// TODO: Loading animation while waiting for the launch & redirect.
	// Error messages in case of redirection failure & display instructions to manually check the token from launches.
	// Handle redirection & async functions.

	return (
		<>
			{isClient && walletClient && (
				<div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="space-y-12">
							<div className="border-b border-gray-600 pb-12">
								<div className="sm:col-span-3">
									<label htmlFor="template" className="block text-sm font-medium leading-6 text-white">
										Choose from one of the templates
									</label>
									<div className="mt-2">
										<select
											id="template"
											name="template"
											defaultValue="USDCoin"
											className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:max-w-xs sm:text-sm sm:leading-6 bg-neutral-800 outline-0 ps-2 pe-2 appearance-none"
										>
											<option>USDCoin</option>
											<option>Ethetium</option>
											<option>SAFU</option>
										</select>
									</div>
								</div>
							</div>
							<div className="border-b border-gray-600 pb-12">
								<h2 className="text-base font-semibold leading-7 text-white">Tell us about your Token</h2>
								<p className="mt-1 text-sm leading-6 text-gray-400">
									Information that you enter for token creation cannot be changed after we deploy the token.
									<br />
									So, be careful when you fill this form.
								</p>

								<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
									<div className="sm:col-span-3">
										<TextField
											label="Coin name"
											id="name"
											defaultValue="SAFUCoin"
											placeholder="Safu Launcher"
											{...register("name", {
												required: true,
												maxLength: 20,
												pattern: /^[A-Za-z ]+$/i,
											})}
											isError={errors.name ? true : false}
											error="We need an alphabets only name to deploy the token."
										/>
									</div>
									<div className="sm:col-span-3">
										<TextField
											label="Symbol"
											id="symbol"
											defaultValue="SAFC"
											placeholder="USDC"
											{...register("symbol", {
												required: true,
												maxLength: 8,
												pattern: /^[A-Za-z]+$/i,
											})}
											isError={errors.symbol ? true : false}
											error="We need a 4 letter alphabets only symbol."
										/>
									</div>
									<div className="sm:col-span-3">
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
										/>
									</div>
									<div className="sm:col-span-3">
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
										/>
									</div>
								</div>
							</div>
							<div className="border-b border-gray-600 pb-12">
								<h2 className="text-base font-semibold leading-7 text-white">Set your taxations</h2>
								<p className="mt-1 text-sm leading-6 text-gray-400">
									Information that you enter for token creation cannot be changed after we deploy the token.
									<br />
									So, be careful when you fill this form.
								</p>

								<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
									<div className="sm:col-span-3">
										<TextField
											label="Max buy tax"
											id="maxbtax"
											defaultValue="40"
											placeholder="40"
											{...register("maxbtax", {
												required: true,
												max: 40,
												min: 0,
											})}
											isPercent={true}
											isError={errors.maxbtax ? true : false}
											error="Tax can only be between 0 to 40."
										/>
									</div>

									<div className="sm:col-span-3">
										<TextField
											label="Max sell tax"
											id="maxstax"
											defaultValue="40"
											placeholder="40"
											{...register("maxstax", {
												required: true,
												max: 40,
												min: 0,
											})}
											isPercent={true}
											isError={errors.maxstax ? true : false}
											error="Tax can only be between 0 to 40."
										/>
									</div>

									<div className="sm:col-span-3">
										<TextField
											label="Final buy tax"
											id="minbtax"
											defaultValue="0"
											placeholder="0"
											{...register("minbtax", {
												required: true,
												max: 40,
												min: 0,
											})}
											isPercent={true}
											isError={errors.minbtax ? true : false}
											error="Tax can only be between 0 to 40."
										/>
									</div>

									<div className="sm:col-span-3">
										<TextField
											label="Final sell tax"
											id="minstax"
											defaultValue="0"
											placeholder="0"
											{...register("minstax", {
												required: true,
												max: 40,
												min: 0,
											})}
											isPercent={true}
											isError={errors.minstax ? true : false}
											error="Tax can only be between 0 to 40."
										/>
									</div>
									<div className="sm:col-span-2 sm:col-start-1">
										<label htmlFor="initTaxType" className="block text-sm font-medium leading-6 text-white">
											Choose Tax Drop Style
										</label>
										<div className="mt-2">
											<select
												id="initTaxType"
												name="initTaxType"
												defaultValue="Hybrid"
												className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:max-w-xs sm:text-sm sm:leading-6 bg-neutral-800 outline-0 ps-2 pe-2 appearance-none"
											>
												<option>Timestamp</option>
												<option>Count</option>
												<option>Hybrid</option>
											</select>
										</div>
									</div>

									<div className="sm:col-span-2">
										<TextField
											label="Interval in Seconds"
											id="initinterval"
											defaultValue="60"
											placeholder="60"
											{...register("initinterval", {
												required: true,
												max: 60,
												min: 0,
											})}
											isError={errors.initinterval ? true : false}
											error="Interval should be between 0-60."
										/>
									</div>

									<div className="sm:col-span-2">
										<TextField
											label="Count Interval"
											id="countinterval"
											defaultValue="60"
											placeholder="60"
											{...register("countinterval", {
												required: true,
												max: 60,
												min: 0,
											})}
											isError={errors.countinterval ? true : false}
											error="Interval should be between 0-60."
										/>
									</div>

									<div className="sm:col-span-3">
										<TextField
											label="Liquidity Pool tax"
											id="lptax"
											defaultValue="0"
											placeholder="0"
											{...register("lptax", {
												required: true,
												max: 20,
												min: 0,
											})}
											isPercent={true}
											isError={errors.lptax ? true : false}
											error="Tax can only be between 0 to 20."
										/>
									</div>
								</div>
							</div>
							<div className="border-b border-gray-600 pb-12">
								<h2 className="text-base font-semibold leading-7 text-white">Do you have a team?</h2>
								<p className="mt-1 text-sm leading-6 text-gray-400">
									Information that you enter for token creation cannot be changed after we deploy the token.
									<br />
									So, be careful when you fill this form.
								</p>

								<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
									<div className="sm:col-span-3">
										<TextField
											label="Cliff period"
											id="cliffPeriod"
											placeholder="30"
											{...register("cliffPeriod", {
												min: 30,
											})}
											isError={errors.cliffPeriod ? true : false}
											error="Minimum of 30 days Cliff period is needed."
										/>
									</div>
									<div className="sm:col-span-3">
										<TextField
											label="Vesting period"
											id="vestingPeriod"
											placeholder="30"
											{...register("vestingPeriod", {
												min: 30,
											})}
											isError={errors.vestingPeriod ? true : false}
											error="Minimum of 30 days Vesting period is needed."
										/>
									</div>
									<div className="sm:col-span-3">
										<TextField
											label="Team wallet"
											id="team1"
											defaultValue=""
											placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
											{...register("team1", {
												minLength: 42,
												pattern: /^[A-Za-z0-9]+$/i,
											})}
											isError={errors.team1 ? true : false}
											error="Please provide a valid wallet address."
										/>
									</div>

									<div className="sm:col-span-3">
										<TextField
											label="Percentage share"
											id="team1p"
											placeholder="0"
											{...register("team1p", {
												max: 1,
												min: 0,
											})}
											isPercent={true}
											isError={errors.team1p ? true : false}
											error="Share cannot be more than 1%."
										/>
									</div>
									<div className="sm:col-span-3">
										<TextField
											label="Team wallet 2"
											id="team2"
											defaultValue=""
											placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
											{...register("team2", {
												minLength: 42,
												pattern: /^[A-Za-z0-9]+$/i,
											})}
											isError={errors.team2 ? true : false}
											error="Please provide a valid wallet address."
										/>
									</div>

									<div className="sm:col-span-3">
										<TextField
											label="Percentage share"
											id="team2p"
											placeholder="0"
											{...register("team2p", {
												max: 1,
												min: 0,
											})}
											isPercent={true}
											isError={errors.team2p ? true : false}
											error="Share cannot be more than 1%."
										/>
									</div>
									<div className="sm:col-span-3">
										<TextField
											label="Team wallet 3"
											id="team3"
											defaultValue=""
											placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
											{...register("team3", {
												minLength: 42,
												pattern: /^[A-Za-z0-9]+$/i,
											})}
											isError={errors.team3 ? true : false}
											error="Please provide a valid wallet address."
										/>
									</div>

									<div className="sm:col-span-3">
										<TextField
											label="Percentage share"
											id="team3p"
											placeholder="0"
											{...register("team3p", {
												max: 1,
												min: 0,
											})}
											isPercent={true}
											isError={errors.team3p ? true : false}
											error="Share cannot be more than 1%."
										/>
									</div>
									<div className="sm:col-span-3">
										<TextField
											label="Team wallet 4"
											id="team4"
											defaultValue=""
											placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
											{...register("team4", {
												minLength: 42,
												pattern: /^[A-Za-z0-9]+$/i,
											})}
											isError={errors.team4 ? true : false}
											error="Please provide a valid wallet address."
										/>
									</div>

									<div className="sm:col-span-3">
										<TextField
											label="Percentage share"
											id="team4p"
											placeholder="0"
											{...register("team4p", {
												max: 1,
												min: 0,
											})}
											isPercent={true}
											isError={errors.team4p ? true : false}
											error="Share cannot be more than 1%."
										/>
									</div>
									<div className="sm:col-span-3">
										<TextField
											label="Team wallet 5"
											id="team5"
											defaultValue=""
											placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
											{...register("team5", {
												minLength: 42,
												pattern: /^[A-Za-z0-9]+$/i,
											})}
											isError={errors.team5 ? true : false}
											error="Please provide a valid wallet address."
										/>
									</div>

									<div className="sm:col-span-3">
										<TextField
											label="Percentage share"
											id="team5p"
											placeholder="0"
											{...register("team5p", {
												max: 1,
												min: 0,
											})}
											isPercent={true}
											isError={errors.team5p ? true : false}
											error="Share cannot be more than 1%."
										/>
									</div>
									<Link
										href="#"
										className="px-6 py-2 select-none rounded-md text-white bg-blue-500 hover:bg-blue-600 me-2 mb-2"
									>
										Add Team member
									</Link>
								</div>
							</div>

							<div className="border-b border-gray-600 pb-12">
								<h2 className="text-base font-semibold leading-7 text-white">Advanced settings</h2>
								<p className="mt-1 text-sm leading-6 text-white">This section is for advanced users.</p>
								<div className="relative flex gap-x-3">
									<div className="flex h-6 items-center">
										<input
											id="user"
											name="user"
											type="checkbox"
											className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
										/>
									</div>
									<div className="text-sm leading-6">
										<label htmlFor="user" className="font-medium text-white">
											I'm an advanced user
										</label>
									</div>
								</div>

								<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
									<div className="sm:col-span-3">
										<TextField
											label="Max Transaction Limit"
											id="maxTx"
											placeholder="0"
											{...register("maxTx", {
												max: 1,
												min: 0,
											})}
											isError={errors.maxTx ? true : false}
											error="Please provide a valid limit."
										/>
									</div>

									<div className="sm:col-span-3">
										<TextField
											label="Max Wallet Limit"
											id="maxWallet"
											placeholder="0"
											{...register("maxWallet", {
												max: 1,
												min: 0,
											})}
											isError={errors.maxWallet ? true : false}
											error="Please provide a valid limit."
										/>
									</div>

									<div className="sm:col-span-3">
										<TextField
											label="Tax Swap Threshold"
											id="taxSwapThreshold"
											placeholder="1000"
											{...register("taxSwapThreshold", {
												max: 1000,
												min: 0,
											})}
											isError={errors.taxSwapThreshold ? true : false}
											error="Please provide a valid limit."
										/>
									</div>

									<div className="sm:col-span-3">
										<TextField
											label="Max Tax Swap"
											id="maxSwap"
											placeholder="10000"
											{...register("maxSwap", {
												max: 10000,
												min: 0,
											})}
											isError={errors.maxSwap ? true : false}
											error="Please provide a valid limit."
										/>
									</div>

									<div className="sm:col-span-3">
										<TextField
											label="Prevent Swap Before"
											id="preventSwap"
											placeholder="10"
											{...register("preventSwap", {
												max: 10,
												min: 0,
											})}
											isError={errors.preventSwap ? true : false}
											error="Please provide a valid limit."
										/>
									</div>
								</div>
							</div>
							<div className="border-b border-gray-600 pb-12">
								<h2 className="text-base font-semibold leading-7 text-white">Payment methods</h2>
								<p className="mt-1 text-sm leading-6 text-white">
									You can either go for a free tier, or pay us with wither ETH or SAFU tokens.
								</p>
								<div className="sm:col-span-3 mt-4">
									<label htmlFor="template" className="block text-sm font-medium leading-6 text-white">
										Choose the tier
									</label>
									<div className="mt-2">
										<select
											id="tier"
											name="tier"
											defaultValue="Premium"
											className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:max-w-xs sm:text-sm sm:leading-6 bg-neutral-800 outline-0 ps-2 pe-2 appearance-none"
										>
											<option>Premium</option>
											<option>Free</option>
										</select>
									</div>
								</div>

								<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
									<div className="sm:col-span-3">
										<label htmlFor="amount" className="block text-sm font-medium leading-6 text-white">
											Amount
										</label>
										<div className="mt-2 relative">
											<input
												type="text"
												id="amount"
												defaultValue="20"
												className={
													"block w-full rounded-md ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 bg-neutral-800 outline-0 " +
													(errors.lptax
														? "border border-pink-600"
														: "border-0 focus:ring-blue-400 focus:ring-2 focus:ring-inset ring-1 ring-inset ring-gray-600")
												}
												placeholder="20"
												// {...register("lptax", {
												//   required: true,
												//   max: 20,
												//   min: 0,
												// })}
												name="amount"
											/>
											{errors.lptax && (
												<div className="absolute inset-y-0 right-0 flex items-center pr-4">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 20 20"
														fill="currentColor"
														aria-hidden="true"
														className="h-5 w-5 text-pink-600"
													>
														<path
															fill-rule="evenodd"
															d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
															clip-rule="evenodd"
														></path>
													</svg>
												</div>
											)}
										</div>
										{errors.lptax && <p className="mt-2 text-pink-600 text-sm">Tax should be between 0 to 20.</p>}
									</div>

									<div className="sm:col-span-3">
										<label htmlFor="template" className="block text-sm font-medium leading-6 text-white">
											Choose currency
										</label>
										<div className="mt-2">
											<select
												id="currency"
												name="currency"
												defaultValue="SAFU"
												className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:max-w-xs sm:text-sm sm:leading-6 bg-neutral-800 outline-0 ps-2 pe-2 appearance-none"
											>
												<option>SAFU</option>
												<option>Etherium</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="px-5 py-2.5">{error && <span>There has been an error in the launch</span>}</div>
						<input
							type="submit"
							value="Launch"
							className="px-6 py-2 select-none rounded-md text-white bg-blue-500 hover:bg-blue-600 me-2 mb-2 cursor-pointer"
						/>
					</form>
				</div>
			)}
		</>
	);
}
export default Launch;
