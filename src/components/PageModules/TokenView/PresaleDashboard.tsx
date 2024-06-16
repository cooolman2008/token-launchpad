import { useContractWrite, useWalletClient, useContractRead, useBalance } from "wagmi";
import { useState, SetStateAction, Dispatch } from "react";

import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import Presaleabi from "../../../../presaleabi.json";

import { getNumber } from "@/utils/math";

interface Presale {
	softcap: bigint;
	hardcap: bigint;
	startTs: bigint;
	duration: bigint;
	sold: bigint;
	maxEth: bigint;
	maxBag: bigint;
	status: bigint;
}

const PresaleDashboard = ({
	presaleAddress,
	setSuccess,
	isTrading,
}: {
	presaleAddress?: `0x${string}`;
	setSuccess: Dispatch<SetStateAction<string>>;
	isTrading: boolean;
}) => {
	const { data: walletClient } = useWalletClient();
	const [presale, setPresale] = useState<Presale>();
	const [balance, setBalance] = useState(0);
	const [error, setError] = useState("");

	useBalance({
		address: presaleAddress,
		onSuccess(data) {
			console.log("Success", data);
			setBalance(Number(data.formatted));
		},
		onError(error) {
			console.log("Error", error);
		},
	});

	const clear = () => {
		setError("");
	};

	// get presale details.
	const { refetch } = useContractRead({
		address: presaleAddress,
		abi: Presaleabi.abi,
		functionName: "getPresaleDetails",
		onSuccess(data: Presale) {
			if (data) {
				setPresale(data);
			}
		},
	});

	// contract call to end presale.
	const { isLoading: finishing, write: finish } = useContractWrite({
		address: presaleAddress,
		abi: Presaleabi.abi,
		functionName: "finishPresale",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
			refetch();
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
			refetch();
			setSuccess("Presales refunded successfully");
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});

	// contract call for the owner to claim ETH from presales after trading begins.
	const { isLoading: claiming, write: claim } = useContractWrite({
		address: presaleAddress,
		abi: Presaleabi.abi,
		functionName: "claimEth",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
			refetch();
			setSuccess("Claim successful");
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});
	return (
		<>
			{refunding && <Loading msg="Retrieving presales fund from the token contract..." />}
			{finishing && <Loading msg="Ending presale..." />}
			{error && (
				<Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} callback={clear} />
			)}
			{(presale?.status === BigInt(1) ||
				(presale?.status === BigInt(2) && !isTrading) ||
				(presale?.status === BigInt(2) && isTrading && balance > 0) ||
				presale?.status === BigInt(3)) && (
				<div className="w-full py-8 border-b border-gray-700">
					<div className="flex mb-1">
						{presale?.status !== BigInt(3) && !isTrading && (
							<h2 className="text-xl text-slate-200 mr-1">Presale management</h2>
						)}
						{presale?.status === BigInt(1) && (
							<svg height="24px" width="24px" version="1.1" viewBox="0 0 611.999 611.999">
								<defs>
									<linearGradient id="grad3" gradientTransform="rotate(45)">
										<stop offset="20%" stopColor="rgb(250, 204, 21)" />
										<stop offset="100%" stopColor="rgb(220, 38, 38)" />
									</linearGradient>
								</defs>
								<g>
									<path
										fill="url(#grad3)"
										d="M216.02,611.195c5.978,3.178,12.284-3.704,8.624-9.4c-19.866-30.919-38.678-82.947-8.706-149.952   c49.982-111.737,80.396-169.609,80.396-169.609s16.177,67.536,60.029,127.585c42.205,57.793,65.306,130.478,28.064,191.029   c-3.495,5.683,2.668,12.388,8.607,9.349c46.1-23.582,97.806-70.885,103.64-165.017c2.151-28.764-1.075-69.034-17.206-119.851   c-20.741-64.406-46.239-94.459-60.992-107.365c-4.413-3.861-11.276-0.439-10.914,5.413c4.299,69.494-21.845,87.129-36.726,47.386   c-5.943-15.874-9.409-43.33-9.409-76.766c0-55.665-16.15-112.967-51.755-159.531c-9.259-12.109-20.093-23.424-32.523-33.073   c-4.5-3.494-11.023,0.018-10.611,5.7c2.734,37.736,0.257,145.885-94.624,275.089c-86.029,119.851-52.693,211.896-40.864,236.826   C153.666,566.767,185.212,594.814,216.02,611.195z"
									/>
								</g>
							</svg>
						)}
					</div>
					{presale?.status === BigInt(1) && (
						<>
							<p className="text-sm text-gray-500 mb-4">You can terminate presale whenever you want.</p>
							<div className="w-full flex justify-between">
								<h2 className="text-2xl font-medium text-slate-200">
									<b className="font-bold text-gray-500">Sold:</b> {presale?.sold ? getNumber(presale?.sold) : "0"}{" "}
									Tokens
								</h2>
								<div className="flex justify-center flex-col">
									<input
										className="safu-button-primary cursor-pointer"
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
					{presale?.status === BigInt(2) && !isTrading && (
						<>
							<p className="text-sm text-gray-500 mb-4">
								You can refund your presale funds to the users if you are not plannig to start the trading.
							</p>
							<div className="w-full flex justify-between">
								<h2 className="text-2xl font-medium text-slate-200">
									<b className="font-bold text-gray-500">Sold:</b> {presale?.sold ? getNumber(presale?.sold) : "0"}{" "}
									Tokens
								</h2>
								<div className="flex justify-center flex-col">
									<input
										className="safu-button-primary cursor-pointer"
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
					{presale?.status === BigInt(2) && isTrading && balance > 0 && (
						<>
							<div className="w-full flex flex-wrap justify-center">
								<h2 className="w-full text-xl text-red-700 font-medium text-center mb-4">
									Hurray!! Your presale claims are here!
								</h2>
								<div className="flex justify-center flex-col">
									<input
										className="safu-button-primary cursor-pointer"
										type="submit"
										value={"Claim " + balance}
										onClick={() => {
											claim();
										}}
									/>
								</div>
							</div>
						</>
					)}
					{presale?.status === BigInt(3) && (
						<>
							<div className="w-full flex flex-wrap justify-between">
								<h2 className="w-full text-md text-red-700 font-medium text-center">
									Presale failed to meet the softcap
								</h2>
								<h2 className="w-full text-md text-yellow-600 font-medium text-center">
									Do not worry, your customers will get their refunds though our platform
								</h2>
							</div>
						</>
					)}
				</div>
			)}
		</>
	);
};

export default PresaleDashboard;
