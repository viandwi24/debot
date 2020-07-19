import { Bot } from "./bot.ts";
import { require } from "../support/require.ts";
import { exists } from "../support/path.ts";
import { app } from "../example/sylvia-bot/bootstrap/app.ts";
import { register } from "../example/sylvia-bot/modules/telegram.ts";

export interface IContainerOptions {
    basepath?: string;
    configpath?: string;
}

export interface LooseObject {
    [key: string]: any
}

export interface IProvider {
    name: string;
    registerCallback: Function;
    bootCallback: Function;
}

export enum ERunProvider {
    REGISTER = 'register',
    BOOT = 'boot'
}

export class Container implements LooseObject {
    private basepath = '';
    private configpath = '';
    private configs: Record<string,any> = {};
    private providers: Array<IProvider> = [];
    private providersRegistered: Array<IProvider> = [];
    private providersBooted: Array<IProvider> = [];

    
    /**
     * Create a container
     * @param  {Bot} publicbot
     * @param  {IContainerOptions} options?
     */
    public constructor (public bot: Bot, options?: IContainerOptions) {
        this.basepath = ((options?.basepath) ? options.basepath : Deno.cwd()) + "/";
        this.configpath = ((options?.configpath) ? options.configpath : 'config') + "/";
    }
    
    
    /**
     * Load module
     * @param  {string[]} modules
     * @returns Promise
     */
    public async loadModule(modules: string[]) : Promise<void> {
        for(let key in modules) {
            let path = modules[key];
            if (!await exists(path)) {
                console.error(`Module "${path}" Not Loaded because not found.`);
                continue;
            }
    
            // 
            let module: any;
            try {
                module = await require(path); 
            } catch (error) {
                console.error(`Module "${path}" Not Loaded because error when load.`);
                console.error(error);
                continue;
            }
    
            // 
            if (typeof module['extend'] == 'undefined') {
                console.error(`Module "${path}" Not Loaded because not export "extend" method.`);
                continue;
            }
    
            // 
            try {
                module.extend(this, this.bot);
            } catch (error) {
                console.error(`Extend Module "${path}" Failed because have an error.`);
                console.error(error);
            }
        }
    }

    
    /**
     * Register provider
     * @param  {string} name
     * @param  {Function} callback
     * @returns Promise
     */
    public async addProvider(name: string, registerCallback: Function, bootCallback: Function) : Promise<void> {
        this.providers.push({name, registerCallback, bootCallback} as IProvider);
    }

    
    /**
     * Run a provider
     * @param  {string} mode?
     */
    public async runProvider(mode?: string) {
        let providers = this.providers;

        // 
        if (typeof mode == "undefined") {
            this.providersRegistered = await this.registerProvider(providers);
            this.providersBooted = await this.bootProvider(this.providersRegistered);
        } else {
            if (mode == "register") this.providersRegistered = await this.registerProvider(providers);
            if (mode == "boot") this.providersRegistered = await this.bootProvider(this.providersRegistered);
        }
    }

    
    /**
     * Registering provider
     * @param  {Array<IProvider>} providers
     */
    private async registerProvider(providers: Array<IProvider>) {
        let registered = [];
        for (let i in providers) {
            let provider = providers[i];
            try {
                await provider.registerCallback(this, this.bot);
                registered.push(provider);
            } catch (error) {
                console.error(`Error on register provider "${provider.name}".`);
                console.error(error);
            }
        }
        return registered;
    }

    
    /**
     * Booting provider
     * @param  {Array<IProvider>} registered
     */
    private async bootProvider(registered: Array<IProvider>) {
        let booted = [];
        for (let i in registered) {
            let provider: IProvider = registered[i];
            try {
                await provider.bootCallback(this, this.bot);
                booted.push(provider);
            } catch (error) {
                console.error(`Error on boot provider "${provider.name}".`);
                console.error(error);
            }
        }
        return booted;
    }

    
    /**
     * Load configuration file
     * @param  {string} file
     * @returns Promise<boolean>
     */
    public async configure(file: string) : Promise<boolean> {
        let path = this.basepath +
                this.configpath + file + ".ts";
        try {
            let config = (await require(path)).default;
            this.configs[file] = config;
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get a config
     * @param  {string} key
     * @param  {any} defaultIfNull?
     * @returns undefined
     */
    public config(key: string, defaultIfNull?: any) : undefined|any {
        let configs = (Object.entries(this.configs));
        let keys = key.split(".");
        for (let i in configs) {
            if (configs[i][0] == keys[0]) {
                if (keys.length > 1) {
                    let result = configs[i][1];
                    for (let i in keys) {
                        if (i == "0") continue;
                        if (
                            typeof result[keys[i]] != "undefined"
                        ) {
                            result = result[keys[i]];
                        }
                    }
                    return result;
                }
                return configs[i][1];
            }
        }
        return (typeof defaultIfNull == "undefined") 
            ? undefined
            : defaultIfNull;
    }
}