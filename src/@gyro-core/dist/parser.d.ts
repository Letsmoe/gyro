import { TokenStream } from "./token-stream.js";
declare function parse(input: TokenStream): {
    type: string;
    body: any[];
};
export { parse };
