import Link from "next/link";
import { Tokens } from "@/api/getTokens";
import { getAbr } from "@/utils/math";

const Table = ({ tokens }: { tokens: Tokens[] }) => {
	return (
		<table className="w-full">
			<thead>
				<tr className="text-md tracking-wide text-left bg-neutral-950 text-gray-100 border-b border-neutral-800 text-base">
					<th className="px-4 py-3 font-light text-gray-400">Token name</th>
					<th className="px-4 py-3 font-light text-gray-400">Price</th>
					<th className="px-4 py-3 font-light text-gray-400">1 day</th>
					<th className="px-4 py-3 font-light text-gray-400">1 hour</th>
					<th className="px-4 py-3 font-light text-gray-400">FDV</th>
					<th className="px-4 py-3 font-light">Volume</th>
				</tr>
			</thead>
			<tbody className="bg-black">
				{Object.values(tokens).map((token) => (
					<tr key={token.id} className="text-white text-base">
						<td className="px-4 py-3">
							<Link href={"/" + token.id}>
								<div>
									<p className="">{token.name}</p>
									<p className="text-gray-400">{token.symbol}</p>
								</div>
							</Link>
						</td>
						<td className="px-4 py-3">$ {token.totalSupply}</td>
						<td className="px-4 py-3 text-green-400 font-bold">+1.2</td>
						<td className="px-4 py-3 text-rose-800 font-bold">-0.3</td>
						<td className="px-4 py-3">
							<span className="px-2 py-1 leading-tight bg-neutral-800 font-medium border border-neutral-700 rounded-2xl">
								${getAbr(token?.tradeVolume ? Number(token?.tradeVolume) : 0)}
							</span>
						</td>
						<td className="px-4 py-3">${getAbr(token?.tradeVolume ? Number(token?.tradeVolume) : 0)}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default Table;
