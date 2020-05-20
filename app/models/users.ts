export {};
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

import { CustomObject } from "../utils/types";
const { randomStr } = require("../utils/common");

// any should be replaced with user object

module.exports = function (): void {
    const { USERS, TOKENS } = this.tables;

    this.getUserByCredentials = ({
        email,
        password,
    }: CustomObject): CustomObject => {
        return this.query(
            `SELECT userId, password FROM ${USERS} WHERE email = ?;`,
            [email],
            false
        ).then((data: any) => {
            try {
                if (data.length) {
                    return bcrypt
                        .compare(password, data[0]["password"])
                        .then((valid: boolean) => {
                            if (valid) {
                                return this.createToken(data[0]["userId"]).then(
                                    (token: string) => {
                                        return { valid, token };
                                    }
                                );
                            } else {
                                this.db.destroy();
                                return { valid };
                            }
                        });
                } else {
                    this.db.destroy();
                    return {};
                }
            } catch (error) {
                this.logger.error(error);
                return {};
            }
        });
    };

    this.getUserByToken = (token: string): any => {
        return this.query(
            `SELECT userId FROM ${TOKENS} WHERE token = ? AND status = 1;`,
            [token],
            false
        );
    };

    this.updateUserById = ({ id, name }: CustomObject): Promise<any> => {
        return this.query(
            `UPDATE ${USERS} SET name = ? WHERE userId = ?;`,
            [name, id],
            false
        ).then(() =>
            this.query(`SELECT * FROM ${USERS} WHERE userId = ?;`, [
                id,
            ]).then((data: any) => (data.length ? data[0] : {}))
        );
    };

    this.getAllUsers = (): Array<any> => {
        return this.query(`SELECT * FROM ${USERS};`);
    };

    this.expireUserToken = (token: string): any => {
        return this.query(
            `UPDATE ${TOKENS} SET status = 0 WHERE userId = ? AND token = ?;`,
            [this.requester, token]
        );
    };

    this.createToken = (userId: number): Promise<string> => {
        const token = jwt.sign(
            {
                data: randomStr(16),
            },
            process.env.APP_SALT,
            { expiresIn: "1h" }
        );

        return this.query(
            `INSERT INTO ${TOKENS} (userId, token) VALUES (?, ?);`,
            [userId, token]
        ).then(() => token);
    };

    return this;
};
