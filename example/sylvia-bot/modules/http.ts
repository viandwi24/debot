import { Bot } from "../deps.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

export async function extend(bot: Bot) {
    bot.addTask('* * * * * *', async () => {
        // get state
        let state = bot.get("http_state", false);

        // if state true dont run
        if (state) return ;

        // set state to true
        bot.set("http_state", true);

        // http server
        const app = new Application();
        const router = new Router();

        // 
        router.get("/", (context) => {
            context.response.body = "Hello world!";
        });
        router.get("/test", (context) => {
            context.response.body = "wkwkw";
        });

        // 
        app.addEventListener("listen", ({ hostname, port, secure }) => {
            console.log(
                `[HTTP] Listening on: ${secure ? "https://" : "http://"}${
                hostname ?? "localhost"
                }:${port}`
            );
        });

        // 
        app.use(router.routes());
        app.use(router.allowedMethods());

        // 
        await app.listen({ port: 8000 });
    });
}