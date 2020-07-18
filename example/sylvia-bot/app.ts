import { Sylvia } from "./bootstrap/app.ts";

// welcome text
console.log(
    `[${Sylvia.get('bot_name')} Running]`
);

// run task
Sylvia.runTask();