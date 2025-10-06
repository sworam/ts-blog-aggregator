import { eq } from "drizzle-orm";
import { db } from "..";
import { feeds, User, users } from "../schema";
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

export async function getFeeds() {
    const results = await db.select({ name: feeds.name, url: feeds.url, username: users.name })
        .from(feeds)
        .innerJoin(users, eq(feeds.user_id, users.id));
    return results;
}
