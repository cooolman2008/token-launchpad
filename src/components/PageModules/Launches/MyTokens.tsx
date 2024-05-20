import Table from "../../elements/Table";
import { useEffect, useState, memo } from "react";
import { useAccount } from "wagmi";
import { fetchMyTokens, Tokens } from "@/api/getMyTokens";

const MyTokens = memo(() => {
	const [tokens, setTokens] = useState<Tokens[]>([]);
	const { address } = useAccount();
	useEffect(() => {
		async function fetchOwnedTokens() {
			if (address) {
				const tokensFetched = await fetchMyTokens(address?.toString());
				setTokens(tokensFetched);
			}
		}
		fetchOwnedTokens();
	}, [address]);
	return <Table tokens={tokens} />;
});
MyTokens.displayName = "Launches myTokens";

export default MyTokens;
