import { and, eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";

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

export async function deleteFeedFollow(userId: string, feedId: string) {
    await db.delete(feedFollows)
        .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)));
}
