import Image from "next/image";

import EtherscanBadge from "@/components/images/EtherscanBadge";
import DextoolsBadge from "@/components/images/DextoolsBadge";
import Website from "@/components/images/Website";
import Telegram from "@/components/images/Telegram";
import XBadge from "@/components/images/XBadge";

import logo from "../../../../public/coin.svg";
import { Token } from "@/api/getToken";

const Intro = ({ address, token, isOwner }: { address: `0x${string}`; token: Token; isOwner: boolean }) => {
	return (
		<>
			<span className="text-sm lg:text-md text-gray-400 px-2 border-x border-neutral-400 font-normal rounded-xl">
				{address.toLowerCase()}
			</span>
			<div className="w-full flex mb-8 mt-2">
				<div className="flex flex-1 items-center">
					<Image id="box" src={logo} style={{ width: "auto", height: "40px" }} alt="SAFU Launcher Logo" />
					<h2 className="text-xl lg:text-3xl mx-4 text-slate-200">{token?.name}</h2>
					<h2 className="text-xl lg:text-3xl text-gray-400">{token?.symbol}</h2>
				</div>
				<div className="flex items-center">
					{!isOwner && token?.website && <Website url="token?.website" />}
					{!isOwner && token?.telegram && <Telegram url="token?.telegram" />}
					{!isOwner && token?.twitter && <XBadge url="token?.twitter" />}
					<EtherscanBadge url={"https://etherscan.io/token/" + address} />
					<DextoolsBadge url="https://info.dextools.io/" />
				</div>
			</div>
			<div className="w-full pb-8 border-b border-gray-700">
				<h2 className="mb-1 text-xl text-slate-200">Statistics</h2>
				<div className="flex flex-wrap">
					<div className="w-1/2 flex flex-col lg:flex-1">
						<span className="text-sm mb-2 text-gray-400">TVL</span>
						<h2 className="text-2xl text-slate-200">$662.28M</h2>
					</div>
					<div className="w-1/2 flex flex-col lg:flex-1">
						<span className="text-sm mb-2 text-gray-400">Market cap</span>
						<h2 className="text-2xl text-slate-200">$33.5B</h2>
					</div>
					<div className="w-1/2 flex flex-col lg:flex-1">
						<span className="text-sm mb-2 text-gray-400">FDV</span>
						<h2 className="text-2xl text-slate-200">$1.25B</h2>
					</div>
					<div className="w-1/2 flex flex-col lg:flex-1">
						<span className="text-sm mb-2 text-gray-400">1 day Volume</span>
						<h2 className="text-2xl text-slate-200">$321.4M</h2>
					</div>
				</div>
			</div>
		</>
	);
};

export default Intro;
