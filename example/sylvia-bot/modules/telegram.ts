import { Bot, Container } from "../deps.ts";
import {
    TelegramBot,
    UpdateType,
  } from "https://deno.land/x/telegram_bot_api/mod.ts";
import { LooseObject } from "../deps.ts";

export async function extend(app: Container & LooseObject, bot: Bot) {
    app.addProvider('telegram-provider', register, boot);
};

export async function register(app: Container & LooseObject, bot: Bot) {

        // 
        let telegrambot = new TelegramBot(app.config("telegram.API_KEY"));

        // 
        await telegrambot.deleteWebhook();

        // 
        telegrambot.run({
            polling: {
                timeout: 30,
            },
        });

        // 
        telegrambot.on(UpdateType.Message, async ({ message }) => {
            const chat_id = message.chat.id;

            console.log(
                `[Telegram] ${message.chat.username} : ${message.text}`
            );
            if (message.text) {
                let text = await bot.send(message.text, { telegrambot, message });
                if (typeof text != "undefined" && text != null) {
                    if (text == bot.lang["trigger:notfound"]) text = "I do not understand what you mean.";
                    await telegrambot.sendMessage({
                        chat_id,
                        text
                    });
                }
            }
        });

        // 
        app.telegrambot = telegrambot;
}

export async function boot(app: Container & LooseObject, bot: Bot) {
    console.log("[Telegram] Bot Running.");
}