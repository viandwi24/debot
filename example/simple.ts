import { Bot } from "https://raw.githubusercontent.com/viandwi24/debot/master/mod.ts";

// create new instance
let bot = new Bot;

// add trigger
bot.addTrigger("lamp:on", /turn on.*lamp.*/g, async (input: string) => {
    return "lamp turn on.";
});

// send input
let input = "Can you turn on the lamp now?";
let result = await bot.send(input);
console.log(
    `[You] : ${input}\n[Bot] : ${result}`
);


// this job will be executed every 1 second
bot.addTask('* * * * * *', () => {
    console.log("Hello World Every 1 Second!");
});

// This Job will be executed 1st day of every month at mid-night.
bot.addTask('1 0 0 1 */1 *', () => {
    console.log("Hello World!");
});

// 
bot.runTask();