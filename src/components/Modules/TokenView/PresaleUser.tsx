import { useWriteContract, useWalletClient, useReadContract, useAccount } from "wagmi";
import { useState, useEffect, SetStateAction, Dispatch } from "react";

import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import { getAbr, getNumber } from "@/utils/math";
import { presaleAbi } from "@/abi/presaleAbi";
import { formatEther } from "viem";

interface Presale {
	softcap: bigint;
	hardcap: bigint;
	startTs: bigint;
	finishTs: bigint;
	duration: bigint;
	cliffPeriod: bigint;
	vestingPeriod: bigint;
	sold: bigint;
	maxEth: bigint;
	maxBag: bigint;
	status: bigint;
}

const PresaleUser = ({
	presaleAddress,
	address,
	callback,
	setSuccess,
	isTrading,
	isOwner,
}: {
	presaleAddress?: `0x${string}`;
	address: `0x${string}`;
	callback: () => void;
	setSuccess: Dispatch<SetStateAction<string>>;
	isTrading: boolean;
	isOwner: boolean;
}) => {
	const { data: walletClient } = useWalletClient();
	const [claimable, setClaimable] = useState(BigInt(0));
	const [claimableDays, setClaimableDays] = useState(BigInt(0));
	const [bought, setBought] = useState(0);
	const [remaining, setremaining] = useState(0);
	const [claimedDays, setClaimedDays] = useState(0);
	const [presale, setPresale] = useState<Presale>();
	const [presaleScene, setPresaleScene] = useState(0);
	const [error, setError] = useState("");

	// get presale details.
	const { data: presaleData, refetch } = useReadContract({
		address: presaleAddress,
		abi: presaleAbi,
		functionName: "getPresaleDetails",
	});

	useEffect(() => {
		console.log(presaleData);
		if (presaleData) {
			setPresale(presaleData);
		}
	}, [presaleData]);

	const clear = () => {
		setError("");
	};

	// get user claimable token details.
	const { data: claimables, refetch: getBought } = useReadContract({
		address: presaleAddress,
		abi: presaleAbi,
		functionName: "getClaimableTokens",
		args: [address],
	});

	useEffect(() => {
		console.log(claimables);
		if (claimables && claimables?.length > 0) {
			setClaimable(claimables[0]);
			setClaimableDays(claimables[1] + claimables[3]);
			setBought(getNumber(claimables[2]));
			setClaimedDays(Number(claimables[3]));
			if (presale?.vestingPeriod)
				setremaining(
					getNumber(claimables[2] - ((claimables[2] / presale?.vestingPeriod) * claimables[3] + claimables[0]))
				);
		}
	}, [claimables, presale?.vestingPeriod]);

	// contract call for the user to get the refund.
	const { isPending: getting, writeContract: getrefund } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				callback();
				getBought();
				setSuccess("Refund initiated successfully!");
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});

	// contract call to end presale after the owner of token doesn't start trading under the duration.
	const { isPending: finishing, writeContract: finish } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				getBought();
				callback();
				setSuccess("Presales terminated successfully");
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});

	// contract call to refund the liquidity from the token contract to presale contract.
	const { isPending: refunding, writeContract: refund } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				getBought();
				callback();
				setSuccess("Presales refunded successfully");
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});

	// contract call to refund the liquidity from the token contract to presale contract.
	const { isPending: claiming, writeContract: claim } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				getBought();
				callback();
				setSuccess("Presales claimed successfully");
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});

	// 1 - Presale live but duration passed - end presale button.
	// 2 - Presale successfull but not trading - waiting banner.
	// 3 - Presale successfull but not trading passed duration - refund presale button.
	// 4 - Presale successfull trading started & under cliff period - banner with cliff period end.
	// 5 - Presale successfull trading started & after cliff period - Claim button with vested tokens.
	// 6 - Presale successfull trading started & after cliff period & vesting period first day - Show message that vesting has started.
	// 7 - Presale successfull trading started & after cliff period & no claimable tokens - Show message not tokens.
	// 8 - Presale Unsuccessfull - get refund
	useEffect(() => {
		if (presale) {
			const start = Number(presale?.startTs);
			const finish = Number(presale?.finishTs);
			const duration = Number(presale?.duration) * 86400;
			const cliff = Number(presale?.cliffPeriod) * 86400;
			const now = Math.floor(Date.now() / 1000); // + 80 * 86400;

			switch (presale?.status) {
				case BigInt(1):
					if (now > start + duration) {
						setPresaleScene(1);
					}
					break;
				case BigInt(2):
					if (!isTrading) {
						now < finish + duration ? setPresaleScene(2) : setPresaleScene(3);
					} else {
						if (now < finish + cliff) {
							setPresaleScene(4);
						} else if (claimable > 0) {
							setPresaleScene(5);
						} else if (claimedDays > 0) {
							setPresaleScene(7);
						} else {
							setPresaleScene(6);
						}
					}
					break;
				case BigInt(3):
					setPresaleScene(8);
					break;
				default:
					setPresaleScene(0);
			}
		}
	}, [claimable, claimedDays, isTrading, presale]);
	return (
		<>
			{finishing && <Loading msg="Ending presale..." />}
			{getting && <Loading msg="Initiating presale token refund..." />}
			{refunding && <Loading msg="Initiating presale liquidity refund..." />}
			{claiming && <Loading msg="Initiating presale liquidity refund..." />}
			{error && (
				<Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} callback={clear} />
			)}
			{bought > 0 && presaleScene > 0 && (
				<div className="w-full py-8 border-b border-gray-700">
					{presaleScene !== 1 && presaleScene !== 2 && presaleScene !== 4 && (
						<>
							<div className="flex mb-1">
								<h2 className="text-xl mr-1">Presale</h2>
							</div>
							<p className="text-sm text-gray-500 mb-4">Manage your Presale tokens & activities.</p>
						</>
					)}
					{presaleScene === 1 && !isOwner && (
						<>
							<div className="w-full flex flex-wrap justify-center">
								<h2 className="w-full text-xl text-amber-400 font-medium text-center mb-4">
									The presale has passed the duration. You can end the presale now.
								</h2>
								<div className="flex justify-center flex-col">
									<input
										className="safu-button-secondary cursor-pointer"
										type="submit"
										value="End Presales"
										onClick={() => {
											if (presaleAddress) {
												finish({
													address: presaleAddress,
													abi: presaleAbi,
													functionName: "finishPresale",
													account: walletClient?.account,
												});
											}
										}}
									/>
								</div>
							</div>
						</>
					)}
					{presaleScene === 2 && (
						<>
							<div className="w-full flex flex-wrap justify-between">
								<h2 className="w-full text-md font-normal text-center">
									Hurray! You have bought {getAbr(bought)} presale tokens!
								</h2>
								<h2 className="w-full text-md text-yellow-500 font-light text-center">
									You can claim your tokens once the trading starts. If not, you will be able to claim a refund.
								</h2>
							</div>
						</>
					)}
					{presaleScene === 3 && (
						<>
							<p className="text-sm text-gray-500 mb-4">
								You can refund the presale tokens from the token contract by yourself. Get your refund from the presale
								contract after this.
							</p>
							<div className="w-full flex justify-between">
								<h2 className="text-2xl font-medium">
									<b className="font-bold text-gray-500">You bought:</b> {bought} Tokens
								</h2>
								<div className="flex justify-center flex-col">
									<input
										className="safu-button-secondary cursor-pointer"
										type="submit"
										value="Refund Presales"
										onClick={() => {
											if (presaleAddress) {
												refund({
													address: presaleAddress,
													abi: presaleAbi,
													functionName: "refundPresale",
													account: walletClient?.account,
												});
											}
										}}
									/>
								</div>
							</div>
						</>
					)}
					{presaleScene === 4 && (
						<>
							<div className="w-full flex flex-wrap justify-between">
								<h2 className="w-full text-md font-normal text-center">
									Hurray! You have bought {bought} presale tokens!
								</h2>
								<h2 className="w-full text-md text-yellow-500 font-light text-center">
									Your tokens are in a cliff period right now! You can claim your tokens once cliff period is over &
									vesting starts.
								</h2>
							</div>
						</>
					)}
					{presaleScene === 5 && (
						<>
							<div className="w-full flex flex-wrap justify-center">
								<div className="w-full flex flex-col justify-between mb-4">
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">Bought:</b> {bought} Tokens
									</h2>
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">Vested:</b> {claimableDays.toString()}/
										{presale?.vestingPeriod.toString()} Days
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
											if (presaleAddress) {
												claim({
													address: presaleAddress,
													abi: presaleAbi,
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
					{presaleScene === 6 && (
						<>
							<div className="w-full flex flex-wrap justify-center">
								<div className="w-full flex flex-col justify-between mb-4">
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">Bought:</b> {bought} Tokens
									</h2>
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">Vested:</b> {claimableDays.toString()}/
										{presale?.vestingPeriod.toString()} Days
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
					{presaleScene === 7 && (
						<>
							<div className="w-full flex flex-wrap justify-center">
								<div className="w-full flex flex-col justify-between mb-4">
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">Bought:</b> {bought} Tokens
									</h2>
									<h2 className="text-2xl font-normal">
										<b className="font-medium text-gray-500">Vested:</b> {claimableDays.toString()}/
										{presale?.vestingPeriod.toString()} Days
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
					{presaleScene === 8 && (
						<>
							<p className="text-sm text-gray-500 mb-4">
								Presale has failed to break the softcap. Do not worry, you can get your refund here.
							</p>
							<div className="w-full flex justify-between">
								<h2 className="text-2xl font-medium">
									<b className="font-bold text-gray-500">Bought:</b> {bought} Tokens
								</h2>
								<div className="flex justify-center flex-col">
									<input
										className="safu-button-secondary cursor-pointer"
										type="submit"
										value="Get my refund"
										onClick={() => {
											if (presaleAddress) {
												getrefund({
													address: presaleAddress,
													abi: presaleAbi,
													functionName: "getRefund",
													account: walletClient?.account,
												});
											}
										}}
									/>
								</div>
							</div>
						</>
					)}
				</div>
			)}
		</>
	);
};

export default PresaleUser;
