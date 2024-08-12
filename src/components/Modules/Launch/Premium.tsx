import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { animate, spring } from "motion";
import Select from "react-select";

import TextField from "@/components/elements/TextField";
import Arrow from "@/components/elements/Arrow";
import { arrowOptions } from "@/components/Pages/Launch";

import { LaunchForm } from "@/utils/launchHelper";
import { scrollTo } from "@/utils/uiUtils";

const Premium = ({
	register,
	errors,
	setPaid,
}: {
	register: UseFormRegister<LaunchForm>;
	errors: FieldErrors<LaunchForm>;
	setPaid: Dispatch<SetStateAction<boolean>>;
}) => {
	const [premium, setPremium] = useState(false);
	const payOptions = [
		{ value: "eth", label: "ETH" },
		{ value: "safu", label: "SAFU" },
	];

	const close = useCallback(() => {
		animate("#premium_arrow", { rotate: 0 }, arrowOptions);
		animate("#premium", { maxHeight: 0, opacity: 0 }, { easing: "ease-in-out" });
	}, []);

	const open = useCallback(() => {
		scrollTo("premium_container");
		animate("#premium_arrow", { rotate: [0, -180] }, arrowOptions);
		animate(
			"#premium",
			{ maxHeight: "110px", opacity: 1 },
			{ easing: spring({ stiffness: 300, damping: 16, mass: 0.4 }), delay: 0.1 }
		);
	}, []);
	useEffect(() => {
		if (premium) {
			open();
		} else {
			close();
		}
	}, [close, open, premium]);
	return (
		<div id="premium_container" className="py-8">
			<div className="flex mb-1">
				<Arrow
					id="premium_arrow"
					onClick={() => {
						setPremium(!premium);
					}}
					checked={premium}
				/>
				<h3 className="text-2xl mb-1">Go Premium</h3>
			</div>
			<p className="text-sm text-gray-500 mb-4">
				Pay once and access <b className="font-bold text-gray-400">premium features</b>.
			</p>
			<div id="premium" className="flex flex-wrap max-h-0">
				<div className="w-full md:w-1/2 2xl:w-1/3 flex md:pr-4 2xl:pr-12 items-center flex-wrap mb-4">
					<label htmlFor="pay" className="text-xl text-gray-400 pr-4 grow">
						Currency
					</label>
					<Select
						unstyled={true}
						defaultValue={payOptions[0]}
						inputId="pay"
						classNames={{
							control: (state) => "bg-neutral-900 p-2 rounded-xl border-l border-gray-600 2xl:text-sm",
							menuList: (state) => "bg-neutral-900 mt-1 rounded-xl 2xl:text-sm",
							option: (state) => " flex flex-col justify-center px-4 py-2 cursor-pointer",
						}}
						options={payOptions}
					/>
				</div>
				<TextField
					label="Amount"
					id="amount"
					placeholder="10"
					defaultValue={0.2}
					disabled={true}
					{...register("amount", {
						pattern: /^[0-9]+$/i,
					})}
					error={errors.amount}
					width="w-24"
					labelWidth="grow"
				/>
			</div>
		</div>
	);
};

export default Premium;
