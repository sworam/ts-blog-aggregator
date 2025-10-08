import { createFeedFollow, getFeed, getFeedFollows } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

export async function handlerFollow(_: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("usage: follow <feed_url>");
    }
    const [url] = args;
    const feed = await getFeed(url);
    const feedFollow = await createFeedFollow(user.id, feed.id);
    console.log(`ID: ${feedFollow.id}`);
    console.log(`Created at: ${feedFollow.createdAt}`);
    console.log(`Updated at: ${feedFollow.updatedAt}`);
    console.log(`UserName: ${feedFollow.userName}`);
    console.log(`FeedName: ${feedFollow.feedName}`);
}

export async function handlerFollowing(_: string, user: User) {
    const feedFollows = await getFeedFollows(user.id);
    for (const feedFollow of feedFollows) {
        console.log(`Feed: ${feedFollow.feedName}`);
    }
}
