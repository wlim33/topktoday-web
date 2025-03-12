import { auth } from "@/auth";
import type { APIContext, MiddlewareNext } from "astro";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.extend(duration);
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

export function getRemaining(rawStart: string, rawDuration: number) {

	const parsed_duration = dayjs.duration({
		milliseconds: rawDuration / 1000000,
	});

	const start = dayjs(rawStart);

	const now = dayjs();

	const remaining = now.diff(start);
	return parsed_duration.subtract(remaining)
}

export function formatTimeAgo(timestamp: string): string {
	return dayjs(
		timestamp
	).fromNow(
		true,
	) + " ago"
}
export function formatHistoryTimestamp(timestamp: string): string {
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

export const youtubeUrlToEmbed = (urlString: string | undefined | null): string | null | undefined => {
	const template = (v: string) => `https://www.youtube.com/embed/${v}`;
	if (urlString && URL.canParse(urlString)) {
		const url = new URL(urlString);
		// short URL
		if (url.hostname === 'www.youtu.be' || url.hostname === 'youtu.be') {
			return template(url.pathname.startsWith('/') ? url.pathname.substring(1) : url.pathname);
		}
		// regular URL
		const v = url.searchParams.get('v');
		if ((url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') && v) {
			return template(v);
		}
	}
	return urlString;
};
