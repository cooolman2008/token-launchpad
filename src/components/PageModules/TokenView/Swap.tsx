import { mainnet, useAccount, useNetwork, useContractWrite, useContractRead } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { animate, spring } from "motion";
import { Token } from "@uniswap/sdk-core";
import { Pair } from "@uniswap/v2-sdk";
import { parseEther, formatEther } from "viem";

// token & router abis
import tokenAbi from "../../../../newtokenabi.json";
import routerAbi from "../../../../routerabi.json";

// internal utils
import { createPair, getExchangeRate, getMinAmountOut, getReserves } from "@/utils/swapTokens";

const WETH_ADDRESS = process.env.WETH_ADDRESS;
const UNISWAP_ROUTER_ADDRESS = process.env.UNISWAP_ROUTER_ADDRESS;

interface SwapForm {
	pay: number;
	slippage: number;
	deadline: number;
}

const Swap = ({
	contractAddress,
	symbol,
	tradingEnabled,
}: {
	contractAddress: `0x${string}`;
	symbol: string;
	tradingEnabled: boolean;
}) => {
	// Current chain & wallet address
	const { chain } = useNetwork();
	const { address } = useAccount();

	const [allowance, setAllowance] = useState(BigInt("0"));
	const [worstPrice, setWorstPrice] = useState("0");
	const [reserves, setReserves] = useState<bigint[]>();
	const [pair, setPair] = useState<Pair>();
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const settingRef = useRef<SVGSVGElement>(null);

	// states to dictate the
	const [tokenIn, setTokenIn] = useState(new Token(31337, WETH_ADDRESS, 18));
	const [tokenOut, setTokenOut] = useState(new Token(31337, contractAddress, 18));

	// sort tokens by hex value
	const token0 = tokenIn.sortsBefore(tokenOut) ? tokenIn : tokenOut;
	const token1 = tokenIn.sortsBefore(tokenOut) ? tokenOut : tokenIn;

	useEffect(() => {
		if (tradingEnabled) {
			getReserves(token0, token1, chain ? chain : mainnet).then((data) => {
				setReserves(data);
				if (data) {
					const newPair = createPair(token0, token1, data);
					setPair(newPair);
				}
			});
		}
	}, []);

	// get the allowance of the user
	useContractRead({
		address: contractAddress,
		abi: tokenAbi.abi,
		functionName: "allowance",
		args: [address, UNISWAP_ROUTER_ADDRESS],
		onSuccess(data) {
			if (data && typeof data === "bigint") {
				setAllowance(data);
			}
		},
	});

	// sets the tokens to recieve on swap
	const setAmounts = () => {
		const amount = getValues("pay");
		if (reserves && amount) {
			// gets the tokens to recieve on swap
			getExchangeRate(
				tokenIn === token0 ? reserves : [reserves[1], reserves[0]],
				parseEther(amount.toString()),
				chain ? chain : mainnet
			).then((data) => {
				setWorstPrice(data);
			});
		}
	};

	useEffect(() => {
		setAmounts();
	}, [tokenIn]);

	// router function to swap ETH for tokens
	const {
		data: theSwap,
		isLoading: loadingSwap,
		isSuccess: swapDone,
		write: swap,
	} = useContractWrite({
		address: UNISWAP_ROUTER_ADDRESS,
		abi: routerAbi.abi,
		functionName: "swapExactETHForTokens",
		onSuccess(res) {
			console.log(res);
		},
		onError(error) {
			console.log(error);
		},
	});

	// swap function for ETH to tokens
	const {
		data: theTokenSwap,
		isLoading: loadingTokenSwap,
		isSuccess: tokenSwapDone,
		write: tokenSwap,
	} = useContractWrite({
		address: UNISWAP_ROUTER_ADDRESS,
		abi: routerAbi.abi,
		functionName: "swapExactTokensForETH",
		onSuccess(res) {
			console.log(res);
		},
		onError(error) {
			console.log(error);
		},
	});

	const {
		data: suc,
		isSuccess: done,
		writeAsync: approve,
	} = useContractWrite({
		address: contractAddress,
		abi: tokenAbi.abi,
		functionName: "approve",
		onSuccess(res) {
			console.log(res);
		},
		onError(error) {
			console.log(error);
		},
	});

	const {
		register,
		handleSubmit,
		getValues,
		formState: { errors },
	} = useForm<SwapForm>();
	const onSubmit: SubmitHandler<SwapForm> = (formData) => {
		if (formData.pay && pair) {
			const amountInMax = parseEther(formData.pay.toString());
			// const slippage = formData.slippage.toString();
			// const deadline = Math.floor(Date.now() / 1000) + 60 * formData.deadline;
			const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
			const minAmountOut = getMinAmountOut(
				tokenIn === token0 ? token0 : token1,
				tokenIn === token0 ? token1 : token0,
				amountInMax,
				pair
				// slippage
			);
			console.log(minAmountOut);
			console.log(amountInMax);
			console.log(deadline);

			if (tokenIn.address.toUpperCase() === WETH_ADDRESS.toUpperCase()) {
				swap({
					args: [minAmountOut, [WETH_ADDRESS, contractAddress], address, deadline],
					value: amountInMax,
				});
			} else {
				const args = {
					args: [amountInMax, minAmountOut, [contractAddress, WETH_ADDRESS], address, deadline],
				};

				if (allowance >= amountInMax) {
					tokenSwap(args);
				} else {
					approve({ args: [UNISWAP_ROUTER_ADDRESS, amountInMax] }).then(() => {
						tokenSwap(args);
					});
				}
			}
		}
	};

	const handleClickOutside = (event: MouseEvent | TouchEvent) => {
		const wrapper = wrapperRef.current;
		if (
			wrapper instanceof HTMLElement &&
			settingRef.current instanceof SVGSVGElement &&
			!wrapper.contains(event.target as Node) &&
			!settingRef.current.contains(event.target as Node)
		) {
			setIsOpen(false);
			document.removeEventListener("mouseup", handleClickOutside);
			document.removeEventListener("touchend", handleClickOutside);
		}
	};

	const handleSettings = () => {
		if (!isOpen) {
			document.addEventListener("mouseup", handleClickOutside);
			document.addEventListener("touchend", handleClickOutside);
			setIsOpen(true);
		} else {
			setIsOpen(false);
			document.removeEventListener("mouseup", handleClickOutside);
			document.removeEventListener("touchend", handleClickOutside);
		}
	};

	return (
		<>
			<div className="flex justify-between mb-4 items-center relative">
				<h2 className="text-2xl">Swap</h2>
				<svg
					ref={settingRef}
					width="24"
					height="24"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					className="fill-gray-400 cursor-pointer"
					onClick={handleSettings}
				>
					<path d="M20.83 14.6C19.9 14.06 19.33 13.07 19.33 12C19.33 10.93 19.9 9.93999 20.83 9.39999C20.99 9.29999 21.05 9.1 20.95 8.94L19.28 6.06C19.22 5.95 19.11 5.89001 19 5.89001C18.94 5.89001 18.88 5.91 18.83 5.94C18.37 6.2 17.85 6.34 17.33 6.34C16.8 6.34 16.28 6.19999 15.81 5.92999C14.88 5.38999 14.31 4.41 14.31 3.34C14.31 3.15 14.16 3 13.98 3H10.02C9.83999 3 9.69 3.15 9.69 3.34C9.69 4.41 9.12 5.38999 8.19 5.92999C7.72 6.19999 7.20001 6.34 6.67001 6.34C6.15001 6.34 5.63001 6.2 5.17001 5.94C5.01001 5.84 4.81 5.9 4.72 6.06L3.04001 8.94C3.01001 8.99 3 9.05001 3 9.10001C3 9.22001 3.06001 9.32999 3.17001 9.39999C4.10001 9.93999 4.67001 10.92 4.67001 11.99C4.67001 13.07 4.09999 14.06 3.17999 14.6H3.17001C3.01001 14.7 2.94999 14.9 3.04999 15.06L4.72 17.94C4.78 18.05 4.89 18.11 5 18.11C5.06 18.11 5.12001 18.09 5.17001 18.06C6.11001 17.53 7.26 17.53 8.19 18.07C9.11 18.61 9.67999 19.59 9.67999 20.66C9.67999 20.85 9.82999 21 10.02 21H13.98C14.16 21 14.31 20.85 14.31 20.66C14.31 19.59 14.88 18.61 15.81 18.07C16.28 17.8 16.8 17.66 17.33 17.66C17.85 17.66 18.37 17.8 18.83 18.06C18.99 18.16 19.19 18.1 19.28 17.94L20.96 15.06C20.99 15.01 21 14.95 21 14.9C21 14.78 20.94 14.67 20.83 14.6ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15Z"></path>
				</svg>
				{isOpen && (
					<div
						className="absolute top-10 right-0 rounded-xl bg-black p-4 border-2 border-neutral-800 w-80 z-10 flex"
						ref={wrapperRef}
					>
						<div className="mr-8">
							<label htmlFor="slippage" className="block text-sm leading-6 text-white mb-2">
								Max.slippage
							</label>
							<div className="mt-2 relative">
								<input
									type="text"
									id="slippage"
									placeholder="0.5"
									defaultValue="6"
									{...register("slippage", {
										required: true,
										min: 0.005,
										max: 6,
									})}
									className="block w-20 rounded-xl ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 border border-gray-600 outline-0 sm:text-md"
								/>

								<div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:text-md text-gray-400">%</div>
							</div>
						</div>
						<div className="">
							<label htmlFor="deadline" className="block text-sm leading-6 text-white mb-2">
								Deadline
							</label>
							<input
								type="text"
								id="deadline"
								placeholder="10"
								defaultValue={10}
								{...register("deadline", {
									required: true,
									min: 10,
									max: 20,
								})}
								className="block w-20 rounded-xl ps-3 pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-md"
							/>
						</div>
					</div>
				)}
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
								min: 0.0001,
							})}
							disabled={!tradingEnabled}
							className="block w-full rounded-xl pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-3xl"
							onBlur={setAmounts}
						/>
						<span className="block sm:text-3xl leading-6 text-gray-400 pt-1.5">
							{tokenIn.address.toUpperCase() === WETH_ADDRESS.toUpperCase() ? "ETH" : symbol}
						</span>
					</div>
				</div>
				<div
					className="w-full flex justify-end pr-8"
					style={{ margin: "-16px auto" }}
					onClick={() => {
						setTokenIn(tokenOut);
						setTokenOut(tokenIn);
						animate("#arrows", { skewY: [0, 180] }, { easing: spring() });
					}}
				>
					<div className="w-10 h-10 bg-neutral-900 flex items-center justify-center rounded-xl border-4 border-black cursor-pointer">
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
					<label className="block text-sm leading-6 text-gray-400">Your returns</label>
					<div className="w-full flex">
						<span className="block w-full pe-3 my-3 text-gray-400 sm:leading-6 bg-neutral-900 sm:text-3xl">
							{worstPrice}
						</span>
						<span className="block sm:text-3xl leading-6 text-gray-400 pt-1.5">
							{tokenIn.address.toUpperCase() === WETH_ADDRESS.toUpperCase() ? symbol : "ETH"}
						</span>
					</div>
				</div>
				{tradingEnabled && (
					<div className="flex justify-center flex-col mt-2">
						<input className="safu-button-primary cursor-pointer" type="submit" value="Swap" />
					</div>
				)}
			</form>
		</>
	);
};

export default Swap;
