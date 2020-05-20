import { Request, Response } from "express";

const { UNDER_MAINTENANCE } = require("../utils/messages");

module.exports = function (req: Request, res: Response): void {
    res.json({ message: UNDER_MAINTENANCE, code: 503 });
};
