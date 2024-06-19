"use client";

import { useWalletClient, useAccount } from "wagmi";
import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { useEffect, useState } from "react";
import Link from "next/link";

import Details from "@/components/PageModules/Launches/Details";
import Table from "@/components/elements/Table";

import { getContractAddress, getGraphUrl } from "@/utils/utils";
import { fetchTokens, fetchMyTokens, fetchStealthTokens, Tokens, fetchPresalesTokens } from "@/api/getTokens";

function Launches() {
	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();

	const { selectedNetworkId: chainId } = useWeb3ModalState();
	const API_ENDPOINT = getGraphUrl(Number(chainId));
	const CONTRACT_ADDRESS = getContractAddress(Number(chainId));

	const [isClient, setIsClient] = useState(false);
	const [tab, setTab] = useState("Explore");
	const [tokens, setTokens] = useState<Tokens[]>([]);
	const [explore, setExplore] = useState<Tokens[]>([]);
	const [launches, setLaunches] = useState<Tokens[]>([]);
	const [stealth, setStealth] = useState<Tokens[]>([]);
	const [presales, setPresales] = useState<Tokens[]>([]);

	useEffect(() => {
		switch (tab) {
			case "Launches":
				if (launches.length > 0) {
					setTokens(launches);
				} else {
					if (address) {
						fetchMyTokens(address?.toString(), API_ENDPOINT).then((tokensFetched) => {
							if (tokensFetched.length === 0) setTokens([]);
							setLaunches(tokensFetched);
						});
					}
				}
				break;
			case "Stealth":
				if (stealth.length > 0) {
					setTokens(stealth);
				} else {
					fetchStealthTokens(API_ENDPOINT).then((tokensFetched) => {
						if (tokensFetched.length === 0) setTokens([]);
						setStealth(tokensFetched);
					});
				}
				break;
			case "Presales":
				if (presales.length > 0) {
					setTokens(presales);
				} else {
					fetchPresalesTokens(API_ENDPOINT).then((tokensFetched) => {
						if (tokensFetched.length === 0) setTokens([]);
						setPresales(tokensFetched);
					});
				}
				break;
			default:
				if (explore.length > 0) {
					setTokens(explore);
				} else {
					fetchTokens(CONTRACT_ADDRESS, API_ENDPOINT).then((tokensFetched) => {
						if (tokensFetched.length === 0) setTokens([]);
						setExplore(tokensFetched);
					});
				}
		}
	}, [API_ENDPOINT, address, explore, launches, stealth, presales, tab, CONTRACT_ADDRESS]);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<>
			{isClient && (
				<>
					<div className="w-full flex my-12 justify-between">
						<Details />
					</div>
					<div className="flex self-start my-4 min-w-full px-3">
						<h2
							className={"text-2xl pr-8 cursor-pointer " + (tab === "Explore" ? "safu-grad-text-l" : "text-gray-400")}
							onClick={() => {
								setTab("Explore");
							}}
						>
							Explore
						</h2>
						{walletClient && (
							<h2
								className={
									"text-2xl px-8 cursor-pointer " + (tab === "Launches" ? "safu-grad-text-l" : "text-gray-400")
								}
								onClick={() => {
									setTab("Launches");
								}}
							>
								My Launches
							</h2>
						)}
						<h2
							className={"text-2xl px-8 cursor-pointer " + (tab === "Stealth" ? "safu-grad-text-l" : "text-gray-400")}
							onClick={() => {
								setTab("Stealth");
							}}
						>
							Stealth Launches
						</h2>
						<h2
							className={"text-2xl px-8 cursor-pointer " + (tab === "Presales" ? "safu-grad-text-l" : "text-gray-400")}
							onClick={() => {
								setTab("Presales");
							}}
						>
							Presales
						</h2>
						<h2 className="w-32 self-end ml-auto pt-2 pb-2.5 pl-3.5 rounded-2xl flex border border-neutral-700">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
								<path
									d="M21.53 20.47L17.689 16.629C18.973 15.106 19.75 13.143 19.75 11C19.75 6.175 15.825 2.25 11 2.25C6.175 2.25 2.25 6.175 2.25 11C2.25 15.825 6.175 19.75 11 19.75C13.143 19.75 15.106 18.973 16.629 17.689L20.47 21.53C20.616 21.676 20.808 21.75 21 21.75C21.192 21.75 21.384 21.677 21.53 21.53C21.823 21.238 21.823 20.763 21.53 20.47ZM3.75 11C3.75 7.002 7.002 3.75 11 3.75C14.998 3.75 18.25 7.002 18.25 11C18.25 14.998 14.998 18.25 11 18.25C7.002 18.25 3.75 14.998 3.75 11Z"
									fill="#9B9B9B"
								/>
							</svg>
						</h2>
					</div>
					<div className="w-full mb-8 overflow-hidden rounded-2xl shadow-lg border border-neutral-800">
						<div className="w-full overflow-x-auto">
							<Table tokens={tokens} type={tab} />
						</div>
					</div>
					<Link href="/launch" className="safu-button-secondary" scroll={true}>
						Launch a token
					</Link>
				</>
			)}
		</>
	);
}
export default Launches;
