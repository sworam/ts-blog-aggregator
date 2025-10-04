import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
    try {
        const [result] = await db.insert(users).values({ name: name }).returning();
        return result;
    } catch (err) {
        throw new Error("could not createUser, username alredy exists");
    }
}

export async function getUser(name: string) {
    const [result] = await db.select().from(users).where(eq(users.name, name));
    return result;
}

export async function resetUsers() {
    await db.delete(users);
}

export async function getUsers() {
    const result = await db.select().from(users);
    return result;
}
