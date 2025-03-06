import zod from "zod";

export const usernameSchema = zod.string().trim().regex(/^[a-zA-Z0-9_.-]*$/).min(3).max(30)

export const newSubmissionSchema = zod.object({
	score: zod.number(),
	link: zod.string().url(),
}).required()
