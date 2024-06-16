import { useContractWrite, useWalletClient, useAccount, useContractRead } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, SetStateAction, Dispatch, useEffect } from "react";
import { parseEther } from "viem";

import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

// token & presale abis
import tokenAbi from "../../../../newtokenabi.json";
import Presaleabi from "../../../../presaleabi.json";

import { getNumber } from "@/utils/math";

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
	const [claimable, setClaimable] = useState(BigInt(0));
	const [claimableDays, setClaimableDays] = useState(BigInt(0));
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
				setClaimable(data[0]);
				setClaimableDays(data[1]);
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
					<span className="text-sm font-medium text-green-400">
						Tokens sold: {presale?.sold ? getNumber(presale?.sold) : "0"}
					</span>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="mb-4">
					<div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900">
						<div className="flex justify-between mb-2">
							<span className="text-sm font-medium text-gray-400">
								<b className="font-bold text-gray-500">Softcap:</b>{" "}
								{presale?.softcap ? getNumber(presale?.softcap) : "0"}
							</span>
							<span
								className={"text-sm font-medium " + (errors.amount || maxBag === 0 ? "text-red-600" : "text-gray-400")}
							>
								<b className="font-bold text-gray-500">Wallet limit:</b> {maxBag}
							</span>
						</div>
						<div className="flex justify-between mb-4">
							<span className="text-sm font-medium text-gray-400">
								<b className="font-bold text-gray-500">Hardcap:</b>{" "}
								{presale?.hardcap ? getNumber(presale?.hardcap) : "0"}
							</span>
							<span className="text-sm font-medium text-gray-400">
								<b className="font-bold text-gray-500">You bought:</b> {bought ? getNumber(bought) : "0"}
							</span>
						</div>
						<div className="w-full flex">
							<input
								type="text"
								id="amount"
								placeholder="0"
								{...register("amount", {
									required: true,
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
