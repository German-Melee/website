import "dotenv/config";
import {
	convertSheetToObjects,
	getSpreadsheet,
} from "../_lib/google-sheets.js";

/**
 * Eleventy data file to fetch events (Turniere) from Google Sheets
 * The returned data will be available as `events` in templates
 */
export default async function () {
	const sheetData = await getSpreadsheet("Turniere");
	const [headerRow, ...dataRows] = sheetData;
	const events = convertSheetToObjects(headerRow, dataRows);

	for (const event of events) {
		console.log(event);
		event.Tags = event.Tags.split(",").map((tag) => tag.trim());
	}

	console.log(
		`✅ Loaded ${events.length} events (Turniere) from Google Sheets`,
	);

	return events;
}
