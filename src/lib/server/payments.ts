import Stripe from "stripe";
import {
	type NewCustomer, type Customer, createCustomer,
	lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";
import { db } from "@/auth"

export const stripe: Stripe = new Stripe(import.meta.env.PUBLIC_STRIPE_KEY)
export const lemonSqueezy = lemonSqueezySetup({ apiKey: import.meta.env.LEMONSQUEEZY_API_KEY })

export const registerCustomer = async (name: string, email: string, user_id: string) => {
	const { data, error } = await createCustomer(import.meta.env.LEMONSQUEEZY_STORE_ID, {
		name,
		email
	})
	if (error) {
		throw new Error("Failed to register lemonsqueezy customer:", error)

	}

	if (data && data.data && data.data.id) {
		await db.query(`INSERT INTO customers(userid, ls) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [user_id, data.data.id])
	}
}

export const updateCustomerEmail = async (id: string, email: string) => {
	await stripe.customers.update(id, {
		email
	})
}

