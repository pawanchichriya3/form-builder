import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    text,
} from "drizzle-orm/pg-core";

import { usersTable } from "./user";

export const formsTable = pgTable("forms", {
    id: uuid("id").primaryKey().defaultRandom(),

    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),

    createdBy: uuid("created_by").references(() => usersTable.id),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectForm = typeof formsTable.$inferSelect;
export type InsertForm = typeof formsTable.$inferInsert;