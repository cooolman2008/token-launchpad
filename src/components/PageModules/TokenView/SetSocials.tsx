import { useContractWrite, useWalletClient } from "wagmi";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState, SetStateAction, Dispatch, memo } from "react";

import InformationTip from "@/components/elements/InformationTip";
import Loading from "@/components/elements/Loading";
import Modal from "@/components/elements/Modal";

import Ownerabi from "../../../../ownerabi.json";

interface SocialsForm {
	telegram: string;
	website: string;
	twitter: string;
}

const SetSocials = memo(
	({
		contractAddress,
		telegram,
		website,
		twitter,
		setSuccess,
	}: {
		contractAddress: `0x${string}`;
		telegram: string;
		website: string;
		twitter: string;
		setSuccess: Dispatch<SetStateAction<string>>;
	}) => {
		const { data: walletClient } = useWalletClient();
		const [error, setError] = useState("");

		const clear = () => {
			setError("");
		};

		// contract call to start trading of the launched token.
		const {
			data,
			isSuccess,
			isLoading: setting,
			write: set,
		} = useContractWrite({
			address: contractAddress,
			abi: Ownerabi.abi,
			functionName: "setSocials",
			account: walletClient?.account,
			onSuccess(res) {
				setSuccess("Socials are set successfully!");
				console.log(res);
			},
			onError(error) {
				console.log(error);
			},
		});

		// handle form & fire launch token with the form details
		const {
			register,
			handleSubmit,
			formState: { errors },
		} = useForm<SocialsForm>();
		const onSubmit: SubmitHandler<SocialsForm> = (formData) => {
			set({
				args: [formData.telegram, formData.twitter, formData.website],
			});
		};
		return (
			<>
				{setting && <Loading msg="Setting your socials..." />}
				{error && (
					<Modal
						msg={error}
						des="This might be a temporary issue, try again in sometime"
						error={true}
						callback={clear}
					/>
				)}
				<div className="socials-container mt-12">
					<div className="flex mb-2">
						<h2 className="text-2xl">The socials</h2>
						<InformationTip msg="Set your socials & get a boost to your token" />
					</div>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900 mb-2">
							<div className="w-full flex">
								<input
									type="text"
									id="twitter"
									placeholder="x.com/SAFUlauncher"
									{...register("twitter", {
										required: true,
									})}
									defaultValue={twitter}
									className="block w-full rounded-xl pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-xl"
								/>
								<span className="block sm:text-4xl leading-6 text-gray-400 pt-1.5">
									<svg
										width="40px"
										height="40px"
										viewBox="0 0 18 18"
										xmlns="http://www.w3.org/2000/svg"
										stroke="transparent"
										className="fill-gray-400"
									>
										<path d="M12.8761 3H14.9451L10.4251 8.16609L15.7425 15.196H11.579L8.31797 10.9324L4.58662 15.196H2.51644L7.35104 9.67026L2.25 3H6.51922L9.46689 6.89708L12.8761 3ZM12.15 13.9576H13.2964L5.89628 4.17332H4.66605L12.15 13.9576Z"></path>
									</svg>
								</span>
							</div>
						</div>
						<div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900 mb-2">
							<div className="w-full flex">
								<input
									type="text"
									id="site"
									{...register("website", {
										required: true,
									})}
									defaultValue={website}
									placeholder="safulauncher.com"
									className="block w-full rounded-xl pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-xl"
								/>
								<span className="block sm:text-4xl leading-6 text-gray-400 pt-1.5">
									<svg
										width="40px"
										height="40px"
										viewBox="0 0 18 18"
										xmlns="http://www.w3.org/2000/svg"
										stroke="transparent"
										className="fill-gray-400"
									>
										<path d="M5.12245 9.5625C5.23495 11.8725 6.01495 14.2275 7.37245 16.32C4.19245 15.615 1.76996 12.8925 1.52246 9.5625H5.12245ZM7.37245 1.67999C4.19245 2.38499 1.76996 5.1075 1.52246 8.4375H5.12245C5.23495 6.1275 6.01495 3.77249 7.37245 1.67999ZM9.14997 1.5H8.84995L8.62496 1.82249C7.19996 3.84749 6.36745 6.1725 6.24745 8.4375H11.7525C11.6325 6.1725 10.8 3.84749 9.37496 1.82249L9.14997 1.5ZM6.24745 9.5625C6.36745 11.8275 7.19996 14.1525 8.62496 16.1775L8.84995 16.5H9.14997L9.37496 16.1775C10.8 14.1525 11.6325 11.8275 11.7525 9.5625H6.24745ZM12.8775 9.5625C12.765 11.8725 11.985 14.2275 10.6275 16.32C13.8075 15.615 16.23 12.8925 16.4775 9.5625H12.8775ZM16.4775 8.4375C16.23 5.1075 13.8075 2.38499 10.6275 1.67999C11.985 3.77249 12.765 6.1275 12.8775 8.4375H16.4775Z"></path>
									</svg>
								</span>
							</div>
						</div>
						<div className="w-full p-4 rounded-xl border-2 border-transparent hover:border-neutral-800 bg-neutral-900 mb-2">
							<div className="w-full flex">
								<input
									type="text"
									id="telegram"
									placeholder="t.me/SAFULauncherPortal"
									{...register("telegram", {
										required: true,
									})}
									defaultValue={telegram}
									className="block w-full rounded-xl pe-3 py-1.5 text-white shadow-sm placeholder:text-gray-400 sm:leading-6 bg-neutral-900 outline-0 sm:text-xl"
								/>
								<span className="block sm:text-4xl leading-6 text-gray-400 pt-1.5">
									<svg
										width="40px"
										height="40px"
										viewBox="0 0 24 24"
										role="img"
										xmlns="http://www.w3.org/2000/svg"
										className="fill-gray-400"
									>
										<path d="M23.91 3.79L20.3 20.84c-.25 1.21-.98 1.5-2 .94l-5.5-4.07-2.66 2.57c-.3.3-.55.56-1.1.56-.72 0-.6-.27-.84-.95L6.3 13.7l-5.45-1.7c-1.18-.35-1.19-1.16.26-1.75l21.26-8.2c.97-.43 1.9.24 1.53 1.73z" />
									</svg>
								</span>
							</div>
						</div>
						<div className="flex flex-col justify-center w-full mb-4">
							<input type="submit" value="Set" className="safu-button-primary cursor-pointer" />
						</div>
					</form>
				</div>
			</>
		);
	}
);
SetSocials.displayName = "setSocials";

export default SetSocials;
