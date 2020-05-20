export {};
const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";

import { ServiceProvider } from "../utils/types";
const { constants, messages } = require("../utils");

const {
    ERROR,
    UNAUTHORIZED,
    SYSTEM_ERROR,
    SESSION_EXPIRED,
    INVALID_SESSION,
    AUTHENTICATION_FAILED,
} = messages;
const { AUTH_NOT_REQUIRED } = constants;

module.exports = function (provider: ServiceProvider) {
    return function (
        { baseUrl, headers }: Request,
        res: Response,
        next: NextFunction
    ): void {
        const logger = provider.get("logger");

        try {
            if (baseUrl && AUTH_NOT_REQUIRED.indexOf(baseUrl) === -1) {
                const { authorization } = headers;
                if (authorization) {
                    jwt.verify(authorization, process.env.APP_SALT, function (
                        error: Error
                    ) {
                        if (!error) {
                            const model = provider.model("users");
                            if (model) {
                                const { getUserByToken } = model();
                                getUserByToken(authorization).then(
                                    (data: any) => {
                                        if (data.length) {
                                            provider.register(
                                                "requester",
                                                data[0].userId
                                            );
                                            next();
                                        } else
                                            res.json({
                                                code: 401,
                                                message: INVALID_SESSION,
                                            });
                                    }
                                );
                            } else {
                                res.json({ code: 500, message: ERROR });
                            }
                        } else {
                            let message = "";

                            switch (error.name) {
                                case "TokenExpiredError":
                                    message = SESSION_EXPIRED;
                                    break;
                                case "NotBeforeError":
                                case "JsonWebTokenError":
                                    message = INVALID_SESSION;
                                    break;
                                default:
                                    message = AUTHENTICATION_FAILED;
                                    break;
                            }
                            res.json({ code: 401, message });
                        }
                    });
                } else {
                    res.json({ code: 401, message: UNAUTHORIZED });
                }
            } else next();
        } catch (err) {
            logger.error(err);
            res.json({ code: 500, message: SYSTEM_ERROR });
        }
    };
};
