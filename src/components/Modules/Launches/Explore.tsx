import Table from "../../elements/Table";
import { useEffect, useState } from "react";
import { fetchTokens, Tokens } from "@/api/getTokens";

const Explore = () => {
  const [tokens, setTokens] = useState<Tokens[]>([]);
  useEffect(() => {
    async function fetchOwnedTokens() {
      const tokensFetched = await fetchTokens();
      setTokens(tokensFetched);
    }
    fetchOwnedTokens();
  }, []);
  return <Table tokens={tokens} />;
};

export default Explore;
