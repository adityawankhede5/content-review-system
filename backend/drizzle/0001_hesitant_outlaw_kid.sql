CREATE INDEX "idx_assignments_reviewer_id_status_expires_at" ON "assignments" USING btree ("reviewerId","status","expires_at");--> statement-breakpoint
CREATE INDEX "idx_assignments_status_expires_at" ON "assignments" USING btree ("status","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_reserved_ticket" ON "assignments" USING btree ("ticketId") WHERE "assignments"."status" = $1;--> statement-breakpoint
CREATE INDEX "idx_tickets_locale_status" ON "tickets" USING btree ("locale","status");