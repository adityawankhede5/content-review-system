DROP INDEX "idx_tickets_locale_status";--> statement-breakpoint
CREATE INDEX "idx_tickets_locale_status_enqueued" ON "tickets" USING btree ("locale","status","enqueued_at");