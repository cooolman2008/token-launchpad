import { useEffect, useState, memo } from "react";
import { fetchSafu } from "@/api/getSafu";
import { getAbr } from "@/utils/math";
import { getContractAddress, getGraphUrl } from "@/utils/utils";
import { useChainId } from "wagmi";

const Details = memo(() => {
	const chainId = useChainId();
	const API_ENDPOINT = getGraphUrl(chainId);
	const CONTRACT_ADDRESS = getContractAddress(chainId);

	const [safuTVL, setSafuTVL] = useState(0);
	const [safuVolume, setSafuVolume] = useState(0);
	const [safuLaunches, setSafuLaunches] = useState(0);

	useEffect(() => {
		async function fetchSafuDetails() {
			if (CONTRACT_ADDRESS && API_ENDPOINT) {
				const safuDetails = await fetchSafu(CONTRACT_ADDRESS, API_ENDPOINT);
				setSafuTVL(safuDetails?.totalLiquidityUSD ? safuDetails?.totalLiquidityUSD : 0);
				setSafuVolume(safuDetails?.totalVolumeUSD ? safuDetails?.totalVolumeUSD : 0);
				setSafuLaunches(safuDetails?.launchCount ? safuDetails?.launchCount : 0);
			}
		}
		fetchSafuDetails();
	}, [CONTRACT_ADDRESS, API_ENDPOINT]);
	return (
		<>
			<div className="flex flex-col max-md:px-4 max-md:mx-auto max-md:text-center">
				<span className="text-base xl:text-lg mb-2 text-gray-400">SAFU TVL</span>
				<h2 className="text-2xl xl:text-4xl md:text-pink-500">${getAbr(Number(safuTVL))}</h2>
			</div>
			<div className="flex flex-col max-md:px-4 max-md:mx-auto text-center">
				<span className="text-base xl:text-lg mb-2 text-gray-400">SAFU Launches</span>
				<h2 className="text-2xl xl:text-4xl">{safuLaunches}</h2>
			</div>
			<div className="flex flex-col max-md:px-4 max-md:mx-auto max-md:mt-4 max-md:text-center md:text-right">
				<span className="text-base xl:text-lg mb-2 text-gray-400">SAFU Volume</span>
				<h2 className="text-2xl xl:text-4xl md:text-blue-600">${getAbr(Number(safuVolume))}</h2>
			</div>
		</>
	);
});
Details.displayName = "Launches details";

export default Details;
