/**
 * Fetch data from start.gg GraphQL API
 * @param {Object} params - Configuration object
 * @param {string} params.query - GraphQL query string
 * @param {Record<string, unknown>} [params.variables={}] - GraphQL variables
 */
export async function fetchStartGG({ query, variables = {} }) {
	const apiKey = process.env.STARTGG_API_KEY;

	if (!apiKey) {
		throw new Error("STARTGG_API_KEY is undefined. Check your .env file.");
	}

	const response = await fetch("https://api.start.gg/gql/alpha", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({ query, variables }),
	});

	const json = await response.json();

	// Validate basic response structure
	if (!json || (typeof json !== "object" && !("data" in json))) {
		throw new Error("Invalid response from start.gg API");
	}

	// Check for GraphQL errors
	if ("success" in json && json.success === false) {
		throw new Error(`GraphQL error: ${json.message || "Unknown error"}`);
	}

	return json.data;
}
