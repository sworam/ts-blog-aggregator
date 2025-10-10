import { eq } from "drizzle-orm";
import { db } from "..";
import { Feed, feeds, posts, User, users } from "../schema";

export async function createPost(
    title: string,
    url: string,
    description: string,
    publishedAt: Date,
    feed: Feed
) {
    try {
        const [result] = await db.insert(posts).values({
            title: title,
            url: url,
            description: description,
            publishedAt: publishedAt,
            feedId: feed.id,
        }).returning();
        return result;
    } catch (err) {
        throw new Error("could not insert into posts");
    }
}

export async function getPostsForUser(user: User, numPosts: number) {
    const results = await db.select().from(posts)
        .innerJoin(feeds, eq(feeds.id, posts.feedId))
        .innerJoin(users, eq(users.id, feeds.userId))
        .where(eq(users.id, user.id))
        .limit(numPosts);
    return results;
}
