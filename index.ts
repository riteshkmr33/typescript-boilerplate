require("dotenv").config();
import { Request, Response, NextFunction } from "express";
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
});

app.get("/", (req: Request, res: Response) =>
    res.send("Welcome to Typescript boilerplate!")
);

require("./bootstrap")(app);

app.listen(process.env.APP_PORT, () =>
    console.log(`Falcon listening at http://localhost:${process.env.APP_PORT}`)
);
