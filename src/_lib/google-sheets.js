/**
 * Fetches a sheet from Google Spreadsheet
 * @param {string} sheetName - The name of the sheet to fetch
 * @returns {Promise<Object[]>} - Array of objects with headers as keys
 */
export async function getSpreadsheet(sheetName) {
	const sheetId = process.env.GOOGLE_SPREADSHEET_ID;
	const apiKey = process.env.GOOGLE_CLOUD_PLATFORM_API_KEY;

	if (!apiKey || !sheetId) {
		throw new Error(
			"GOOGLE_CLOUD_PLATFORM_API_KEY or GOOGLE_SPREADSHEET_ID is undefined. Check your .env file.",
		);
	}

	const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(
			`Failed to fetch sheet: ${response.statusText}. Response: ${await response.text()}`,
		);
	}

	const json = await response.json();
	const [headerRow, ...dataRows] = json.values || [];

	return dataRows.map((row) =>
		headerRow.reduce(
			(prev, cur, index) => ({ ...prev, [cur]: row[index] || "" }),
			{},
		),
	);
}
