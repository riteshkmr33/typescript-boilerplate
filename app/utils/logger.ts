const { createLogger, format, transports } = require("winston");
const { combine, timestamp, json, errors } = format;

const today = new Date();

module.exports = createLogger({
    level: "info",
    format: combine(
        errors({ stack: true }), // <-- use errors format
        timestamp(),
        json()
    ),
    transports: [
        //
        // - Write all logs error (and below) to `error.log`.
        //
        process.env.ENVIRONMENT === "development"
            ? new transports.Console()
            : new transports.File({
                  filename: `logs/error-${today.getDate()}-${
                      today.getMonth() + 1
                  }-${today.getFullYear()}.log`,
                  level: "error",
              }),
    ],
});
