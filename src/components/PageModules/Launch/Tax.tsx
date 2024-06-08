import { UseFormRegister, FieldErrors } from "react-hook-form";
import { animate, spring } from "motion";
import { useEffect, useState } from "react";
import Select from "react-select";

import TextField from "@/components/elements/TextField";
import { LaunchForm } from "@/utils/launchHelper";

const Tax = ({ register, errors }: { register: UseFormRegister<LaunchForm>; errors: FieldErrors<LaunchForm> }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const taxOptions = [
		{ value: "hybrid", label: "Hybrid" },
		{ value: "count", label: "Count" },
		{ value: "interval", label: "Interval" },
	];
	useEffect(() => {
		animate("#tax", { maxHeight: "600px" }, { easing: spring({ stiffness: 300, damping: 16, mass: 0.4 }), delay: 0.1 });
		setTimeout(() => {
			setIsLoaded(true);
		}, 200);
	}, []);
	return (
		<>
			<div id="tax" className={"flex flex-wrap max-h-0" + (!isLoaded && " overflow-hidden")}>
				<TextField
					label="Initial buy tax"
					id="maxbtax"
					defaultValue="40.44"
					placeholder="40"
					{...register("maxBuyTax", {
						required: true,
						max: 40,
						min: 0,
					})}
					isPercent={true}
					isError={errors.maxBuyTax ? true : false}
					error="Tax can only be between 0 to 40."
					width="w-24"
					labelWidth="grow"
				/>
				<TextField
					label="Initial sell tax"
					id="maxstax"
					defaultValue="40"
					placeholder="40"
					{...register("maxSellTax", {
						required: true,
						max: 40,
						min: 0,
					})}
					isPercent={true}
					isError={errors.maxSellTax ? true : false}
					error="Tax can only be between 0 to 40."
					width="w-24"
					labelWidth="grow"
				/>
				<div className="w-full flex flex-wrap">
					<TextField
						label="Final buy tax"
						id="minbtax"
						defaultValue="0"
						placeholder="0"
						{...register("minBuyTax", {
							required: true,
							max: 40,
							min: 0,
						})}
						isPercent={true}
						isError={errors.minBuyTax ? true : false}
						error="Tax can only be between 0 to 40."
						width="w-24"
						labelWidth="grow"
					/>
					<TextField
						label="Final sell tax"
						id="minstax"
						defaultValue="0"
						placeholder="0"
						{...register("minSellTax", {
							required: true,
							max: 40,
							min: 0,
						})}
						isPercent={true}
						isError={errors.minSellTax ? true : false}
						error="Tax can only be between 0 to 40."
						width="w-24"
						labelWidth="grow"
					/>
				</div>
				<div className="w-full flex flex-wrap">
					<div className="w-full md:w-1/2 2xl:w-1/3 flex md:pr-4 2xl:pr-12 items-center flex-wrap mb-4">
						<label htmlFor="" className="text-xl text-gray-400 pr-4 grow">
							Tax drop
						</label>
						<Select
							unstyled={true}
							defaultValue={taxOptions[0]}
							classNames={{
								control: (state) => "bg-neutral-900 p-2 rounded-xl border-l border-gray-600 2xl:text-sm",
								menuList: (state) => "bg-neutral-900 mt-1 rounded-xl 2xl:text-sm",
								option: (state) => " flex flex-col justify-center px-4 py-2 cursor-pointer",
							}}
							options={taxOptions}
							isSearchable={false}
						/>
					</div>
					<TextField
						label="Interval in Seconds"
						id="initinterval"
						defaultValue="60"
						placeholder="60"
						{...register("initInterval", {
							required: true,
							max: 60,
							min: 0,
						})}
						isError={errors.initInterval ? true : false}
						error="Interval should be between 0-60."
						width="w-24"
						labelWidth="grow"
					/>
					<TextField
						label="Buy count"
						id="countinterval"
						defaultValue="60"
						placeholder="60"
						{...register("countInterval", {
							required: true,
							max: 60,
							min: 0,
						})}
						isError={errors.countInterval ? true : false}
						error="Interval should be between 0-60."
						width="w-24"
						labelWidth="grow"
					/>
				</div>
				<TextField
					label="Buy back tax"
					id="lptax"
					defaultValue="0"
					placeholder="0"
					{...register("lpTax", {
						required: true,
						max: 20,
						min: 0,
					})}
					isPercent={true}
					isError={errors.lpTax ? true : false}
					error="Tax can only be between 0 to 20."
					width="w-24"
					labelWidth="grow"
				/>
			</div>
		</>
	);
};

export default Tax;
