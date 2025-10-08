import { fetchFeed } from "src/rss";

export async function handlerAgg(_: string) {
    const url = "https://www.wagslane.dev/index.xml";
    const feed = await fetchFeed(url);
    console.log(feed);
    for (const item of feed.channel.item) {
        console.log(item);
    }
}


