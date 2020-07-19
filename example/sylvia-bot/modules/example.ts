import { Bot } from "../deps.ts";

export async function extend(bot: Bot) {
    bot.addTask('* * * * * *', () => {
        console.log("Hello World, This is example module !");
    });
}