"use client";

import { useAccount, useContractWrite, useWalletClient, useWaitForTransaction } from "wagmi";
import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { animate } from "motion";

import { LaunchForm, getArgs, updateFields } from "@/utils/launchHelper";
import { getContractAddress, getRouterAddress } from "@/utils/utils";

import Loading from "@/components/elements/Loading";
import Arrow from "@/components/elements/Arrow";
import Modal from "@/components/elements/Modal";

import Advanced from "@/components/PageModules/Launch/Advanced";
import Premium from "@/components/PageModules/Launch/Premium";
import Basic from "@/components/PageModules/Launch/Basic";
import Tax from "@/components/PageModules/Launch/Tax";

import ManagerAbi from "../../managerabi.json";
import templateOptions from "../static/templates.json";
import { WriteContractResult } from "wagmi/actions";

function Launch() {
	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();
	const router = useRouter();

	const { selectedNetworkId: chainId } = useWeb3ModalState();
	const CONTRACT_ADDRESS = getContractAddress(Number(chainId));
	const ROUTER_ADDRESS = getRouterAddress(Number(chainId));

	const [isClient, setIsClient] = useState(false);
	const [tax, setTax] = useState(false);
	const [advanced, setAdvanced] = useState(false);
	const [premium, setPremium] = useState(false);
	const [template, setTemplate] = useState(templateOptions.templates[0]);
	const [error, setError] = useState("");
	const [response, setResponse] = useState<WriteContractResult>();

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
		writeAsync: launchFree,
		isLoading,
		data,
	} = useContractWrite({
		address: CONTRACT_ADDRESS,
		abi: ManagerAbi.abi,
		functionName: "launchTokenFree",
		onSuccess(res) {
			console.log(res);
		},
		onError(error) {
			setError("Launch failed with an unknown reason!");
			console.log(error);
		},
	});

	// get the transaction details by waiting for the transaction.
	const {
		data: transaction,
		isLoading: retrieval,
		refetch,
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
			// Wait 1 second for the Graph to pick up the event.
			setTimeout(() => {
				router.push("/" + transaction?.logs[0]?.address, { scroll: true });
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
			const args = getArgs(address, CONTRACT_ADDRESS, formData, template, ROUTER_ADDRESS);
			console.log(args);
			launchFree({ args: [args] }).then((res) => {
				setResponse(res);
				refetch();
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
					{(isLoading || retrieval) && <Loading msg="Launching..." />}
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
								<w3m-button />
							</div>
						)}
					</form>
				</>
			)}
		</>
	);
}
export default Launch;
