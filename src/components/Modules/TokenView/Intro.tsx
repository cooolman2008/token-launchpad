import Image from "next/image";

import EtherscanBadge from "@/components/images/EtherscanBadge";
import DextoolsBadge from "@/components/images/DextoolsBadge";
import Website from "@/components/images/Website";
import Telegram from "@/components/images/Telegram";
import XBadge from "@/components/images/XBadge";

import coin from "../../../../public/coin.svg";
import { Token } from "@/api/getToken";
import { getAbr } from "@/utils/math";
import { useEffect } from "react";
import { animate } from "motion";

const Intro = ({
	address,
	token,
	isOwner,
	isPresale,
}: {
	address: `0x${string}`;
	token: Token;
	isOwner: boolean;
	isPresale: boolean;
}) => {
	useEffect(() => {
		if (isPresale) {
			animate(
				"#shine",
				{ left: ["-180px", "150px", "150px"] },
				{ easing: "ease-in-out", repeat: Infinity, duration: 2 }
			);
		}
	}, [isPresale]);
	return (
		<>
			<span className="text-xs md:text-md text-gray-400 px-2 border-x border-neutral-400 font-normal rounded-xl">
				{address.toLowerCase()}
			</span>
			<div className="w-full flex flex-wrap mb-8 mt-2">
				<div className="w-full xl:w-auto flex flex-1 mb-4 xl:mb-0 items-center">
					<Image id="box" src={coin} style={{ width: "auto", height: "40px" }} alt="SAFU Launcher Logo" />
					<h2 className="text-xl lg:text-3xl mx-4">{token?.name}</h2>
					<h2 className="text-xl lg:text-3xl mr-4 text-gray-400">{token?.symbol}</h2>
					{isPresale && (
						<div className="flex border-orange-600 rounded-xl px-3 py-1 bg-gradient-to-r from-orange-500/15 relative overflow-hidden">
							<svg height="18px" width="18px" version="1.1" viewBox="0 0 611.999 611.999">
								<defs>
									<linearGradient id="grad2" gradientTransform="rotate(45)">
										<stop offset="0%" stopColor="rgb(250, 204, 21)" />
										<stop offset="100%" stopColor="rgb(220, 38, 38)" />
									</linearGradient>
								</defs>
								<g>
									<path
										fill="url(#grad2)"
										d="M216.02,611.195c5.978,3.178,12.284-3.704,8.624-9.4c-19.866-30.919-38.678-82.947-8.706-149.952   c49.982-111.737,80.396-169.609,80.396-169.609s16.177,67.536,60.029,127.585c42.205,57.793,65.306,130.478,28.064,191.029   c-3.495,5.683,2.668,12.388,8.607,9.349c46.1-23.582,97.806-70.885,103.64-165.017c2.151-28.764-1.075-69.034-17.206-119.851   c-20.741-64.406-46.239-94.459-60.992-107.365c-4.413-3.861-11.276-0.439-10.914,5.413c4.299,69.494-21.845,87.129-36.726,47.386   c-5.943-15.874-9.409-43.33-9.409-76.766c0-55.665-16.15-112.967-51.755-159.531c-9.259-12.109-20.093-23.424-32.523-33.073   c-4.5-3.494-11.023,0.018-10.611,5.7c2.734,37.736,0.257,145.885-94.624,275.089c-86.029,119.851-52.693,211.896-40.864,236.826   C153.666,566.767,185.212,594.814,216.02,611.195z"
									/>
								</g>
							</svg>
							<h3 className="pl-1 text-sm font-normal text-orange-400">Presale</h3>
							<div
								id="shine"
								className="absolute h-20 w-64 bg-gradient-to-b from-trasparent via-50 via-white/45 via-100 via-transparent -rotate-45 -translate-x-1/3 -left-16"
							></div>
						</div>
					)}
				</div>
				<div className="w-full xl:w-auto flex items-center">
					{!isOwner && token?.website && <Website url="token?.website" />}
					{!isOwner && token?.telegram && <Telegram url="token?.telegram" />}
					{!isOwner && token?.twitter && <XBadge url="token?.twitter" />}
					<EtherscanBadge url={"https://etherscan.io/token/" + address} />
					<DextoolsBadge url="https://info.dextools.io/" />
				</div>
			</div>
			<div className="w-full pb-8 border-b border-gray-700">
				<h2 className="mb-1 text-xl">Statistics</h2>
				<div className="flex flex-wrap">
					<div className="w-1/2 flex flex-col md:flex-1">
						<span className="text-sm mb-2 text-gray-400">TVL</span>
						<h2 className="text-2xl text-slate-200">${getAbr(Number(token?.totalLiquidity))}</h2>
					</div>
					<div className="w-1/2 flex flex-col md:flex-1">
						<span className="text-sm mb-2 text-gray-400">Market cap</span>
						<h2 className="text-2xl text-slate-200">$0</h2>
					</div>
					<div className="w-1/2 flex flex-col md:flex-1">
						<span className="text-sm mb-2 text-gray-400">FDV</span>
						<h2 className="text-2xl text-slate-200">$0</h2>
					</div>
					<div className="w-1/2 flex flex-col md:flex-1">
						<span className="text-sm mb-2 text-gray-400">1 day Volume</span>
						<h2 className="text-2xl text-slate-200">
							${token?.tokenDayData[0] ? getAbr(Number(token?.tokenDayData[0]?.dailyVolumeUSD)) : "0"}
						</h2>
					</div>
				</div>
			</div>
		</>
	);
};

export default Intro;
