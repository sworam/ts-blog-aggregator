import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { Feed, feeds, User, users } from "../schema";

export async function createFeed(
    name: string,
    url: string,
    currentUser: User) {
    console.log(currentUser);
    const userId = currentUser.id;
    try {
        const [result] = await db
            .insert(feeds)
            .values({ name: name, url: url, userId: userId })
            .returning();
        return result;
    } catch (err) {
        throw new Error("could not insert into feeds");
    }
}

export async function getFeeds() {
    const results = await db.select({ name: feeds.name, url: feeds.url, username: users.name })
        .from(feeds)
        .innerJoin(users, eq(feeds.userId, users.id));
    return results;
}

export async function getFeed(url: string) {
    try {
        const [result] = await db.select()
            .from(feeds)
            .where(eq(feeds.url, url));
        return result;
    } catch (err) {
        throw new Error(`feed with url: ${url} does not exist!`);
    }
}

export async function markFeedFetched(feedId: string) {
    await db.update(feeds)
        .set({ updatedAt: sql`NOW()`, lastFetchedAt: sql`NOW()` })
        .where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch(): Promise<Feed> {
    const [result] = await db.execute(sql`SELECT * FROM ${feeds} ORDER BY ${feeds.lastFetchedAt} ASC NULLS FIRST LIMIT 1`);
    return result as Feed;
}
