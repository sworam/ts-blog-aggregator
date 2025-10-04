import { createUser, getUser } from "src/lib/db/queries/users";
import { setUser } from "../config"

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("expecting username as argument");
    }

    const userName = args[0];
    const user = await getUser(userName);
    console.log(user);
    if (!user) {
        throw new Error(`User ${userName} does not exist!`);
    }
    setUser(userName);
    console.log(`Username has been set to ${userName}`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("expecting username as argument");
    }

    const userName = args[0];
    await createUser(userName);
    setUser(userName);
    console.log(`User has been registered: ${userName}`);
    const user = await getUser(userName);
    console.log(user);
}
