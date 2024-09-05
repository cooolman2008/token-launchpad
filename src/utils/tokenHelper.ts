export const registerReferral = (
	token: `0x${string}`,
	txn: `0x${string}`,
	referrer: `0x${string}`,
	referral: `0x${string}`,
	amount: string
) => {
	fetch("/api/refer", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			token,
			txn,
			referrer,
			referral,
			amount,
			date: Date.now(),
		}),
	})
		.then((res) => {
			return res;
		})
		.catch((err) => {
			console.log(err);
		});
};
