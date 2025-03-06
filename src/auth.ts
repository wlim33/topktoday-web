import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins"
import { anonymous } from "better-auth/plugins"
import { usernameSchema } from "@/lib/server/schemas";
import { linkAnonymousAccount } from "@/lib/server/api";
import * as pg from 'pg'
const { Pool } = pg

export const db = new Pool({
	connectionString: import.meta.env.DB_URL
})

export const auth = betterAuth({
	plugins: [
		username({
			usernameValidator: (username) => {
				const { success } = usernameSchema.safeParse(username)
				return success
			}
		}),
		anonymous({})
		//anonymous({
		//	onLinkAccount: async ({ anonymousUser, newUser }) => {
		//		await linkAnonymousAccount(anonymousUser.user.id, newUser.user.id)
		//	},
		//})
	],
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60 // Cache duration in seconds
		}
	},
	emailAndPassword: {
		enabled: true
	},
	database: db,
})
