export {};
const fs = require("fs");

import { CustomObject } from "./types";

module.exports = function (dir: string): CustomObject {
    const loadedModules: CustomObject = {};

    try {
        const modules = fs.readdirSync(`./app/${dir}`);

        modules.forEach((module: string) => {
            module = module.replace(".js", "").replace(".ts", "");
            if (["index", "autoload"].indexOf(module) === -1)
                loadedModules[module] = require(`../${dir}/${module}`);
        });
    } catch (error) {
        console.log(error);
    }

    return loadedModules;
};
