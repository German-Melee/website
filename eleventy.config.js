import tailwindcss from "@tailwindcss/postcss";
import fs from "node:fs";
import postcss from "postcss";

const processor = postcss([tailwindcss()]);

export default function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy({
		"src/assets": "assets",
	});

	// Compile tailwind after passthrough copy so it overwrites the source CSS.
	eleventyConfig.on("eleventy.after", async () => {
		if (!fs.existsSync("./_site/assets/styles")) {
			fs.mkdirSync("./_site/assets/styles", { recursive: true });
		}

		const cssContent = fs.readFileSync("./src/assets/styles/index.css", "utf8");

		const result = await processor.process(cssContent, {
			from: "./src/assets/styles/index.css",
		});

		fs.writeFileSync("./_site/assets/styles/index.css", result.css);

		// Create .nojekyll file to prevent GitHub Pages from using Jekyll
		fs.writeFileSync("./_site/.nojekyll", "");
	});

	return {
		dir: { input: "src" },
	};
}
