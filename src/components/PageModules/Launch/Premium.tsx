import { UseFormRegister, FieldErrors } from "react-hook-form";
import { animate, spring } from "motion";
import { useEffect, useState } from "react";
import Select from "react-select";

import TextField from "@/components/elements/TextField";
import { LaunchForm } from "@/context/Launch";

const Premium = ({ register, errors }: { register: UseFormRegister<LaunchForm>; errors: FieldErrors<LaunchForm> }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const payOptions = [
		{ value: "eth", label: "ETH" },
		{ value: "safu", label: "SAFU" },
	];
	useEffect(() => {
		animate(
			"#premium",
			{ maxHeight: "110px" },
			{ easing: spring({ stiffness: 300, damping: 16, mass: 0.4 }), delay: 0.1 }
		);
		setTimeout(() => {
			setIsLoaded(true);
		}, 200);
	}, []);
	return (
		<>
			<div id="premium" className={"flex flex-wrap max-h-0" + (!isLoaded && " overflow-hidden")}>
				<div className="w-full md:w-1/2 2xl:w-1/3 flex md:pr-4 2xl:pr-12 items-center flex-wrap mb-4">
					<label htmlFor="" className="text-xl text-gray-400 pr-4 grow">
						Currency
					</label>
					<Select
						unstyled={true}
						defaultValue={payOptions[0]}
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
						max: 10,
						min: 0,
					})}
					isError={errors.preventSwap ? true : false}
					error="Please provide a valid limit."
					width="w-24"
					labelWidth="grow"
				/>
			</div>
		</>
	);
};

export default Premium;
