import Link from "next/link";
import { Tokens } from "@/api/getTokens";
import { getAbr } from "@/utils/math";

const Table = ({ tokens, type }: { tokens: Tokens[]; type: string }) => {
	return (
		<table className="w-full">
			{tokens.length > 0 && (
				<thead>
					<tr className="text-md tracking-wide text-left bg-neutral-950 text-gray-400 border-b border-neutral-800 text-base font-light">
						<th className="px-4 py-3 font-light">Token name</th>
						{(type === "Explore" || type === "Launches") && (
							<>
								<th className="px-4 py-3 font-light">Price</th>
								<th className="px-4 py-3 font-light">1 day</th>
								<th className="px-4 py-3 font-light">1 hour</th>
								<th className="px-4 py-3 font-light">FDV</th>
								<th className="px-4 py-3 font-light">Volume</th>
							</>
						)}
						{(type === "Stealth" || type === "Presales") && (
							<>
								<th className="px-4 py-3 font-light">Contract Address</th>
								<th className="px-4 py-3 font-light">Supply</th>
							</>
						)}
					</tr>
				</thead>
			)}
			<tbody className="bg-black">
				{tokens.length > 0 ? (
					Object.values(tokens).map((token) => (
						<tr key={token.id} className="text-base">
							<td className="px-4 py-3">
								<Link href={"/" + token.id} scroll={true}>
									<div>
										<p className="">{token.name}</p>
										<p className="text-gray-400">{token.symbol}</p>
									</div>
								</Link>
							</td>
							{(type === "Explore" || type === "Launches") && (
								<>
									<td className="px-4 py-3">$ {getAbr(token?.price ? Number(Number(token?.price).toFixed(10)) : 0)}</td>
									<td className="px-4 py-3 text-green-500 font-medium">
										<div className="flex items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="10px"
												height="10px"
												viewBox="0 0 24 24"
												className="fill-green-500 mr-1"
											>
												<path d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z" />
											</svg>
											1.2%
										</div>
									</td>
									<td className="px-4 py-3 text-red-500 font-medium">
										<div className="flex items-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="10px"
												height="10px"
												viewBox="0 0 24 24"
												className="fill-red-500 mr-1"
											>
												<path d="M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z" />
											</svg>
											0.3%
										</div>
									</td>
									<td className="px-4 py-3">
										<span className="px-2 py-1 leading-tight bg-neutral-800 font-medium border border-neutral-700 rounded-2xl">
											${getAbr(token?.FDV ? Number(token?.FDV) : 0)}
										</span>
									</td>
									<td className="px-4 py-3">${getAbr(token?.tradeVolumeUSD ? Number(token?.tradeVolumeUSD) : 0)}</td>
								</>
							)}
							{(type === "Stealth" || type === "Presales") && (
								<>
									<td className="px-4 py-3 text-sm text-gray-500">{token.id}</td>
									<td className="px-4 py-3">${getAbr(token?.totalSupply ? Number(token?.totalSupply) : 0)}</td>
								</>
							)}
						</tr>
					))
				) : (
					<tr className="table-row">
						<td className="p-12 text-lg text-gray-400">There are no tokens here yet!</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};

export default Table;
