import { resetUsers } from "../lib/db/queries/users"
export async function handlerResetUsers(cmdName: string, ...args: string[]) {
    await resetUsers();
    console.log(`Reset the users table!`);
}
