export {};

export type CustomObject = {
    [key: string]: any;
};

export interface ServiceProvider {
    inject(func: Function): Function;
    model(model: string): Function | void;
    get(dependency: string | string[]): any;
    register(serviceName: string, service: any, bind?: boolean): void;
}
