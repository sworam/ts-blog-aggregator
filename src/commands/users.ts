import { createUser, getUser, getUsers } from "src/lib/db/queries/users";
import { readConfig, setUser } from "../config"

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

export async function handlerUsers(cmdName: string, ...args: string[]) {
    const users = await getUsers();
    const config = readConfig();
    for (const user of users) {
        const isCurrent = user.name === config.currentUserName;
        console.log(` * ${user.name}${isCurrent ? " (current)" : ""}`);
    }
}
