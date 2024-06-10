"use client";

import { useWalletClient, useAccount } from "wagmi";
import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAddress, getAddress } from "viem";

import { fetchToken, Token } from "@/api/getToken";

import Intro from "@/components/PageModules/TokenView/Intro";
import StartTrading from "@/components/PageModules/TokenView/StartTrading";
import LaunchStaking from "@/components/PageModules/TokenView/LaunchStaking";
import SetSocials from "@/components/PageModules/TokenView/SetSocials";
import Swap from "@/components/PageModules/TokenView/Swap";
import Staking from "@/components/PageModules/TokenView/Staking";
import Promote from "@/components/PageModules/TokenView/Promote";
import LPChanges from "@/components/PageModules/TokenView/LPChanges";
import Team from "@/components/PageModules/Launch/Team";
import Claim from "@/components/PageModules/TokenView/Claim";
import Modal from "@/components/elements/Modal";

import { getGraphUrl } from "@/utils/utils";
import Limits from "@/components/PageModules/TokenView/Limits";

function TokenView({ params }: { params: { slug: `0x${string}` } }) {
	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();
	const router = useRouter();

	const { selectedNetworkId: chainId } = useWeb3ModalState();
	const API_ENDPOINT = getGraphUrl(Number(chainId));

	const [isClient, setIsClient] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const [isTeam, setIsTeam] = useState(false);
	const [isTeamSet, setIsTeamSet] = useState(true);
	const [isTrading, setIsTrading] = useState(true);
	const [isStaking, setIsStaking] = useState(true);
	const [token, setToken] = useState<Token>();
	const [success, setSuccess] = useState("");

	const clear = () => {
		setSuccess("");
		fetchTheToken();
	};

	const fetchTheToken = useCallback(async () => {
		const data = await fetchToken(params?.slug?.toString(), API_ENDPOINT);
		const address_0 = "0x0000000000000000000000000000000000000000";
		if (data?.pair === address_0) {
			data.pair = "";
			setIsTrading(false);
		}
		if (data?.staking === address_0) {
			data.staking = "";
			setIsStaking(false);
		}
		setToken(data);
		if (data?.owner.toLowerCase() === address?.toLowerCase()) {
			setIsOwner(true);
		}
		if (
			data?.team1 === address_0 &&
			data?.team2 === address_0 &&
			data?.team3 === address_0 &&
			data?.team4 === address_0 &&
			data?.team5 === address_0
		) {
			setIsTeamSet(false);
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
	}, [API_ENDPOINT, address, params?.slug]);

	useEffect(() => {
		if (!isAddress(params?.slug)) {
			router.push("/");
		}
		fetchTheToken();
		setIsClient(true);
	}, [router, address, params?.slug, fetchTheToken]);

	return (
		<>
			{isClient && walletClient && token && (
				<>
					{success && <Modal msg={success} callback={clear} />}
					<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12 w-full">
						<div className="sm:col-span-7 lg:col-span-8">
							<Intro address={params?.slug} token={token} isOwner={isOwner} />
							{isTeam && <Claim contractAddress={params?.slug} />}
							{isOwner && (
								<>
									{!isTrading && !isTeamSet && (
										<Team contractAddress={params?.slug} callback={setIsTeamSet} setSuccess={setSuccess} />
									)}
									{!isTrading && (
										<StartTrading contractAddress={params?.slug} callback={setIsTrading} setSuccess={setSuccess} />
									)}
									{isTrading && !isStaking && (
										<LaunchStaking contractAddress={params?.slug} callback={setIsStaking} setSuccess={setSuccess} />
									)}
									{isTrading && !token?.isLpRetrieved && !token?.isLpBurnt && (
										<LPChanges
											contractAddress={params?.slug}
											setSuccess={setSuccess}
											lplockDays={token?.lplockDays}
											lplockStart={Number(token?.lplockStart)}
										/>
									)}
									{isTrading && (
										<Limits
											contractAddress={params?.slug}
											setSuccess={setSuccess}
											txLimit={token?.txLimit}
											walletLimit={token?.walletLimit}
										/>
									)}
								</>
							)}
							<Promote contractAddress={params?.slug} />
						</div>
						<div className="sm:col-span-5 lg:col-span-4">
							<Swap
								contractAddress={params?.slug}
								symbol={token?.symbol ? token?.symbol : ""}
								tradingEnabled={token?.pair ? true : false}
							/>
							{isStaking && token?.staking && (
								<Staking
									contractAddress={params?.slug}
									stakingAddress={getAddress(token?.staking)}
									symbol={token?.symbol ? token?.symbol : ""}
									callback={setIsStaking}
									setSuccess={setSuccess}
								/>
							)}
							{isOwner && (
								<SetSocials
									contractAddress={params?.slug}
									telegram={token?.telegram ? token?.telegram : ""}
									twitter={token?.twitter ? token?.twitter : ""}
									website={token?.website ? token?.website : ""}
								/>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
}
export default TokenView;
