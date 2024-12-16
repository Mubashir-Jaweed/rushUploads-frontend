import type { DefaultSession } from "next-auth";

// Extend the default Session type
declare module "next-auth" {
	interface User {
		id: string;
		email: string;
		role: string;
		tier: string;
		remainingStorage: string;
		isVerified: string;
		updatedAt: string;
		token: string;
	}

	interface Session {
		user: {
			id: string;
			email: string;
			role: string;
			tier: string;
			remainingStorage: string;
			isVerified: string;
			updatedAt: string;
			token: string;
		} & DefaultSession["user"];
	}
}
