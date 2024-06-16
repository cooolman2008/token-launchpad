import { useContractWrite, useWalletClient, useContractRead, useAccount } from "wagmi";
import { useState, SetStateAction, Dispatch } from "react";

import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import Presaleabi from "../../../../presaleabi.json";

import { getNumber } from "@/utils/math";

const PresaleUser = ({
	presaleAddress,
	callback,
	setSuccess,
	presaleStatus,
}: {
	presaleAddress?: `0x${string}`;
	callback: () => void;
	setSuccess: Dispatch<SetStateAction<string>>;
	presaleStatus: number;
}) => {
	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();
	const [error, setError] = useState("");
	const [bought, setBought] = useState(BigInt(0));

	const clear = () => {
		setError("");
	};

	// get user claimable token details.
	const { refetch } = useContractRead({
		address: presaleAddress,
		abi: Presaleabi.abi,
		functionName: "getClaimableTokens",
		args: [address],
		onSuccess(data: [bigint, bigint, bigint]) {
			if (data && data.length > 0) {
				setBought(data[2]);
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
			refetch();
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
			refetch();
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
			refetch();
			callback();
			setSuccess("Presales refunded successfully");
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});
	return (
		<>
			{finishing && <Loading msg="Ending presale..." />}
			{getting && <Loading msg="Initiating presale token refund..." />}
			{refunding && <Loading msg="Initiating presale liquidity refund..." />}
			{error && (
				<Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} callback={clear} />
			)}
			{bought > 0 && (
				<div className="w-full py-8 border-b border-gray-700">
					<div className="flex mb-1">
						<h2 className="text-xl text-slate-200 mr-1">Presale</h2>
					</div>
					{/* {presaleStatus === 2 && duration > finish + duration (
						<>
							<p className="text-sm text-gray-500 mb-4">You can terminate presale yourself.</p>
							<div className="w-full flex justify-between">
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
					)} */}
					{/* {presaleStatus === 2 && trading started ( */}
					<>
						{/* <p className="text-sm text-gray-500 mb-4">
							You can claim your tokens once the Cliff period is over.
						</p>
						<div className="w-full flex justify-between">
							<h2 className="text-2xl font-medium text-slate-200">
								<b className="font-bold text-gray-500">Sold:</b> {presale?.sold ? getNumber(presale?.sold) : "0"} Tokens
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
						</div> */}
					</>
					{/* )} */}
					{presaleStatus === 3 && (
						<>
							<p className="text-sm text-gray-500 mb-4">
								Presale has failed to break the softcap. Do not worry, you can get your refund here.
							</p>
							<div className="w-full flex justify-between">
								<h2 className="text-2xl font-medium text-slate-200">
									<b className="font-bold text-gray-500">Bought:</b> {bought ? getNumber(bought) : "0"} Tokens
								</h2>
								<div className="flex justify-center flex-col">
									<input
										className="safu-button-primary cursor-pointer"
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
