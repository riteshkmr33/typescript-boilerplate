const mysql = require("mysql");
import { MysqlError } from "mysql";
import { Request, Response, NextFunction } from "express";

import { ServiceProvider } from "../utils/types";
const { SYSTEM_ERROR } = require("../utils/messages");
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

module.exports = function (provider: ServiceProvider) {
    return function (req: Request, res: Response, next: NextFunction): void {
        const logger = provider.get("logger");
        const db = mysql.createConnection({
            host: DB_HOST,
            user: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB_DATABASE,
        });

        db.on("error", function (err: MysqlError): void {
            if (err) {
                logger.error(err);
                res.json({ code: 500, message: SYSTEM_ERROR });
            }
        });
        db.connect(function (err: MysqlError) {
            if (err) {
                logger.error(err);
                res.json({ code: 500, message: SYSTEM_ERROR });
            } else {
                provider.register("db", db);
                next();
            }
        });
    };
}
