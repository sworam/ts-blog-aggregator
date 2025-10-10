import { createFeedFollow } from "src/lib/db/queries/feed-follows";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { Feed, User } from "src/lib/db/schema";

export async function handlerAddFeed(_: string, user: User, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error("usage: addfeed <feed_name> <feed_url>");
    }
    const [feedName, feedUrl] = args;
    const feed = await createFeed(feedName, feedUrl, user);
    await createFeedFollow(user.id, feed.id);
    printFeed(feed, user);
}

function printFeed(feed: Feed, user: User) {
    console.log(`Feed: ${feed.name}`);
    console.log(`Created at: ${feed.createdAt}`);
    console.log(`Updated at: ${feed.updatedAt}`);
    console.log(`URL: ${feed.url}`);
    console.log(`ID: ${feed.id}`);
    console.log(`User_ID: ${feed.userId}`);
    console.log(`User: ${user.name}`);
    console.log(`Created at: ${user.createdAt}`);
    console.log(`Updated at: ${user.updatedAt}`);
    console.log(`ID: ${user.id}`);
}

export async function handlerFeeds(_: string) {
    const feeds = await getFeeds();
    for (const feed of feeds) {
        console.log(`Feed: ${feed.name}`);
        console.log(`URL: ${feed.url}`);
        console.log(`User: ${feed.username}\n`);
    }
}
