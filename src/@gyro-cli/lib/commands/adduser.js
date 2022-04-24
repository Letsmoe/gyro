var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readConfig, addUser, userExists } from "../config.js";
import axios from "axios";
import prompts from "prompts";
import * as qs from "qs";
import { info } from "../error.js";
import { error } from "../error.js";
export const adduserCommand = [
    "adduser",
    "Add a user account to the local configuration.",
    (parser) => {
        let locals = parser.args._defaults;
        let username = locals[0];
        let password = locals[1];
        let email = locals[2];
        const [packageData, packagePath] = readConfig();
        (() => __awaiter(void 0, void 0, void 0, function* () {
            var data;
            if (username && password && email) {
                data = { username, password, email };
            }
            else {
                // @ts-ignore
                data = yield prompts.prompt([
                    {
                        type: "text",
                        name: "username",
                        message: "What is your username?",
                    },
                    {
                        type: "password",
                        name: "password",
                        message: "What is the corresponding password?",
                    },
                    {
                        type: "text",
                        name: "email",
                        message: "What is the email address connected to the account?",
                    },
                ]);
            }
            const inputData = {
                username: data.username,
                password: data.password,
                email: data.email,
            };
            // Check if the user already exists
            if (!userExists(inputData)) {
                axios({
                    method: "post",
                    url: "https://gyro.continuum-ai.de/api/validate_user.php",
                    data: qs.stringify(inputData),
                }).then((response) => {
                    let data = response.data;
                    if (data.status === "success") {
                        if (addUser(inputData)) {
                            info("User account successfully added to config.");
                        }
                    }
                    else {
                        error("Failed to add user account.");
                    }
                });
            }
        }))();
    },
];
