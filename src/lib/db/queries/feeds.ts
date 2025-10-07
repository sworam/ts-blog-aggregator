import { eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, User, users } from "../schema";

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

export async function createFeedFollow(userId: string, feedId: string) {
    try {
        const [newFeedFollow] = await db.insert(feedFollows).values({ userId, feedId }).returning();
        const [result] = await db.select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            feedName: feeds.name,
            userName: users.name,
        })
            .from(feedFollows)
            .where(eq(feedFollows.id, newFeedFollow.id))
            .innerJoin(users, eq(feedFollows.userId, users.id))
            .innerJoin(feeds, eq(feedFollows.feedId, feeds.id));
        return result;
    } catch (err) {
        throw new Error("could not insert into feed_follows");
    }
}

export async function getFeedFollows(userId: string) {
    const queriedFeedFollows = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        feedName: feeds.name,
        userName: users.name,
    })
        .from(feedFollows)
        .where(eq(feedFollows.userId, userId))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id));
    return queriedFeedFollows;
}
