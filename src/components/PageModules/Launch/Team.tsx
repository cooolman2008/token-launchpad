import { UseFormRegister, FieldErrors } from "react-hook-form";
import { animate, spring } from "motion";
import { useEffect } from "react";

import TextField from "@/components/elements/TextField/TextField";
import { LaunchForm } from "@/context/Launch";

const Team = ({ register, errors }: { register: UseFormRegister<LaunchForm>; errors: FieldErrors<LaunchForm> }) => {
	useEffect(() => {
		animate(
			"#team",
			{ maxHeight: "308px" },
			{ easing: spring({ stiffness: 300, damping: 16, mass: 0.4 }), delay: 0.1 }
		);
	}, []);
	return (
		<>
			<div id="team" className="flex flex-wrap max-h-0 overflow-hidden">
				<TextField
					label="Cliff period"
					id="cliffPeriod"
					placeholder="30"
					{...register("cliffPeriod", {
						min: 30,
					})}
					isError={errors.cliffPeriod ? true : false}
					error="Minimum of 30 days Cliff period is needed."
					width="w-24"
					labelWidth="grow"
				/>
				<TextField
					label="Vesting period"
					id="vestingPeriod"
					placeholder="30"
					{...register("vestingPeriod", {
						min: 30,
					})}
					isError={errors.vestingPeriod ? true : false}
					error="Minimum of 30 days Vesting period is needed."
					width="w-24"
					labelWidth="grow"
				/>
				<div className="w-full flex flex-wrap">
					<TextField
						label="Wallet 1"
						id="team1"
						defaultValue=""
						placeholder="0xXXXXXXXXXXXXXXXXXXXXXXXXX"
						{...register("team1", {
							minLength: 42,
							pattern: /^[A-Za-z0-9]+$/i,
						})}
						isError={errors.team1 ? true : false}
						error="Please provide a valid wallet address."
						width="w-64"
						labelWidth="grow"
					/>
					<TextField
						label="Wallet 1 share"
						id="team1p"
						placeholder="0"
						{...register("team1p", {
							max: 1,
							min: 0,
						})}
						isPercent={true}
						isError={errors.team1p ? true : false}
						error="Share cannot be more than 1%."
						width="w-24"
						labelWidth="grow"
					/>
				</div>
				<div className="w-full flex justify-center">
					<button className="safu-icon">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="#ffffff"
							width="12px"
							height="12px"
							viewBox="0 0 45.402 45.402"
						>
							<g>
								<path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141   c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27   c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435   c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z" />
							</g>
						</svg>
					</button>
				</div>
			</div>
		</>
	);
};

export default Team;
