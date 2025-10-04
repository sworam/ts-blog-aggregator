import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerLogin } from "./commands/users";

function main() {
    const registry: CommandsRegistry = {}
    registerCommand(registry, "login", handlerLogin);

    let args = process.argv.slice(2);
    if (args.length < 1) {
        console.log("no argument provided");
        process.exit(1);
    }

    const cmdName = args[0];
    args = args.slice(1);
    try {
        runCommand(registry, cmdName, ...args);
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        } else {
            console.log(err);
        }
        process.exit(1);
    }
}

main();
