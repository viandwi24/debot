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
    bot.alternative.push("Aku mendengarmu...");

    // lang
    bot.lang["trigger:notfound"] = "Aku tidak tahu maksudmu.";

    // data
    bot.set("count", 0);

    // add middleware
    bot.addMiddleware('word-replace', (next: Function, input: string) => {
        input = input.replace(/ sebuah /g, " ")
            .replace(/tolong /g, "")
            .replace(/ tolong/g, "");
        return next(input);
    });

    // add trigger
    bot.addTrigger("lamp:on", /hidup.*lampu/g, async (input: string) => {
        return "Lampu dihidupkan";
    });
    bot.addTrigger("lamp:off", /matikan.*lampu/g, async (input: string) => {
        return "Lampu dimatikan";
    });

    // add task
    bot.addTask('*/1 * * * * *', () => {
        let count = bot.get("count");

        if (count % 10 == 0) console.log("h3h3");
        bot.set("count", count+1);
    });    

    // add brain
    return bot;
}