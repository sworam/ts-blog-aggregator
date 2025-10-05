import { db } from "..";
import { feeds, User } from "../schema";
import { getUser } from "./users";

export async function createFeed(
    name: string,
    url: string,
    currentUser: User) {
    const userId = currentUser.id;
    try {
        const [result] = await db
            .insert(feeds)
            .values({ name: name, url: url, user_id: userId })
            .returning();
        return result;
    } catch (err) {
        throw new Error("could not insert into feeds");
    }
}
