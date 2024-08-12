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
						required: true,
						pattern: /^[A-Za-z. ]+$/i,
					})}
					isError={errors.name ? true : false}
					error="We need an alphabets only name to deploy the token."
					width="w-48 lg:grow"
					labelWidth="grow lg:grow-0"
				/>
				<TextField
					label="Symbol"
					id="symbol"
					placeholder="USDC"
					{...register("symbol", {
						required: true,
						maxLength: 8,
						pattern: /^[A-Za-z]+$/i,
					})}
					isError={errors.symbol ? true : false}
					error="Symbol needs to be all alphabetic * below 8 chars."
					width="w-40 lg:grow"
					labelWidth="grow lg:grow-0"
				/>
				<TextField
					label="Supply"
					id="supply"
					placeholder="1000000"
					{...register("supply", {
						required: true,
						min: 1000000,
						max: 1000000000000000,
						pattern: /^[0-9]+$/i,
						onChange: (event) => {
							const supply = event.target.value;
							setValue("maxSwap", Number(supply) * 0.01);
							setValue("taxSwapThreshold", Number(supply) * 0.0001);
						},
					})}
					isError={errors.supply ? true : false}
					error="Supply should be minimum 1Million."
					width="w-48 lg:grow"
					labelWidth="grow lg:grow-0"
				/>
				<TextField
					label="Tax Wallet"
					id="taxWallet"
					defaultValue={address}
					placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
					{...register("taxWallet", {
						required: true,
						minLength: 42,
						pattern: /^[A-Za-z0-9]+$/i,
					})}
					isError={errors.taxWallet ? true : false}
					error="Tax wallet should be a valid wallet."
					width="w-48 md:w-56 lg:grow"
					labelWidth="grow lg:grow-0"
				/>
			</div>
		</div>
	);
};

export default Basic;
