import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

export async function fetchFeed(feedURL: string) {
    const response = await fetch(feedURL, {
        method: "GET",
        headers: {
            "User-Agent": "gator",
        }
    });
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const xmlData = await response.text();
    const xmlObject = parseXML(xmlData);
    console.log(xmlObject);
    return extractRSSFeed(xmlObject);
}

function parseXML(xmlString: string) {
    const parser = new XMLParser();
    return parser.parse(xmlString);
}

function extractRSSFeed(xmlData: any) {
    const { channel, title, link, description } = validateMetadata(xmlData);
    const rssItems = extractRSSItems(channel);
    // assemble rssfeed and rssitems and return
    const feed: RSSFeed = {
        channel: {
            title,
            link,
            description,
            item: rssItems,
        }
    }
    return feed;
}

function validateMetadata(xmlData: any) {
    // extract channel field and verify existance
    if (!xmlData.rss.channel) {
        throw new Error("RSS channel does not exist");
    }

    // extract metadata title, link and description from channel
    const channel = xmlData.rss.channel;

    if (!channel.title) {
        throw new Error("title field does not exist");
    }
    const title = channel.title;
    if (!channel.link) {
        throw new Error("link field does not exist");
    }
    const link = channel.link;
    if (!channel.description) {
        throw new Error("description field does not exist");
    }
    const description = channel.description;
    return { channel, title, link, description };
}

function extractRSSItems(channel: any) {
    // extract feed items
    if (!channel.item) {
        throw new Error("channel does not have items");
    }
    const items = channel.item;
    const rssItems: RSSItem[] = [];
    for (const item of items) {
        const title = item.title;
        const link = item.link;
        const description = item.description;
        const pubDate = item.pubDate;
        if (!title || !link || !description || !pubDate) {
            continue;
        }
        const feedItem: RSSItem = {
            title,
            link,
            description,
            pubDate
        }
        rssItems.push(feedItem);
    }
    return rssItems;
}
