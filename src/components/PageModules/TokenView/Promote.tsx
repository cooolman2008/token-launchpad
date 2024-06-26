import { useContractWrite, useWalletClient } from "wagmi";
import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { parseEther, formatEther } from "viem";
import { useEffect, useState } from "react";

import { getContractAddress } from "@/utils/utils";
import { fetchPromoCost } from "@/api/getSafu";

import TextField from "@/components/elements/TextField";
import InformationTip from "@/components/elements/InformationTip";

import Helperabi from "../../../../helperabi.json";

interface PromoteForm {
	cost: number;
	times: number;
}

const Promote = ({ contractAddress }: { contractAddress: `0x${string}` }) => {
	const { data: walletClient } = useWalletClient();
	const [promoCost, setPromoCost] = useState(0);
	const [price, setPrice] = useState(0);

	const { selectedNetworkId: chainId } = useWeb3ModalState();
	const CONTRACT_ADDRESS = getContractAddress(Number(chainId));

	// contract call to start trading of the launched token.
	const {
		data,
		isSuccess,
		write: promote,
	} = useContractWrite({
		address: CONTRACT_ADDRESS,
		abi: Helperabi.abi,
		functionName: "promoteToken",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
		},
		onError(error) {
			console.log(error);
		},
	});

	// handle form & launch promote token utility with number of times to promote
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<PromoteForm>();
	const onSubmit: SubmitHandler<PromoteForm> = (formData) => {
		if (promoCost) {
			promote({
				args: [contractAddress, formData.times],
				value: parseEther(promoCost.toString()) * BigInt(formData.times),
			});
		}
	};

	useEffect(() => {
		async function fetchTheCost() {
			const data = await fetchPromoCost(CONTRACT_ADDRESS);
			if (data) {
				setPromoCost(Number(formatEther(data)));
				setValue("cost", Number(formatEther(data)));
			}
		}
		fetchTheCost();
	}, [CONTRACT_ADDRESS, setValue]);

	return (
		<div className="w-full py-8 border-b border-gray-700">
			<div className="flex mb-1">
				<h2 className="text-xl">Promote this token</h2>
				<InformationTip msg="Your token will be displayed in our twitter account as many times as you say" />
			</div>
			<p className="text-sm text-gray-500 mb-4">
				Start promoting this token to raise the noice!
				<br />
				Just enter the number of times you want to display, we will populate the cost for you.
			</p>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="w-full pb-4 rounded-xl mb-2">
					<div className="w-full flex flex-wrap justify-between">
						<TextField
							label="Cost (ETH)"
							id="cost"
							placeholder="30"
							{...register("cost", {
								valueAsNumber: true,
								disabled: true,
							})}
							isError={errors.cost ? true : false}
							error="Minimum 30 days required"
							width="w-20"
							labelWidth="grow lg:grow-0"
							containerWidth="w-full md:w-auto"
							margin="mb-4 lg:mb-0"
						/>
						<TextField
							label="Times"
							id="times"
							placeholder="0"
							{...register("times", {
								required: true,
								min: 1,
							})}
							onKeyUp={() => {
								setPrice(Number((getValues("times") * promoCost).toFixed(4)));
							}}
							isError={errors.times ? true : false}
							error="Minimum 30 days required"
							width="w-20"
							labelWidth="grow lg:grow-0"
							containerWidth="w-full md:w-auto"
							margin="mb-4 lg:mb-0"
						/>
						<div className="w-full lg:w-auto flex justify-center flex-col">
							<input
								type="submit"
								value={"Promote for " + price + " ETH"}
								className="safu-button-secondary cursor-pointer"
							/>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
};

export default Promote;
