import "dotenv/config";
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

	return events
		.map((event) => ({
			...event,
			Tags: event.Tags.split(",").map((tag) => tag.trim()),
			parsedDate: parseDate(event.Datum),
		}))
		.toSorted((a, b) => a.parsedDate - b.parsedDate);
}
