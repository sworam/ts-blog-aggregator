import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { Feed } from "src/lib/db/schema";
import { fetchFeed } from "src/rss";

export async function handlerAgg(_: string, ...args: string[]) {
    // const url = "https://www.wagslane.dev/index.xml";
    // const feed = await fetchFeed(url);
    // console.log(feed);
    // for (const item of feed.channel.item) {
    //     console.log(item);
    // }
    if (args.length !== 1) {
        throw new Error("usage: agg <duration_string>");
    }
    const [durationString] = args;
    const duration = parseDuration(durationString);

    scrapeFeeds();
    const interval = setInterval(() => {
        scrapeFeeds();
    }, duration);

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}

async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();
    if (!feed) {
        console.log("No feeds to fetch.");
        return;
    }
    console.log("Found feed to fetch");
    scrapeFeed(feed);
}

async function scrapeFeed(feed: Feed) {
    await markFeedFetched(feed.id);
    const fetchedFeed = await fetchFeed(feed.url);
    for (const item of fetchedFeed.channel.item) {
        console.log(item.title);
    }
}

function parseDuration(durationString: string) {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationString.match(regex);
    if (!match) {
        throw new Error("duration_string invalid. must match '^(\d+)(ms|s|m|h)$'");
    }
    const amountStr = match[1];
    const amount = parseInt(amountStr);
    const unit = match[2];
    let totalMS = 0;
    switch (unit) {
        case "ms":
            totalMS = amount;
            break;
        case "s":
            totalMS = amount * 1000;
            break;
        case "m":
            totalMS = amount * 1000 * 60;
            break;
        case "h":
            totalMS = amount * 1000 * 60 * 60;
    }
    return totalMS;
}
