import { useReadContract, useWalletClient } from "wagmi";

import { tokenAbi } from "@/abi/tokenAbi";

const Claim = ({ contractAddress }: { contractAddress: `0x${string}` }) => {
	return (
		<div className="w-full py-8 border-b border-gray-700">
			<h2 className="text-2xl mb-1">Claim what&#39;s yours</h2>
			<p className="text-sm text-gray-500 mb-4">
				You can hit the claim button & get the vested tokens displayed in the button.
			</p>

			<div className="flex">
				<div className="flex flex-col">
					<button className="safu-button-primary">Claim $62.02M</button>
				</div>
			</div>
		</div>
	);
};

export default Claim;
