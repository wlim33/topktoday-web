import { pathJoin } from "./utils";

export async function newLeaderboard(userID: string, displayName: string) {
	const path = pathJoin([import.meta.env.PUBLIC_API_DOMAIN, "leaderboard"])
	return await fetch(path, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"UserID": userID
		},
		body: JSON.stringify({ name: displayName }),
	});
}
export async function getHistory(leaderboard: string, submission: string) {
	const path = pathJoin([import.meta.env.PUBLIC_API_DOMAIN, "leaderboard", leaderboard, "submission", submission, "history"])
	const response = await fetch(path);
	let parsed = await response.json()
	return parsed
}

export async function getSubmissionInfo(leaderboard: string, submission: string) {
	const path = pathJoin([import.meta.env.PUBLIC_API_DOMAIN, "leaderboard", leaderboard, "submission", submission])
	const response = await fetch(path);
	let parsed = await response.json()
	return parsed
}

export async function getLeaderboardInfo(id: string) {
	const path = pathJoin([import.meta.env.PUBLIC_API_DOMAIN, "leaderboard", id, "info"])
	const response = await fetch(path);
	let parsed = await response.json()
	return parsed
}

export async function getLeaderboard(id: string) {
	const path = pathJoin([import.meta.env.PUBLIC_API_DOMAIN, "leaderboard", id])
	const response = await fetch(path,
		{
			cache: "default"
		}
	);
	let parsed = await response.json()
	return parsed
}


export function patchSubmissionScore(userId: string, leaderboard_id: string, submission_id: string, score: number) {
	const path = pathJoin([import.meta.env.PUBLIC_API_DOMAIN, "leaderboard", leaderboard_id, "submission", submission_id, "score"])
	return fetch(path,
		{
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"UserID": userId
			},
			body: JSON.stringify({ score })
		});
}

export function postNewSubmission(userId: string, leaderboard_id: string, score: number, link: string) {
	const path = pathJoin([import.meta.env.PUBLIC_API_DOMAIN, "leaderboard", leaderboard_id, "submission"])
	return fetch(path,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"UserID": userId
			},
			body: JSON.stringify({ score, link })
		});
}

export function verifySubmission(userId: string, leaderboard_id: string, submission_id: string) {
	const path = pathJoin([import.meta.env.PUBLIC_API_DOMAIN, "leaderboard", leaderboard_id, "submission", submission_id, "verify"])
	return fetch(path,
		{
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"UserID": userId
			},
			body: JSON.stringify({ is_valid: true })
		});
}

export async function getUserLeaderboards(userId: string) {
	const path = pathJoin([import.meta.env.PUBLIC_API_DOMAIN, "account", userId, "leaderboards"])
	const resp = await fetch(path);
	const body = await resp.json();
	console.log(body)
	return body.leaderboards
}


export async function getUserSubmissions(userId: string) {
	const path = pathJoin([import.meta.env.PUBLIC_API_DOMAIN, "account", userId, "submissions"])
	const resp = await fetch(path);
	const body = await resp.json();

	console.log(body)
	return body.submissions
}

export async function getVersion() {
	const path = pathJoin([import.meta.env.PUBLIC_API_DOMAIN, "health"])
	const resp = await fetch(path);
	const body = await resp.json()
	return body.message
}

export async function getVerifiers(leaderboard_id: string) {
	const path = pathJoin([import.meta.env.PUBLIC_API_DOMAIN, "leaderboard", leaderboard_id, "verifiers"])
	const resp = await fetch(path);
	const body = await resp.json();
	return body
}


export async function linkAnonymousAccount(anonymous_id: string, user_id: string) {
	const path = pathJoin([import.meta.env.PUBLIC_API_DOMAIN, "account", "link_anonymous"])
	const resp = await fetch(path, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"UserID": user_id
		},
		body: JSON.stringify({
			"anon_id": anonymous_id
		})
	});
	const body = await resp.json();
	return body
}
