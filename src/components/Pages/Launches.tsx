"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { useWalletClient, useAccount, useChainId } from "wagmi";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import Table from "@/components/elements/Table";
import Details from "@/components/Modules/Launches/Details";

import { getBaseCoin, getContractAddress, getGraphUrl, getUSDC } from "@/utils/utils";

import {
	fetchTokens,
	fetchMyTokens,
	fetchStealthTokens,
	Tokens,
	fetchPresalesTokens,
	fetchChartData,
	DayData,
} from "@/api/getTokens";

import { getOptions } from "@/config/ChartOptions";

function Launches() {
	const address_0 = "0x0000000000000000000000000000000000000000";
	const { address } = useAccount();
	const loggedOutChain = useChainId();
	const { data: walletClient } = useWalletClient();
	const { selectedNetworkId } = useWeb3ModalState();

	const [tab, setTab] = useState("Explore");
	const [loading, setLoading] = useState(true);
	const [isClient, setIsClient] = useState(false);
	const [tokens, setTokens] = useState<Tokens[]>([]);
	const [chartData, setChartData] = useState<DayData[]>([]);

	const heading_classes = "text-base xl:text-2xl max-lg:mx-auto lg:mr-8 cursor-pointer ";

	const handleTokens = (tokensFetched: Tokens[]) => {
		tokensFetched.length === 0 ? setTokens([]) : setTokens(tokensFetched);
		setLoading(false);
	};

	useEffect(() => {
		// clear the data before fetching
		setTokens([]);
		setChartData([]);

		const chainId = selectedNetworkId ? Number(selectedNetworkId) : loggedOutChain;
		const API_ENDPOINT = getGraphUrl(chainId);
		const CONTRACT_ADDRESS = getContractAddress(chainId);

		let id = getBaseCoin(chainId);
		const BASE_ADDRESS = id ? id : address_0;
		id = getUSDC(chainId);
		const USDC_ADDRESS = id ? id : address_0;

		const controller = new AbortController();
		// reset tab on logging out
		if (!address && tab === "Launches") {
			setTab("Explore");
		}
		if (API_ENDPOINT) {
			fetchChartData(API_ENDPOINT, controller.signal)
				.then((fetchedChartData) => {
					setChartData(fetchedChartData);
				})
				.catch((error) => {
					console.log(error);
				});
		}
		if (API_ENDPOINT && CONTRACT_ADDRESS) {
			setLoading(true);
			switch (tab) {
				case "Launches":
					if (address) {
						fetchMyTokens(address?.toString(), API_ENDPOINT, controller.signal)
							.then(handleTokens)
							.catch((error) => {
								console.log(error);
								if (controller && !controller.signal.aborted) {
									setLoading(false);
								}
							});
					}
					break;
				case "Stealth":
					fetchStealthTokens(API_ENDPOINT, USDC_ADDRESS?.toString(), BASE_ADDRESS?.toString(), controller.signal)
						.then(handleTokens)
						.catch((error) => {
							console.log(error);
							if (controller && !controller.signal.aborted) {
								setLoading(false);
							}
						});
					break;
				case "Presales":
					fetchPresalesTokens(API_ENDPOINT, controller.signal)
						.then(handleTokens)
						.catch((error) => {
							console.log(error);
							if (controller && !controller.signal.aborted) {
								setLoading(false);
							}
						});
					break;
				default:
					fetchTokens(CONTRACT_ADDRESS, API_ENDPOINT, controller.signal)
						.then(handleTokens)
						.catch((error) => {
							console.log(error);
							if (controller && !controller.signal.aborted) {
								setLoading(false);
							}
						});
			}
		} else {
			setLoading(false);
		}

		return () => {
			controller.abort();
		};
	}, [address, tab, selectedNetworkId, loggedOutChain]);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<>
			{isClient && (
				<>
					<div className="w-full flex mt-12 max-md:mb-12 justify-between flex-wrap">
						<Details />
					</div>
					{chartData.length > 0 && (
						<div className="w-full flex justify-between max-md:hidden">
							<HighchartsReact highcharts={Highcharts} options={getOptions("tvl", chartData)} />
							<HighchartsReact highcharts={Highcharts} options={getOptions("volume", chartData)} />
						</div>
					)}
					<div className="flex self-start my-4 min-w-full px-3 flex-wrap gap-1 items-end">
						<h2
							className={heading_classes + (tab === "Explore" ? "safu-grad-text-l text-xl" : "text-gray-400")}
							onClick={() => {
								setTab("Explore");
							}}
						>
							Explore
						</h2>
						{walletClient && (
							<h2
								className={heading_classes + (tab === "Launches" ? "safu-grad-text-l text-xl" : "text-gray-400")}
								onClick={() => {
									setTab("Launches");
								}}
							>
								My Launches
							</h2>
						)}
						<h2
							className={heading_classes + (tab === "Stealth" ? "safu-grad-text-l text-xl" : "text-gray-400")}
							onClick={() => {
								setTab("Stealth");
							}}
						>
							Stealth Launches
						</h2>
						<h2
							className={heading_classes + (tab === "Presales" ? "safu-grad-text-l text-xl" : "text-gray-400")}
							onClick={() => {
								setTab("Presales");
							}}
						>
							Presales
						</h2>
						<div className="max-xl:hidden w-32 self-end ml-auto pt-2 pb-2.5 pl-3.5 rounded-2xl flex border border-neutral-700">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
								<path
									d="M21.53 20.47L17.689 16.629C18.973 15.106 19.75 13.143 19.75 11C19.75 6.175 15.825 2.25 11 2.25C6.175 2.25 2.25 6.175 2.25 11C2.25 15.825 6.175 19.75 11 19.75C13.143 19.75 15.106 18.973 16.629 17.689L20.47 21.53C20.616 21.676 20.808 21.75 21 21.75C21.192 21.75 21.384 21.677 21.53 21.53C21.823 21.238 21.823 20.763 21.53 20.47ZM3.75 11C3.75 7.002 7.002 3.75 11 3.75C14.998 3.75 18.25 7.002 18.25 11C18.25 14.998 14.998 18.25 11 18.25C7.002 18.25 3.75 14.998 3.75 11Z"
									fill="#9B9B9B"
								/>
							</svg>
						</div>
					</div>
					<div className="w-full mb-8 overflow-hidden rounded-2xl shadow-lg border border-neutral-800">
						<div className="w-full overflow-x-auto">
							<Table tokens={tokens} type={tab} loading={loading} />
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
