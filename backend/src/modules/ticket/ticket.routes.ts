import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { db } from "../../db";
import { tickets, assignments } from "../../db/schema";
import { eq, and, desc, gte } from "drizzle-orm";

const router = Router();

// const TICKET_EXPIRATION_TIME = 20 * 60 * 1000; // 20 minutes
const TICKET_EXPIRATION_TIME = 1 * 60 * 1000; // 1 minute

router.get("/available", authMiddleware, async (_req, res) => {
    const currentReviewer = _req.user;
    const localeTickets = await db.select().from(tickets).where(and(
        eq(tickets.locale, currentReviewer.locale),
        eq(tickets.status, "available")
    ));
    res.json(localeTickets);
});

router.get("/reserved", authMiddleware, async (_req, res) => {
    const currentReviewer = _req.user;
    const reservedTickets = await db.select({
        id: tickets.id,
        locale: tickets.locale,
        reservedAt: assignments.reservedAt,
        expiresAt: assignments.expiresAt,
        status: assignments.status
    })
        .from(tickets)
        .innerJoin(assignments, eq(tickets.id, assignments.ticketId))
        .where(and(
            eq(assignments.reviewerId, currentReviewer.id),
            eq(assignments.status, "reserved"),
            gte(assignments.expiresAt, new Date())
        ));
    res.json(reservedTickets);
});

router.get("/confirmed", authMiddleware, async (_req, res) => {
    const currentReviewer = _req.user;
    const confirmedTickets = await db.select({
        id: tickets.id,
        locale: tickets.locale,
        reservedAt: assignments.reservedAt,
        confirmedAt: assignments.confirmedAt,
        status: assignments.status
    })
        .from(tickets)
        .innerJoin(assignments, eq(tickets.id, assignments.ticketId))
        .where(and(
            eq(assignments.reviewerId, currentReviewer.id),
            eq(assignments.status, "confirmed")
        ));
    res.json(confirmedTickets);
});

router.post("/:id/reserve", authMiddleware, async (_req, res) => {
    const ticketId = _req.params.id;
    if (!ticketId || typeof ticketId !== "string") {
        return res.status(400).json({ message: "Invalid ticket ID" });
    }
    const currentReviewer = _req.user;
    try {
        const reservedTicket = await db.transaction(async (tx) => {
            const updatedTicket = await tx.update(tickets).set({ status: "reserved" })
                .where(and(
                    eq(tickets.id, ticketId),
                    eq(tickets.status, "available"),
                    eq(tickets.locale, currentReviewer.locale)
                ))
                .returning();
            if (updatedTicket.length === 0) {
                throw new Error("Failed to reserve ticket. It might have been reserved by someone else.");
            }
            const [assignment] = await tx.insert(assignments).values({
                reviewerId: currentReviewer.id,
                ticketId: ticketId,
                expiresAt: new Date(Date.now() + TICKET_EXPIRATION_TIME)
            })
            .returning({
                reservedAt: assignments.reservedAt,
                expiresAt: assignments.expiresAt,
                status: assignments.status
            });
            return {
                id: ticketId,
                locale: currentReviewer.locale,
                reservedAt: assignment.reservedAt,
                expiresAt: assignment.expiresAt,
                status: assignment.status
            }
        });
        return res.json(reservedTicket);
    } catch (error) {
        console.error("Error reserving ticket:", error);
        res.status(500).json({ message: "Failed to reserve ticket" });
        return;
    }
});

router.post("/:id/confirm", authMiddleware, async (_req, res) => {
    const ticketId = _req.params.id;
    if (!ticketId || typeof ticketId !== "string") {
        return res.status(400).json({ message: "Invalid ticket ID" });
    }
    const currentReviewer = _req.user;

    try {
        const confirmedTicket = await db.transaction(async (tx) => {
            const updatedReservation = await tx.update(assignments).set({ status: "confirmed", confirmedAt: new Date() })
                .where(and(
                    eq(assignments.ticketId, ticketId),
                    eq(assignments.reviewerId, currentReviewer.id),
                    eq(assignments.status, "reserved"),
                    gte(assignments.expiresAt, new Date())
                ))
                .returning();
            if (updatedReservation.length === 0) {
                throw new Error("Reservation expired or invalid");
            }
            await tx.update(tickets).set({ status: "confirmed" })
                .where(eq(tickets.id, ticketId))
            return {
                id: ticketId,
                locale: currentReviewer.locale,
                reservedAt: updatedReservation[0].reservedAt,
                confirmedAt: updatedReservation[0].confirmedAt,
                status: updatedReservation[0].status
            }
        });
        return res.json(confirmedTicket);
    } catch (error) {
        console.error("Error confirming ticket:", error);
        res.status(500).json({ message: "Failed to confirm ticket" });
        return;
    }
});

export default router;