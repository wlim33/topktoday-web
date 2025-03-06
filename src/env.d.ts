/// <reference path="../.astro/types.d.ts" />

declare namespace App {
	// Note: 'import {} from ""' syntax does not work in .d.ts files.
	interface Locals {
		user: (import("better-auth").User & { isAnonymous: bool }) | null;
		session: import("better-auth").Session | null;
		customer_id: number | null;
	}
}

interface ImportMetaEnv {
	readonly LEMONSQUEEZY_API_KEY: string;
	readonly LEMONSQUEEZY_API_KEY: string;
	readonly PUBLIC_LEMONSQUEEZY_FREE_VARIANT_ID: string;
	readonly PUBLIC_LEMONSQUEEZY_BASIC_VARIANT_ID: string;
	readonly LEMONSQUEEZY_STORE_ID: string;
	readonly PUBLIC_API_DOMAIN: string;
	readonly BETTER_AUTH_SECRET: string;
	readonly PUBLIC_STRIPE_KEY: string;
	// more env variables...
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
