import "dotenv/config";
import { getSpreadsheet } from "../_lib/google-sheets.js";

/**
 * The returned data will be available as `events` in templates
 */
export default async function () {
	const events = await getSpreadsheet("Turniere");

	console.log("events", events);

	return events.map((event) => ({
		...event,
		Tags: event.Tags.split(",").map((tag) => tag.trim()),
	}));
}
