import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Google({}), // Add google id and secret
		Credentials({
			credentials: {
				id: { label: "ID", type: "text" },
				email: { label: "Email", type: "email" },
				role: { label: "Role", type: "text" },
				tier: { label: "Tier", type: "text" },
				remainingStorage: { label: "Remaining Storage", type: "text" },
				isVerified: { label: "Is Verified", type: "text" },
				updatedAt: { label: "Updated At", type: "text" },
				token: { label: "Token", type: "text" },
			},
			authorize: async (credentials) => {
				const {
					id,
					email,
					role,
					tier,
					remainingStorage,
					isVerified,
					updatedAt,
					token,
				} = credentials;

				const user = {
					id: id as string,
					email: email as string,
					role: role as string,
					tier: tier as string,
					remainingStorage: remainingStorage as string,
					isVerified: isVerified as string,
					updatedAt: updatedAt as string,
					token: token as string,
				};

				return user;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.role = user.role;
				token.tier = user.tier;
				token.remainingStorage = user.remainingStorage;
				token.isVerified = user.isVerified;
				token.updatedAt = user.updatedAt;
				token.token = user.token;
			}

			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.email = token.email as string;
				session.user.role = token.role as string;
				session.user.tier = token.tier as string;
				session.user.remainingStorage = token.remainingStorage as string;
				session.user.isVerified = token.isVerified as string;
				session.user.updatedAt = token.updatedAt as string;
				session.user.token = token.token as string;
			}

			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/login",
	},
});
