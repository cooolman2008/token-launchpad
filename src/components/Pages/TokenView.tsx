"use client";

import { useWalletClient, useAccount, useReadContract, useChainId } from "wagmi";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAddress, getAddress, formatEther } from "viem";

import { fetchToken, Token, TeamMember, LPDetails } from "@/api/getToken";

import Intro from "@/components/Modules/TokenView/Intro";
import StartTrading from "@/components/Modules/TokenView/StartTrading";
import LaunchStaking from "@/components/Modules/TokenView/LaunchStaking";
import SetSocials from "@/components/Modules/TokenView/SetSocials";
import Swap from "@/components/Modules/TokenView/Swap";
import Staking from "@/components/Modules/TokenView/Staking";
import Promote from "@/components/Modules/TokenView/Promote";
import LPChanges from "@/components/Modules/TokenView/LPChanges";
import Team from "@/components/Modules/TokenView/Team";
import Claim from "@/components/Modules/TokenView/Claim";
import Modal from "@/components/elements/Modal";
import Limits from "@/components/Modules/TokenView/Limits";

import { getContractAddress, getGraphUrl } from "@/utils/utils";
import LaunchPresale from "@/components/Modules/TokenView/LaunchPresale";
import Presale from "@/components/Modules/TokenView/Presale";
import PresaleDashboard from "@/components/Modules/TokenView/PresaleDashboard";
import PresaleUser from "@/components/Modules/TokenView/PresaleUser";
import Loading from "@/components/elements/Loading";

import { ownerAbi } from "@/abi/ownerAbi";
import { helperAbi } from "@/abi/helperAbi";

export interface LauncherData {
	ethCost: bigint;
	safuCost: bigint;
	promoCostEth: bigint;
	promoCostSafu: bigint;
	minLiq: bigint;
	bridge: `0x${string}`;
}

function TokenView({ params }: { params: { slug: `0x${string}` } }) {
	const address_0 = "0x0000000000000000000000000000000000000000";

	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();
	const router = useRouter();

	const chainId = useChainId();
	const API_ENDPOINT = getGraphUrl(chainId);
	const CONTRACT_ADDRESS = getContractAddress(chainId);

	const [isClient, setIsClient] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const [isTeamSet, setIsTeamSet] = useState(false);
	const [isTeam, setIsTeam] = useState(false);
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>();
	const [isTrading, setIsTrading] = useState(true);
	const [isLimited, setIsLimited] = useState(true);
	const [isStaking, setIsStaking] = useState(true);
	const [presale, setPresale] = useState(0);
	const [token, setToken] = useState<Token>();
	const [lp, setLp] = useState<LPDetails>();
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const [launcher, setLauncher] = useState<LauncherData>();

	const clear = () => {
		setSuccess("");
		fetchTheToken();
		refetch();
	};

	const scrollTo = (id: string) => {
		const ele = document.getElementById(id);
		if (ele) {
			ele.scrollIntoView({
				behavior: "smooth",
			});
		}
	};

	// function you can use:
	function getSecondPart(str: string) {
		return str.split("-")[1];
	}

	// get LP details.
	const { data: LPData, refetch } = useReadContract({
		address: getAddress(params?.slug?.toString()),
		abi: ownerAbi,
		functionName: "getLPDetails",
	});

	useEffect(() => {
		if (LPData) {
			console.log(LPData);
			if (LPData) {
				if (LPData?.stakingContract === address_0) {
					setIsStaking(false);
				}
				if (LPData?.pair === address_0) {
					setIsTrading(false);
				}
				if (!LPData?.walletLimited) {
					setIsLimited(false);
				}
				setLp(LPData);
			}
		}
	}, [LPData]);

	// get Promo costs from SAFU launcher.
	const { data: launcherData } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: helperAbi,
		functionName: "getLauncherDetails",
	});

	useEffect(() => {
		if (launcherData) {
			setLauncher(launcherData);
		}
	}, [launcherData]);

	const checkIfTeam = useCallback((team: TeamMember[], address: `0x${string}`) => {
		let members = [] as TeamMember[];
		let id = "";
		team.forEach((element) => {
			id = getSecondPart(element.id);
			if (id.toLowerCase() === address.toLowerCase()) {
				setIsTeam(true);
			}
			members.push({
				id: id,
				percent: element.percent,
			});
		});
		setTeamMembers(members);
	}, []);

	const checkIfOwner = useCallback((tokenOwner: string, wallet: `0x${string}`) => {
		tokenOwner.toLocaleLowerCase() === wallet?.toLocaleLowerCase() ? setIsOwner(true) : setIsOwner(false);
	}, []);

	const fetchTheToken = useCallback(
		async (controller?: AbortController) => {
			if (API_ENDPOINT) {
				setLoading(true);
				setToken(undefined);
				fetchToken(params?.slug?.toString(), API_ENDPOINT, controller ? controller.signal : undefined)
					.then((data) => {
						if (data) {
							if (data?.presaleStatus) {
								setPresale(Number(data?.presaleStatus));
							}
							if (data?.cliffPeriod && Number(data?.cliffPeriod) !== 0) {
								setIsTeamSet(true);
							}
							setToken(data);
							setLoading(false);
						} else {
							setLoading(false);
						}
					})
					.catch((error) => {
						console.log(error);
						if (controller && !controller.signal.aborted) {
							setLoading(false);
						}
					});
			}
		},
		[API_ENDPOINT, params?.slug]
	);

	useEffect(() => {
		if (token?.owner && address) {
			if (address) checkIfOwner(token?.owner, address);
		}
		if (token?.teamMembers && token?.teamMembers.length > 0 && address) {
			checkIfTeam(token?.teamMembers, address);
		}
	}, [address, checkIfOwner, checkIfTeam, token?.owner, token?.teamMembers]);

	useEffect(() => {
		const controller = new AbortController();
		setLoading(true);
		if (!isAddress(params?.slug)) {
			router.push("/", { scroll: true });
		}
		if (chainId) {
			fetchTheToken(controller);
		}
		scrollTo("#body");
		setIsClient(true);
		return () => {
			controller.abort();
		};
	}, [router, params?.slug, fetchTheToken, chainId]);

	return (
		<>
			{isClient && (
				<>
					{loading && <Loading msg="Loading your token.." />}
					{token ? (
						<>
							{success && <Modal msg={success} callback={clear} />}
							<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-12 w-full">
								<div className="lg:col-span-8">
									<Intro
										address={params?.slug}
										token={token}
										isOwner={isOwner}
										isPresale={presale === 1}
										isTrading={isTrading}
										chain={chainId}
									/>
									{isTeam && address && isTrading && (
										<Claim contractAddress={params?.slug} address={address} token={token} />
									)}
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
													totalSupply={token?.totalSupply}
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
												<StartTrading contractAddress={params?.slug} callback={setIsTrading} setSuccess={setSuccess} />
											)}
											{!isStaking && (
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
											{isLimited && (
												<Limits
													contractAddress={params?.slug}
													setSuccess={setSuccess}
													txLimit={token?.txLimit}
													walletLimit={token?.walletLimit}
												/>
											)}
										</>
									)}
									{address && (
										<>
											{presale > 0 && token?.presale && (
												<PresaleUser
													callback={clear}
													setSuccess={setSuccess}
													presaleAddress={getAddress(token?.presale)}
													isTrading={isTrading}
													isOwner={isOwner}
													address={address}
												/>
											)}
											{CONTRACT_ADDRESS && launcher && (
												<Promote
													contractAddress={params?.slug}
													safuAddress={CONTRACT_ADDRESS}
													address={address}
													launcher={launcher}
												/>
											)}
										</>
									)}
								</div>
								<div className="lg:col-span-4">
									<Swap
										contractAddress={params?.slug}
										routerAddress={lp?.router && lp?.router !== address_0 ? getAddress(lp?.router) : address_0}
										pairAddress={lp?.pair && lp?.pair !== address_0 ? getAddress(lp?.pair) : address_0}
										symbol={token?.symbol ? token?.symbol : ""}
										tradingEnabled={lp?.pair && lp?.pair !== address_0 ? true : false}
										setSuccess={setSuccess}
										address={address ? address : address_0}
									/>
									{presale === 1 && token?.presale && (
										<Presale
											presaleAddress={getAddress(token?.presale)}
											address={address}
											symbol={token?.symbol ? token?.symbol : ""}
										/>
									)}
									{isStaking && lp?.stakingContract && lp.stakingContract !== address_0 && address && (
										<Staking
											contractAddress={params?.slug}
											stakingAddress={getAddress(lp?.stakingContract)}
											address={address}
											symbol={token?.symbol ? token?.symbol : ""}
											setSuccess={setSuccess}
										/>
									)}
									{isOwner && walletClient && launcher && (
										<SetSocials
											contractAddress={params?.slug}
											telegram={token?.telegram ? token?.telegram : ""}
											twitter={token?.twitter ? token?.twitter : ""}
											website={token?.website ? token?.website : ""}
											setSuccess={setSuccess}
											promoCost={Number(formatEther(launcher?.promoCostEth))}
											isFree={token?.isFree}
										/>
									)}
								</div>
							</div>
						</>
					) : (
						!loading && (
							<div className="min-h-[90vh] flex flex-col justify-center text-center">
								<h2 className="max-md:text-sm text-2xl text-red-500">
									{params.slug.toString() === "0xdca7905c38f15d5e653f76e956109bf5a4f43fbb"
										? "$SAFU is only available on Ethereum mainnet!"
										: "Sorry, there was no data on this address!"}
								</h2>
								<p className="max-md:text-xs text-xl text-gray-400">
									Check if you are on the right network and try refreshing the page.
								</p>
							</div>
						)
					)}
				</>
			)}
		</>
	);
}
export default TokenView;
