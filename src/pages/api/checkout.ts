import type { APIRoute } from "astro";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

export const GET: APIRoute = async () => {
	const checkoutResp = await createCheckout(import.meta.env.LEMONSQUEEZY_STORE_ID, import.meta.env.LEMONSQUEEZY_BASIC_VARIANT_ID)

	return new Response(
		JSON.stringify(product), {
		status: 200,
		headers: {
			"Content-Type": "application/json"
		}
	}
	);
};
