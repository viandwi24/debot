import { Bot } from "../deps.ts";
import { Sylvia } from "../bootstrap/app.ts";

export async function extend(bot: Bot) {
    bot.addTask('* * * * * *', () => {
        console.log("Hello World, This is example module !");
    });
}