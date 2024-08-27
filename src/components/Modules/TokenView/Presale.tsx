import {
	useWalletClient,
	useReadContract,
	useWriteContract,
	useWaitForTransactionReceipt,
	useChainId,
	useEstimateFeesPerGas,
	usePublicClient,
} from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { formatEther, getAddress, parseEther } from "viem";

import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import { getAbr, getNumber } from "@/utils/math";
import { presaleAbi } from "@/abi/presaleAbi";
import { animate, AnimationControls, spring } from "motion";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { getSymbol } from "@/utils/utils";
import { scrollTo } from "@/utils/uiUtils";
import { registerReferral } from "@/utils/tokenHelper";

interface PresaleForm {
	amount: number;
	eth: string;
	walletaddress: string;
}

interface Presale {
	softcap: bigint;
	hardcap: bigint;
	startTs: bigint;
	duration: bigint;
	sold: bigint;
	maxEth: bigint;
	maxBag: bigint;
}

const Presale = ({
	symbol,
	presaleAddress,
	address,
	safuAddress,
	contractAddress,
}: {
	symbol: string;
	presaleAddress: `0x${string}`;
	address?: `0x${string}`;
	safuAddress: `0x${string}`;
	contractAddress: `0x${string}`;
}) => {
	const { data: walletClient } = useWalletClient();
	const publicClient = usePublicClient();
	const { open } = useWeb3Modal();
	const chain = useChainId();

	const [presale, setPresale] = useState<Presale>();
	const [bought, setBought] = useState(BigInt(0));
	const [referral, setReferral] = useState(false);
	const [maxBag, setMaxBag] = useState(0);
	const [price, setPrice] = useState(BigInt(0));
	const [gasFee, setGasFee] = useState(BigInt(0));
	const [remaining, setRemaining] = useState(0);
	const [trans, setTrans] = useState<`0x${string}`>();
	const [animation, setAnimation] = useState<AnimationControls>();

	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// get presale details.
	const { data: presaleData, refetch } = useReadContract({
		address: presaleAddress,
		abi: presaleAbi,
		functionName: "getPresaleDetails",
	});

	useEffect(() => {
		if (presaleData) {
			setPresale(presaleData);
		}
	}, [presaleData]);

	const { data: gas, refetch: reGas } = useEstimateFeesPerGas({
		chainId: chain,
	});

	// get user claimable token details.
	const { data: claimables, refetch: getBought } = useReadContract({
		address: presaleAddress,
		abi: presaleAbi,
		functionName: "getClaimableTokens",
		args: [address ? address : "0x0000000000000000000"],
	});

	useEffect(() => {
		console.log(claimables);
		if (claimables && claimables?.length > 0) {
			setBought(claimables[2]);
		}
	}, [claimables]);

	// contract call to buy presale tokens.
	const { isPending: buying, writeContract: buyTokens } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				resetField("amount");
				resetField("eth");
				const address = walletClient?.account.address;
				if (
					address &&
					contractAddress.toLowerCase() === safuAddress.toLowerCase() &&
					res &&
					getValues("walletaddress") &&
					referral
				) {
					registerReferral(contractAddress, res, getAddress(getValues("walletaddress")), address, formatEther(price));
				}
				setPrice(BigInt(0));
				setTrans(res);
				setSuccess("Your presale tokens are on it's way!");
				animation?.play();
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});

	// get the transaction details by waiting for the transaction.
	const {
		data: transaction,
		isLoading: retrieval,
		isError,
	} = useWaitForTransactionReceipt({
		hash: trans,
	});

	useEffect(() => {
		if (transaction) {
			animation?.stop();
			getBought();
			refetch();
		} else if (isError) {
			setError("Something went wrong!");
		}
	}, [transaction, getBought, refetch, trans, animation, isError]);

	useEffect(() => {
		setAnimation(
			animate(
				"#bought",
				{ opacity: [1, 0.4] },
				{
					easing: "ease-in-out",
					duration: 0.5,
					direction: "alternate",
					repeat: Infinity,
				}
			)
		);
		if (presale) {
			setMaxBag(getNumber(presale.maxBag));
			const remaining = presale.maxBag - bought;
			const available = presale.hardcap - presale.sold;
			remaining > available ? setRemaining(getNumber(available)) : setRemaining(getNumber(remaining));
		}
	}, [bought, presale]);

	useEffect(() => {
		if (animation) {
			animation.stop();
		}
	}, [animation]);

	// handle buy form.
	const {
		register,
		handleSubmit,
		setValue,
		clearErrors,
		resetField,
		getValues,
		trigger,
		formState: { errors },
	} = useForm<PresaleForm>();
	const onSubmit: SubmitHandler<PresaleForm> = (formData) => {
		if (presale?.maxEth && presale?.hardcap) {
			const amount = parseEther(formData.amount.toString());
			const pay = (amount * presale?.maxEth) / presale?.hardcap;
			buyTokens({
				address: presaleAddress,
				abi: presaleAbi,
				functionName: "buyTokens",
				account: walletClient?.account,
				args: [amount],
				value: pay,
			});
		}
	};

	useEffect(() => {
		if (publicClient && gas && getValues("amount") > 0 && price > BigInt(0))
			publicClient
				.estimateContractGas({
					address: presaleAddress,
					abi: presaleAbi,
					functionName: "buyTokens",
					args: [parseEther(getValues("amount").toString())],
					value: price,
				})
				.then((res) => {
					if (gas) {
						setGasFee(gas.maxFeePerGas * res);
					}
				})
				.catch((error) => {
					console.log(error);
				});
	}, [gas, getValues, presaleAddress, price, publicClient, walletClient?.account]);

	return (
		<>
			{buying && <Loading msg="Getting presale tokens for you..." />}
			{success && <Modal msg={success} />}
			{error && (
				<Modal
					msg={error}
					des="Check if you have adequete balance in the right network, else please try again!"
					error={true}
					callback={() => {
						setError("");
					}}
				/>
			)}
			<div className="presale-container mb-12">
				<div className="flex justify-between mb-2 items-center relative">
					<h2 className="text-2xl">Presale</h2>
					<span
						className={
							"text-sm font-normal " +
							(presale?.sold && presale?.softcap && presale?.sold > presale?.softcap
								? "text-green-400"
								: "text-amber-400")
						}
					>
						<b className="text-sm font-normal text-gray-400">Sold: </b>{" "}
						{presale?.sold ? getAbr(getNumber(presale?.sold)) : "0"}
					</span>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="mb-4" autoComplete="off">
					<div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900">
						<div className="border-b border-neutral-800">
							<div className="flex justify-between mb-2">
								<span className="text-sm font-light text-gray-400">
									Softcap: {presale?.softcap ? getAbr(getNumber(presale?.softcap)) : "0"}
								</span>
								<span className="text-sm font-normal text-gray-400">
									Hardcap: {presale?.hardcap ? getAbr(getNumber(presale?.hardcap)) : "0"}
								</span>
							</div>
							<div className="flex justify-between mb-2">
								<div className="w-full h-4 relative rounded-xl bg-neutral-800  border-neutral-700/60">
									<div
										className={
											"absolute top-0 left-0 right-0 bottom-0 rounded-l-xl text-sm text-black pl-2" +
											(presale?.sold && presale?.softcap && presale?.sold > presale?.softcap
												? " bg-green-600"
												: " bg-amber-400")
										}
										style={
											presale?.sold && presale?.sold > 0
												? {
														width: (Number(presale?.sold) * 100) / Number(presale?.hardcap) + "%",
												  }
												: { visibility: "hidden" }
										}
									></div>
								</div>
							</div>
							<div className="flex max-md:flex-col justify-between mb-4">
								<span className={"text-sm font-normal text-gray-400"} id="bought">
									<b className="text-sm font-normal text-gray-400">Wallet limit:</b>{" "}
									{presale?.maxBag ? getAbr(getNumber(bought)) + " / " + getAbr(getNumber(presale?.maxBag)) : "0"}{" "}
									{symbol.toUpperCase()}
								</span>
							</div>
						</div>
						<div className="w-full flex flex-col my-4">
							<div className="block flex justify-between">
								<span className="text-sm leading-6 text-gray-400">You pay</span>
								<span className="text-sm leading-6 text-gray-400">
									Max:{" "}
									{presale?.maxEth && presale?.hardcap
										? parseFloat(
												Number(
													formatEther((parseEther(remaining.toString()) * presale?.maxEth) / presale?.hardcap)
												).toFixed(10)
										  )
										: 0}
								</span>
							</div>
							<div className="flex">
								<input
									type="text"
									id="eth"
									placeholder="0"
									{...register("eth", {
										required: { value: true, message: "Eth can't be empty" },
										pattern: { value: /^[0-9.]+$/i, message: "Eth should be a number" },
										max: {
											value:
												presale?.maxEth && presale?.hardcap
													? Number(formatEther((parseEther(remaining.toString()) * presale?.maxEth) / presale?.hardcap))
													: 100,
											message: "Please keep ETH below wallet limit",
										},
										onChange: (event) => {
											if (!isNaN(event.target.value)) {
												if (event.target.value > 0) {
													const eth = parseEther(event.target.value.toString());
													if (presale?.maxEth && presale?.hardcap)
														setValue(
															"amount",
															Math.floor(Number(formatEther((eth * presale?.hardcap) / presale?.maxEth))),
															{ shouldValidate: true }
														);
													trigger("eth");
												} else {
													clearErrors("eth");
													resetField("amount");
												}
												setPrice(parseEther(event.target.value));
											}
										},
									})}
									className="block w-full rounded-xl pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-3xl"
								/>
								<span className="block sm:text-3xl leading-6 text-gray-400 pt-1.5">{getSymbol(chain)}</span>
							</div>
							{errors.eth && <p className="w-full mb-2 text-pink-600 text-sm">{errors.eth.message}</p>}
						</div>
						<div className="w-full flex flex-col">
							<div className="block flex justify-between">
								<span className="text-sm leading-6 text-gray-400">You get</span>
								<span className="text-sm leading-6 text-gray-400">Max: {remaining ? remaining : "0"}</span>
							</div>
							<div className="flex">
								<input
									type="text"
									id="amount"
									placeholder="0"
									{...register("amount", {
										required: { value: true, message: "Amount can't be empty" },
										pattern: { value: /^[0-9.]+$/i, message: "Amount should be a number" },
										min: { value: 1, message: "Minimum 1 SAFU is needed" },
										max: {
											value: remaining,
											message: "Please keep amount below wallet limit",
										},
										onChange: (event) => {
											if (!isNaN(event.target.value)) {
												if (event.target.value > 0) {
													const amount = parseEther(event.target.value.toString());
													if (presale?.maxEth && presale?.hardcap) {
														const eth = (amount * presale?.maxEth) / presale?.hardcap;
														setPrice(eth);
														setValue("eth", formatEther(eth), {
															shouldValidate: true,
														});
													}
													trigger("amount");
												} else {
													clearErrors("amount");
													resetField("eth");
													setPrice(BigInt(0));
												}
											}
										},
									})}
									className="block w-full rounded-xl pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-3xl"
								/>
								<span className="block sm:text-3xl leading-6 text-gray-400 pt-1.5">{symbol.toUpperCase()}</span>
							</div>
							{errors.amount && <p className="w-full mb-2 text-pink-600 text-sm">{errors.amount.message}</p>}
						</div>
						{contractAddress.toLowerCase() === safuAddress.toLowerCase() && (
							<div className="w-full flex flex-col pt-4 mt-4 mb-2 border-t border-neutral-800">
								<div className="block flex">
									<button
										type="button"
										className="group outline-0 mr-2"
										onClick={() => {
											if (referral) {
												scrollTo("body");
												animate("#referral", { maxHeight: 0, opacity: 0 }, { easing: "ease-in-out" });
											} else {
												scrollTo("referral");
												animate(
													"#referral",
													{ maxHeight: "340px", opacity: 1 },
													{ easing: spring({ stiffness: 300, damping: 16, mass: 0.4 }), delay: 0.1 }
												);
											}
											setReferral(!referral);
										}}
									>
										<div
											className={
												"rounded-md border-neutral-700 w-4 h-4 flex items-center justify-center group-focus:outline-blue-600 group-focus:outline group-focus:border-2" +
												(referral ? " bg-blue-600" : " border-2 bg-neutral-800")
											}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 16 16"
												className={"fill-slate-200 " + (referral ? "" : "hidden")}
											>
												<path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
											</svg>
										</div>
									</button>
									<span className="text-sm leading-6 text-gray-400">I have a referral</span>
								</div>
								<div id="referral" className="flex flex-col max-h-0 overflow-hidden">
									<span className="block sm:text-sm leading-6 text-gray-400 mt-4 mb-2">Wallet</span>
									<input
										type="text"
										id="walletaddress"
										placeholder="0xXXXXXXXXXXXXXXXXXXX"
										{...register("walletaddress", {
											required: { value: referral, message: "Referrer Wallet is needed" },
											minLength: { value: 42, message: "Referrer Wallet not valid" },
											pattern: { value: /^[A-Za-z0-9]+$/i, message: "Referrer Wallet not valid!" },
										})}
										className="block w-full rounded-xl px-2 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-950 outline-0 sm:text-xl border-l border-gray-600"
									/>
									{errors.walletaddress && (
										<p className="w-full mb-2 text-pink-600 text-sm">{errors.walletaddress.message}</p>
									)}
								</div>
							</div>
						)}
					</div>
					{gasFee > BigInt(0) && price > BigInt(0) && (
						<div className="w-full flex flex-col">
							<p className="text-sm leading-6 text-gray-500 py-2">
								Estimated Gas: ~<b className="text-gray-400">{Number(formatEther(gasFee)).toFixed(14)} </b>
								{getSymbol(chain)}
							</p>
							<p className="text-sm leading-6 text-gray-500">
								Total ( Pay + Gas ) : ~
								<b className="text-gray-400">{Number(formatEther(price + gasFee)).toFixed(14)} </b>
								{getSymbol(chain)}
							</p>
						</div>
					)}

					{maxBag > 0 && (
						<div className="flex justify-between flex-wrap">
							<div className="flex justify-center flex-col mt-2 grow">
								{address ? (
									<input className="safu-button-primary cursor-pointer" type="submit" value="Buy" />
								) : (
									<span className="safu-soft-button text-center" onClick={() => open()}>
										Connect Wallet
									</span>
								)}
							</div>
						</div>
					)}
				</form>
			</div>
		</>
	);
};

export default Presale;
