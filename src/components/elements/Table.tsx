import Link from "next/link";
import { Tokens } from "@/api/getMyTokens";

const Table = ({ tokens }: { tokens: Tokens[] }) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="text-md tracking-wide text-left bg-gray-900 text-gray-100">
          <th className="px-4 py-3 font-light text-gray-400">Token Name</th>
          <th className="px-4 py-3 font-light text-gray-400">Price</th>
          <th className="px-4 py-3 font-light text-gray-400">1 Day</th>
          <th className="px-4 py-3 font-light text-gray-400">1 Hour</th>
          <th className="px-4 py-3 font-light text-gray-400">FDV</th>
          <th className="px-4 py-3 font-light">Volume</th>
        </tr>
      </thead>
      <tbody className="bg-black">
        {Object.values(tokens).map((token) => (
          <tr key={token.id} className="text-white">
            <td className="px-4 py-3">
              <Link href={"/" + token.id} className="text-lg">
                <div>
                  <p className="">{token.name}</p>
                  <p className="text-xs text-gray-400">{token.symbol}</p>
                </div>
              </Link>
            </td>
            <td className="px-4 py-3 text-ms">$ {token.totalSupply}</td>
            <td className="px-4 py-3 text-ms text-green-400">+1.2</td>
            <td className="px-4 py-3 text-ms text-pink-600">-0.3</td>
            <td className="px-4 py-3 text-xs">
              <span className="px-2 py-1 leading-tight bg-pink-600 text-sm">
                $ {token.tradeVolume}.0
              </span>
            </td>
            <td className="px-4 py-3 text-sm">${token.tradeVolume}.0M</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
