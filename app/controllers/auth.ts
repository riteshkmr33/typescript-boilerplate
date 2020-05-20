export {};
import { Request, Response } from "express";

const { messages } = require("../utils");
import { CustomObject } from "../utils/types";
const { INVALID_CREDENTIALS, LOGIN_SUCCESS, LOGOUT_SUCCESS } = messages;

module.exports = function ({ app }: CustomObject): void {
    const model = this.model("users");

    app.post("/login", function ({ body }: Request, res: Response) {
        const { getUserByCredentials } = model();
        getUserByCredentials(body).then(({ valid, token }: CustomObject) => {
            if (!valid) res.json({ message: INVALID_CREDENTIALS, code: 404 });
            else
                res.json({
                    data: { token },
                    message: LOGIN_SUCCESS,
                    code: 200,
                });
        });
    });

    app.get("/logout", function ({ headers }: Request, res: Response) {
        const { expireUserToken } = model();
        expireUserToken(headers.authorization).then(() => {
            res.json({ message: LOGOUT_SUCCESS, code: 200 });
        });
    });
};
