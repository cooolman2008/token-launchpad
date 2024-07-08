import { useContractWrite, useWalletClient } from "wagmi";
import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, SetStateAction, Dispatch } from "react";
import { parseEther } from "viem";

import TextField from "@/components/elements/TextField";
import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

// Token & helper ABIs.
import Helperabi from "../../../../helperabi.json";
import Tokenabi from "../../../../newtokenabi.json";

import { getContractAddress } from "@/utils/utils";

interface PresaleForm {
	percent: number;
	liqPercent: number;
	duration: number;
	cliffPeriod: number;
	vestingPeriod: number;
	maxEth: number;
	maxBag: number;
	saftcap: number;
}

const LaunchPresale = ({
	contractAddress,
	presaleAddress,
	setSuccess,
}: {
	contractAddress: `0x${string}`;
	presaleAddress?: `0x${string}`;
	setSuccess: Dispatch<SetStateAction<string>>;
}) => {
	const { data: walletClient } = useWalletClient();
	const [error, setError] = useState("");

	const { selectedNetworkId: chainId } = useWeb3ModalState();
	const CONTRACT_ADDRESS = getContractAddress(Number(chainId));

	const clear = () => {
		setError("");
	};

	// contract call to launch presale contract.
	const { isLoading: launching, write: launch } = useContractWrite({
		address: CONTRACT_ADDRESS,
		abi: Helperabi.abi,
		functionName: "launchPresale",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
			setSuccess("Presale contract was launched successfully");
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});

	// contract call to setup & start presale.
	const { isLoading: setting, write: setup } = useContractWrite({
		address: contractAddress,
		abi: Tokenabi.abi,
		functionName: "addPresale",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
			setSuccess("Presale setup was successful");
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});

	// handle presale setup form.
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<PresaleForm>();
	const onSubmit: SubmitHandler<PresaleForm> = (formData) => {
		setup({
			args: [
				presaleAddress,
				formData.percent * 100,
				{
					owner: walletClient?.account.address,
					token: contractAddress,
					softcap: parseEther("1"),
					hardcap: parseEther("2"),
					startTs: 1718276705,
					finishTs: 1718276705,
					duration: formData.duration,
					liqPercent: formData.liqPercent,
					cliffPeriod: formData.cliffPeriod,
					vestingPeriod: formData.vestingPeriod,
					status: parseEther("0.01"),
					sold: parseEther("0.01"),
					maxEth: parseEther(formData.maxEth.toString()),
					maxBag: parseEther(formData.maxBag.toString()), // supply * percent /10
					fee: parseEther("0.01"),
				},
			],
		});
	};
	return (
		<>
			{launching && <Loading msg="Launching a presale contract..." />}
			{setting && <Loading msg="Setting & starting your presales..." />}
			{error && (
				<Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} callback={clear} />
			)}
			<div className="w-full py-8 border-b border-gray-700">
				{presaleAddress !== "0x0000000000000000000000000000000000000000" ? (
					<>
						<h2 className="text-xl mb-1">Start your Presales</h2>
						<p className="text-sm text-gray-500 mb-4">
							Setup presale for your token.
							<br />
							Softcap will be 25% of your token hardcap.
						</p>
						<div className="w-full pb-4 rounded-xl">
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="w-full flex justify-between flex-wrap">
									<TextField
										label="Liquidity share"
										id="liqPercent"
										defaultValue="80"
										placeholder="0"
										{...register("liqPercent", {
											required: true,
											min: 80,
											max: 100,
										})}
										isPercent={true}
										isError={errors.liqPercent ? true : false}
										error="Liquidity share should be between 80-100%"
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
									/>
									<TextField
										label="Duration"
										id="duration"
										{...register("duration", {
											required: true,
											min: 1,
											max: 30,
										})}
										defaultValue={7}
										placeholder="10"
										isError={errors.duration ? true : false}
										error="Duration should be within 1-30 days"
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2 "
										padding="md:pr-0"
									/>
									<TextField
										label="Cliff period"
										id="cliffPeriod"
										placeholder="2"
										defaultValue={2}
										{...register("cliffPeriod", {
											required: true,
											min: 1,
											max: 30,
										})}
										isError={errors.cliffPeriod ? true : false}
										error="Minimum of 1 day Cliff period is needed."
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
									/>
									<TextField
										label="Vesting period"
										id="vestingPeriod"
										placeholder="7"
										defaultValue={7}
										{...register("vestingPeriod", {
											required: true,
											min: 7,
											max: 30,
										})}
										isError={errors.vestingPeriod ? true : false}
										error="Minimum of 7 day Vesting period is needed."
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2 "
										padding="md:pr-0"
									/>
									<TextField
										label="ETH hardcap"
										id="maxEth"
										defaultValue="1"
										placeholder="0"
										{...register("maxEth", {
											required: true,
										})}
										isError={errors.maxEth ? true : false}
										error="Maximum ETH is needed"
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
									/>
									<TextField
										label="Max bag"
										id="maxBag"
										defaultValue="10000"
										placeholder="0"
										{...register("maxBag", {
											required: true,
										})}
										isError={errors.maxBag ? true : false}
										error="Max bag should be less than 10% of hardcap"
										width="w-32"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2 "
										padding="md:pr-0"
									/>
									<TextField
										label="Token hardcap"
										id="percent"
										defaultValue="10"
										placeholder="0"
										{...register("percent", {
											required: true,
											min: 1,
											max: 100,
										})}
										isPercent={true}
										isError={errors.percent ? true : false}
										error="Percentage share should be between 1-100%"
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
										onKeyUp={() => {
											setValue("saftcap", getValues("percent") * 0.25);
										}}
									/>
									<TextField
										label="Token softcap"
										id="softcap"
										defaultValue="2.5"
										placeholder="0"
										{...register("saftcap", {
											required: true,
											min: 1,
											max: 100,
											disabled: true,
										})}
										isPercent={true}
										isError={errors.percent ? true : false}
										error="Percentage share should be between 1-100%"
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2 "
										padding="md:pr-0"
									/>
								</div>
								<div className="flex flex-col items-end">
									<input type="submit" value="Start Presale" className="safu-button-secondary cursor-pointer" />
								</div>
							</form>
						</div>
					</>
				) : (
					<div className="flex flex-wrap justify-between">
						<div className="">
							<h2 className="text-xl mb-1">Do you want to launch a presale?</h2>
							<p className="text-sm text-gray-500 mb-4">
								You wil be able to setup a presale once you launch a presale contract for your token.
							</p>
						</div>
						<div className="flex justify-center flex-col max-md:w-full">
							<input
								type="button"
								value="Launch presale"
								className="safu-button-secondary cursor-pointer"
								onClick={() => {
									launch({ args: [contractAddress] });
								}}
							/>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default LaunchPresale;
