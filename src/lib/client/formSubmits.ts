import zod from "zod";
import { newLeaderboardSchema } from "./schemas";
import { LEADERBOARD_API_BASE, pathJoin } from "./urls";
import { getPageData } from "./utils"

export async function newLeaderboard(leaderboardConfig: zod.infer<typeof newLeaderboardSchema>): Promise<string> {
	const response = await fetch(LEADERBOARD_API_BASE, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(leaderboardConfig),
	});

	if (response.status === 500) {
		throw new Error("Looks like our servers are currently experiencing difficulties. Please try again soon.")
	}
	if (response.status !== 200) {
		throw new Error("Unable to create a new leaderboard at this time.")
	}
	let parsed = await response.json()
	return parsed.id
}

export async function addScore(score: number, link: string) {
	const p = getPageData()
	if (p.leaderboard.length === 0) {
		throw new Error("Stale data found - please refresh the page and try again.")
	}
	await fetch(pathJoin([LEADERBOARD_API_BASE, p.leaderboard, "submission"]), {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ score, link }),
	});

}

export async function verifyScore() {
	const p = getPageData()
	if (p.submission.length === 0 || p.leaderboard.length === 0) {
		throw new Error("Stale data found -- please refresh the page and try again.")

	}
	await fetch(pathJoin([LEADERBOARD_API_BASE, p.leaderboard, "submission", p.submission, "verify"]), {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
	});

}

