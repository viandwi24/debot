# Debot
Debot is a framework to help you build a bot.

![screenshot preview](https://raw.githubusercontent.com/viandwi24/debot/master/ss.png)




# Table Of Content
<!--ts-->
   * [Features](#features)
   * [Simple Example](#simple-example)
   * [Trigger](#trigger)
   * [Middleware](#middleware)
   * [Task](#task)
   * [Advanced Usage With Simple Framework](#advanced-usage-with-simple-framework)
      * [Scaffolding](#scaffolding)
      * [Module](#module)
      * [Running](#running)
<!--te-->

## Features
* Debot captures input and then uses triggers to process it.
* Middleware
* Running Tasks Like Cron
* Simple Global Data / State
* add other people's scripts easily as a Module

## Simple Example
You can import library from :
```
import { Bot } from "https://raw.githubusercontent.com/viandwi24/debot/master/mod.ts";
```

And then make 'app.ts' file and write this :
```
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
```

Run your script with :
```
deno run -A app.ts
```

And you get this in your terminal :
```
[You] : Can you turn on the lamp now?
[Bot] : lamp turn on.
```

## Trigger 
Trigger is a function that will be run when an input match with a specified regex pattern.
```
// add new trigger
bot.addTrigger("lamp:on", /turn on.*lamp.*/g, async (input: string) => {
    return "lamp turn on.";
});

// send input
let result = await bot.send(input);
console.log(result);
```

## Middleware
Middleware can help you filter user input before it is forwarded to the trigger.
```
bot.addMiddleware('safe-word-replace', (next: Function, input: string) => {
    input = input.replace(/ fuck /g, " ");
    return next(input);
});
```

## Task
You can make a task with time template like Cron.
```
// this job will be executed every 1 second
bot.addTask('* * * * * *', () => {
    console.log("Hello World Every 1 Second!");
});

// This Job will be executed 1st day of every month at mid-night.
bot.addTask('1 0 0 1 */1 *', () => {
    console.log("Hello World!");
});

// run task
bot.runTask();
```


## Advanced Usage With Simple Framework
### Scaffolding
You can clone this git repo
```
git clone https://github.com/viandwi24/debot.git
```
And delete all folder except `example/sylvia-bot`.
or, you can cd to this folder.
```
cd debot/example/sylvia-bot
```
And, you see this structure of folder :
```
example/sylvia-bot
.
├── bootstrap
│   └── app.ts
├── config
│   ├── module.ts
│   └── telegram.ts
├── modules
│   ├── example.ts
│   ├── http.ts
│   └── telegram.ts
├── scripts
│   └── my.ts
├── app.ts
└── deps.ts
```
For run a bot, use this :
```
deno run -A app.ts
```

### Module
Simple add module to framework, first make your file like `mymodule.ts :
```
import{
    Bot, Container
} from "https://raw.githubusercontent.com/viandwi24/debot/master/mod.ts";

export async function extend(app: Container, bot: Bot) {    
    app.addProvider('mymodule-provider', register, boot);
}

export async function register(app: Container, bot: Bot) {
    console.log("[ExampleModule] registered.");
}

export async function boot(app: Container, bot: Bot) {
    console.log("[ExampleModule] booted.");
}
```

And then, add your module to module register config, in `config/module.ts`, add your module :
```
const root = Deno.cwd();
export default [
    // 'https://raw.githubusercontent.com/viandwi24/debot/master/module/example-module.ts',
    `${root}/modules/http.ts`,
    `${root}/modules/telegram.ts`,
    `${root}/modules/mymodule.ts`
    // `${root}/modules/example.ts`,
];
```

### Running
before everything is run, this bot is prepared in `bootstrap / app.ts`. you can see it.  
* Make Container
```
import { Bot, Container, LooseObject } from "../deps.ts";

// 
const root = Deno.cwd();

// make bot instance
const Sylvia = new Bot;
const app: Container & LooseObject = new Container(Sylvia, { basepath: root, configpath: "config" });
```
* Load configuration file
```
await app.configure("module");
await app.configure("telegram");
```

* Load module
```
// load module
await app.loadModule(app.config("module"));
```

* Register and Boot provider
```
import { ERunProvider } from "./deps.ts";
await app.runProvider(ERunProvider.REGISTER);
await app.runProvider(ERunProvider.BOOT);
```

* And Then Run Task
```
// run task
app.bot.runTask();
```