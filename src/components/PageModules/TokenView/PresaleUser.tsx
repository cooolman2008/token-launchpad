import { useContractWrite, useWalletClient, useContractRead, useAccount } from "wagmi";
import { useState, useEffect, SetStateAction, Dispatch } from "react";

import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import Presaleabi from "../../../../presaleabi.json";

import { getAbr, getNumber } from "@/utils/math";

interface Presale {
	softcap: bigint;
	hardcap: bigint;
	startTs: bigint;
	finishTs: bigint;
	duration: bigint;
	cliffPeriod: bigint;
	sold: bigint;
	maxEth: bigint;
	maxBag: bigint;
	status: bigint;
}

const PresaleUser = ({
	presaleAddress,
	callback,
	setSuccess,
	isTrading,
	isOwner,
}: {
	presaleAddress?: `0x${string}`;
	callback: () => void;
	setSuccess: Dispatch<SetStateAction<string>>;
	isTrading: boolean;
	isOwner: boolean;
}) => {
	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();
	const [claimable, setClaimable] = useState(BigInt(0));
	const [claimableDays, setClaimableDays] = useState(BigInt(0));
	const [bought, setBought] = useState(0);
	const [presale, setPresale] = useState<Presale>();
	const [presaleScene, setPresaleScene] = useState(0);
	const [error, setError] = useState("");

	// get presale details.
	const { refetch } = useContractRead({
		address: presaleAddress,
		abi: Presaleabi.abi,
		functionName: "getPresaleDetails",
		onSuccess(data: Presale) {
			console.log(data);
			if (data) {
				setPresale(data);
			}
		},
	});

	const clear = () => {
		setError("");
	};

	// get user claimable token details.
	const { refetch: getBought } = useContractRead({
		address: presaleAddress,
		abi: Presaleabi.abi,
		functionName: "getClaimableTokens",
		args: [address],
		onSuccess(data: [bigint, bigint, bigint]) {
			console.log(data);
			if (data && data.length > 0) {
				setClaimable(data[0]);
				setClaimableDays(data[1]);
				setBought(getNumber(data[2]));
			}
		},
	});

	// contract call for the user to get the refund.
	const { isLoading: getting, write: getrefund } = useContractWrite({
		address: presaleAddress,
		abi: Presaleabi.abi,
		functionName: "getRefund",
		account: walletClient?.account,
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
	});

	// contract call to end presale after the owner of token doesn't start trading under the duration.
	const { isLoading: finishing, write: finish } = useContractWrite({
		address: presaleAddress,
		abi: Presaleabi.abi,
		functionName: "finishPresale",
		account: walletClient?.account,
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
	});

	// contract call to refund the liquidity from the token contract to presale contract.
	const { isLoading: refunding, write: refund } = useContractWrite({
		address: presaleAddress,
		abi: Presaleabi.abi,
		functionName: "refundPresale",
		account: walletClient?.account,
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
	});

	// 1 - Presale live but duration passed - end presale button.
	// 2 - Presale successfull but not trading - waiting banner.
	// 3 - Presale successfull but not trading passed duration - refund presale button.
	// 4 - Presale successfull trading started & under cliff period - banner with cliff period end.
	// 5 - Presale successfull trading started & after cliff period - Claim button with vested tokens.
	// 6 - Presale Unsuccessfull - get refund
	useEffect(() => {
		if (presale) {
			const start = Number(presale?.startTs);
			const finish = Number(presale?.finishTs);
			const duration = Number(presale?.duration) * 86400;
			const cliff = Number(presale?.cliffPeriod) * 86400;
			const now = Math.floor(Date.now() / 1000) + 8 * 86400;
			switch (presale?.status) {
				case BigInt(1):
					if (now > start + duration) {
						setPresaleScene(1);
					}
					break;
				case BigInt(2):
					if (!isTrading) {
						if (now < finish + duration) {
							setPresaleScene(2);
						} else {
							setPresaleScene(3);
						}
					} else {
						if (now < finish + cliff) {
							setPresaleScene(4);
						} else {
							if (claimable > 0) {
								setPresaleScene(5);
							}
						}
					}
					break;
				case BigInt(3):
					setPresaleScene(6);
					break;
				default:
					setPresaleScene(0);
			}
		}
	}, [claimable, isTrading, presale]);
	return (
		<>
			{finishing && <Loading msg="Ending presale..." />}
			{getting && <Loading msg="Initiating presale token refund..." />}
			{refunding && <Loading msg="Initiating presale liquidity refund..." />}
			{error && (
				<Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} callback={clear} />
			)}
			{bought > 0 && presaleScene > 0 && !isOwner && (
				<div className="w-full py-8 border-b border-gray-700">
					{presaleScene !== 1 && presaleScene !== 2 && presaleScene !== 4 && (
						<div className="flex mb-1">
							<h2 className="text-xl text-slate-200 mr-1">Presale</h2>
						</div>
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
											finish();
										}}
									/>
								</div>
							</div>
						</>
					)}
					{presaleScene === 2 && !isOwner && (
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
								<h2 className="text-2xl font-medium text-slate-200">
									<b className="font-bold text-gray-500">You bought:</b> {bought} Tokens
								</h2>
								<div className="flex justify-center flex-col">
									<input
										className="safu-button-secondary cursor-pointer"
										type="submit"
										value="Refund Presales"
										onClick={() => {
											refund();
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
					{presaleScene === 6 && (
						<>
							<p className="text-sm text-gray-500 mb-4">
								Presale has failed to break the softcap. Do not worry, you can get your refund here.
							</p>
							<div className="w-full flex justify-between">
								<h2 className="text-2xl font-medium text-slate-200">
									<b className="font-bold text-gray-500">Bought:</b> {bought} Tokens
								</h2>
								<div className="flex justify-center flex-col">
									<input
										className="safu-button-secondary cursor-pointer"
										type="submit"
										value="Get my refund"
										onClick={() => {
											getrefund();
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
