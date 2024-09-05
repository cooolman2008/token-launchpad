"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatEther, getAddress } from "viem";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import {
	useAccount,
	useWriteContract,
	useWalletClient,
	useWaitForTransactionReceipt,
	useChainId,
	useReadContract,
} from "wagmi";
import Select from "react-select";
import { useForm, SubmitHandler } from "react-hook-form";

import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";
import Advanced from "@/components/Modules/Launch/Advanced";
import Premium from "@/components/Modules/Launch/Premium";
import Basic from "@/components/Modules/Launch/Basic";
import Tax from "@/components/Modules/Launch/Tax";

import { LaunchForm, updateFields } from "@/utils/launchHelper";
import { getContractAddress, getRouterAddress } from "@/utils/utils";

import templateOptions from "../../static/templates.json";

import { managerAbi } from "@/abi/managerAbi";
import { AnimationOptionsWithOverrides } from "motion";
import { helperAbi } from "@/abi/helperAbi";

export const arrowOptions: AnimationOptionsWithOverrides = {
	easing: "ease-in-out",
	duration: 0.5,
	direction: "alternate",
};

function Launch() {
	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();
	const router = useRouter();
	const { open } = useWeb3Modal();

	const chainId = useChainId();
	const ROUTER_ADDRESS = getRouterAddress(chainId);
	const CONTRACT_ADDRESS = getContractAddress(chainId);

	const [isClient, setIsClient] = useState(false);
	const [paid, setPaid] = useState("");
	const [initTaxType, setInitTaxType] = useState(1);
	const [template, setTemplate] = useState(templateOptions.templates[0]);
	const [processing, setProcessing] = useState(false);
	const [setting, setSetting] = useState(false);
	const [error, setError] = useState("");
	const [launchCost, setLaunchCost] = useState(BigInt(0));

	const clear = () => {
		setError("");
	};

	// get Promo costs from SAFU launcher.
	const { data: launcherData } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: helperAbi,
		functionName: "getLauncherDetails",
	});

	useEffect(() => {
		// if (launcherData?.safuCost) {
		// 	console.log(formatEther(launcherData?.safuCost));
		// }
		if (launcherData) {
			setLaunchCost(launcherData.ethCost);
		}
	}, [launcherData]);

	// contract call for token launch.
	const {
		writeContract: launchFree,
		isPending,
		data,
	} = useWriteContract({
		mutation: {
			onSuccess(res) {
				setProcessing(false);
				console.log(res);
			},
			onError(error) {
				setProcessing(false);
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
	}, [transaction, router, setSetting]);

	// handle form & fire launch token with the form details.
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		resetField,
		formState: { errors },
	} = useForm<LaunchForm>();
	const onSubmit: SubmitHandler<LaunchForm> = (formData) => {
		setProcessing(true);
		console.log(CONTRACT_ADDRESS);
		if (address && CONTRACT_ADDRESS && ROUTER_ADDRESS) {
			if (paid === "ETH") {
				launchFree({
					address: CONTRACT_ADDRESS,
					abi: managerAbi,
					functionName: "launchTokenEth",
					args: [
						{
							owner: address,
							taxWallet: getAddress(formData.taxWallet),
							stakingFacet: CONTRACT_ADDRESS,
							v2router: ROUTER_ADDRESS,
							isFreeTier: false,
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
							taxSwapThreshold: BigInt(
								formData.taxSwapThreshold ? formData.taxSwapThreshold : template.taxSwapThreshold
							),
							name: formData.name,
							symbol: formData.symbol,
						},
					],
					value: launchCost,
				});
			} else if (paid === "SAFU") {
				launchFree({
					address: CONTRACT_ADDRESS,
					abi: managerAbi,
					functionName: "launchTokenBridge",
					args: [
						{
							owner: address,
							taxWallet: getAddress(formData.taxWallet),
							stakingFacet: CONTRACT_ADDRESS,
							v2router: ROUTER_ADDRESS,
							isFreeTier: false,
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
							taxSwapThreshold: BigInt(
								formData.taxSwapThreshold ? formData.taxSwapThreshold : template.taxSwapThreshold
							),
							name: formData.name,
							symbol: formData.symbol,
						},
					],
				});
			} else {
				console.log({
					type: "free",
					owner: address,
					taxWallet: getAddress(formData.taxWallet),
					stakingFacet: CONTRACT_ADDRESS,
					v2router: ROUTER_ADDRESS,
					isFreeTier: true,
					minLiq: BigInt(0),
					supply: BigInt(formData.supply),
					initTaxType: BigInt(initTaxType),
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
				});
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
							taxSwapThreshold: BigInt(
								formData.taxSwapThreshold ? formData.taxSwapThreshold : template.taxSwapThreshold
							),
							name: formData.name,
							symbol: formData.symbol,
						},
					],
				});
			}
		} else {
			setProcessing(false);
		}
	};

	useEffect(() => {
		updateFields(setValue, resetField, templateOptions.templates[0]);
		setIsClient(true);
	}, [resetField, setValue]);

	return (
		<>
			{isClient && (
				<>
					{(isPending || retrieval || processing) && <Loading msg="Launching..." />}
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
											updateFields(setValue, resetField, selectedTemplate);
											setTemplate(selectedTemplate);
										}
									}}
									options={templateOptions.options}
								/>
							</div>
						</div>
						<Basic register={register} setValue={setValue} errors={errors} />
						<Tax register={register} getValues={getValues} errors={errors} setInitTaxType={setInitTaxType} />
						<Advanced register={register} getValues={getValues} errors={errors} />
						<Premium register={register} errors={errors} setPaid={setPaid} />
						<div className="w-full flex justify-center mt-4">
							{walletClient ? (
								<input type="submit" value="Launch" className="safu-button-primary" />
							) : (
								<button className="mr-8 safu-soft-button" onClick={() => open()}>
									Connect Wallet
								</button>
							)}
						</div>
					</form>
				</>
			)}
		</>
	);
}
export default Launch;
