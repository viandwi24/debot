import { Bot } from "../deps.ts";
import { loadConfig, loadModule } from "./helper.ts";

// 
const root = Deno.cwd();

// make bot instance
const Sylvia = new Bot;

// set data
Sylvia.set("bot_name", "Sylvia");

// set lang and altnative reply
Sylvia.lang["trigger:notfound"] = "no trigger found.";
Sylvia.alternative.push("i am listening...");

// 
let modules = await loadConfig(`${root}/config/module.ts`);
await loadModule(modules, Sylvia);

// 

// export
export { Sylvia };