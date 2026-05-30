import { pgTable, text, uuid, varchar, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const locales = ["East Coast", "West Coast", "Midwest", "South"];

export const reviewers = pgTable("reviewers", {
    id: uuid().defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    locale: varchar("locale", { length: 255 }).notNull(),
    email: text("email").notNull().unique(),
});

export const tickets = pgTable("tickets", {
    id: uuid().defaultRandom().primaryKey(),
    locale: varchar("locale", { length: 255 }).notNull(),
    status: varchar("status", { enum: ["available", "reserved", "confirmed"] }).default("available").notNull(),
    createAt: timestamp("created_at", { withTimezone: true}).defaultNow().notNull(),
    enqueuedAt: timestamp("enqueued_at", { withTimezone: true}).defaultNow().notNull()
}, (table) => [
    index("idx_tickets_locale_status").on(table.locale, table.status)
]);

export const assignments = pgTable("assignments", {
    id: uuid().defaultRandom().primaryKey(),
    reviewerId: uuid().references(() => reviewers.id).notNull(),
    ticketId: uuid().references(() => tickets.id).notNull(),
    status: varchar("status", { enum: ["reserved", "expired", "confirmed"] }).default("reserved").notNull(),
    reservedAt: timestamp("reserved_at", { withTimezone: true}).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true}).notNull(),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true}),
}, (table) => [
    index("idx_assignments_reviewer_id_status_expires_at").on(table.reviewerId, table.status, table.expiresAt),
    index("idx_assignments_status_expires_at").on(table.status, table.expiresAt),
    uniqueIndex("unique_reserved_ticket").on(table.ticketId).where(sql`${table.status} = 'reserved'`)
]);