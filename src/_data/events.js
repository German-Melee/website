import "dotenv/config";
import fs from "node:fs";
import { getSpreadsheet } from "../_lib/google-sheets.js";
import { fetchStartGG } from "../_lib/start-gg.js";
import Fetch from "@11ty/eleventy-fetch";

// Parse date string in format "DD.MM.YYYY"
const parseDate = (dateStr) => {
	if (!dateStr) return new Date(0);
	const [day, month, year] = dateStr.split(".");
	return new Date(year, month - 1, day);
};

/**
 * Extract slug from start.gg URL
 * @param {string} url - start.gg URL
 * @returns {string|null} - Tournament slug or null
 */
function extractStartGGSlug(url) {
	if (!url || !url.includes("start.gg")) {
		return null;
	}
	const match = url.match(/start\.gg\/tournament\/([^/?#]+)/);
	return match ? match[1] : null;
}

/**
 * Fetch number of attendees for a start.gg tournament
 * @param {string} slug - Tournament slug
 * @returns {Promise<number|null>} - Number of attendees or null
 */
async function fetchAttendees(slug) {
	try {
		const data = await fetchStartGG({
			query: `
				query Caps {
					tournament(slug: "${slug}") {
						numAttendees
					}
				}
			`,
		});
		return data?.tournament?.numAttendees || null;
	} catch (err) {
		console.error(`Failed to fetch attendees for ${slug}:`, err.message);
		return null;
	}
}

/**
 * The returned data will be available as `events` in templates
 */
export default async function () {
	const events = await getSpreadsheet("Turniere");

	// console.log("events", events);

	const enrichedEvents = await Promise.all(
		events.map(async (event) => {
			const slug = extractStartGGSlug(event.Link);
			const numAttendees = slug ? await fetchAttendees(slug) : null;

			return {
				...event,
				Tags: event.Tags.split(",").map((tag) => tag.trim()),
				parsedDate: parseDate(event.Datum),
				image: await getOgImage(event.Link),
				numAttendees,
			};
		}),
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
		const html = await Fetch(url, { type: "text" });

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
