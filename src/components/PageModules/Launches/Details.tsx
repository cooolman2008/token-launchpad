import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { useEffect, useState, memo } from "react";
import { fetchSafu } from "@/api/getSafu";
import { getAbr } from "@/utils/math";
import { getContractAddress } from "@/utils/utils";

const Details = memo(() => {
	const { selectedNetworkId: chainId } = useWeb3ModalState();
	const CONTRACT_ADDRESS = getContractAddress(Number(chainId));

	const [safuTVL, setSafuTVL] = useState(0);
	const [safuVolume, setSafuVolume] = useState(0);
	const [safuLaunches, setSafuLaunches] = useState(0);

	useEffect(() => {
		async function fetchSafuDetails() {
			const safuDetails = await fetchSafu(CONTRACT_ADDRESS);
			setSafuTVL(safuDetails?.totalLiquidityUSD ? safuDetails?.totalLiquidityUSD : 0);
			setSafuVolume(safuDetails?.totalVolumeUSD ? safuDetails?.totalVolumeUSD : 0);
			setSafuLaunches(safuDetails?.launchCount ? safuDetails?.launchCount : 0);
		}
		fetchSafuDetails();
	}, [CONTRACT_ADDRESS]);
	return (
		<>
			<div className="flex flex-col px-12">
				<span className="text-lg mb-2 text-gray-400">SAFU TVL</span>
				<h2 className="text-4xl">${getAbr(Number(safuTVL))}</h2>
			</div>
			<div className="flex flex-col px-12">
				<span className="text-lg mb-2 text-gray-400">SAFU Volume</span>
				<h2 className="text-4xl">${getAbr(Number(safuVolume))}</h2>
			</div>
			<div className="flex flex-col px-12">
				<span className="text-lg mb-2 text-gray-400">SAFU Launches</span>
				<h2 className="text-4xl">{safuLaunches}</h2>
			</div>
		</>
	);
});
Details.displayName = "Launches details";

export default Details;
