import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
	mode: 'production',
	entry: './lib/index.js',
	experiments: {
		outputModule: true
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'gyro.prod.js',
		library: {
			type: "module"
		}
	},
};