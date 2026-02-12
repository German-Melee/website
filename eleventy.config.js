import tailwindcss from "eleventy-plugin-tailwindcss-4";

export default function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy("src/assets");

	eleventyConfig.addPlugin(tailwindcss, {
		input: "tailwind.css",
	});

	return {
		dir: { input: "src" },
	};
}
