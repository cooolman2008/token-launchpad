import Table from "../../elements/Table";
import { memo, useEffect, useState } from "react";
import { fetchStealthTokens, Tokens } from "@/api/getStealth";

const Stealth = memo(() => {
  const [tokens, setTokens] = useState<Tokens[]>([]);
  useEffect(() => {
    async function fetchStealth() {
      const tokensFetched = await fetchStealthTokens();
      setTokens(tokensFetched);
    }
    fetchStealth();
  }, []);
  return <Table tokens={tokens} />;
});

export default Stealth;
