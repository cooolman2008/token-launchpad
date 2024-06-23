import { useContractWrite, useWalletClient } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { parseEther } from "viem";

import TextField from "@/components/elements/TextField";
import Tokenabi from "../../../../newtokenabi.json";
import { useState } from "react";

const Claim = ({ contractAddress }: { contractAddress: `0x${string}` }) => {
	const { data: walletClient } = useWalletClient();

	// contract call to start trading of the launched token.
	const { data, isSuccess, write } = useContractWrite({
		address: contractAddress,
		abi: Tokenabi.abi,
		functionName: "startTrading",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
		},
		onError(error) {
			console.log(error);
		},
	});
	return (
		<div className="w-full py-8 border-b border-gray-700">
			<h2 className="text-2xl mb-1">Claim what&#39;s yours</h2>
			<p className="text-sm text-gray-500 mb-4">
				You can hit the claim button & get the vested tokens displayed in the button.
			</p>

			<div className="flex">
				<div className="flex flex-col">
					<button className="safu-button-primary">Claim $62.02M</button>
				</div>
			</div>
		</div>
	);
};

export default Claim;
