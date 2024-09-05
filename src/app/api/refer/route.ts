import { apiGet, apiPost } from "@/api/database";

export async function POST(req: Request, res: Response) {
	const body = await req.json();
	const { token, txn, referrer, referral, amount, date } = body;

	const query = `
    INSERT INTO referrals(token, txn, referrer, referral, amount, date)
    VALUES(?, ?, ?, ?, ?, ?)
  `;
	const values = [token, txn, referrer, referral, amount, date];

	let status, respBody;
	await apiPost(query, values)
		.then(() => {
			status = 200;
			respBody = { message: "Successfully created a referral" };
		})
		.catch((err) => {
			status = 400;
			respBody = err;
		});
	return Response.json(respBody, {
		status,
	});
}

export async function GET(req: Request, res: Response) {
	const query = `
	   SELECT * from referrals
	 `;

	let status, body;
	try {
		await apiGet(query)
			.then((res) => {
				status = 200;
				body = res;
			})
			.catch((err: Error) => {
				status = 400;
				body = { error: err };
			});
		return Response.json(body, {
			status,
		});
	} catch (error: any) {
		console.error(error.message);
		return Response.json(
			{ error: error },
			{
				status: 400,
			}
		);
	}
}
