import dayjs from "dayjs";
import zod from "zod";

const displayNameSchema = zod.string().min(3, {
	message: "Display name must be at least 3 characters.",
}).max(20, {
	message: "Display name canont be more than 20 characters.",
})

export const newSubmission = zod.object({
	link: zod.string().url(),
	score: zod.coerce.number()
}).required()



export const leaderboardTitle = zod
	.string()
	.min(
		1,
		{
			message: "Leaderboard title is required.",
		},
	)

export const newLeaderboardSchema = zod.object({
	title: leaderboardTitle,
	"highest-score": zod.boolean(),
	"only-one-submission": zod.boolean(),
	"start-datetime": zod.string().transform(value => `${value}Z`),
	"cutoff-datetime": zod.string().transform(value => `${value}Z`),
	"end-date-never": zod.boolean(),
	"start-date-now": zod.boolean(),
}).transform((val) => {
	const formatted: any = {
		title: val.title,
		highest_first: val['highest-score'],
		multiple_submissions: !val['only-one-submission'],
		is_time: !val['highest-score'],
	}
	const start_now = val['start-date-now'] || val['start-datetime'] === 'Z'
	const end_never = val['end-date-never'] || val['cutoff-datetime'] === 'Z'

	let start = dayjs()
	if (!start_now) {
		start = dayjs(val['start-datetime'])
		formatted.start = start.toISOString()
	}
	if (!end_never) {
		formatted.duration = dayjs.duration(dayjs(val['cutoff-datetime']).diff(start)).format('YYYY-MM-DDTHH:mm:ss')
		formatted.duration = formatted.duration.replace(/^(0|-|T)+(?!$)/, "")
	}

	return formatted
})

export const loginForm = zod.object({
	email: zod.union([
		zod
			.string()
			.min(
				3,
				"Username or email is required.",
			)
			.email("Invalid email")
			.max(100)
			.trim(),
		zod
			.string()
			.min(
				3,
				"Username or email is required.",
			)
			.max(100)
			.trim(),
	]),
	password: zod.string().min(8, "Password must be at least 8 characters.").max(64, "Password cannot be no more than 50 characters."),
	rememberme: zod.boolean().optional(),
})


export const signUpFormSchema = zod.object({
	username: displayNameSchema,
	email: zod.string().email(),
	password: zod
		.string()
		.min(8, {
			message: "Password must be at least 8 characters.",
		})
		.max(20, {
			message: "Password cannot be greater than 20 characters.",
		}),
})

export const adminFormSchema = zod.object({
	username: zod.string().min(1, {
		message: "Player is required",
	}),
	score: zod.coerce.number().min(1, {
		message: "Score is required",
	}),
})

