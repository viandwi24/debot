import { Bot, Container, LooseObject } from "https://raw.githubusercontent.com/viandwi24/debot/master/mod.ts";

export async function extend(app: Container & LooseObject, bot: Bot) {    
    app.addProvider('example-module-provider', register, boot);
}

export async function register(app: Container & LooseObject, bot: Bot) {
    console.log("[ExampleModule] registered.");
}

export async function boot(app: Container & LooseObject, bot: Bot) {
    console.log("[ExampleModule] booted.");
}