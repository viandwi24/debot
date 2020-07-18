import { Bot } from "../deps.ts";

/**
 * Import a file local with async
 * 
 * @param path 
 */
export async function require(path: string) {
    let regLocal = new RegExp('file:///');
    let regOnline = new RegExp('http://|https://');
    if (!regLocal.test(path) && !regOnline.test(path)) {
        path = "file:///" + path;
    }
    return await import(path);
}

export async function loadConfig(path: string) {
    let config;
    try {
        config = (await require(path)).default;
    } catch (error) {
        config = [];
    }
    return config;
}

export async function loadModule(modules: string[], bot: Bot) {
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
            module.extend(bot);
        } catch (error) {
            console.log(error);
        }
    }
}

export async function exists(filename: string) : Promise<boolean> {
    try {
        await Deno.stat(filename);
        return true;
    } catch (error) {
        return false;
    }
  };