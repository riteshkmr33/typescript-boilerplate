export {};
import { Application } from "express";

const fs = require("fs");

const { logger, provider, common, dbTables } = require("./app/utils");
const { db, auth, maintenance } = require("./app/middlewares");

module.exports = function (app: Application): void {
    const serviceProvider = new provider();

    /* Registering services for application */
    serviceProvider.register("logger", logger);
    serviceProvider.register("tables", dbTables);
    serviceProvider.register("query", common.query, true);

    app.use((req, res, next) => {
        serviceProvider.register("response", res);
        next();
    });

    app.use("*", db(serviceProvider), auth(serviceProvider));

    if (process.env.APP_MAINTENANCE === "true") {
        app.use(maintenance);
    } else {
        fs.readdir("app/controllers", (error: Error, controllers: string[]) => {
            if (!error) {
                try {
                    controllers.forEach((controller: string) => {
                        controller = controller
                            .replace(".js", "")
                            .replace(".ts", "");
                        require(`./app/controllers/${controller}`).call(
                            serviceProvider,
                            { app }
                        );
                    });
                } catch (err) {
                    logger.error(err);
                    app.use(maintenance);
                }
            } else {
                logger.error(error);
                app.use(maintenance);
            }
        });
    }
};
