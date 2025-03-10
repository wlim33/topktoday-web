import { auth } from "@/auth";
import type { APIContext, MiddlewareNext } from "astro";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
export type Verifier = {
	id: string,
	added_at: string,
	username: string
}

export type Entry = {
	user: {
		username: string,
		id: string
	},
	score: number,
	submitted_at: string,
	id: string,
	verified: boolean,
}
export type LeaderboardInfo = {
	title: string,
	duration: string,
	start: string,
	allow_multiple: boolean,
	is_time: boolean,
	highest_first: boolean,
	created_at: string
}


export function formatTimeAgo(timestamp: string): string {
	return dayjs(
		timestamp
	).fromNow(
		true,
	) + " ago"
}

export function pathJoin(parts: string[]) {
	const separator = "/";
	parts = parts.map((part, index) => {
		if (index) {
			part = part.replace(
				new RegExp(
					"^" + separator,
				),
				"",
			);
		}
		if (index !== parts.length - 1) {
			part = part.replace(
				new RegExp(
					separator + "$",
				),
				"",
			);
		}
		return part;
	});
	return parts.join(separator);
}


export async function signInAnonymousIfUnauthorized(context: APIContext, next: MiddlewareNext) {
	if (!context.locals.user) {
		const anonResp = await auth.api.signInAnonymous()
		if (anonResp) {
			context.locals.user = anonResp.user
		}
	}
	return next()
}
