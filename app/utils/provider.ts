export {};
const fs = require("fs");

import { CustomObject, ServiceProvider } from "./types";

const dependencies: CustomObject = {};

class Provider implements ServiceProvider {
    register(serviceName: string, service: any, bind = false): any {
        dependencies[serviceName] = bind ? service.bind(this) : service;
    }

    inject(func: Function): Function {
        return func.bind({ ...dependencies });
    }

    get(dependency: string | string[]): any {
        if (Array.isArray(dependency)) {
            const services: CustomObject = {};
            dependency.forEach((service) => {
                services[service] = dependencies[service]
                    ? dependencies[service]
                    : null;
            });

            return services;
        } else {
            return dependencies[dependency] ? dependencies[dependency] : null;
        }
    }

    model(model: string): Function | void {
        try {
            if (
                fs.existsSync(`${process.env.APP_ROOT}/app/models/${model}.js`)
            ) {
                return this.inject(require(`../models/${model}`));
            } else throw new Error(`${model} Model not found`);
        } catch (error) {
            const logger = this.get("logger");
            logger ? logger.error(error) : console.log(error);
        }
    }
}

module.exports = Provider;
