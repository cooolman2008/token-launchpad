"use client";

import { LPDetails, Token } from "@/api/getToken";
import { createContext, useContext } from "react";
import { Account } from "viem";

interface TokenContextInterface {
	token: Token;
	account: Account;
	lpDetails: LPDetails;
}

const TokenContext = createContext<TokenContextInterface | undefined>(undefined);

export const useTokenContext = () => {
	const context = useContext(TokenContext);
	if (context === undefined) {
		throw new Error("useTokenContext must be used within a TokenProvider");
	}
	return context;
};

export default TokenContext;
