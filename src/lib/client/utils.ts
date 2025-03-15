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


export function parseRawLeaderboardInfo(rawStop: string) {
	return dayjs(rawStop)
}

export function getRemaining(stop: dayjs.Dayjs) {
	const now = dayjs();

	const remaining = stop.diff(now);
	return dayjs.duration(remaining)
}


export function setCountdownValue(
	elem: HTMLSpanElement,
	value: number,
) {
	elem.setAttribute(
		"style",
		`--value:${value}`,
	);
	elem.setAttribute(
		"aria-label",
		`${value}`,
	);
	elem.innerText = value.toString();
}
export function formatTimeAgo(timestamp: string): string {
	return dayjs(
		timestamp
	).fromNow(
		true,
	) + " ago"
}


export function addCarousel(intervalId: null | ReturnType<typeof setInterval>, firstWordID: string, secondWordID: string): ReturnType<typeof setInterval> {

	let i: number = 0;
	if (intervalId) {
		clearInterval(intervalId);
		intervalId = null;
	}
	if (!intervalId) {
		intervalId = setInterval(() => {
			const firstWord = document.querySelector(`#${firstWordID}`) as HTMLElement
			const secondWord = document.querySelector(`#${secondWordID}`) as HTMLElement
			let next = getNextText(i)
			let next_first = firstWord.cloneNode(true) as HTMLElement
			let next_second = secondWord.cloneNode(true) as HTMLElement
			next_first.innerHTML = next[1]
			next_second.innerHTML = next[2]
			i = next[0];

			firstWord.replaceWith(next_first);
			secondWord.replaceWith(next_second);
		}, 2500);
	}
	return intervalId



}


class CountdownTimer {
	duration: number = 3600;
	granularity: number = 1000;
	tickFtns: Function[] = [];
	running: boolean = false;

	constructor(duration: number, granularity: number) {
		this.granularity = granularity;
		this.duration = duration;
	}

	start() {
		if (this.running) {
			return;
		}
		this.running = true;
		var start = Date.now(),
			that = this,
			diff, obj: CountdownTimer;

		(function timer() {
			diff = that.duration - (((Date.now() - start) / 1000) | 0);

			if (diff > 0) {
				setTimeout(timer, that.granularity);
			} else {
				diff = 0;
				that.running = false;
			}

			that.tickFtns.forEach(function (ftn) {
			}, that);
		}());
	};

	onTick(ftn: Function) {
		if (typeof ftn === 'function') {
			this.tickFtns.push(ftn);
		}
		return this;
	};

	expired() {
		return !this.running;
	};



}


const words: [string, string][] = [["most active users", "in your Discord server"], ["fastest speedrunners", "in your video game"], ["top teams", "in your sports league"], ["funniest coworkers", "in your Slack channel"]]
export function getNextText(current_i: number): [number, string, string] {
	let next_i = (current_i + 1) % words.length;
	return [next_i, words[next_i][0], words[next_i][1]]
}

export function hideBasedOn(hide_elem: HTMLInputElement, show_elem: HTMLInputElement, target: HTMLElement) {
	function show() {
		if (show_elem.checked) {
			target.hidden = false
		}
	}

	function hide() {
		if (hide_elem.checked) {
			target.hidden = true
		}
	}

	hide_elem.addEventListener("change", hide)
	show_elem.addEventListener("change", show)
	hide()
	show()



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


export const setupFormWithMultipleSubmits = (element: HTMLFormElement, config: Config<Schema>) => {

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
		console.log(event.submitter)
		const form = event.currentTarget as any;
		const data = Object.fromEntries(new FormData(form) as any);

		console.log(data)
		const buttons = form.querySelectorAll("button");
		const inputs = form.querySelectorAll("input, textarea, select");
		for (const input of inputs) {
			if (input.getAttribute("type") === "radio" || input.getAttribute("type") === "checkbox") {
				data[input.id] = input.checked
			}
		}
		data[event.submitter.id] = true
		const prevText = form.querySelector("button[type=submit]")?.textContent;

		try {
			const parsed = schema.parse(data);
			for (const button of buttons) {
				button.disabled = true;
			}

			for (const input of inputs) {
				input.disabled = true;
			}

			event.submitter.textContent = onBusy;

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

				if (config.emitEvent) {
					form.dispatchEvent(config.emitEvent)
				}
			}
		} catch (error: any) {
			console.log(error)
			let message = error.message;

			if (error.errors && error.errors.length) {
				console.log(error.errors[0].path[0])
				form.querySelector(`[name="${error.errors[0].path[0]}"]`).focus();
				message = error.errors[0].message;
			} else {
				message = error.message;
			}

			event.submitter.textContent = prevText;
			for (const button of buttons) {
				button.disabled = false;
			}

			for (const input of inputs) {
				input.disabled = false;
			}

			onError.innerHTML = `<p>${message}</p>`;
		}
	};
	element.addEventListener("submit", handler);

	return {
		remove: () => element.removeEventListener("submit", handler),
	};
};

export const setupForm = (element: HTMLFormElement, config: Config<Schema>) => {

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
		console.log(event.submitter)
		const form = event.currentTarget as any;
		const data = Object.fromEntries(new FormData(form) as any);

		const buttons = form.querySelectorAll("button");
		const inputs = form.querySelectorAll("input, textarea, select");
		for (const input of inputs) {
			if (input.getAttribute("type") === "radio" || input.getAttribute("type") === "checkbox") {
				data[input.id] = input.checked
			}

		}
		const prevText = form.querySelector("button[type=submit]")?.textContent;

		try {
			const parsed = schema.parse(data);
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

				//form.querySelector("button[type=submit]").textContent = prevText;
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

			form.querySelector("button[type=submit]").textContent = prevText;
			for (const button of buttons) {
				button.disabled = false;
			}

			for (const input of inputs) {
				input.disabled = false;
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
