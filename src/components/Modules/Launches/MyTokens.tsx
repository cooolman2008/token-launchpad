import Table from "../../elements/Table";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { fetchMyTokens, Tokens } from "@/api/getMyTokens";

const MyTokens = () => {
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
  }, []);
  return <Table tokens={tokens} />;
};

export default MyTokens;
