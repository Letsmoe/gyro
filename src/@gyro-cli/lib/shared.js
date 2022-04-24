import { dirname } from "path";
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
export const shared = {
    __dirname: __dirname,
};
