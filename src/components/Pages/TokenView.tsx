"use client";

import { useWalletClient, useAccount, useReadContract, useChainId } from "wagmi";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAddress, getAddress } from "viem";

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

import { getGraphUrl } from "@/utils/utils";
import LaunchPresale from "@/components/Modules/TokenView/LaunchPresale";
import Presale from "@/components/Modules/TokenView/Presale";
import PresaleDashboard from "@/components/Modules/TokenView/PresaleDashboard";
import PresaleUser from "@/components/Modules/TokenView/PresaleUser";
import Loading from "@/components/elements/Loading";

import { ownerAbi } from "@/abi/ownerAbi";

function TokenView({ params }: { params: { slug: `0x${string}` } }) {
	const address_0 = "0x0000000000000000000000000000000000000000";

	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();
	const router = useRouter();

	const chainId = useChainId();
	const API_ENDPOINT = getGraphUrl(chainId);

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

	const clear = () => {
		setSuccess("");
		fetchTheToken();
		refetch();
	};

	// function you can use:
	function getSecondPart(str: string) {
		return str.split("-")[1];
	}

	// get LP details.
	const {
		data: LPData,
		refetch,
		isSuccess,
	} = useReadContract({
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
		if (API_ENDPOINT) {
			const data = await fetchToken(params?.slug?.toString(), API_ENDPOINT);
			if (data) {
				if (data?.presaleStatus) {
					setPresale(Number(data?.presaleStatus));
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
			}
		}
		setLoading(false);
	}, [API_ENDPOINT, address, checkIfTeam, params?.slug]);

	useEffect(() => {
		setLoading(true);
		if (!isAddress(params?.slug)) {
			router.push("/", { scroll: true });
		}
		console.log(chainId);
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
					{token ? (
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
										tradingEnabled={lp?.pair ? true : false}
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
									{isStaking && lp?.stakingContract && lp.stakingContract !== address_0 && walletClient && (
										<Staking
											contractAddress={params?.slug}
											stakingAddress={getAddress(lp?.stakingContract)}
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
					) : (
						!loading && (
							<div className="min-h-[90vh] flex flex-col justify-center text-center">
								<h2 className="max-md:text-sm text-2xl text-red-500">Sorry, there was no data on this address!</h2>
								<p className="max-md:text-xs text-xl text-gray-400">
									Try refreshing the page or searching the address of the contract in the above search bar
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
