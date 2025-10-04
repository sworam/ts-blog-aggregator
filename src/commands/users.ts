import { setUser } from "../config"

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("expecting username as argument");
    }

    const userName = args[0];
    setUser(userName);
    console.log(`Username has been set to ${userName}`);
}
