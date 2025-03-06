export const APP_URL: URL = new URL(window.location.href);
export const API_V1: string = `${APP_URL.origin}/api`;
export const ACCOUNT_BASE: string = `${API_V1}/account`;
export const ACCOUNT_PAGE_BASE: string = `${APP_URL.origin}/account`;
export const LEADERBOARD_PAGE_BASE: string = `${APP_URL.origin}/leaderboard`;
export const LEADERBOARD_API_BASE: string = `${API_V1}/leaderboard`;


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



