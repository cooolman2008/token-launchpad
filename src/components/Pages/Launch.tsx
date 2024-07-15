"use client";

import { useAccount, useWriteContract, useWalletClient, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { useWeb3Modal, useWeb3ModalState } from "@web3modal/wagmi/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { animate } from "motion";

import { LaunchForm, updateFields } from "@/utils/launchHelper";
import { getContractAddress, getRouterAddress } from "@/utils/utils";

import Loading from "@/components/elements/Loading";
import Arrow from "@/components/elements/Arrow";
import Modal from "@/components/elements/Modal";

import Advanced from "@/components/Modules/Launch/Advanced";
import Premium from "@/components/Modules/Launch/Premium";
import Basic from "@/components/Modules/Launch/Basic";
import Tax from "@/components/Modules/Launch/Tax";

import templateOptions from "../../static/templates.json";
import { managerAbi } from "@/abi/managerAbi";
import { getAddress } from "viem";

function Launch() {
	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();
	const router = useRouter();
	const { open } = useWeb3Modal();

	const chainId = useChainId();
	const ROUTER_ADDRESS = getRouterAddress(chainId);
	const CONTRACT_ADDRESS = getContractAddress(chainId);

	const [isClient, setIsClient] = useState(false);
	const [tax, setTax] = useState(false);
	const [advanced, setAdvanced] = useState(false);
	const [premium, setPremium] = useState(false);
	const [template, setTemplate] = useState(templateOptions.templates[0]);
	const [setting, setSetting] = useState(false);
	const [error, setError] = useState("");

	const clear = () => {
		setError("");
	};

	const scrollTo = (id: string) => {
		const ele = document.getElementById(id);
		if (ele) {
			ele.scrollIntoView({
				behavior: "smooth",
			});
		}
	};

	// contract call for token launch.
	const {
		writeContract: launchFree,
		isPending,
		data,
	} = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
			},
			onError(error) {
				setError("Launch failed with an unknown reason!");
				console.log(error);
			},
		},
	});

	// get the transaction details by waiting for the transaction.
	const { data: transaction, isLoading: retrieval } = useWaitForTransactionReceipt({
		hash: data,
	});

	// redirect to the token page once the address is aquired from the waitForTransaction hook.
	useEffect(() => {
		if (transaction?.logs[0]?.address) {
			console.log(transaction?.logs[0]?.address);

			// Wait 1 second for the Graph to handle the event.
			setSetting(true);
			setTimeout(() => {
				setSetting(false);
				router.push("/" + transaction?.logs[0]?.address);
			}, 1000);
		}
	}, [transaction, router]);

	// handle form & fire launch token with the form details.
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<LaunchForm>();
	const onSubmit: SubmitHandler<LaunchForm> = (formData) => {
		console.log(CONTRACT_ADDRESS);
		if (address && CONTRACT_ADDRESS && ROUTER_ADDRESS) {
			launchFree({
				address: CONTRACT_ADDRESS,
				abi: managerAbi,
				functionName: "launchTokenFree",
				args: [
					{
						owner: address,
						taxWallet: getAddress(formData.taxWallet),
						stakingFacet: CONTRACT_ADDRESS,
						v2router: ROUTER_ADDRESS,
						isFreeTier: true,
						minLiq: BigInt(0),
						supply: BigInt(formData.supply),
						initTaxType: BigInt(0),
						initInterval: BigInt(formData.initInterval ? formData.initInterval : template.initInterval),
						countInterval: BigInt(formData.countInterval ? formData.countInterval : template.initInterval),
						maxBuyTax: BigInt(formData.maxBuyTax ? formData.maxBuyTax : template.maxBuyTax),
						minBuyTax: BigInt(formData.minBuyTax ? formData.minBuyTax : template.minBuyTax),
						maxSellTax: BigInt(formData.maxSellTax ? formData.maxSellTax : template.maxSellTax),
						minSellTax: BigInt(formData.minSellTax ? formData.minSellTax : template.minSellTax),
						lpTax: BigInt(formData.lpTax ? formData.lpTax : template.lpTax),
						maxWallet: BigInt(formData.maxWallet ? formData.maxWallet : template.maxWallet),
						maxTx: BigInt(formData.maxTx ? formData.maxTx : template.maxTx),
						preventSwap: BigInt(formData.preventSwap ? formData.preventSwap : template.preventSwap),
						maxSwap: BigInt(formData.maxSwap ? formData.maxSwap : template.maxSwap),
						taxSwapThreshold: BigInt(formData.taxSwapThreshold ? formData.taxSwapThreshold : template.taxSwapThreshold),
						name: formData.name,
						symbol: formData.symbol,
					},
				],
			});
		}
	};

	useEffect(() => {
		updateFields(setValue, templateOptions.templates[0]);
		setIsClient(true);
	}, [setValue]);

	// Error messages in case of redirection failure & display instructions to manually check the token from launches.

	return (
		<>
			{isClient && (
				<>
					{(isPending || retrieval) && <Loading msg="Launching..." />}
					{setting && <Loading msg="We're building a dashboard for your token..." />}
					{error && (
						<Modal
							msg={error}
							des="This might be a temporary issue, try again in sometime"
							error={true}
							callback={clear}
						/>
					)}
					<form onSubmit={handleSubmit(onSubmit)} className="w-full mb-48">
						<h2 className="block text-4xl lg:text-5xl font-thin safu-grad-text text-center uppercase py-8 lg:py-24">
							Launch your token in 60 seconds
						</h2>
						<div className="border-b border-gray-700 py-8">
							<h3 className="text-2xl mb-4">Choose a template</h3>
							<div className="w-80 lg:w-80">
								<Select
									unstyled={true}
									defaultValue={templateOptions.options[0]}
									classNames={{
										control: (state) => "bg-neutral-900 p-2 rounded-xl border-l border-gray-600 2xl:text-sm",
										menuList: (state) => "bg-neutral-900 mt-1 rounded-xl 2xl:text-sm",
										option: (state) => " flex flex-col justify-center px-4 py-2 cursor-pointer",
									}}
									onChange={(value) => {
										const selectedTemplate = templateOptions.templates.find((x) => x.symbol === value?.value);
										if (selectedTemplate) {
											updateFields(setValue, selectedTemplate);
											setTemplate(selectedTemplate);
										}
									}}
									options={templateOptions.options}
								/>
							</div>
						</div>
						<div className="border-b border-gray-700 py-8">
							<h3 className="text-2xl mb-1">Customise Token</h3>
							<p className="text-sm text-gray-500 mb-4">
								Enter wallet address or <b className="font-bold text-gray-400"> splitter contract </b> address as your
								tax wallet.
							</p>
							<Basic register={register} errors={errors} />
						</div>
						<div id="tax_container" className="border-b border-gray-700 py-8">
							<div className="flex mb-1">
								<Arrow
									onClick={(event) => {
										if (tax) {
											animate(
												event.currentTarget,
												{ rotate: 0 },
												{ easing: "ease-in-out", duration: 0.5, direction: "alternate" }
											);
											animate("#tax", { maxHeight: 0 }, { easing: "ease-in-out" });
											setTimeout(() => {
												setTax(!tax);
											}, 300);
										} else {
											scrollTo("tax_container");
											animate(
												event.currentTarget,
												{ rotate: [0, -180] },
												{ easing: "ease-in-out", duration: 0.5, direction: "alternate" }
											);
											setTax(!tax);
										}
									}}
									checked={tax}
								/>
								<h3 className="text-2xl mb-1">Modify Tokenomics</h3>
							</div>
							<p className="text-sm text-gray-500 mb-4">
								Define your <b className="font-bold text-gray-400">tokenomics</b>.
							</p>
							{tax && <Tax register={register} errors={errors} />}
						</div>
						<div id="advanced_container" className="border-b border-gray-700 py-8">
							<div className="flex mb-1">
								<Arrow
									onClick={(event) => {
										if (advanced) {
											animate(
												event.currentTarget,
												{ rotate: 0 },
												{ easing: "ease-in-out", duration: 0.5, direction: "alternate" }
											);
											animate("#advanced", { maxHeight: 0 }, { easing: "ease-in-out" });
											setTimeout(() => {
												setAdvanced(!advanced);
											}, 200);
										} else {
											scrollTo("advanced_container");
											animate(
												event.currentTarget,
												{ rotate: [0, -180] },
												{ easing: "ease-in-out", duration: 0.5, direction: "alternate" }
											);
											setAdvanced(!advanced);
										}
									}}
									checked={advanced}
								/>
								<h3 className="text-2xl mb-1">Advanced Settings</h3>
							</div>
							<p className="text-sm text-gray-500 mb-4">
								If you <b className="font-bold text-gray-400">know</b> what you are doing, configure the settings.
							</p>
							{advanced && <Advanced register={register} errors={errors} />}
						</div>
						<div id="premium_container" className="py-8">
							<div className="flex mb-1">
								<Arrow
									onClick={(event) => {
										if (premium) {
											animate(
												event.currentTarget,
												{ rotate: 0 },
												{ easing: "ease-in-out", duration: 0.5, direction: "alternate" }
											);
											animate("#premium", { maxHeight: 0 }, { easing: "ease-in-out" });
											setTimeout(() => {
												setPremium(!premium);
											}, 300);
										} else {
											scrollTo("premium_container");
											animate(
												event.currentTarget,
												{ rotate: [0, -180] },
												{ easing: "ease-in-out", duration: 0.5, direction: "alternate" }
											);
											setPremium(!premium);
										}
									}}
									checked={premium}
								/>
								<h3 className="text-2xl mb-1">Go Premium</h3>
							</div>
							<p className="text-sm text-gray-500 mb-4">
								Pay once and access <b className="font-bold text-gray-400">premium features</b>.
							</p>
							{premium && <Premium register={register} errors={errors} />}
						</div>
						{walletClient ? (
							<div className="w-full flex justify-center mt-4">
								<input type="submit" value="Launch" className="safu-button-primary" />
							</div>
						) : (
							<div className="w-full flex justify-center mt-4">
								<button className="mr-8 safu-soft-button" onClick={() => open()}>
									Connect Wallet
								</button>
							</div>
						)}
					</form>
				</>
			)}
		</>
	);
}
export default Launch;