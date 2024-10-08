"use client";

import { useWeb3ModalState } from "@web3modal/wagmi/react";
import { useChainId } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { searchTokens } from "@/api/searchToken";
import { getGraphUrl } from "@/utils/utils";

interface SearchForm {
	param: string;
}

function Search() {
	const loggedOutChain = useChainId();
	const { selectedNetworkId } = useWeb3ModalState();

	const search = (param: string) => {
		const chainId = selectedNetworkId ? Number(selectedNetworkId) : loggedOutChain;
		const API_ENDPOINT = getGraphUrl(chainId);
		if (API_ENDPOINT) searchTokens(param, API_ENDPOINT);
	};

	// handle form & fire launch token with the form details
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SearchForm>();
	const onSubmit: SubmitHandler<SearchForm> = (formData) => {
		search(formData.param);
	};

	return (
		<div className="w-full lg:w-1/4 flex mx-auto mb-8 lg:mb-0 rounded-3xl border border-neutral-700 hover:border-neutral-600">
			<div className="inset-y-0 right-0 flex items-center pl-3">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20px"
					height="20px"
					viewBox="0 0 24 24"
					className="fill-gray-400"
				>
					<path d="M21.53 20.47L17.689 16.629C18.973 15.106 19.75 13.143 19.75 11C19.75 6.175 15.825 2.25 11 2.25C6.175 2.25 2.25 6.175 2.25 11C2.25 15.825 6.175 19.75 11 19.75C13.143 19.75 15.106 18.973 16.629 17.689L20.47 21.53C20.616 21.676 20.808 21.75 21 21.75C21.192 21.75 21.384 21.677 21.53 21.53C21.823 21.238 21.823 20.763 21.53 20.47ZM3.75 11C3.75 7.002 7.002 3.75 11 3.75C14.998 3.75 18.25 7.002 18.25 11C18.25 14.998 14.998 18.25 11 18.25C7.002 18.25 3.75 14.998 3.75 11Z"></path>
				</svg>
			</div>
			<input
				id="search"
				type="text"
				placeholder="Search Tokens"
				{...register("param", {
					required: { value: true, message: "Share can't be empty" },
				})}
				className="block w-full rounded-xl ps-3 pe-3 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-transparent outline-0 sm:text-md pb-0.5"
			/>
		</div>
	);
}
export default Search;
