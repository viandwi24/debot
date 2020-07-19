import { Bot, Container } from "../deps.ts";
import { LooseObject } from "../../../foundation/container.ts";

// 
const root = Deno.cwd();

// make bot instance
const Sylvia = new Bot;
const app: Container & LooseObject = new Container(Sylvia, { basepath: root, configpath: "config" });

// load configuration file
await app.configure("module");
await app.configure("telegram");

// set data
app.bot.set("bot_name", "Sylvia");

// set lang and altnative reply
app.bot.lang["trigger:notfound"] = "no trigger found.";
app.bot.alternative.push("i am listening...");

// load module
await app.loadModule(app.config("module"));

// export
export { app };