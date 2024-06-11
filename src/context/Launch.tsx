"use client";

import { useAccount, useContractWrite, useWalletClient, useWaitForTransaction } from "wagmi";
import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { animate } from "motion";

import { LaunchForm, getArgs, updateFields } from "@/utils/launchHelper";
import { getContractAddress } from "@/utils/utils";

import Loading from "@/components/elements/Loading";
import Switch from "@/components/elements/Switch";
import Modal from "@/components/elements/Modal";

import Advanced from "@/components/PageModules/Launch/Advanced";
import Premium from "@/components/PageModules/Launch/Premium";
import Basic from "@/components/PageModules/Launch/Basic";
import Tax from "@/components/PageModules/Launch/Tax";

import ManagerAbi from "../../managerabi.json";
import templateOptions from "../static/templates.json";

function Launch() {
	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();
	const router = useRouter();

	const { selectedNetworkId: chainId } = useWeb3ModalState();
	const CONTRACT_ADDRESS = getContractAddress(Number(chainId));

	const [isClient, setIsClient] = useState(false);
	const [tax, setTax] = useState(false);
	const [advanced, setAdvanced] = useState(false);
	const [premium, setPremium] = useState(false);
	const [template, setTemplate] = useState(templateOptions.templates[0]);
	const [error, setError] = useState("");

	// contract call for token launch.
	const {
		data: response,
		write,
		isLoading,
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
	const { data: transaction, isLoading: retrieval } = useWaitForTransaction({
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
		if (address) {
			const args = getArgs(address, CONTRACT_ADDRESS, formData, template);
			console.log(args);
			write({ args: [args] });
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
					{error && <Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} />}
					<form onSubmit={handleSubmit(onSubmit)} className="w-full">
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
							<h3 className="text-2xl mb-1">Customise token</h3>
							<p className="text-sm text-gray-500 mb-4">
								Enter wallet address or <b className="font-bold text-gray-400"> splitter contract </b> address as your
								tax wallet.
							</p>
							<Basic register={register} errors={errors} />
						</div>
						<div className="border-b border-gray-700 py-8">
							<div className="flex mb-1">
								<Switch
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
								<h3 className="text-2xl mb-1">Modify Tokenomics</h3>
							</div>
							<p className="text-sm text-gray-500 mb-4">
								Define your <b className="font-bold text-gray-400">tokenomics</b>.
							</p>
							{tax && <Tax register={register} errors={errors} />}
						</div>
						<div className="border-b border-gray-700 py-8">
							<div className="flex mb-1">
								<Switch
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
								<h3 className="text-2xl mb-1">I know this</h3>
							</div>
							<p className="text-sm text-gray-500 mb-4">
								You can configure <b className="font-bold text-gray-400">advanced settings</b> if you know what you are
								doing.
							</p>
							{advanced && <Advanced register={register} errors={errors} />}
						</div>
						<div className="border-b border-gray-700 py-8">
							<div className="flex mb-1">
								<Switch
									onChange={() => {
										if (premium) {
											animate("#premium", { maxHeight: 0 }, { easing: "ease-in-out" });
											setTimeout(() => {
												setPremium(!premium);
											}, 300);
										} else {
											setPremium(!premium);
										}
									}}
									checked={premium}
								/>
								<h3 className="text-2xl mb-1">Go premium</h3>
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
