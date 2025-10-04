import { setUser } from "src/config";

export type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = Record<string, CommandHandler>;

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
    return registry;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    if (!(cmdName in registry.commands)) {
        throw new Error("unknown command");
    }
    registry[cmdName](cmdName, ...args);
}

