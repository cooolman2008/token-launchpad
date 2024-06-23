import { useAccount } from "wagmi";
import { UseFormRegister, FieldErrors } from "react-hook-form";

import TextField from "@/components/elements/TextField";
import { LaunchForm } from "@/utils/launchHelper";

const Basic = ({ register, errors }: { register: UseFormRegister<LaunchForm>; errors: FieldErrors<LaunchForm> }) => {
	const { address } = useAccount();
	return (
		<>
			<div className="flex flex-wrap">
				<TextField
					label="Coin name"
					id="name"
					placeholder="SAFU"
					{...register("name", {
						required: true,
						pattern: /^[A-Za-z. ]+$/i,
					})}
					isError={errors.name ? true : false}
					error="We need an alphabets only name to deploy the token."
					width="w-56 lg:grow"
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
					error="We need a 4 letter alphabets only symbol."
					width="w-48 lg:grow"
					labelWidth="grow lg:grow-0"
				/>
				<TextField
					label="Supply"
					id="supply"
					placeholder="1000000"
					{...register("supply", {
						required: true,
						min: 1000000,
					})}
					isError={errors.supply ? true : false}
					error="Supply should be minimum 1Million."
					width="w-64 lg:grow"
					labelWidth="grow lg:grow-0"
				/>
				<TextField
					label="Tax wallet"
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
					width="w-64 md:w-56 lg:grow"
					labelWidth="grow lg:grow-0"
				/>
			</div>
		</>
	);
};

export default Basic;
