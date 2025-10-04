import { setUser } from "./config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = {
    commands: Record<string, CommandHandler>;
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry.commands[cmdName] = handler;
    return registry;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    if (!(cmdName in registry.commands)) {
        throw new Error("unknown command");
    }
    registry.commands[cmdName](cmdName, ...args);
}

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("expecting username as argument");
    }

    const userName = args[0];
    setUser(userName);
    console.log(`Username has been set to ${userName}`);
}
