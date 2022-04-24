import {config} from "./make-config.js";
import * as fs from "fs";
import * as path from "path";
import { shared } from "./shared.js";

function loadFile(filename: string) {
	return fs.readFileSync(path.join(shared.__dirname, filename), 'utf8');
}

const mppconfig = `{
	css: "../style/docs.css",
	outDir: "../out/",
	rootDir: "./",
	watch: true,
	wrapper: function(head, header, body, footer, metadata, md) {
		return \`<!DOCTYPE html><html><head>\${head}\${this.generateMetadata(metadata)}</head><body>\${header}<div class="content">\${body}</div>\${footer}</body></html>\`
	}
}`

export const StandardTemplates = {
	default: {
		name: "default",
		description: "A default template.",
		files: {
			src: {
				modules: {},
				"main.gy": "# Create a demo function that prints 'Hello, World!'\ndemo = func() {\n\tprint(\"Hello, World!\");\n}"
			},
			dist: {},
			docs: {
				style: {
					"docs.css": loadFile("../templates/default/docs/style/docs.css"),
					"docs.scss": loadFile("../templates/default/docs/style/docs.scss"),
				},
				src: {
					"index.mpp": loadFile("../templates/default/docs/src/index.mpp"),
					"mppconfig.mjs": mppconfig,
				},
				out: {}
			},
			test: {
				"main.spec.gy": ""
			},
			"README.md": "",
			"LICENSE": "",
			"CHANGELOG.md": "",
			".gitignore": "",
			"gyst.json": JSON.stringify(config, null, 4),
		}
	},
	minimal: {
		name: "minimal",
		description: "A minimal template.",
		files: {
			src: {
				modules: {},
				"main.gy": "# Create a demo function that prints 'Hello, World!'\ndemo = func() {\n\tprint(\"Hello, World!\");\n}"
			},
			dist: {},
			docs: {
				style: {
					"docs.css": loadFile("../templates/default/docs/style/docs.css"),
					"docs.scss": loadFile("../templates/default/docs/style/docs.scss"),
				},
				src: {
					"index.mpp": loadFile("../templates/default/docs/src/index.mpp"),
					"mppconfig.mjs": mppconfig,
				},
				out: {}
			},
			"README.md": "",
			"LICENSE": "",
			"gyst.json": JSON.stringify(config, null, 4),
		}
	},
}