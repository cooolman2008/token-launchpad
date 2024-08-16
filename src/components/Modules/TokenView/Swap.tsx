import { useWriteContract, useReadContract, useChainId, usePublicClient } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState, SetStateAction, Dispatch, useCallback } from "react";
import { animate, spring } from "motion";
import { Token } from "@uniswap/sdk-core";
import { Pair } from "@uniswap/v2-sdk";
import { getAddress, parseEther } from "viem";

import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

// internal utils
import { createPair, getExchangeRate, getMinAmountOut, getReserves } from "@/utils/swapHelper";
import { tokenAbi } from "@/abi/tokenAbi";
import { routerAbi } from "@/abi/routerAbi";
import { getBaseCoin } from "@/utils/utils";
import SwapSettings from "./SwapSettings";
import { useWeb3Modal } from "@web3modal/wagmi/react";

export interface SwapForm {
	pay: number;
	slippage: number;
	deadline: number;
}

const Swap = ({
	contractAddress,
	routerAddress,
	pairAddress,
	address,
	symbol,
	tradingEnabled,
	setSuccess,
}: {
	contractAddress: `0x${string}`;
	routerAddress: `0x${string}`;
	pairAddress: `0x${string}`;
	address: `0x${string}`;
	symbol: string;
	tradingEnabled: boolean;
	setSuccess: Dispatch<SetStateAction<string>>;
}) => {
	const address_0 = "0x0000000000000000000000000000000000000000";
	// Current chain & wallet address
	const chain = useChainId();
	const client = usePublicClient({
		chainId: chain,
	});
	const { open } = useWeb3Modal();

	const [allowance, setAllowance] = useState(BigInt("0"));
	const [worstPrice, setWorstPrice] = useState("0");
	const [reserves, setReserves] = useState<bigint[]>();
	const [pair, setPair] = useState<Pair>();
	const [error, setError] = useState("");

	const clear = () => {
		setError("");
	};

	const base = getBaseCoin(chain);
	const WETH_ADDRESS = base ? base : getAddress("0xcd12ed11c27c1fa611bbc814178f7ea8be25402c");

	// states to dictate the reserves
	const [tokenIn, setTokenIn] = useState(new Token(chain, WETH_ADDRESS, 18));
	const [tokenOut, setTokenOut] = useState(new Token(chain, contractAddress, 18));

	// sort tokens by hex value
	const token0 = tokenIn.sortsBefore(tokenOut) ? tokenIn : tokenOut;
	const token1 = tokenIn.sortsBefore(tokenOut) ? tokenOut : tokenIn;

	useEffect(() => {
		if (tradingEnabled && client && pairAddress) {
			getReserves(client, pairAddress)
				.then((data) => {
					setReserves(data);
					if (data) {
						const newPair = createPair(token0, token1, data);
						setPair(newPair);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [chain, client, pairAddress, token0, token1, tradingEnabled]);

	// get the allowance of the user
	const { data: allowanceData, refetch: check } = useReadContract({
		address: contractAddress,
		abi: tokenAbi,
		functionName: "allowance",
		args: [address, routerAddress],
	});

	useEffect(() => {
		if (allowanceData) {
			setAllowance(allowanceData);
		}
	}, [allowanceData]);

	const { isPending: approving, writeContractAsync: approve } = useWriteContract({
		mutation: {
			onSuccess(res) {
				console.log(res);
			},
			onError(error) {
				setError("Something went wrong!");
				console.log(error);
			},
		},
	});

	// router function to swap ETH for tokens
	const { isPending: loadingSwap, writeContract: swap } = useWriteContract({
		mutation: {
			onSuccess(res) {
				setSuccess("Swapped successfully!");
				console.log(res);
			},
			onError(error) {
				setError("Something went wrong!");
				console.log(error);
			},
		},
	});

	// swap function for ETH to tokens
	const { isPending: loadingTokenSwap, writeContract: tokenSwap } = useWriteContract({
		mutation: {
			onSuccess(res) {
				setSuccess("Swapped successfully!");
				console.log(res);
			},
			onError(error) {
				setError("Something went wrong!");
				console.log(error);
			},
		},
	});

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm<SwapForm>();
	const onSubmit: SubmitHandler<SwapForm> = (formData) => {
		if (formData.pay && pair && address) {
			const amountInMax = parseEther(formData.pay.toString());
			const slippage = formData.slippage ? formData.slippage.toString() : "6";
			const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * (formData.deadline ? formData.deadline : 10));
			const minAmountOut = getMinAmountOut(
				tokenIn === token0 ? token0 : token1,
				tokenIn === token0 ? token1 : token0,
				amountInMax,
				pair,
				slippage
			);

			if (tokenIn.address.toUpperCase() === WETH_ADDRESS.toUpperCase()) {
				console.log({
					address: routerAddress,
					functionName: "swapExactETHForTokensSupportingFeeOnTransferTokens",
					args: [minAmountOut, [WETH_ADDRESS, contractAddress], address, deadline],
					value: amountInMax,
				});
				swap({
					address: routerAddress,
					abi: routerAbi,
					functionName: "swapExactETHForTokensSupportingFeeOnTransferTokens",
					args: [minAmountOut, [WETH_ADDRESS, contractAddress], address, deadline],
					value: amountInMax,
				});
			} else {
				if (allowance >= amountInMax) {
					console.log({
						address: routerAddress,
						functionName: "swapExactTokensForETHSupportingFeeOnTransferTokens",
						args: [amountInMax, minAmountOut, [contractAddress, WETH_ADDRESS], address, deadline],
					});
					tokenSwap({
						address: routerAddress,
						abi: routerAbi,
						functionName: "swapExactTokensForETHSupportingFeeOnTransferTokens",
						args: [amountInMax, minAmountOut, [contractAddress, WETH_ADDRESS], address, deadline],
					});
				} else {
					approve({
						address: contractAddress,
						abi: tokenAbi,
						functionName: "approve",
						args: [routerAddress, amountInMax],
					}).then(() => {
						console.log({
							address: routerAddress,
							functionName: "swapExactTokensForETHSupportingFeeOnTransferTokens",
							args: [amountInMax, minAmountOut, [contractAddress, WETH_ADDRESS], address, deadline],
						});
						tokenSwap({
							address: routerAddress,
							abi: routerAbi,
							functionName: "swapExactTokensForETHSupportingFeeOnTransferTokens",
							args: [amountInMax, minAmountOut, [contractAddress, WETH_ADDRESS], address, deadline],
						});
					});
				}
			}
		}
	};

	// sets the tokens to recieve on swap
	const setAmounts = useCallback(() => {
		const amount = getValues("pay");
		if (reserves && amount && client) {
			// gets the tokens to recieve on swap
			getExchangeRate(
				tokenIn === token0 ? reserves : [reserves[1], reserves[0]],
				parseEther(amount.toString()),
				client,
				routerAddress
			).then((data) => {
				setWorstPrice(data);
			});
		}
	}, [routerAddress, client, getValues, reserves, token0, tokenIn]);

	useEffect(() => {
		setAmounts();
	}, [setAmounts, tokenIn]);

	return (
		<>
			{(loadingTokenSwap || loadingSwap) && <Loading msg="Bringing you new tokens..." />}
			{approving && <Loading msg="Waiting for your approval..." />}
			{error && (
				<Modal
					msg={error}
					des="You can try increasing your slippage or this might be a temporary issue"
					error={true}
					callback={clear}
				/>
			)}
			<div className="swap-container">
				<div className="flex justify-between mb-2 items-center relative z-10">
					<h2 className="text-2xl">Swap</h2>
					<SwapSettings register={register} errors={errors} />
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900">
						<label htmlFor="amount" className="block text-sm leading-6 text-gray-400">
							Your pay
						</label>
						<div className="w-full flex">
							<input
								type="text"
								id="amount"
								placeholder="0"
								{...register("pay", {
									required: true,
									pattern: /^[0-9.]+$/i,
								})}
								disabled={!tradingEnabled}
								className="block w-full rounded-xl pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-3xl"
								onBlur={setAmounts}
							/>
							<span
								className={"block sm:text-3xl leading-6 pt-1.5" + (errors.pay ? " text-red-500" : " text-gray-400")}
							>
								{tokenIn.address.toUpperCase() === WETH_ADDRESS.toUpperCase() ? "ETH" : symbol}
							</span>
						</div>
					</div>
					<div className="w-full flex justify-end pr-8" style={{ margin: "-16px auto" }}>
						<div
							className="w-10 h-10 bg-neutral-900 flex items-center justify-center rounded-xl border-4 border-black cursor-pointer"
							onClick={() => {
								setTokenIn(tokenOut);
								setTokenOut(tokenIn);
								animate("#arrows", { skewY: [0, 180] }, { easing: spring() });
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="fill-gray-400"
								id="arrows"
								width="20px"
								height="20px"
								viewBox="0 0 256 256"
							>
								<path d="M120.48535,167.51465a11.99975,11.99975,0,0,1,0,16.9707l-32,32c-.01855.01856-.03906.03418-.0581.05274-.26221.2583-.53418.50634-.81885.74023-.148.12109-.30322.227-.45508.33984-.16211.1211-.31982.24659-.48828.35938-.17627.11767-.35889.22021-.54.32812-.15527.09229-.30664.19-.4668.27539-.18261.09766-.37011.18067-.55615.26807-.16943.08008-.33545.16455-.50879.23633-.18017.07422-.36377.13428-.5459.19971-.187.06738-.37158.13867-.5625.19677-.18213.05518-.36767.09571-.55175.14209-.19532.04883-.38868.104-.5879.14356-.21093.0415-.42334.0664-.63574.09668-.17529.02539-.34765.05859-.52539.07617C80.79,219.979,80.395,220,80,220s-.79-.021-1.18408-.05957c-.17774-.01758-.35059-.05078-.52588-.07617-.21192-.03028-.42481-.05518-.63477-.09668-.1997-.03955-.39306-.09473-.58886-.144-.18409-.0459-.36914-.08643-.55127-.14161-.19092-.05761-.375-.12939-.56153-.19629-.1831-.06543-.3667-.126-.54687-.20019-.17334-.07178-.33887-.15625-.50781-.23584-.18653-.0874-.37452-.17041-.55713-.26856-.16016-.08544-.3125-.18359-.46826-.27636-.18018-.10742-.3628-.20948-.53858-.32715-.16846-.11328-.32715-.23926-.48975-.36035-.15136-.1128-.30615-.21826-.45361-.33887-.28467-.23389-.55664-.48193-.81885-.74023-.019-.01856-.03955-.03418-.0581-.05274l-32-32a12.0001,12.0001,0,0,1,16.9707-16.9707L68,179.0293V48a12,12,0,0,1,24,0V179.0293l11.51465-11.51465A12.00062,12.00062,0,0,1,120.48535,167.51465Zm96-96-32-32c-.01855-.01856-.03906-.03418-.0581-.05274-.26221-.2583-.53418-.50634-.81885-.74023-.14795-.12109-.30322-.227-.45508-.33984-.16211-.1211-.31982-.24659-.48828-.35938-.17578-.11719-.35791-.21973-.53809-.32666-.15625-.09326-.30859-.19141-.46924-.27734-.18164-.09717-.36865-.17969-.55371-.26709-.16992-.08008-.33691-.16455-.51074-.23682-.1792-.07422-.36279-.13428-.54443-.19922-.1875-.06738-.37305-.13916-.56494-.19775-.17969-.0542-.36231-.09375-.54395-.13965-.19824-.04981-.394-.10547-.59619-.14551-.20508-.04053-.4126-.06445-.61963-.09472-.18066-.02588-.3584-.06006-.5415-.07813q-.56763-.05566-1.13819-.05713C176.0293,36.002,176.01514,36,176,36s-.0293.002-.04443.00244q-.56983.0022-1.13819.05713c-.18359.01807-.36133.05225-.542.07813-.207.03027-.41406.05419-.61914.09472-.20215.04-.39844.0957-.59668.14551-.18164.0459-.36377.08545-.54346.13965-.19189.05859-.37695.13037-.56445.19775-.18213.06494-.36523.125-.54492.19922-.17383.07227-.34033.15674-.50977.23682-.18554.08691-.37256.16992-.55468.26709-.16114.08642-.314.18457-.47022.27783-.17969.10693-.36182.209-.53711.32617-.16846.11328-.32715.23926-.48975.36035-.15136.1128-.30615.21778-.45361.33887-.28467.23389-.55664.48193-.81885.74023-.019.01856-.03955.03418-.0581.05274l-32,32a12.0001,12.0001,0,0,0,16.9707,16.9707L164,76.9707V208a12,12,0,0,0,24,0V76.9707l11.51465,11.51465a12.0001,12.0001,0,0,0,16.9707-16.9707Z" />
							</svg>
						</div>
					</div>
					<div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900">
						<span className="block text-sm leading-6 text-gray-400">Your returns</span>
						<div className="w-full flex">
							<span className="block w-full pe-3 my-3 text-gray-400 sm:leading-6 bg-neutral-900 sm:text-3xl">
								{worstPrice}
							</span>
							<span className="block sm:text-3xl leading-6 text-gray-400 pt-1.5">
								{tokenIn.address.toUpperCase() === WETH_ADDRESS.toUpperCase() ? symbol : "ETH"}
							</span>
						</div>
					</div>
					{tradingEnabled &&
						(address !== address_0 ? (
							<div className="flex justify-center flex-col mt-2">
								<input className="safu-button-primary cursor-pointer" type="submit" value="Swap" />
							</div>
						) : (
							<div className="w-full flex justify-center mt-4">
								<button className="mr-8 safu-soft-button" onClick={() => open()}>
									Connect Wallet
								</button>
							</div>
						))}
				</form>
			</div>
		</>
	);
};

export default Swap;
