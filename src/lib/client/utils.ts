import { z } from "zod";
import type { Schema } from "zod";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);

dayjs.extend(duration)

export type Handler = (event: SubmitEvent) => void;

export type Config<T extends Schema> = {
	emitEvent?: CustomEvent,
	schema: T;
	onSubmit: (data: z.infer<T>) => Promise<boolean | Error | string>;
	onBusy: string;
};

export function formatTimeAgo(timestamp: string): string {
	return dayjs(
		timestamp
	).fromNow(
		true,
	) + " ago"
}

export function hideBasedOn(input_selector: string, target_selector: string, invert: boolean = false) {
	const input = document.querySelector(input_selector) as HTMLInputElement
	const target = document.querySelector(target_selector) as HTMLElement
	function update() {

		if (invert) {
			target.hidden = !input.checked
		} else {
			target.hidden = input.checked
		}
	}

	input.addEventListener("change", update)
	update()



}
export const getTodayAndTomorrow = (): { today: string, tomorrow: string } => {
	var date = new Date();
	var one_day_forward = new Date();
	one_day_forward.setDate(
		date.getDate() + 1,
	);

	one_day_forward.setMilliseconds(0);
	one_day_forward.setSeconds(0);
	date.setMilliseconds(0);
	date.setSeconds(0);

	const today = date
		.toISOString()
		.replace(":00.000Z", "");
	const tomorrow = one_day_forward
		.toISOString()
		.replace(":00.000Z", "");
	return { today, tomorrow }
}

export const setupForm = (form_id: string, config: Config<Schema>) => {
	const element = document.querySelector(form_id)
	if (!element) {
		console.error("Unable to find form element:", form_id)
		return
	}

	const onError = document.querySelector(
		'[role="alert"]',
	)
	if (!onError) {
		console.error("Unable to find form error message element")
		return
	}
	const { onSubmit, schema, onBusy } = config;
	const handler = async (event: any) => {
		event.preventDefault();
		onError.innerHTML = "";

		const form = event.currentTarget as any;
		const data = Object.fromEntries(new FormData(form) as any);

		const buttons = form.querySelectorAll("button");
		const inputs = form.querySelectorAll("input, textarea, select");
		console.log(inputs)
		for (const input of inputs) {
			if (input.getAttribute("type") === "radio" || input.getAttribute("type") === "checkbox") {
				data[input.id] = input.checked
			}

		}
		const prevText = form.querySelector("button[type=submit]")?.textContent;

		console.log(data)
		try {
			const parsed = schema.parse(data);
			console.log(parsed)
			for (const button of buttons) {
				button.disabled = true;
			}

			for (const input of inputs) {
				input.disabled = true;
			}

			form.querySelector("button[type=submit]").textContent = onBusy;

			const response = await onSubmit(parsed);

			if (response) {
				event.preventDefault();

				if (response !== true) {
					const message = response instanceof Error ? response.message : response;

					onError.innerHTML = `<p>${message}</p>`;
				}

				for (const button of buttons) {
					button.disabled = false;
				}

				for (const input of inputs) {
					input.disabled = false;
					input.value = ""
				}

				form.querySelector("button[type=submit]").textContent = prevText;
				if (config.emitEvent) {
					form.dispatchEvent(config.emitEvent)
				}
			}
		} catch (error: any) {
			let message = error.message;

			if (error.errors && error.errors.length) {
				console.log(error.errors[0].path[0])
				form.querySelector(`[name="${error.errors[0].path[0]}"]`).focus();
				message = error.errors[0].message;
			} else {
				message = error.message;
			}

			onError.innerHTML = `<p>${message}</p>`;
		}
	};
	element.addEventListener("submit", handler);

	return {
		remove: () => element.removeEventListener("submit", handler),
	};
};



export const createRow = (entry: {
	user: string,
	score: string,
	submitted_at: string
}
	, index: number): HTMLTableRowElement => {

	const newRow =
		document.createElement(
			"tr",
		);
	newRow.setAttribute(
		"data-timestamp",
		entry.submitted_at,
	);
	const rankCell =
		document.createElement(
			"th",
		);
	rankCell.setAttribute(
		"scope",
		"row",
	);

	rankCell.classList.add(
		"row-rank",
	);
	newRow.appendChild(rankCell);
	const usernameCell =
		newRow.insertCell();
	usernameCell.classList.add(
		"row-user",
	);
	const scoreCell =
		newRow.insertCell();

	scoreCell.classList.add(
		"row-score",
	);
	const timestampCell =
		newRow.insertCell();

	timestampCell.classList.add(
		"row-timestamp",
	);
	rankCell.innerHTML = (
		index + 1
	).toString();
	if (index == 0) {
		rankCell.classList.add("gold")
	}
	if (index == 1) {

		rankCell.classList.add("silver")
	}
	if (index == 2) {
		rankCell.classList.add("bronze")
	}
	if (index <= 2) {
		rankCell.innerHTML = `<strong> ${index + 1} </strong>`;
	} else {
		rankCell.innerHTML = `${index + 1}`;
	}
	usernameCell.innerHTML =
		entry.user;
	scoreCell.innerHTML =
		entry.score;
	timestampCell.innerHTML = dayjs(
		entry.submitted_at,
	).fromNow(true) + " ago";
	return newRow;

}

export type PageData = {
	leaderboard: string
	submission: string
}
export function getPageData(): PageData {
	const pageData: PageData = { leaderboard: "", submission: "" }
	const data_elem: HTMLElement | null = document.querySelector('#frontmatter-store')
	console.log(data_elem)
	if (data_elem && data_elem.dataset && data_elem.dataset.leaderboard) {
		pageData.leaderboard = data_elem.dataset.leaderboard
	} else {
		pageData.leaderboard = ""
	}
	if (data_elem && data_elem.dataset && data_elem.dataset.submission) {
		pageData.submission = data_elem.dataset.submission
	} else {
		pageData.submission = ""
	}

	return pageData
}
