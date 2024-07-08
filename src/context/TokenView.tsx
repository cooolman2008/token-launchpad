"use client";

import { useWalletClient, useAccount } from "wagmi";
import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAddress, getAddress } from "viem";

import { fetchToken, Token, TeamMember } from "@/api/getToken";

import Intro from "@/components/PageModules/TokenView/Intro";
import StartTrading from "@/components/PageModules/TokenView/StartTrading";
import LaunchStaking from "@/components/PageModules/TokenView/LaunchStaking";
import SetSocials from "@/components/PageModules/TokenView/SetSocials";
import Swap from "@/components/PageModules/TokenView/Swap";
import Staking from "@/components/PageModules/TokenView/Staking";
import Promote from "@/components/PageModules/TokenView/Promote";
import LPChanges from "@/components/PageModules/TokenView/LPChanges";
import Team from "@/components/PageModules/TokenView/Team";
import Claim from "@/components/PageModules/TokenView/Claim";
import Modal from "@/components/elements/Modal";
import Limits from "@/components/PageModules/TokenView/Limits";

import { getGraphUrl } from "@/utils/utils";
import LaunchPresale from "@/components/PageModules/TokenView/LaunchPresale";
import Presale from "@/components/PageModules/TokenView/Presale";
import PresaleDashboard from "@/components/PageModules/TokenView/PresaleDashboard";
import PresaleUser from "@/components/PageModules/TokenView/PresaleUser";
import Loading from "@/components/elements/Loading";

function TokenView({ params }: { params: { slug: `0x${string}` } }) {
	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();
	const router = useRouter();

	const { selectedNetworkId: chainId } = useWeb3ModalState();
	const API_ENDPOINT = getGraphUrl(Number(chainId));

	const [isClient, setIsClient] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const [isTeamSet, setIsTeamSet] = useState(false);
	const [isTeam, setIsTeam] = useState(false);
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>();
	const [isTrading, setIsTrading] = useState(true);
	const [isStaking, setIsStaking] = useState(true);
	const [presale, setPresale] = useState(0);
	const [token, setToken] = useState<Token>();
	const [success, setSuccess] = useState("");
	const [tokenFound, setTokenFound] = useState(true);
	const [loading, setLoading] = useState(false);

	const clear = () => {
		setSuccess("");
		fetchTheToken();
	};

	// function you can use:
	function getSecondPart(str: string) {
		return str.split("-")[1];
	}

	const checkIfTeam = useCallback((team: TeamMember[], address: `0x${string}`) => {
		let members = [] as TeamMember[];
		let id = "";
		team.forEach((element) => {
			id = getSecondPart(element.id);
			if (id === address) {
				setIsTeam(true);
			}
			members.push({
				id: id,
				percent: element.percent,
			});
		});
		setTeamMembers(members);
	}, []);

	const fetchTheToken = useCallback(async () => {
		const data = await fetchToken(params?.slug?.toString(), API_ENDPOINT);
		if (data) {
			const address_0 = "0x0000000000000000000000000000000000000000";
			if (data?.presaleStatus) {
				setPresale(Number(data?.presaleStatus));
			}
			if (data?.staking === address_0) {
				data.staking = "";
				setIsStaking(false);
			}
			if (data?.pair === address_0) {
				data.pair = "";
				setIsTrading(false);
			}
			if (data?.owner.toLowerCase() === address?.toLowerCase()) {
				setIsOwner(true);
			} else {
				setIsOwner(false);
			}
			if (data?.teamMembers && data?.teamMembers.length > 0) {
				if (address) checkIfTeam(data?.teamMembers, address);
			}
			if (data?.cliffPeriod && Number(data?.cliffPeriod) !== 0) {
				setIsTeamSet(true);
			}
			setToken(data);
		} else {
			setTokenFound(false);
		}
		setLoading(false);
	}, [API_ENDPOINT, address, checkIfTeam, params?.slug]);

	useEffect(() => {
		setLoading(true);
		if (!isAddress(params?.slug)) {
			router.push("/", { scroll: true });
		}
		if (chainId) {
			fetchTheToken();
		}
		setIsClient(true);
	}, [router, address, params?.slug, fetchTheToken, chainId]);

	return (
		<>
			{isClient && (
				<>
					{loading && <Loading msg="Loading your token.." />}
					{tokenFound ? (
						token && (
							<>
								{success && <Modal msg={success} callback={clear} />}
								<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-12 w-full">
									<div className="lg:col-span-8">
										<Intro address={params?.slug} token={token} isOwner={isOwner} isPresale={presale === 1} />
										{isTeam && <Claim contractAddress={params?.slug} />}
										{isOwner && !isTrading && presale === 0 && (
											<Team
												contractAddress={params?.slug}
												teamSet={isTeamSet}
												teamMembers={teamMembers}
												setSuccess={setSuccess}
											/>
										)}
										{isOwner && (
											<>
												{!isTrading && presale === 0 && (
													<LaunchPresale
														contractAddress={params?.slug}
														setSuccess={setSuccess}
														presaleAddress={getAddress(token?.presale)}
													/>
												)}
												{presale !== 0 && token?.presale && (
													<PresaleDashboard
														setSuccess={setSuccess}
														presaleAddress={getAddress(token?.presale)}
														isTrading={isTrading}
														symbol={token?.symbol ? token?.symbol : ""}
													/>
												)}
												{!isTrading && presale !== 1 && (
													<StartTrading
														contractAddress={params?.slug}
														callback={setIsTrading}
														setSuccess={setSuccess}
													/>
												)}
												{!isStaking && (
													<LaunchStaking
														contractAddress={params?.slug}
														callback={setIsStaking}
														setSuccess={setSuccess}
													/>
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
										{walletClient && (
											<>
												{presale > 0 && token?.presale && (
													<PresaleUser
														callback={clear}
														setSuccess={setSuccess}
														presaleAddress={getAddress(token?.presale)}
														isTrading={isTrading}
														isOwner={isOwner}
													/>
												)}
												<Promote contractAddress={params?.slug} />
											</>
										)}
									</div>
									<div className="lg:col-span-4">
										<Swap
											contractAddress={params?.slug}
											symbol={token?.symbol ? token?.symbol : ""}
											tradingEnabled={token?.pair ? true : false}
											setSuccess={setSuccess}
										/>
										{presale === 1 && token?.presale && walletClient && (
											<Presale
												contractAddress={params?.slug}
												presaleAddress={getAddress(token?.presale)}
												symbol={token?.symbol ? token?.symbol : ""}
												setSuccess={setSuccess}
											/>
										)}
										{isStaking && token?.staking && walletClient && (
											<Staking
												contractAddress={params?.slug}
												stakingAddress={getAddress(token?.staking)}
												symbol={token?.symbol ? token?.symbol : ""}
												setSuccess={setSuccess}
											/>
										)}
										{isOwner && walletClient && (
											<SetSocials
												contractAddress={params?.slug}
												telegram={token?.telegram ? token?.telegram : ""}
												twitter={token?.twitter ? token?.twitter : ""}
												website={token?.website ? token?.website : ""}
												setSuccess={setSuccess}
											/>
										)}
									</div>
								</div>
							</>
						)
					) : (
						<div className="min-h-[90vh] flex flex-col justify-center text-center">
							<h2 className="max-md:text-sm text-2xl text-red-500">Sorry, there was no contract on this address!</h2>
							<p className="max-md:text-xs text-xl text-gray-400">
								Try refreshing the page or searching the address of the contract in the above search bar
							</p>
						</div>
					)}
				</>
			)}
		</>
	);
}
export default TokenView;
