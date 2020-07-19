import { Bot, Container, LooseObject } from "../deps.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

export interface http {
    application: Application;
    router: Router;
}

export async function extend(app: Container & LooseObject, bot: Bot) {    
    app.addProvider('http-provider', register, boot);
}

export async function register(app: Container & LooseObject, bot: Bot) {
    // get state
    let state = bot.get("http_state", false);

    // http server
    const http = new Application();
    const router = new Router();

    // 
    router.get("/", (context) => {
        context.response.body = "Hello world!";
    });
    router.get("/test", (context) => {
        context.response.body = "wkwkwkwk land.";
    });

    // 
    app.http = http;
    app.router = router;
}

export async function boot(app: Container & LooseObject, bot: Bot) {
    // 
    const http: Application = app.http;
    const router: Router = app.router;

    // 
    http.addEventListener("listen", ({ hostname, port, secure }) => {
        bot.set("http_state", true);
        console.log(
            `[HTTP] Listening on: ${secure ? "https://" : "http://"}${
            hostname ?? "localhost"
            }:${port}`
        );
    });

    // 
    http.use(router.routes());
    http.use(router.allowedMethods());

    // 
    http.listen({ port: 8000 });
}