import { useState, SetStateAction, Dispatch } from "react";
import { useContractWrite, useWalletClient, useAccount } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";

import TextField from "@/components/elements/TextField";
import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import Tokenabi from "../../../../newtokenabi.json";
import { TeamMember } from "@/api/getToken";

interface TeamForm {
	team1p: number;
	team1: string;
	cliffPeriod: number;
	vestingPeriod: number;
}

const Team = ({
	contractAddress,
	teamSet,
	teamMembers,
	setSuccess,
}: {
	contractAddress: `0x${string}`;
	teamSet: boolean;
	teamMembers?: TeamMember[];
	setSuccess: Dispatch<SetStateAction<string>>;
}) => {
	const { data: walletClient } = useWalletClient();
	const [error, setError] = useState("");

	// contract call to add team members.
	const { isLoading, write } = useContractWrite({
		address: contractAddress,
		abi: Tokenabi.abi,
		functionName: "addTeam",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
			setSuccess("A team member has been added successfully");
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});

	// handle team form.
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TeamForm>();
	const onSubmit: SubmitHandler<TeamForm> = (formData) => {
		if (formData.team1 && formData.team1p) {
			write({
				args: [
					{
						team1: formData.team1,
						team1p: formData.team1p,
						cliffPeriod: teamSet ? 0 : formData.cliffPeriod,
						vestingPeriod: teamSet ? 0 : formData.vestingPeriod,
						isAdd: true,
					},
				],
			});
		}
	};
	return (
		<>
			{isLoading && <Loading msg="Adding your team..." />}
			{error && <Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} />}
			<div className="w-full py-8 border-b border-gray-700">
				<h2 className="text-xl mb-1">Add your team</h2>
				<p className="text-sm text-gray-500 mb-4">
					Add team members before launching the presale or trade.
					<br />
					Once added, team details cannot be changed.
				</p>
				{teamMembers && (
					<div className="w-full mb-8 rounded-xl text-gray-400">
						{Object.values(teamMembers).map((member) => (
							<div
								key={member.id}
								className="w-full flex justify-between flex-wrap border-b last:border-0 border-neutral-700 py-4"
							>
								<div className="w-full flex flex-wrap justify-between font-medium uppercase">
									<span className="text-xs md:text-sm">{member.id}</span>
									<span className="text-xs md:text-sm">{member.percent} %</span>
								</div>
							</div>
						))}
					</div>
				)}
				<div className="w-full pb-4 rounded-xl">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="w-full flex justify-between flex-wrap">
							{!teamSet && (
								<>
									<TextField
										label="Cliff Period"
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
										label="Vesting Period"
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
										containerWidth="w-full md:w-1/2 "
										padding="md:pr-0"
									/>
								</>
							)}
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
									width="w-48"
									labelWidth="grow"
									containerWidth="w-full md:w-1/2"
								/>
								<TextField
									label="Share"
									id="team1p"
									placeholder="0"
									{...register("team1p", {
										required: true,
										pattern: /^[0-9]+$/i,
										max: 20,
										min: 0,
									})}
									isPercent={true}
									isError={errors.team1p ? true : false}
									error="Share cannot be more than 1%."
									width="w-24"
									labelWidth="grow"
									containerWidth="w-full md:w-1/2 "
									padding="md:pr-0"
								/>
							</div>
							<div className="w-full flex justify-end">
								<div className="flex justify-center flex-col">
									<input type="submit" value="Add Wallet" className="safu-button-secondary cursor-pointer" />
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
