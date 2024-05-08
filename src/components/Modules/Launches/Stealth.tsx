import Table from "../../elements/Table";
import { useEffect, useState } from "react";
import { fetchStealthTokens, Tokens } from "@/api/getStealth";

const Stealth = () => {
  const [tokens, setTokens] = useState<Tokens[]>([]);
  useEffect(() => {
    async function fetchStealth() {
      const tokensFetched = await fetchStealthTokens();
      setTokens(tokensFetched);
    }
    fetchStealth();
  }, []);
  return <Table tokens={tokens} />;
};

export default Stealth;
