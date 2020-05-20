const { ERROR } = require("./messages");
import { queryCallback } from "mysql";

module.exports = {
    randomStr: (length: number): string => {
        let result = "";
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    },
    query: function (
        query: string,
        params: Array<string | number> = [],
        closeConnection = true
    ): Promise<any> {
        return new Promise((resolve) => {
            const { db, logger, response } = this.get([
                "db",
                "logger",
                "response",
            ]);
            try {
                const callback: queryCallback = (error, data) => {
                    try {
                        if (closeConnection) db.destroy();
                        if (error) {
                            logger.error(error);
                            response.json({ message: ERROR, code: 500 });
                        } else resolve(data);
                    } catch (error) {
                        logger.error(error);
                        response.json({ message: ERROR, code: 500 });
                    }
                };
                db.query(query, params, callback);
            } catch (error) {
                logger.error(error);
                response.json({ message: ERROR, code: 500 });
            }
        });
    },
};
