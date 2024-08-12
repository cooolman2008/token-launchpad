import { useCallback, useEffect, useState } from "react";
import { UseFormRegister, FieldErrors, UseFormGetValues } from "react-hook-form";
import { animate, spring } from "motion";

import TextField from "@/components/elements/TextField";
import Arrow from "@/components/elements/Arrow";

import { LaunchForm } from "@/utils/launchHelper";
import { scrollTo } from "@/utils/uiUtils";

const Advanced = ({
	register,
	getValues,
	errors,
}: {
	register: UseFormRegister<LaunchForm>;
	getValues: UseFormGetValues<LaunchForm>;
	errors: FieldErrors<LaunchForm>;
}) => {
	const [advanced, setAdvanced] = useState(false);

	const is_error = useCallback(() => {
		if (errors.maxTx || errors.maxWallet || errors.maxSwap || errors.taxSwapThreshold || errors.preventSwap)
			return true;
	}, [errors]);

	const close = useCallback(() => {
		animate("#advanced_arrow", { rotate: 0 }, { easing: "ease-in-out", duration: 0.5, direction: "alternate" });
		animate("#advanced", { maxHeight: 0, opacity: 0 }, { easing: "ease-in-out" });
	}, []);

	const open = useCallback(() => {
		scrollTo("advanced_container");
		animate("#advanced_arrow", { rotate: [0, -180] }, { easing: "ease-in-out", duration: 0.5, direction: "alternate" });
		animate(
			"#advanced",
			{ maxHeight: "340px", opacity: 1 },
			{ easing: spring({ stiffness: 300, damping: 16, mass: 0.4 }), delay: 0.1 }
		);
	}, []);

	useEffect(() => {
		if (advanced) {
			open();
		} else {
			close();
		}
		if (errors && is_error() && !advanced) {
			setAdvanced(true);
		}
	}, [close, errors, is_error, open, advanced]);

	return (
		<div id="advanced_container" className="border-b border-gray-700 py-8">
			<div className="flex mb-1">
				<Arrow
					id="advanced_arrow"
					onClick={() => {
						setAdvanced(!advanced);
					}}
					checked={advanced}
				/>
				<h3 className="text-2xl mb-1">Advanced Settings</h3>
			</div>
			<p className="text-sm text-gray-500 mb-4">
				If you <b className="font-bold text-gray-400">know</b> what you are doing, configure the settings.
			</p>
			<div id="advanced" className="flex flex-wrap max-h-0 overflow-hidden">
				<TextField
					label="Max Transaction Limit"
					id="maxTx"
					isPercent={true}
					placeholder="0"
					{...register("maxTx", {
						pattern: /^[0-9]+$/i,
						min: 0,
						max: 100,
					})}
					isError={errors.maxTx ? true : false}
					error="Limit should be below 100%"
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
						min: 0,
						max: 100,
					})}
					isError={errors.maxWallet ? true : false}
					error="Limit should be below 100%"
					width="w-20"
					labelWidth="grow"
				/>
				<TextField
					label="Tax Swap Threshold"
					id="taxSwapThreshold"
					{...register("taxSwapThreshold", {
						required: true,
						pattern: /^[0-9]+$/i,
						min: Number(getValues("supply")) * 0.00001,
						max: Number(getValues("supply")) * 0.01,
					})}
					isError={errors.taxSwapThreshold ? true : false}
					error="Limit should be 0.0001% to 0.1% of supply"
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
						min: Number(getValues("supply")) * 0.01,
						max: Number(getValues("supply")) * 0.02,
					})}
					isError={errors.maxSwap ? true : false}
					error="Limit should be 1% to 2% of supply"
					width="w-24"
					labelWidth="grow"
				/>
				<TextField
					label="Prevent Swap Before"
					id="preventSwap"
					placeholder="10"
					{...register("preventSwap", {
						pattern: /^[0-9]+$/i,
						min: 0,
						max: 50,
					})}
					isError={errors.preventSwap ? true : false}
					error="Prevent swap should be below 50"
					width="w-14"
					labelWidth="grow"
				/>
			</div>
		</div>
	);
};

export default Advanced;
