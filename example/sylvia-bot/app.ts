import { app } from "./bootstrap/app.ts";
import { ERunProvider } from "./deps.ts";
import { my } from "./scripts/my.ts";

// welcome text
console.log(
    `[${app.bot.get('bot_name')} Bot Running]`
);

// register  provider
await app.runProvider(ERunProvider.REGISTER);

// your custom script
await my(app);

// boot  provider
await app.runProvider(ERunProvider.BOOT);

// run task
app.bot.runTask();