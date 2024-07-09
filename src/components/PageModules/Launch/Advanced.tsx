import { UseFormRegister, FieldErrors } from "react-hook-form";
import { animate, spring } from "motion";
import { useEffect } from "react";

import TextField from "@/components/elements/TextField";
import { LaunchForm } from "@/utils/launchHelper";

const Advanced = ({ register, errors }: { register: UseFormRegister<LaunchForm>; errors: FieldErrors<LaunchForm> }) => {
	useEffect(() => {
		animate(
			"#advanced",
			{ maxHeight: "340px" },
			{ easing: spring({ stiffness: 300, damping: 16, mass: 0.4 }), delay: 0.1 }
		);
	}, []);
	return (
		<>
			<div id="advanced" className="flex flex-wrap max-h-0 overflow-hidden">
				<TextField
					label="Max Transaction Limit"
					id="maxTx"
					isPercent={true}
					placeholder="0"
					{...register("maxTx", {
						pattern: /^[0-9]+$/i,
						max: 100,
						min: 0,
					})}
					isError={errors.maxTx ? true : false}
					error="Please provide a valid limit."
					width="w-20"
					labelWidth="grow"
				/>
				<TextField
					label="Max Wallet Limit"
					id="maxWallet"
					isPercent={true}
					placeholder="0"
					{...register("maxWallet", {
						pattern: /^[0-9]+$/i,
						max: 100,
						min: 0,
					})}
					isError={errors.maxWallet ? true : false}
					error="Please provide a valid limit."
					width="w-20"
					labelWidth="grow"
				/>
				<TextField
					label="Tax Swap Threshold"
					id="taxSwapThreshold"
					placeholder="1000"
					{...register("taxSwapThreshold", {
						required: true,
						pattern: /^[0-9]+$/i,
					})}
					isError={errors.taxSwapThreshold ? true : false}
					error="Please provide a valid limit."
					width="w-24"
					labelWidth="grow"
				/>
				<TextField
					label="Max Tax Swap"
					id="maxSwap"
					placeholder="10000"
					{...register("maxSwap", {
						required: true,
						pattern: /^[0-9]+$/i,
					})}
					isError={errors.maxSwap ? true : false}
					error="Please provide a valid limit."
					width="w-24"
					labelWidth="grow"
				/>
				<TextField
					label="Prevent Swap Before"
					id="preventSwap"
					placeholder="10"
					{...register("preventSwap", {
						pattern: /^[0-9]+$/i,
						max: 10,
						min: 0,
					})}
					isError={errors.preventSwap ? true : false}
					error="Please provide a valid limit."
					width="w-14"
					labelWidth="grow"
				/>
			</div>
		</>
	);
};

export default Advanced;
