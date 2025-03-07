import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins"
import { anonymous } from "better-auth/plugins"
import { usernameSchema } from "@/lib/server/schemas";
import { linkAnonymousAccount } from "@/lib/server/api";
import pg from 'pg';

const { Pool } = pg;

export const auth = betterAuth({
	plugins: [
		username({
			usernameValidator: (username) => {
				const { success } = usernameSchema.safeParse(username)
				return success
			}
		}),
		anonymous({
			onLinkAccount: async ({ anonymousUser, newUser }) => {
				await linkAnonymousAccount(anonymousUser.user.id, newUser.user.id)
			},
		})
	],
	socialProviders: {
		discord: {
			clientId: import.meta.env.DISCORD_CLIENT_ID as string,
			clientSecret: import.meta.env.DISCORD_CLIENT_SECRET as string,
		},
		google: {
			clientId: import.meta.env.GOOGLE_CLIENT_ID as string,
			clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60 // Cache duration in seconds
		}
	},
	emailAndPassword: {
		enabled: true
	},
	database: new Pool({
		connectionString: import.meta.env.DB_URL
	})
})
