import { useWalletClient, useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, SetStateAction, Dispatch, useEffect } from "react";
import { parseEther } from "viem";

import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import { getAbr, getNumber } from "@/utils/math";
import { presaleAbi } from "@/abi/presaleAbi";
import { animate, AnimationControls } from "motion";

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
	address,
}: {
	symbol: string;
	presaleAddress: `0x${string}`;
	address: `0x${string}`;
}) => {
	const { data: walletClient } = useWalletClient();

	const [error, setError] = useState("");
	const [presale, setPresale] = useState<Presale>();
	const [bought, setBought] = useState(BigInt(0));
	const [maxBag, setMaxBag] = useState(0);
	const [success, setSuccess] = useState("");
	const [remaining, setRremaining] = useState(0);
	const [trans, setTrans] = useState<`0x${string}`>();
	const [animation, setAnimation] = useState<AnimationControls>();

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

	// get user claimable token details.
	const { data: clamables, refetch: getBought } = useReadContract({
		address: presaleAddress,
		abi: presaleAbi,
		functionName: "getClaimableTokens",
		args: [address],
	});

	useEffect(() => {
		if (clamables && clamables?.length > 0) {
			setBought(clamables[2]);
		}
	}, [clamables]);

	// contract call to buy presale tokens.
	const { isPending: buying, writeContract: buyTokens } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
				setValue("amount", 0);
				setTrans(res);
				setSuccess("Your presale tokens are on it's way!");
				animation?.play();
			},
			onError(error) {
				console.log(error);
				setError("Something went wrong!");
			},
		},
	});

	// get the transaction details by waiting for the transaction.
	const { data: transaction, isLoading: retrieval } = useWaitForTransactionReceipt({
		hash: trans,
	});

	useEffect(() => {
		if (transaction) {
			animation?.stop();
			getBought();
			refetch();
		} else if (trans) {
			setError("Something went wrong!");
		}
	}, [transaction, getBought, refetch]);

	useEffect(() => {
		setAnimation(
			animate(
				"#bought",
				{ opacity: [1, 0.4] },
				{
					easing: "ease-in-out",
					duration: 0.5,
					direction: "alternate",
					repeat: Infinity,
				}
			)
		);
		if (presale) {
			setMaxBag(getNumber(presale.maxBag));
			const remaining = presale.maxBag - bought;
			const available = presale.hardcap - presale.sold;
			remaining > available ? setRremaining(getNumber(available)) : setRremaining(getNumber(remaining));
		}
	}, [bought, presale]);

	useEffect(() => {
		if (animation) {
			animation.stop();
		}
	}, [animation]);

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
				address: presaleAddress,
				abi: presaleAbi,
				functionName: "buyTokens",
				account: walletClient?.account,
				args: [amount],
				value: pay,
			});
		}
	};

	return (
		<>
			{buying && <Loading msg="Getting presale tokens for you..." />}
			{success && <Modal msg={success} />}
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
						<b className="text-sm font-normal text-gray-400">Sold: </b>{" "}
						{presale?.sold ? getAbr(getNumber(presale?.sold)) : "0"}
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
							<span className={"text-sm font-normal " + (errors.amount ? "text-red-600" : "text-gray-400")} id="bought">
								<b className="text-sm font-normal text-gray-400">Wallet limit:</b>{" "}
								{presale?.maxBag ? getAbr(getNumber(bought)) + " / " + getAbr(getNumber(presale?.maxBag)) : "0"}
							</span>
							<span className="text-sm font-normal text-gray-400">Remaining: {remaining ? remaining : "0"}</span>
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
