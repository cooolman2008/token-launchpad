import { useState, SetStateAction, Dispatch } from "react";
import { useContractWrite, useWalletClient, useAccount } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";

import TextField from "@/components/elements/TextField";
import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import Tokenabi from "../../../../newtokenabi.json";

interface TeamForm {
	team1p: number;
	team2p: number;
	team3p: number;
	team4p: number;
	team5p: number;
	team1: string;
	team2: string;
	team3: string;
	team4: string;
	team5: string;
	cliffPeriod: number;
	vestingPeriod: number;
}

const Team = ({
	contractAddress,
	callback,
	setSuccess,
}: {
	contractAddress: `0x${string}`;
	callback: Dispatch<SetStateAction<boolean>>;
	setSuccess: Dispatch<SetStateAction<string>>;
}) => {
	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();
	const [count, setCount] = useState(1);
	const [error, setError] = useState("");

	// contract call to start trading of the launched token.
	const { isLoading, write } = useContractWrite({
		address: contractAddress,
		abi: Tokenabi.abi,
		functionName: "addTeam",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
			callback(true);
			setSuccess("Your team has been added successfully");
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});

	// handle extend lock form.
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TeamForm>();
	const onSubmit: SubmitHandler<TeamForm> = (formData) => {
		write({
			args: [
				{
					team1: formData.team1 ? formData.team1 : address,
					team2: formData.team2 ? formData.team2 : address,
					team3: formData.team3 ? formData.team3 : address,
					team4: formData.team4 ? formData.team4 : address,
					team5: formData.team5 ? formData.team5 : address,
					team1p: formData.team1p ? formData.team1p : 0,
					team2p: formData.team2p ? formData.team2p : 0,
					team3p: formData.team3p ? formData.team3p : 0,
					team4p: formData.team4p ? formData.team4p : 0,
					team5p: formData.team5p ? formData.team5p : 0,
					cliffPeriod: formData.cliffPeriod ? formData.cliffPeriod : 30,
					vestingPeriod: formData.vestingPeriod ? formData.vestingPeriod : 30,
				},
			],
		});
	};
	return (
		<>
			{isLoading && <Loading msg="Adding your team..." />}
			{error && <Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} />}
			<div className="w-full py-8 border-b border-gray-700">
				<h2 className="text-2xl mb-1">Add your team</h2>
				<p className="text-sm text-gray-500 mb-4">
					Add your team members <b className="font-bold text-gray-400">before starting the trade</b>
					<br />
					You can only add the team information <b className="font-bold text-gray-400">once.</b> So, be{" "}
					<b className="font-bold text-gray-400">aware</b> of the details.
				</p>
				<div className="w-full pb-4 rounded-xl">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="w-full flex justify-between flex-wrap">
							<TextField
								label="Cliff period"
								id="cliffPeriod"
								placeholder="30"
								defaultValue={30}
								{...register("cliffPeriod", {
									required: true,
									min: 30,
								})}
								isError={errors.cliffPeriod ? true : false}
								error="Minimum of 30 days Cliff period is needed."
								width="w-24"
								labelWidth="grow"
								containerWidth="w-full md:w-1/2"
							/>
							<TextField
								label="Vesting period"
								id="vestingPeriod"
								placeholder="30"
								defaultValue={30}
								{...register("vestingPeriod", {
									required: true,
									min: 30,
								})}
								isError={errors.vestingPeriod ? true : false}
								error="Minimum of 30 days Vesting period is needed."
								width="w-24"
								labelWidth="grow"
								containerWidth="w-full md:w-1/2"
							/>
							<div className="w-full flex flex-wrap">
								<TextField
									label="Wallet 1"
									id="team1"
									defaultValue=""
									placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
									{...register("team1", {
										required: true,
										minLength: 42,
										pattern: /^[A-Za-z0-9]+$/i,
									})}
									isError={errors.team1 ? true : false}
									error="Please provide a valid wallet address."
									width="w-64"
									labelWidth="grow"
									containerWidth="w-full md:w-1/2"
								/>
								<TextField
									label="Share"
									id="team1p"
									placeholder="0"
									{...register("team1p", {
										required: true,
										max: 1,
										min: 0,
									})}
									isPercent={true}
									isError={errors.team1p ? true : false}
									error="Share cannot be more than 1%."
									width="w-24"
									labelWidth="grow"
									containerWidth="w-full md:w-1/2"
								/>
							</div>
							{count > 1 && (
								<div className="w-full flex flex-wrap">
									<TextField
										label="Wallet 2"
										id="team2"
										defaultValue=""
										placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
										{...register("team2", {
											minLength: 42,
											pattern: /^[A-Za-z0-9]+$/i,
										})}
										isError={errors.team2 ? true : false}
										error="Please provide a valid wallet address."
										width="w-64"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
									/>
									<TextField
										label="Share"
										id="team2p"
										placeholder="0"
										{...register("team2p", {
											max: 1,
											min: 0,
										})}
										isPercent={true}
										isError={errors.team2p ? true : false}
										error="Share cannot be more than 1%."
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
									/>
								</div>
							)}
							{count > 2 && (
								<div className="w-full flex flex-wrap">
									<TextField
										label="Wallet 3"
										id="team3"
										defaultValue=""
										placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
										{...register("team3", {
											minLength: 42,
											pattern: /^[A-Za-z0-9]+$/i,
										})}
										isError={errors.team3 ? true : false}
										error="Please provide a valid wallet address."
										width="w-64"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
									/>
									<TextField
										label="Share"
										id="team3p"
										placeholder="0"
										{...register("team3p", {
											max: 1,
											min: 0,
										})}
										isPercent={true}
										isError={errors.team3p ? true : false}
										error="Share cannot be more than 1%."
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
									/>
								</div>
							)}
							{count > 3 && (
								<div className="w-full flex flex-wrap">
									<TextField
										label="Wallet 4"
										id="team4"
										defaultValue=""
										placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
										{...register("team4", {
											minLength: 42,
											pattern: /^[A-Za-z0-9]+$/i,
										})}
										isError={errors.team4 ? true : false}
										error="Please provide a valid wallet address."
										width="w-64"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
									/>
									<TextField
										label="Share"
										id="team4p"
										placeholder="0"
										{...register("team4p", {
											max: 1,
											min: 0,
										})}
										isPercent={true}
										isError={errors.team4p ? true : false}
										error="Share cannot be more than 1%."
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
									/>
								</div>
							)}
							{count > 4 && (
								<div className="w-full flex flex-wrap">
									<TextField
										label="Wallet 5"
										id="team4"
										defaultValue=""
										placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
										{...register("team5", {
											minLength: 42,
											pattern: /^[A-Za-z0-9]+$/i,
										})}
										isError={errors.team5 ? true : false}
										error="Please provide a valid wallet address."
										width="w-64"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
									/>
									<TextField
										label="Share"
										id="team5p"
										placeholder="0"
										{...register("team5p", {
											max: 1,
											min: 0,
										})}
										isPercent={true}
										isError={errors.team5p ? true : false}
										error="Share cannot be more than 1%."
										width="w-24"
										labelWidth="grow"
										containerWidth="w-full md:w-1/2"
									/>
								</div>
							)}
							<div className="w-full flex justify-between">
								<div className="">
									{count > 1 && (
										<button
											type="button"
											className="safu-icon mr-2"
											onClick={() => {
												if (count > 1) setCount(count - 1);
											}}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="12px"
												height="12px"
												viewBox="0 0 42 42"
												className="fill-white"
											>
												<g>
													<path d="M37.059,16H26H16H4.941C2.224,16,0,18.282,0,21s2.224,5,4.941,5H16h10h11.059  C39.776,26,42,23.718,42,21S39.776,16,37.059,16z" />
												</g>
											</svg>
										</button>
									)}
									<button
										type="button"
										className="safu-icon"
										onClick={() => {
											if (count < 5) setCount(count + 1);
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="#ffffff"
											width="12px"
											height="12px"
											viewBox="0 0 45.402 45.402"
										>
											<g>
												<path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141   c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27   c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435   c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z" />
											</g>
										</svg>
									</button>
								</div>
								<div className="flex justify-center flex-col">
									<input type="submit" value="Add team" className="safu-button-secondary cursor-pointer" />
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default Team;
