import { useAccount } from "wagmi";
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";

import TextField from "@/components/elements/TextField";

import { LaunchForm } from "@/utils/launchHelper";

const Basic = ({
	register,
	setValue,
	errors,
}: {
	register: UseFormRegister<LaunchForm>;
	setValue: UseFormSetValue<LaunchForm>;
	errors: FieldErrors<LaunchForm>;
}) => {
	const { address } = useAccount();
	return (
		<div className="border-b border-gray-700 py-8">
			<h3 className="text-2xl mb-1">Customise Token</h3>
			<p className="text-sm text-gray-500 mb-4">
				Enter wallet address or <b className="font-bold text-gray-400"> splitter contract </b> address as your tax
				wallet.
			</p>
			<div className="flex flex-wrap">
				<TextField
					label="Coin Name"
					id="name"
					placeholder="SAFU"
					{...register("name", {
						required: { value: true, message: "Name can't be empty" },
						maxLength: { value: 30, message: "Name can't be more than 30 characters" },
						pattern: { value: /^[A-Za-z0-9. ]+$/i, message: "Name should only have alphabets/numbers/dots(.)" },
					})}
					error={errors.name}
					width="w-40 md:w-48 lg:grow"
					labelWidth="grow lg:grow-0"
				/>
				<TextField
					label="Symbol"
					id="symbol"
					placeholder="USDC"
					{...register("symbol", {
						required: { value: true, message: "Symbol can't be empty" },
						maxLength: { value: 8, message: "Name can't be more than 8 characters" },
						pattern: { value: /^[A-Za-z0-9. ]+$/i, message: "Symbol should only have alphabets/numbers/dots(.)" },
					})}
					error={errors.symbol}
					width="w-40 lg:grow"
					labelWidth="grow lg:grow-0"
				/>
				<TextField
					label="Supply"
					id="supply"
					placeholder="1000000"
					{...register("supply", {
						required: { value: true, message: "Supply can't be empty" },
						min: { value: 1000000, message: "Supply should be minimum 1 Million" },
						max: { value: 1000000000000000, message: "Supply should be below 1 quadrillion" },
						pattern: { value: /^[0-9]+$/i, message: "Supply should be a number" },
						onChange: (event) => {
							const supply = event.target.value;
							setValue("maxSwap", Number(supply) * 0.01);
							setValue("taxSwapThreshold", Number(supply) * 0.0001);
						},
					})}
					error={errors.supply}
					width="w-48 lg:grow"
					labelWidth="grow lg:grow-0"
				/>
				<TextField
					label="Tax Wallet"
					id="taxWallet"
					defaultValue={address}
					placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
					{...register("taxWallet", {
						required: { value: true, message: "Tax Wallet can't be empty" },
						minLength: { value: 42, message: "Tax Wallet not valid" },
						pattern: { value: /^[A-Za-z0-9]+$/i, message: "Tax Wallet not valid" },
					})}
					error={errors.taxWallet}
					width="w-48 md:w-56 lg:grow"
					labelWidth="grow lg:grow-0"
				/>
			</div>
		</div>
	);
};

export default Basic;
