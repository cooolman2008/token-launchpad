import { useWriteContract, useWalletClient, useReadContract, useBalance } from "wagmi";
import { useState, SetStateAction, Dispatch, useEffect } from "react";

import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import { getNumber } from "@/utils/math";
import { presaleAbi } from "@/abi/presaleAbi";

interface Presale {
	softcap: bigint;
	hardcap: bigint;
	startTs: bigint;
	finishTs: bigint;
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
	symbol,
}: {
	presaleAddress?: `0x${string}`;
	setSuccess: Dispatch<SetStateAction<string>>;
	isTrading: boolean;
	symbol: string;
}) => {
	const { data: walletClient } = useWalletClient();
	const [presale, setPresale] = useState<Presale>();
	const [balance, setBalance] = useState(0);
	const [presaleScene, setPresaleScene] = useState(0);
	const [error, setError] = useState("");

	const { data: balanceData } = useBalance({
		address: presaleAddress,
	});

	useEffect(() => {
		if (balanceData) {
			setBalance(Number(balanceData.value));
		}
	}, [balanceData]);

	// get presale details.
	const { data: presaleData, refetch } = useReadContract({
		address: presaleAddress,
		abi: presaleAbi,
		functionName: "getPresaleDetails",
	});

	useEffect(() => {
		if (presaleData) {
			setPresale(presaleData);
		}
	}, [presaleData]);

	const clear = () => {
		setError("");
	};

	// contract call to end presale.
	const { isPending: finishing, writeContract: finish } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				refetch();
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
				refetch();
				setSuccess("Presales refunded successfully");
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});

	// contract call for the owner to claim ETH from presales after trading begins.
	const { isPending: claiming, writeContract: claim } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				refetch();
				setSuccess("Claim successful");
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});

	// 1 - Presale live
	// 2 - Presale successfull but not trading, refund - display banner
	// 3 - Presale successfull but not trading & duration passed - display red banner
	// 4 - Presale successfull trading started & balance claim.
	// 5 - Presale Unsuccessfull
	useEffect(() => {
		switch (presale?.status) {
			case BigInt(1):
				setPresaleScene(1);
				break;
			case BigInt(2):
				if (!isTrading) {
					const finish = Number(presale.finishTs);
					const durarion = Number(presale.duration);
					Math.floor(Date.now() / 1000) < finish + durarion * 86400 ? setPresaleScene(2) : setPresaleScene(3);
				} else {
					if (balance > 0) {
						setPresaleScene(4);
					}
				}
				break;
			case BigInt(3):
				if (!isTrading) {
					setPresaleScene(5);
				}
				break;
			default:
				setPresaleScene(0);
		}
	}, [balance, isTrading, presale]);
	return (
		<>
			{refunding && <Loading msg="Retrieving presales fund from the token contract..." />}
			{finishing && <Loading msg="Ending presale..." />}
			{error && (
				<Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} callback={clear} />
			)}
			{presaleScene > 0 && (
				<div className="w-full py-8 border-b border-gray-700">
					{(presaleScene === 2 || presaleScene === 3) && (
						<div
							className={
								"bg-gradient-to-r mb-2 p-4 rounded-xl border" +
								(presaleScene === 2 ? " from-yellow-800/20 border-yellow-900/50" : " from-red-800/20 border-red-900/50")
							}
						>
							<div className="flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="18px"
									height="18px"
									viewBox="0 0 24 24"
									className={"mr-1" + (presaleScene === 2 ? " stroke-yellow-600" : " stroke-red-600")}
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
									<line x1="12" y1="9" x2="12" y2="13"></line>
									<line x1="12" y1="17" x2="12.01" y2="17"></line>
								</svg>
								<p className={"font-bold" + (presaleScene === 2 ? " text-yellow-600" : " text-red-600")}>Warning!</p>
							</div>
							<span className={"font-medium text-sm" + (presaleScene === 2 ? " text-yellow-700" : " text-red-700")}>
								{presaleScene === 2
									? "Start trading before the duration ends. All the raised funds can be refunded after the duration ends."
									: "Start trading now! All the funds can be refunded any moment now."}
							</span>
						</div>
					)}
					<div className="flex mb-1">
						{presaleScene < 4 && <h2 className="text-xl mr-1">Presale management</h2>}
						{presaleScene === 1 && (
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
					{presaleScene === 1 && (
						<>
							<p className="text-sm text-gray-500 mb-4">You can terminate presale whenever you want.</p>
							<div className="w-full flex justify-between">
								<h2 className="text-2xl font-extralight">
									<b className="font-normal text-gray-400">Sold:</b> {presale?.sold ? getNumber(presale?.sold) : "0"}{" "}
									{symbol}
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
					{(presaleScene === 2 || presaleScene === 3) && (
						<>
							<p className="text-sm text-gray-500 mb-4">
								You can refund your presale funds to the users if you are not plannig to start the trading.
							</p>
							<div className="w-full flex justify-between">
								<h2 className="text-2xl font-medium">
									<b className="font-bold text-gray-500">Sold:</b> {presale?.sold ? getNumber(presale?.sold) : "0"}{" "}
									{symbol}
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
							<div className="w-full flex flex-wrap justify-center">
								<h2 className="w-full text-xl text-red-700 font-medium text-center mb-4">
									Hurray!! Your presale claims are here!
								</h2>
								<div className="flex justify-center flex-col">
									<input
										className="safu-button-secondary cursor-pointer"
										type="submit"
										value={"Claim " + balance}
										onClick={() => {
											if (presaleAddress) {
												claim({
													address: presaleAddress,
													abi: presaleAbi,
													functionName: "claimEth",
													account: walletClient?.account,
												});
											}
										}}
									/>
								</div>
							</div>
						</>
					)}
					{presaleScene === 5 && (
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
