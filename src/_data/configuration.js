import "dotenv/config";
import { getSpreadsheet } from "../_lib/google-sheets.js";

/**
 * The returned data will be available as `configuration` in templates
 */
export default async function () {
	return (await getSpreadsheet("Konfiguration")).reduce((acc, item) => {
		acc[item.key] = item.value;
		return acc;
	}, {});
}
