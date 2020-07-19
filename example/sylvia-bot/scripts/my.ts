import { Container, LooseObject } from "../deps.ts";
import { TelegramBot, Message } from "https://deno.land/x/telegram_bot_api/mod.ts";
import { Router } from "https://deno.land/x/oak/mod.ts";

export async function my(app: Container & LooseObject) {
    // 
    let router:Router = app.router;
    router.get("/my-api", (context) => {
        context.response.body = "Hello world! This is my custom api.";
    });

    // 
    let iots: Array<any> = [];
    app.bot.addTrigger("my-iot", /myiot/g, async (input: string, params: any) => {
        // 
        if (typeof params.telebot == "undefined") return undefined;
        if (typeof params.message == "undefined") return undefined;

        // 
        let result = "List Your Iot :\n";
        let i = 0;
        iots.forEach((item: any) => {
            i++;
            result += `${i}. ${item.name} [${item.token}]\n`;
        });
        
        // 
        let telebot: TelegramBot = params.telebot;
        let message: Message = params.message;
        await telebot.sendMessage({
            chat_id: message.chat.id,
            text: result
        });

        // 
        return false;
    });
    app.bot.addTrigger("add-iot", /addiot/g, async (input: string, params: any) => {
        // 
        if (typeof params.telebot == "undefined") return undefined;
        if (typeof params.message == "undefined") return undefined;

        // 
        let telebot: TelegramBot = params.telebot;
        let message: Message = params.message;
        // await telebot.sendMessage({
        //     chat_id: from.id,
        //     text,
        // });    
        // await telebot.answerCallbackQuery({
        //     callback_query_id: id
        // });

        // 
        return false;
    });
}