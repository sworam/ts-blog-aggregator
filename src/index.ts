import { handlerAgg } from "./commands/aggregation";
import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerFollow, handlerFollowing } from "./commands/feed-follows";
import { handlerAddFeed, handlerFeeds } from "./commands/feeds";
import { handlerResetUsers } from "./commands/reset";
import { handlerLogin, handlerRegister, handlerUsers } from "./commands/users";
import { middlewareLoggedIn } from "./middleware";

async function main() {
    const registry: CommandsRegistry = {}
    registerCommand(registry, "login", handlerLogin);
    registerCommand(registry, "register", handlerRegister);
    registerCommand(registry, "reset", handlerResetUsers);
    registerCommand(registry, "users", handlerUsers);
    registerCommand(registry, "agg", handlerAgg);
    registerCommand(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
    registerCommand(registry, "feeds", middlewareLoggedIn(handlerFeeds));
    registerCommand(registry, "follow", middlewareLoggedIn(handlerFollow));
    registerCommand(registry, "following", middlewareLoggedIn(handlerFollowing));

    let args = process.argv.slice(2);
    if (args.length < 1) {
        console.log("no argument provided");
        process.exit(1);
    }

    const cmdName = args[0];
    args = args.slice(1);
    try {
        await runCommand(registry, cmdName, ...args);
    } catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
        } else {
            console.log(err);
        }
        process.exit(1);
    }
    process.exit(0);
}

main();
