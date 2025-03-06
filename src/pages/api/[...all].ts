import type { APIRoute } from "astro";

const API_URL: URL = new URL(import.meta.env.PUBLIC_API_DOMAIN)
export const ALL: APIRoute = async ({ params, locals, request }) => {
	if (!locals.user) {
		console.error("Attempted to form submit without logged in/ anonymous user.")
		return Response.error()
	}

	const proxyURL = new URL(params.all || "", API_URL)
	request.headers.set("UserID", locals.user.id)

	return fetch(new Request(proxyURL, request));
};
