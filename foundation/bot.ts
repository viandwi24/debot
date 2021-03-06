// Copyright 2020 the Debot authors. All rights reserved. MIT license.
import { Cron } from "./../deps.ts";

type JobType = () => void;

export interface IMiddleware {
    name: string;
    callback: Function;
}

export interface ITrigger {
    name: string;
    pattern: RegExp;
    callback: Function;
}

export interface IMethod {
    name: string;
    callback: Function;
}

export class Bot {
    /** alternative */
    public alternative: Array<string> = [];  

    /** language */
    public lang: Record<string,string> = {
        "trigger:notfound": "no trigger found."
    };

    /** middleware */
    private middleware: Array<IMiddleware> = [];

    /** trigger */
    private trigger: Array<ITrigger> = [];

    /** method */
    private method: Array<IMethod> = [];

    /** storage */
    private data: Record<string,any> = {};

    /**
     * Send input to bot
     * @param {string} input 
     * @returns {string} return reply from bot
     */
    public async send(input: string, params?: any): Promise<string|null> {
        input = this.makeWordSafe(input);
        input = await this.runMiddleware(input);
        let result = await this.runTrigger(input, params);
        if (typeof result != "string" && typeof result != "undefined") return null;
        return (typeof result == "undefined")
            ? this.__e("trigger:notfound")
            : result;
    }

    
    /**
     * Add middleware for input
     * @param  {string} name
     * @param  {Function} callback
     * @returns void
     */
    public addMiddleware(name: string, callback: Function): void {
        this.middleware.push({ name, callback } as IMiddleware);
    }

    /**
     * Add trigger bot
     * @param  {string} name
     * @param  {string|RegExp} pattern
     * @param  {Function} callback
     * @returns void
     */
    public addTrigger(name: string, pattern: string|RegExp, callback: Function): void {
        if (typeof pattern == "string") pattern = new RegExp(pattern);
        this.trigger.push({ name, pattern, callback } as ITrigger);
    }

    /**
     * Add method bot
     * @param  {string} name
     * @param  {Function} callback
     * @returns void
     */
    public addMethod(name: string, callback: Function): void {
        this.method.push({ name, callback } as IMethod);
    }
    
    
    /**
     * Add task
     * @param  {string|undefined} schedule
     * @param  {JobType} job
     * @returns void
     */
    public addTask(schedule: string | undefined, job: JobType): void {
        return Cron.add(schedule, job);
    }
    
    /**
     * Run a task
     * @returns void
     */
    public runTask(): void {
        return Cron.runScheduler();
    }

    /**
     * @param  {string} text
     * @returns string
     */
    private makeWordSafe(text: string): string {
        text = text.toLowerCase().replace(/[^\w\s\d]/gi, "");
        return text;
    }

    /**
     * Run a middleware
     * @param  {string} input
     * @returns Promise<string>
     */
    private async runMiddleware(input: string): Promise<string> {
        let middlewares: Array<IMiddleware> = [...this.middleware];
        
        const next: Function = async (inputMd: string|undefined) => {
            const result: string = (typeof inputMd == 'undefined') ? input : inputMd;

            if (middlewares.length > 0) {
                let md: IMiddleware|undefined;
                try {
                    md = middlewares.find((e: IMiddleware) => e.name === middlewares[0].name);
                } catch (e) {
                    throw new Error(e);
                }

                middlewares.splice(0, 1);
                return md?.callback(
                    next,
                    result
                );
            } else {
                return result;
            }
        };    

        return await next(input);
    }

    /**
     * Run a trigger
     * @param  {string} input
     * @returns Promise<any>
     */
    private async runTrigger(input: string, params?: any): Promise<any> {
        let trigger = this.trigger.find( (e: ITrigger) => (e.pattern.test(input)) );
        return (typeof trigger == "undefined")
            ? undefined
            : await trigger.callback(input, params);
    }

    
    /**
     * Call trigger
     * @param  {string} name
     * @param  {string} input
     * @param  {any} params?
     * @returns Promise<undefined|any>
     */
    public async callTrigger(name: string, input: string, params?: any) : Promise<undefined|any>
    {
        let trigger = this.trigger.find( (e: ITrigger) => (e.name === name) );
        return (typeof trigger == "undefined")
            ? undefined
            : await trigger.callback(input, params);
    }

    
    /**
     * Call method
     * @param  {string} name
     * @param  {any} ...params
     * @returns Promise
     */
    public async run(name: string, ...params: any) : Promise<undefined|any>
    {
        let method = this.method.find( (e: IMethod) => (e.name === name) );
        return (typeof method == "undefined")
            ? undefined
            : await method.callback(...params);
    }
    
    /**
     * Parse language
     * @param  {string} key
     */
    private __e(key: string) {
        let result = this.lang[key];
        return (typeof result == "undefined")
            ? key
            : result;
    }
    
    /**
     * Set data
     * @param  {string} key
     * @param  {any} value
     */
    public set(key: string, value: any) {
        this.data[key] = value;
    }
    
    /**
     * Get data
     * @param  {string} key
     * @param  {any=null} defaultValue
     */
    public get(key: string, defaultValue: any = null) {
        let value = this.data[key];
        if (typeof value == 'undefined') return defaultValue;
        return value;
    }
}