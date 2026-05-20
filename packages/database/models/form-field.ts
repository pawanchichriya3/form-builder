import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    text,
    numeric,
    pgEnum,
    boolean,
    unique
} from "drizzle-orm/pg-core";
import { formsTable } from "../schema";

export const fieldTypeEnum = pgEnum("field_type_enum", ["TEXT", "NUMBER", "EMAIL", "PASSWORD", "YES_NO"]);

export const formFieldsTable = pgTable("form_fields", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").references(() => formsTable.id),
    label: varchar("label", { length: 255 }).notNull(),
    labelKey: varchar("label_key", { length: 255 }),
    description: text("description"),
    placeholder: varchar("placeholder", { length: 255 }),
    isRequired: boolean("is_required").default(false),
    index: numeric('index', {scale: 2}).notNull(),
    type: fieldTypeEnum("type").notNull(),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
}, (table) => {
    return {
        uniqueFormIdAndIndex: unique().on(table.formId, table.index)
    }
})