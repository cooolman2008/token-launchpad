import { db } from "./database";

export const migrate = () => {
	db.serialize(() => {
		db.run(
			`
      CREATE TABLE IF NOT EXISTS referrals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT NOT NULL,
        txn TEXT NOT NULL,
        referrer TEXT NOT NULL,
        referral TEXT NOT NULL,
        amount TEXT NOT NULL,
        date BIGINT NOT NULL);
    `,
			(err: Error) => {
				if (err) {
					console.error(err.message);
				} else {
					console.log("referrals table created.");
				}
			}
		);
	});
};
