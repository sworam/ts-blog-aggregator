import { readConfig } from "src/config";
import { createFeed, createFeedFollow, getFeed, getFeedFollows, getFeeds } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";
import { Feed, User } from "src/lib/db/schema";
import { fetchFeed } from "src/rss";

export async function getCurrentUser() {
    const config = readConfig()
    const currentUserName = config.currentUserName;
    const currentUser = await getUser(currentUserName);
    return currentUser;
}

export async function handlerAgg(cmdName: string, ...args: string[]) {
    const url = "https://www.wagslane.dev/index.xml";
    const feed = await fetchFeed(url);
    console.log(feed);
    for (const item of feed.channel.item) {
        console.log(item);
    }
}
export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error("usage: addfeed <feed_name> <feed_url>");
    }
    const currentUser = await getCurrentUser();
    const [feedName, feedUrl] = args;
    const feed = await createFeed(feedName, feedUrl, currentUser);
    await createFeedFollow(currentUser.id, feed.id);
    printFeed(feed, currentUser);
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

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    const feeds = await getFeeds();
    for (const feed of feeds) {
        console.log(`Feed: ${feed.name}`);
        console.log(`URL: ${feed.url}`);
        console.log(`User: ${feed.username}\n`);
    }
}

export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error("usage: follow <feed_url>");
    }
    const [url] = args;
    const feed = await getFeed(url)
    const currentUser = await getCurrentUser();
    const feedFollow = await createFeedFollow(currentUser.id, feed.id);
    console.log(`ID: ${feedFollow.id}`);
    console.log(`Created at: ${feedFollow.createdAt}`);
    console.log(`Updated at: ${feedFollow.updatedAt}`);
    console.log(`UserName: ${feedFollow.userName}`);
    console.log(`FeedName: ${feedFollow.feedName}`);
}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
    const currentUser = await getCurrentUser();
    const feedFollows = await getFeedFollows(currentUser.id);
    for (const feedFollow of feedFollows) {
        console.log(`Feed: ${feedFollow.feedName}`);
    }
}
