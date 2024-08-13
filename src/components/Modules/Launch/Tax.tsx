import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { UseFormGetValues, UseFormRegister, FieldErrors } from "react-hook-form";
import { animate, spring } from "motion";
import Select from "react-select";

import TextField from "@/components/elements/TextField";
import Arrow from "@/components/elements/Arrow";
import { arrowOptions } from "@/components/Pages/Launch";

import { LaunchForm } from "@/utils/launchHelper";
import { scrollTo } from "@/utils/uiUtils";

const Tax = ({
	register,
	getValues,
	errors,
	setInitTaxType,
}: {
	register: UseFormRegister<LaunchForm>;
	getValues: UseFormGetValues<LaunchForm>;
	errors: FieldErrors<LaunchForm>;
	setInitTaxType: Dispatch<SetStateAction<number>>;
}) => {
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
			errors.countInterval ||
			errors.initInterval ||
			errors.lpTax
		)
			return true;
	}, [errors]);

	const close = useCallback(() => {
		animate("#tax_arrow", { rotate: 0 }, arrowOptions);
		animate("#tax", { maxHeight: 0, opacity: 0 }, { easing: "ease-in-out" });
	}, []);

	const open = useCallback(() => {
		scrollTo("tax_container");
		animate("#tax_arrow", { rotate: [0, -180] }, arrowOptions);
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
						required: { value: true, message: "Initial Buy Tax can't be empty" },
						pattern: { value: /^[0-9.]+$/i, message: "Tax should be a number" },
						min: {
							value: Number(getValues("minBuyTax")),
							message: "Initial tax should be greater or equal than final tax",
						},
						max: { value: 40, message: "Initial tax should be below 40%" },
					})}
					isPercent={true}
					error={errors.maxBuyTax}
					width="w-24"
					labelWidth="grow"
				/>
				<TextField
					label="Initial Sell Tax"
					id="maxstax"
					defaultValue="40"
					placeholder="40"
					{...register("maxSellTax", {
						required: { value: true, message: "Initial Sell Tax can't be empty" },
						pattern: { value: /^[0-9.]+$/i, message: "Tax should be a number" },
						min: {
							value: Number(getValues("minSellTax")),
							message: "Initial tax should be greater than or equal final tax",
						},
						max: { value: 40, message: "Initial tax should be below 40%" },
					})}
					isPercent={true}
					error={errors.maxSellTax}
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
							required: { value: true, message: "Final buy Tax can't be empty" },
							pattern: { value: /^[0-9.]+$/i, message: "Tax should be a number" },
							min: { value: 0, message: "Tax can't be negative" },
							max: { value: 6, message: "Final tax should be below 6%" },
						})}
						isPercent={true}
						isError={errors.minBuyTax ? true : false}
						error={errors.minBuyTax}
						width="w-24"
						labelWidth="grow"
					/>
					<TextField
						label="Final Sell Tax"
						id="minstax"
						defaultValue="0"
						placeholder="0"
						{...register("minSellTax", {
							required: { value: true, message: "Final Sell Tax can't be empty" },
							pattern: { value: /^[0-9.]+$/i, message: "Tax should be a number" },
							min: { value: 0, message: "Tax can't be negative" },
							max: { value: 6, message: "Final tax should be below 6%" },
						})}
						isPercent={true}
						isError={errors.minSellTax ? true : false}
						error={errors.minSellTax}
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
										setDropStyle(0);
										setInitTaxType(0);
										break;
									case "count":
										setDropStyle(1);
										setInitTaxType(1);
										break;
									default:
										setDropStyle(2);
										setInitTaxType(2);
								}
							}}
						/>
					</div>
					{dropStyle !== 0 && (
						<TextField
							label="Buy Count"
							id="countinterval"
							defaultValue="60"
							placeholder="60"
							{...register("countInterval", {
								required: { value: true, message: "Buy count can't be empty" },
								pattern: { value: /^[0-9]+$/i, message: "Count should be a number" },
								min: { value: 0, message: "Buy count can't be negative" },
								max: { value: 100, message: "Buy count should be below 100" },
							})}
							error={errors.countInterval}
							width="w-24"
							labelWidth="grow"
						/>
					)}
					{dropStyle !== 1 && (
						<TextField
							label="Interval (seconds)"
							id="initinterval"
							defaultValue="60"
							placeholder="60"
							{...register("initInterval", {
								required: { value: true, message: "Interval can't be empty" },
								pattern: { value: /^[0-9]+$/i, message: "Interval should be a number" },
								min: { value: 0, message: "Interval can't be negative" },
								max: { value: 7200, message: "Buy count should be below 7200s (2Hours)" },
							})}
							isError={errors.initInterval ? true : false}
							error={errors.initInterval}
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
						required: { value: true, message: "Buy Back Tax can't be empty" },
						pattern: { value: /^[0-9.]+$/i, message: "Tax should be a number" },
						min: { value: 0, message: "Tax can't be negative" },
						max: { value: 50, message: "Buy back tax should be below 50%" },
					})}
					isPercent={true}
					isError={errors.lpTax ? true : false}
					error={errors.lpTax}
					width="w-24"
					labelWidth="grow"
				/>
			</div>
		</div>
	);
};

export default Tax;
