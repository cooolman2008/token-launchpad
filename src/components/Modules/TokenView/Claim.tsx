import { useReadContract, useWalletClient, useWriteContract } from "wagmi";

import { ownerAbi } from "@/abi/ownerAbi";
import { useEffect, useState } from "react";
import { getNumber } from "@/utils/math";
import { Token } from "@/api/getToken";
import Modal from "@/components/elements/Modal";

const Claim = ({
	contractAddress,
	address,
	token,
}: {
	contractAddress: `0x${string}`;
	address: `0x${string}`;
	token: Token;
}) => {
	const { data: walletClient } = useWalletClient();
	const [claimable, setClaimable] = useState(BigInt(0));
	const [claimableDays, setClaimableDays] = useState(BigInt(0));
	const [bought, setBought] = useState(0);
	const [remaining, setremaining] = useState(0);
	const [claimedDays, setClaimedDays] = useState(0);
	const [status, setStatus] = useState(0);
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");

	const clear = () => {
		setError("");
	};

	// get user claimable token details.
	const { data: claimables, refetch: getBought } = useReadContract({
		address: contractAddress,
		abi: ownerAbi,
		functionName: "getClaimAmount",
		args: [address],
	});

	useEffect(() => {
		console.log("git" + claimables);
		if (claimables && claimables?.length > 0) {
			setClaimable(claimables[0]);
			setClaimableDays(claimables[1] + claimables[3]);
			setBought(getNumber(claimables[2]));
			setClaimedDays(Number(claimables[3]));
			if (token?.vestingPeriod)
				setremaining(
					getNumber(claimables[2] - ((claimables[2] / BigInt(token?.vestingPeriod)) * claimables[3] + claimables[0]))
				);
		}
	}, [claimables, token?.vestingPeriod]);

	// Only after trading has started, Only if there is still something claimable
	// 0 - Cliff period message.
	// 1 - After cliff period - Claim button with vested tokens.
	// 2 - After cliff period & vesting period first day - Show message that vesting has started.
	// 3 - After cliff period & no claimable tokens - Show message not tokens.
	useEffect(() => {
		if (token) {
			const start = Number(token?.lplockStart);
			const vesting = Number(token?.vestingPeriod) * 86400;
			const cliff = Number(token?.cliffPeriod) * 86400;
			const now = Math.floor(Date.now() / 1000);

			if (now < start + cliff) {
				setStatus(0);
			} else if (now < start + cliff + vesting) {
				if (claimable > 0) {
					setStatus(1);
				} else if (claimedDays > 0) {
					setStatus(3);
				} else {
					setStatus(2);
				}
			}
		}
	}, [claimable, claimedDays, token]);

	// contract call to refund the liquidity from the token contract to presale contract.
	const { isPending: claiming, writeContract: claim } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				getBought();
				setSuccess("Presales claimed successfully");
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});
	return (
		<>
			{success && <Modal msg={success} />}
			{error && (
				<Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} callback={clear} />
			)}

			{token?.vestingPeriod > claimedDays && (
				<div className="w-full py-8 border-b border-gray-700">
					{status > 0 && (
						<>
							<h2 className="text-2xl mb-1">Claim what&#39;s yours</h2>
							<p className="text-sm text-gray-500 mb-4">
								You can hit the claim button & get the vested tokens displayed in the button.
							</p>
						</>
					)}
					{status === 0 && (
						<>
							<div className="w-full flex flex-wrap justify-between">
								<h2 className="w-full text-md text-yellow-500 font-light text-center">
									Your tokens are in a cliff period right now! You can claim your tokens once cliff period is over &
									vesting starts.
								</h2>
							</div>
						</>
					)}
					{status === 1 && (
						<>
							<div className="w-full flex flex-wrap justify-center">
								<div className="w-full flex flex-col justify-between mb-4">
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">Bought:</b> {bought} Tokens
									</h2>
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">Vested:</b> {claimableDays.toString()}/
										{token?.vestingPeriod.toString()} Days
									</h2>
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">Claimed:</b> {claimedDays.toString()}/
										{claimableDays.toString()} Days
									</h2>
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">To be vested:</b> {remaining.toString()}
									</h2>
								</div>
								<div className="w-full flex justify-center items-end flex-col">
									<input
										className="safu-button-secondary cursor-pointer"
										type="submit"
										value={"Claim " + getNumber(claimable)}
										onClick={() => {
											if (contractAddress) {
												claim({
													address: contractAddress,
													abi: ownerAbi,
													functionName: "claimTokens",
													account: walletClient?.account,
												});
											}
										}}
									/>
								</div>
							</div>
						</>
					)}
					{status === 2 && (
						<>
							<div className="w-full flex flex-wrap justify-center">
								<div className="w-full flex flex-col justify-between mb-4">
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">Bought:</b> {bought} Tokens
									</h2>
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">Vested:</b> {claimableDays.toString()}/
										{token?.vestingPeriod.toString()} Days
									</h2>
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">To be vested:</b> {remaining.toString()}
									</h2>
								</div>
								<h2 className="w-full text-xl text-red-500 font-normal text-center">
									No tokens to claim! Your vesting period has just started!
								</h2>
							</div>
						</>
					)}
					{status === 3 && (
						<>
							<div className="w-full flex flex-wrap justify-center">
								<div className="w-full flex flex-col justify-between mb-4">
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">Bought:</b> {bought} Tokens
									</h2>
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">Vested:</b> {claimableDays.toString()}/
										{token?.vestingPeriod.toString()} Days
									</h2>
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">Claimed:</b> {claimedDays.toString()}/
										{claimableDays.toString()} Days
									</h2>
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">To be vested:</b> {remaining.toString()}
									</h2>
								</div>
								<h2 className="w-full text-xl text-red-500 font-normal text-center">
									No tokens to claim! Wait for them to get vested!
								</h2>
							</div>
						</>
					)}
				</div>
			)}
		</>
	);
};

export default Claim;
