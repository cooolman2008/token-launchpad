"use client";

import { useWalletClient, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";
import Image from "next/image";

import { fetchToken, Token } from "@/api/getToken";
import EtherscanBadge from "@/components/images/EtherscanBadge";
import DextoolsBadge from "@/components/images/DextoolsBadge";
import StartTrading from "@/components/PageModules/TokenView/StartTrading";
import Changes from "@/components/PageModules/TokenView/Changes";
import SetSocials from "@/components/PageModules/TokenView/SetSocials";
import Promote from "@/components/PageModules/TokenView/Promote";
import Swap from "@/components/PageModules/TokenView/Swap";
import logo from "../../public/coin.svg";

function TokenView({ params }: { params: { slug: `0x${string}` } }) {
	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();
	const router = useRouter();

	const [isClient, setIsClient] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const [isTeam, setIsTeam] = useState(false);
	const [token, setToken] = useState<Token>();

	useEffect(() => {
		if (!isAddress(params?.slug)) {
			router.push("/");
		}
		async function fetchTheToken() {
			const data = await fetchToken(params?.slug?.toString());
			if (data?.pair === "0x0000000000000000000000000000000000000000") {
				data.pair = "";
			}
			setToken(data);
			if (data?.owner.toLowerCase() === address?.toLowerCase()) {
				setIsOwner(true);
			}
			if (
				data?.team1 === address ||
				data?.team2 === address ||
				data?.team3 === address ||
				data?.team4 === address ||
				data?.team5 === address
			) {
				setIsTeam(true);
			}
		}
		fetchTheToken();
		setIsClient(true);
	}, [router, address, params?.slug]);

	return (
		<>
			{isClient && walletClient && token && (
				<>
					<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12 w-full">
						<div className="sm:col-span-8">
							<span className="text-md text-gray-400 px-2 border-x border-neutral-400 font-normal rounded-xl">
								{params?.slug.toLowerCase()}
							</span>
							<div className="w-full flex my-8">
								<div className="flex flex-1">
									<Image id="box" src={logo} style={{ width: "auto", height: "40px" }} alt="SAFU Launcher Logo" />
									<h2 className="text-3xl mx-4 text-slate-200">{token?.name}</h2>
									<h2 className="text-3xl text-gray-400">{token?.symbol}</h2>
								</div>
								<div>
									<EtherscanBadge url={"https://etherscan.io/token/" + params?.slug} />
									<DextoolsBadge url="https://info.dextools.io/" />
								</div>
							</div>
							<div className="w-full pb-8 border-b border-gray-700">
								<h2 className="my-4 text-2xl text-slate-200">Statistics</h2>
								<div className="flex">
									<div className="flex flex-col flex-1">
										<span className="text-sm mb-2 text-gray-400">TVL</span>
										<h2 className="text-3xl text-slate-200">$662.28M</h2>
									</div>
									<div className="flex flex-col flex-1">
										<span className="text-sm mb-2 text-gray-400">Market cap</span>
										<h2 className="text-3xl text-slate-200">$33.5B</h2>
									</div>
									<div className="flex flex-col flex-1">
										<span className="text-sm mb-2 text-gray-400">FDV</span>
										<h2 className="text-3xl text-slate-200">$1.25B</h2>
									</div>
									<div className="flex flex-col flex-1">
										<span className="text-sm mb-2 text-gray-400">1 day Volume</span>
										<h2 className="text-3xl text-slate-200">$321.4M</h2>
									</div>
								</div>
							</div>
							{isTeam && (
								<div className="w-full">
									<h2 className="block text-2xl my-4 font-thin">Take what's yours!</h2>
									<div className="flex mb-12 mt-4">
										<div className="flex flex-col">
											<span className="block text-sm mb-2 text-gray-400">Vested Tokens</span>
											<button className="safu-button-primary">Claim $62.02M</button>
										</div>
									</div>
								</div>
							)}
							{isOwner && (
								<>
									{!token?.pair && (
										<div className="w-full py-8 border-b border-gray-700">
											<StartTrading contractAddress={params?.slug} />
										</div>
									)}
									{token?.pair && (
										<div className="w-full py-8 border-b border-gray-700">
											<Changes
												contractAddress={params?.slug}
												isLimited={token?.isLimited}
												isLpBurnt={token?.isLpBurnt}
												isLpRetrieved={token?.isLpRetrieved}
											/>
										</div>
									)}
								</>
							)}
							<div className="w-full pt-8">
								<Promote contractAddress={params?.slug} />
							</div>
						</div>
						<div className="sm:col-span-4">
							<div className="swap-container">
								<Swap
									contractAddress={params?.slug}
									symbol={token?.symbol ? token?.symbol : ""}
									tradingEnabled={token?.pair ? true : false}
								/>
							</div>
							{isOwner && (
								<div className="socials-container mt-12">
									<SetSocials
										contractAddress={params?.slug}
										telegram={token?.telegram ? token?.telegram : ""}
										twitter={token?.twitter ? token?.twitter : ""}
										website={token?.website ? token?.website : ""}
									/>
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
}
export default TokenView;
