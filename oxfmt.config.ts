import { defineConfig } from "oxfmt";

export default defineConfig({
	useTabs: true,
	singleQuote: false,
	trailingComma: "none",
	sortImports: {},
	printWidth: 100,
	sortTailwindcss: {
		stylesheet: "./src/routes/layout.css"
	},
	sortPackageJson: true,
	ignorePatterns: [
		"package-lock.json",
		"pnpm-lock.yaml",
		"yarn.lock",
		"bun.lock",
		"bun.lockb",
		"/static/",
		"/drizzle/"
	]
});
