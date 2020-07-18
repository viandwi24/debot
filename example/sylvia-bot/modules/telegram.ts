import { Bot } from "../deps.ts";
import { loadConfig } from "../bootstrap/helper.ts";
import {
    TelegramBot,
    UpdateType,
  } from "https://deno.land/x/telegram_bot_api/mod.ts";

export async function extend(bot: Bot) {
    bot.addTask('* * * * * *', async () => {
        // get state
        let state = bot.get("telegram_state", false);

        // if state true dont run
        if (state) return ;

        // set state to true
        bot.set("telegram_state", true);

        // 
        let config = await loadConfig(`telegram.ts`)
        let telebot = new TelegramBot(config.API_KEY);

        // 
        await telebot.deleteWebhook();

        // 
        telebot.run({
            polling: {
                timeout: 30,
            },
        });

        // 
        telebot.on(UpdateType.Message, async ({ message }) => {
            const chatId = message.chat.id;
            console.log(
                `[Telegram] [${message.chat.username}] ${message.text}`
            );
            if (message.text) bot.send(message.text);
        });

        // 
        console.log("[Telegram] Bot Running.");
    });
};