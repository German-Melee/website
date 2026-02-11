import tailwindcss from "@tailwindcss/postcss";
import fs from "node:fs";
import postcss from "postcss";

const processor = postcss([tailwindcss()]);

export default function (eleventyConfig) {
	// Compile tailwind before eleventy processes the files
	eleventyConfig.on("eleventy.before", async () => {
		if (!fs.existsSync("./_site/assets/styles")) {
			fs.mkdirSync("./_site/assets/styles", { recursive: true });
		}

		const cssContent = fs.readFileSync("./src/assets/styles/index.css", "utf8");

		const result = await processor.process(cssContent, {
			from: "./src/assets/styles/index.css",
		});

		fs.writeFileSync("./_site/assets/styles/index.css", result.css);
	});

	return {
		dir: { input: "src" },
	};
}
