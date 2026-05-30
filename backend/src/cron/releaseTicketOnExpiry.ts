import cron from "node-cron";
import { db } from "../db";
import { assignments, tickets } from "../db/schema";
import { eq, lte, inArray, and } from "drizzle-orm";

export function startReleaseTicketOnExpiryCron() {
    cron.schedule("*/5 * * * * *", async () => {
        try {
            await db.transaction(async (tx) => {

                const updatedAssignments = await tx.update(assignments).set({ status: "expired" })
                    .where(and(
                        eq(assignments.status, "reserved"),
                        lte(assignments.expiresAt, new Date())
                    ))
                    .returning();

                if (updatedAssignments.length === 0) {
                    console.log("[CRON][TICKET][RELEASE] No tickets to release");
                    return;
                }

                const updatedTickets = await tx.update(tickets).set({
                    status: "available",
                    enqueuedAt: new Date()
                })
                    .where(inArray(tickets.id, updatedAssignments.map((a) => a.ticketId)))
                    .returning();

                console.log("[CRON][TICKET][RELEASE] Tickets released:", updatedTickets.length);
            })
        } catch (error) {
            console.error(
                "[CRON][TICKET][RELEASE] Failed to release tickets",
                error
            );
        }
    });
}