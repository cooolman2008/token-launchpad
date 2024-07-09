import { useContractWrite, useWalletClient, useAccount, useContractRead } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, SetStateAction, Dispatch, useEffect } from "react";
import { parseEther } from "viem";

import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import Presaleabi from "../../../../presaleabi.json";

import { getAbr, getNumber } from "@/utils/math";

interface PresaleForm {
	amount: number;
}

interface Presale {
	softcap: bigint;
	hardcap: bigint;
	startTs: bigint;
	duration: bigint;
	sold: bigint;
	maxEth: bigint;
	maxBag: bigint;
}

const Presale = ({
	symbol,
	presaleAddress,
	setSuccess,
}: {
	symbol: string;
	contractAddress: `0x${string}`;
	presaleAddress: `0x${string}`;
	setSuccess: Dispatch<SetStateAction<string>>;
}) => {
	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();

	const [error, setError] = useState("");
	const [presale, setPresale] = useState<Presale>();
	const [bought, setBought] = useState(BigInt(0));
	const [maxBag, setMaxBag] = useState(0);

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

	// get user claimable token details.
	const { refetch: getBought } = useContractRead({
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

	// contract call to buy presale tokens.
	const { isLoading: buying, write: buyTokens } = useContractWrite({
		address: presaleAddress,
		abi: Presaleabi.abi,
		functionName: "buyTokens",
		account: walletClient?.account,
		onSuccess(res) {
			console.log(res);
			setSuccess("Presale tokens bought successfully!");
			setValue("amount", 0);
			getBought();
			refetch();
		},
		onError(error) {
			console.log(error);
			setError("Something went wrong!");
		},
	});

	useEffect(() => {
		if (presale) {
			const remaining = presale.maxBag - bought;
			const available = presale.hardcap - presale.sold;
			if (remaining > available) {
				setMaxBag(getNumber(available));
			} else {
				setMaxBag(getNumber(remaining));
			}
		}
	}, [bought, presale]);

	// handle buy form.
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<PresaleForm>();
	const onSubmit: SubmitHandler<PresaleForm> = (formData) => {
		if (presale?.maxEth && presale?.hardcap) {
			const amount = parseEther(formData.amount.toString());
			const pay = (amount * presale?.maxEth) / presale?.hardcap;
			buyTokens({
				args: [amount],
				value: pay,
			});
		}
	};

	return (
		<>
			{buying && <Loading msg="Getting the tokens for you..." />}
			{error && <Modal msg={error} des="This might be a temporary issue, try again in sometime" error={true} />}
			<div className="presale-container mt-12">
				<div className="flex justify-between mb-2 items-center relative">
					<h2 className="text-2xl">Presale</h2>
					<span
						className={
							"text-sm font-normal " +
							(presale?.sold && presale?.softcap && presale?.sold > presale?.softcap
								? "text-green-400"
								: "text-amber-400")
						}
					>
						<b className="text-sm font-normal text-gray-400">Sold: </b> {presale?.sold ? getNumber(presale?.sold) : "0"}
					</span>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="mb-4">
					<div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900">
						<div className="flex justify-between mb-2">
							<span className="text-sm font-light text-gray-400">
								Softcap: {presale?.softcap ? getAbr(getNumber(presale?.softcap)) : "0"}
							</span>
							<span className="text-sm font-normal text-gray-400">
								Hardcap: {presale?.hardcap ? getAbr(getNumber(presale?.hardcap)) : "0"}
							</span>
						</div>
						<div className="flex justify-between mb-2">
							<div className="w-full h-4 relative rounded-xl bg-neutral-800  border-neutral-700/60">
								<div
									className={
										"absolute top-0 left-0 right-0 bottom-0 rounded-l-xl text-sm text-black pl-2" +
										(presale?.sold && presale?.softcap && presale?.sold > presale?.softcap
											? " bg-green-600"
											: " bg-amber-400")
									}
									style={
										presale?.sold && presale?.sold > 0
											? {
													width: (Number(presale?.sold) * 100) / Number(presale?.hardcap) + "%",
											  }
											: { visibility: "hidden" }
									}
								></div>
							</div>
						</div>
						<div className="flex justify-between mb-4">
							<span className={"text-sm font-normal " + (errors.amount ? "text-red-600" : "text-gray-400")}>
								<b className="text-sm font-normal text-gray-400">Wallet limit:</b>{" "}
								{presale?.maxBag ? getNumber(presale?.maxBag) : "0"}
							</span>
							<span className="text-sm font-normal text-gray-400">You Bought: {bought ? getNumber(bought) : "0"}</span>
						</div>
						<div className="w-full flex">
							<input
								type="text"
								id="amount"
								placeholder="0"
								{...register("amount", {
									required: true,
									pattern: /^[0-9]+$/i,
									min: 1,
									max: maxBag,
								})}
								className="block w-full rounded-xl pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-3xl"
							/>
							<span className="block sm:text-3xl leading-6 text-gray-400 pt-1.5">{symbol}</span>
						</div>
					</div>
					{maxBag > 0 && (
						<div className="flex justify-between flex-wrap">
							<div className="flex justify-center flex-col mt-2 mr-2 grow">
								<input className="safu-button-primary cursor-pointer" type="submit" value="Buy" />
							</div>
						</div>
					)}
				</form>
			</div>
		</>
	);
};

export default Presale;
