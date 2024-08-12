import { useState, SetStateAction, Dispatch } from "react";
import { useWriteContract, useWalletClient } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";

import TextField from "@/components/elements/TextField";
import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import { TeamMember } from "@/api/getToken";
import { tokenAbi } from "@/abi/tokenAbi";

interface TeamForm {
	team1p: bigint;
	team1: `0x${string}`;
	cliffPeriod: bigint;
	vestingPeriod: bigint;
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
	const { isPending, writeContract } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				setSuccess("A team member has been added successfully");
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
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
			writeContract({
				address: contractAddress,
				abi: tokenAbi,
				functionName: "addTeam",
				account: walletClient?.account,
				args: [
					{
						team1: formData.team1,
						team1p: formData.team1p,
						cliffPeriod: teamSet ? BigInt(0) : formData.cliffPeriod,
						vestingPeriod: teamSet ? BigInt(0) : formData.vestingPeriod,
						isAdd: true,
					},
				],
			});
		}
	};
	return (
		<>
			{isPending && <Loading msg="Updating your team wallet details..." />}
			{error && <Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} />}
			<div className="w-full py-8 border-b border-gray-700">
				<div className="bg-gradient-to-r from-red-800/20 mb-2 p-4 rounded-xl border border-red-900/50">
					<div className="flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18px"
							height="18px"
							viewBox="0 0 24 24"
							className="stroke-red-600 mr-1"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
							<line x1="12" y1="9" x2="12" y2="13"></line>
							<line x1="12" y1="17" x2="12.01" y2="17"></line>
						</svg>
						<p className="font-bold text-red-600">Warning!</p>
					</div>
					<span className=" font-medium text-red-700 text-sm">
						Make sure you have set your team wallet details before enabling the trade or launching a presale.
					</span>
				</div>
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
											required: { value: true, message: "Cliff period can't be empty" },
											pattern: { value: /^[0-9]+$/i, message: "Cliff period should be a number" },
											min: { value: 30, message: "Cliff period should be minimum 30 days" },
											max: { value: 10000, message: "Cliff period should be below 10000 days" },
										})}
										error={errors.cliffPeriod}
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
											required: { value: true, message: "Vesting period can't be empty" },
											pattern: { value: /^[0-9]+$/i, message: "Vesting period should be a number" },
											min: { value: 30, message: "Vesting period should be minimum 30 days" },
											max: { value: 10000, message: "Vesting period should be below 10000 days" },
										})}
										error={errors.vestingPeriod}
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
										required: { value: true, message: "Team Wallet can't be empty" },
										minLength: { value: 42, message: "Team Wallet not valid" },
										pattern: { value: /^[A-Za-z0-9]+$/i, message: "Team Wallet not valid" },
									})}
									error={errors.team1}
									width="w-48"
									labelWidth="grow"
									containerWidth="w-full md:w-1/2"
								/>
								<TextField
									label="Share"
									id="team1p"
									placeholder="0"
									{...register("team1p", {
										required: { value: true, message: "Share can't be empty" },
										pattern: { value: /^[0-9]+$/i, message: "Share should be a number" },
										min: { value: 0, message: "Share can't be negative" },
										max: { value: 20, message: "Share should be below 20%" },
									})}
									isPercent={true}
									error={errors.team1p}
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
