import { useCallback, useEffect, useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { animate, spring } from "motion";
import Select from "react-select";

import TextField from "@/components/elements/TextField";
import Arrow from "@/components/elements/Arrow";

import { LaunchForm } from "@/utils/launchHelper";
import { scrollTo } from "@/utils/uiUtils";

const Tax = ({ register, errors }: { register: UseFormRegister<LaunchForm>; errors: FieldErrors<LaunchForm> }) => {
	const [dropStyle, setDropStyle] = useState(1);
	const [tax, setTax] = useState(false);

	const taxOptions = [
		{ value: "hybrid", label: "Hybrid" },
		{ value: "count", label: "Count" },
		{ value: "interval", label: "Interval" },
	];

	const is_error = useCallback(() => {
		if (
			errors.maxBuyTax ||
			errors.maxSellTax ||
			errors.minBuyTax ||
			errors.minSellTax ||
			errors.initTaxType ||
			errors.countInterval ||
			errors.initInterval ||
			errors.lpTax
		)
			return true;
	}, [errors]);

	const close = useCallback(() => {
		animate("#tax_arrow", { rotate: 0 }, { easing: "ease-in-out", duration: 0.5, direction: "alternate" });
		animate("#tax", { maxHeight: 0, opacity: 0 }, { easing: "ease-in-out" });
	}, []);

	const open = useCallback(() => {
		scrollTo("tax_container");
		animate("#tax_arrow", { rotate: [0, -180] }, { easing: "ease-in-out", duration: 0.5, direction: "alternate" });
		animate(
			"#tax",
			{ maxHeight: "600px", opacity: 1 },
			{ easing: spring({ stiffness: 300, damping: 16, mass: 0.4 }), delay: 0.1 }
		);
	}, []);

	useEffect(() => {
		if (tax) {
			open();
		} else {
			close();
		}
		if (errors && is_error() && !tax) {
			setTax(true);
		}
	}, [close, errors, is_error, open, tax]);
	return (
		<div id="tax_container" className="border-b border-gray-700 py-8">
			<div className="flex mb-1">
				<Arrow
					onClick={() => {
						setTax(!tax);
					}}
					checked={tax}
					id="tax_arrow"
				/>
				<h3 className="text-2xl mb-1">Modify Tokenomics</h3>
			</div>
			<p className="text-sm text-gray-500 mb-4">
				Define your <b className="font-bold text-gray-400">tokenomics</b>.
			</p>
			<div id="tax" className={"flex flex-wrap max-h-0"}>
				<TextField
					label="Initial Buy Tax"
					id="maxbtax"
					defaultValue="40"
					placeholder="40"
					{...register("maxBuyTax", {
						required: true,
						pattern: /^[0-9]+$/i,
						min: 0,
						max: 40,
					})}
					isPercent={true}
					isError={errors.maxBuyTax ? true : false}
					error="Tax can only be between 0 to 40%"
					width="w-24"
					labelWidth="grow"
				/>
				<TextField
					label="Initial Sell Tax"
					id="maxstax"
					defaultValue="40"
					placeholder="40"
					{...register("maxSellTax", {
						required: true,
						pattern: /^[0-9]+$/i,
						min: 0,
						max: 40,
					})}
					isPercent={true}
					isError={errors.maxSellTax ? true : false}
					error="Tax can only be between 0 to 40%"
					width="w-24"
					labelWidth="grow"
				/>
				<div className="w-full flex flex-wrap">
					<TextField
						label="Final Buy Tax"
						id="minbtax"
						defaultValue="0"
						placeholder="0"
						{...register("minBuyTax", {
							required: true,
							pattern: /^[0-9]+$/i,
							min: 0,
							max: 6,
						})}
						isPercent={true}
						isError={errors.minBuyTax ? true : false}
						error="Tax can only be between 0 to 6%"
						width="w-24"
						labelWidth="grow"
					/>
					<TextField
						label="Final Sell Tax"
						id="minstax"
						defaultValue="0"
						placeholder="0"
						{...register("minSellTax", {
							required: true,
							pattern: /^[0-9]+$/i,
							min: 0,
							max: 6,
						})}
						isPercent={true}
						isError={errors.minSellTax ? true : false}
						error="Tax can only be between 0 to 6%"
						width="w-24"
						labelWidth="grow"
					/>
				</div>
				<div className="w-full flex flex-wrap">
					<div className="w-full md:w-1/2 2xl:w-1/3 flex md:pr-4 2xl:pr-12 items-center flex-wrap mb-4">
						<label htmlFor="type" className="text-xl text-gray-400 pr-4 grow">
							Tax Drop
						</label>
						<Select
							unstyled={true}
							defaultValue={taxOptions[1]}
							inputId="type"
							classNames={{
								control: (state) => "bg-neutral-900 p-2 rounded-xl border-l border-gray-600 2xl:text-sm",
								menuList: (state) => "bg-neutral-900 mt-1 rounded-xl 2xl:text-sm",
								option: (state) => " flex flex-col justify-center px-4 py-2 cursor-pointer",
							}}
							options={taxOptions}
							isSearchable={false}
							onChange={(value) => {
								switch (value?.value) {
									case "interval":
										setDropStyle(1);
										break;
									case "count":
										setDropStyle(2);
										break;
									default:
										setDropStyle(0);
								}
							}}
						/>
					</div>
					{dropStyle !== 1 && (
						<TextField
							label="Buy Count"
							id="countinterval"
							defaultValue="60"
							placeholder="60"
							{...register("countInterval", {
								required: true,
								pattern: /^[0-9]+$/i,
								min: 0,
								max: 100,
							})}
							isError={errors.countInterval ? true : false}
							error="Count should be below 100"
							width="w-24"
							labelWidth="grow"
						/>
					)}
					{dropStyle < 2 && (
						<TextField
							label="Interval in Seconds"
							id="initinterval"
							defaultValue="60"
							placeholder="60"
							{...register("initInterval", {
								required: true,
								pattern: /^[0-9]+$/i,
								min: 0,
								max: 7200,
							})}
							isError={errors.initInterval ? true : false}
							error="Interval should be between 0-7200(2Hours)"
							width="w-24"
							labelWidth="grow"
						/>
					)}
				</div>
				<TextField
					label="Buy Back Tax"
					id="lptax"
					defaultValue="0"
					placeholder="0"
					{...register("lpTax", {
						required: true,
						pattern: /^[0-9]+$/i,
						min: 0,
						max: 50,
					})}
					isPercent={true}
					isError={errors.lpTax ? true : false}
					error="Buy back tax should be below 50%"
					width="w-24"
					labelWidth="grow"
				/>
			</div>
		</div>
	);
};

export default Tax;
