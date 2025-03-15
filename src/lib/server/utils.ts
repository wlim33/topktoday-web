import { auth } from "@/auth";
import type { APIContext, MiddlewareNext } from "astro";
import dayjs from "dayjs";
import RelativeTime from "dayjs/plugin/relativeTime";
import Duration from "dayjs/plugin/duration";
import LocalizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(RelativeTime);
dayjs.extend(Duration);
dayjs.extend(LocalizedFormat)
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
	stop: string,
	start: string,
	verify: boolean,
	is_time: boolean,
	highest_first: boolean,
	created_at: string
}

export function getRemaining(rawStop: string) {
	const now = dayjs();

	const remaining = dayjs(rawStop).diff(now);
	return dayjs.duration(remaining)
}

export function formatTimeAgo(timestamp: string): string {
	return dayjs(
		timestamp
	).fromNow(
		true,
	) + " ago"
}
export function formatTimeFromNow(timestamp: string, showFullIfOlderThanHour: boolean = true): string {
	if (!timestamp) {
		return "-"
	}
	const parsed = dayjs(timestamp);
	const cutoffDate = showFullIfOlderThanHour ? dayjs().add(1, 'hour') : dayjs().add(1, 'day');
	if (cutoffDate.isAfter(parsed)) {
		return "in " + parsed.fromNow(
			true,
		)
	} else {
		return parsed.format('LLL')
	}
}

export function formatHistoryTimestamp(timestamp: string, showFullIfOlderThanHour: boolean = true): string {
	const parsed = dayjs(timestamp);
	const cutoffDate = showFullIfOlderThanHour ? dayjs().subtract(1, 'hour') : dayjs().subtract(1, 'day');
	if (parsed.isAfter(cutoffDate)) {
		return parsed.fromNow(
			true,
		) + " ago"
	} else {
		return parsed.format('LLL')
	}
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
