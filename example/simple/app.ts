import { Bot } from "../../mod.ts";
import { StdFlags } from "../../deps.ts";

const bot = makeBot();
const parsedArgs: StdFlags.Args = StdFlags.parse(Deno.args);

if (typeof parsedArgs['send'] != 'undefined') {
    let text = parsedArgs['send'];
    let output = await bot.send(text);
    console.log(`[You] : ${text}`);
    console.log(`[Bot] : ${output}`);
    Deno.exit();
} else if (typeof parsedArgs._.find((e:any) => e === "start") != "undefined") {
    bot.runTask();
}


function makeBot() {
    // make bot instance
    let bot = new Bot;

    // make alternative reply
    bot.alternative.push("Iam listening...");

    // lang
    bot.lang["trigger:notfound"] = "I dont understand what you mean.";

    // data
    bot.set("count", 0);

    // add middleware
    bot.addMiddleware('safe-word-replace', (next: Function, input: string) => {
        input = input.replace(/ a /g, " ");
        return next(input);
    });

    // add trigger
    bot.addTrigger("lamp:on", /turn on.*lamp.*/g, async (input: string) => {
        return "lamp turn on.";
    });
    bot.addTrigger("lamp:off", /turn off.*lamp.*/g, async (input: string) => {
        return "lamp turn off.";
    });

    // add task
    bot.addTask('*/1 * * * * *', () => {
        let count = bot.get("count");
        console.log(`Count - ${count}`);
        bot.set("count", count+1);
    });    

    // add brain
    return bot;
}