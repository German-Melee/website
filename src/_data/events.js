import "dotenv/config";
import fs from "node:fs";
import { getSpreadsheet } from "../_lib/google-sheets.js";

// Parse date string in format "DD.MM.YYYY"
const parseDate = (dateStr) => {
	if (!dateStr) return new Date(0);
	const [day, month, year] = dateStr.split(".");
	return new Date(year, month - 1, day);
};

/**
 * The returned data will be available as `events` in templates
 */
export default async function () {
	const events = await getSpreadsheet("Turniere");

	console.log("events", events);

	const enrichedEvents = await Promise.all(
		events.map(async (event) => ({
			...event,
			Tags: event.Tags.split(",").map((tag) => tag.trim()),
			parsedDate: parseDate(event.Datum),
			image: await getOgImage(event.Link),
		})),
	);

	return enrichedEvents.toSorted((a, b) => a.parsedDate - b.parsedDate);
}

const FALLBACK_IMAGE = "/assets/fallback.webp";
const CACHE_FILE = "./og-images-cache.json";

let cache = {};

if (fs.existsSync(CACHE_FILE)) {
	cache = JSON.parse(fs.readFileSync(CACHE_FILE));
	console.log("Loaded OpenGraph image cache:", cache);
} else {
	console.log("No OpenGraph image cache found, starting with an empty cache.");
}

async function getOgImage(url) {
	if (!url) {
		return FALLBACK_IMAGE;
	}

	if (cache[url]) {
		return cache[url];
	} else {
		console.log(`No cached OpenGraph image for URL: ${url}, fetching...`);
	}

	try {
		const response = await fetch(url);
		const html = await response.text();

		const match = html.match(
			/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
		);

		const image = match?.[1] || FALLBACK_IMAGE;

		cache[url] = image;
		fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
		return image;
	} catch (err) {
		throw new Error(
			`Failed to fetch OpenGraph image for URL: ${url}\nError: ${err}`,
		);
	}
}
