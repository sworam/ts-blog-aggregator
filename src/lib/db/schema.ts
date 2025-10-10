import { pgTable, uuid, timestamp, text, unique } from "drizzle-orm/pg-core";

export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;
export type FeedFollow = typeof feedFollows.$inferSelect;
export type Post = typeof posts.$inferSelect;

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    lastFetchedAt: timestamp("last_fetched_at"),
    name: text("name").notNull(),
    url: text("url").notNull().unique(),
    userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
});

export const feedFollows = pgTable("feed_follows", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
    feedId: uuid("feed_id").references(() => feeds.id, { onDelete: 'cascade' }).notNull(),
}, (t) => ({ unq: unique().on(t.userId, t.feedId) }),
);

export const posts = pgTable("posts", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    title: text("title").notNull(),
    url: text("url").notNull().unique(),
    description: text("description").notNull(),
    publishedAt: timestamp("published_at").notNull(),
    feedId: uuid("feed_id").references(() => feeds.id, { onDelete: 'cascade' }).notNull(),
});
