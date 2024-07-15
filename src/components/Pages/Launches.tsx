"use client";

import { useWalletClient, useAccount, useChainId } from "wagmi";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import Details from "@/components/Modules/Launches/Details";
import Table from "@/components/elements/Table";

import { getBaseCoin, getContractAddress, getGraphUrl, getUSDC } from "@/utils/utils";
import { fetchTokens, fetchMyTokens, fetchStealthTokens, Tokens, fetchPresalesTokens } from "@/api/getTokens";

function Launches() {
	// const options: Highcharts.Options = {
	// 	chart: {
	// 		type: "area",
	// 		backgroundColor: "#000000",
	// 	},
	// 	colors: ["#51a0d3", "#51a0d3", "#ED561B", "#DDDF00", "#24CBE5", "#64E572", "#FF9655", "#FFF263", "#6AF9C4"],
	// 	accessibility: {
	// 		description: "None",
	// 	},
	// 	legend: {
	// 		itemStyle: {
	// 			font: "9pt Trebuchet MS, Verdana, sans-serif",
	// 			color: "gray",
	// 		},
	// 		itemHoverStyle: {
	// 			color: "#fff",
	// 		},
	// 	},
	// 	title: {
	// 		style: {
	// 			color: "#fff",
	// 			font: 'bold 16px "Trebuchet MS", Verdana, sans-serif',
	// 		},
	// 		text: "",
	// 	},
	// 	xAxis: {
	// 		allowDecimals: false,
	// 		accessibility: {
	// 			rangeDescription: "Range: 1940 to 2024.",
	// 		},
	// 		gridLineWidth: 0,
	// 	},
	// 	yAxis: {
	// 		title: {
	// 			text: "",
	// 		},
	// 		gridLineWidth: 0,
	// 		labels: {
	// 			style: {
	// 				color: "transparent",
	// 			},
	// 		},
	// 	},
	// 	tooltip: {
	// 		backgroundColor: "transparent",
	// 		borderWidth: 1,
	// 		borderColor: "#3d3d3d",
	// 		style: {
	// 			color: "#fff",
	// 			font: 'bold 16px "Trebuchet MS", Verdana, sans-serif',
	// 		},
	// 		pointFormat: "{series.name} {point.y}",
	// 	},
	// 	plotOptions: {
	// 		area: {
	// 			pointStart: 1940,
	// 			marker: {
	// 				enabled: false,
	// 				symbol: "circle",
	// 				radius: 2,
	// 				states: {
	// 					hover: {
	// 						enabled: true,
	// 					},
	// 				},
	// 			},
	// 		},
	// 	},
	// 	series: [
	// 		{
	// 			type: "area",
	// 			name: "SAFU",
	// 			data: [
	// 				2, 9, 13, 50, 170, 299, 438, 841, 1169, 1703, 2422, 3692, 5543, 7345, 12298, 18638, 22229, 25540, 28133,
	// 				29463, 31139, 31175, 31255, 29561, 27552, 26008, 25830, 26516, 27835, 28537, 27519, 25914, 25542, 24418,
	// 				24138, 24104, 23208, 22886, 23305, 23459, 23368, 23317, 23575, 23205, 22217, 21392, 19008, 13708, 11511,
	// 				10979, 10904, 11011, 10903, 10732, 10685, 10577, 10526, 10457, 10027, 8570, 8360, 7853, 5709, 5273, 5113,
	// 				5066, 4897, 4881, 4804, 4717, 4571, 4018, 3822, 3785, 3805, 3750, 3708, 3708, 3708, 3708,
	// 			],
	// 		},
	// 	],
	// };
	const address_0 = "0x0000000000000000000000000000000000000000";
	const { data: walletClient } = useWalletClient();
	const { address } = useAccount();
	const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

	const chainId = useChainId();
	const API_ENDPOINT = getGraphUrl(chainId);
	const CONTRACT_ADDRESS = getContractAddress(chainId);

	const [isClient, setIsClient] = useState(false);
	const [tab, setTab] = useState("Explore");
	const [tokens, setTokens] = useState<Tokens[]>([]);
	const [explore, setExplore] = useState<Tokens[]>([]);
	const [launches, setLaunches] = useState<Tokens[]>([]);
	const [stealth, setStealth] = useState<Tokens[]>([]);
	const [presales, setPresales] = useState<Tokens[]>([]);
	const [chain, setChain] = useState(0);

	let id = getBaseCoin(chainId);
	const BASE_ADDRESS = id ? id : address_0;
	id = getUSDC(chainId);
	const USDC_ADDRESS = id ? id : address_0;

	const heading_classes = "text-base xl:text-2xl max-lg:mx-auto lg:mr-8 cursor-pointer ";

	useEffect(() => {
		if (!address && tab === "Launches") {
			setTab("Explore");
		}
		if (chainId && API_ENDPOINT && CONTRACT_ADDRESS) {
			switch (tab) {
				case "Launches":
					if (launches.length > 0 && chain === Number(chainId)) {
						setTokens(launches);
					} else {
						if (address) {
							fetchMyTokens(address?.toString(), API_ENDPOINT).then((tokensFetched) => {
								setChain(Number(chainId));
								if (tokensFetched.length === 0) {
									setTokens([]);
								} else {
									setLaunches(tokensFetched);
								}
							});
						}
					}
					break;
				case "Stealth":
					if (stealth.length > 0 && chain === Number(chainId)) {
						setTokens(stealth);
					} else {
						fetchStealthTokens(API_ENDPOINT, USDC_ADDRESS?.toString(), BASE_ADDRESS?.toString()).then(
							(tokensFetched) => {
								setChain(Number(chainId));
								if (tokensFetched.length === 0) {
									setTokens([]);
								} else {
									setStealth(tokensFetched);
								}
							}
						);
					}
					break;
				case "Presales":
					if (presales.length > 0 && chain === Number(chainId)) {
						setTokens(presales);
					} else {
						fetchPresalesTokens(API_ENDPOINT).then((tokensFetched) => {
							setChain(Number(chainId));
							if (tokensFetched.length === 0) {
								setTokens([]);
							} else {
								setPresales(tokensFetched);
							}
						});
					}
					break;
				default:
					if (explore.length > 0 && chain === Number(chainId)) {
						setTokens(explore);
					} else {
						fetchTokens(CONTRACT_ADDRESS, API_ENDPOINT).then((tokensFetched) => {
							setChain(Number(chainId));
							if (tokensFetched.length === 0) {
								setTokens([]);
							} else {
								setExplore(tokensFetched);
							}
						});
					}
			}
		}
	}, [
		API_ENDPOINT,
		CONTRACT_ADDRESS,
		USDC_ADDRESS,
		BASE_ADDRESS,
		address,
		explore,
		launches,
		stealth,
		presales,
		tab,
		chainId,
		chain,
	]);

	useEffect(() => {
		setIsClient(true);
	}, [chainId]);

	return (
		<>
			{isClient && (
				<>
					<div className="w-full flex my-12 justify-between flex-wrap text-center">
						<Details />
					</div>
					{/* <HighchartsReact highcharts={Highcharts} options={options} ref={chartComponentRef} /> */}
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