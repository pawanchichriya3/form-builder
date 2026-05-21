import { json, jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { formsTable } from "../schema";

export interface FormSubmissionValue {
    formFieldId: string;
    value: string
}

export type FormSubmissionValueRow = FormSubmissionValue[]

export const formSubmissionTable = pgTable("form_submission", {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id").references(() => formsTable.id).notNull(),
    value: json('value').$type<FormSubmissionValueRow>().notNull(),
    createdAt:  timestamp("created_at").notNull().defaultNow(),
})
    