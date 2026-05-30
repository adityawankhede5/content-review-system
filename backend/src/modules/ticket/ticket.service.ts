import { and, desc, eq, gte, gt } from "drizzle-orm"
import { db } from "../../db"
import { tickets, assignments } from "../../db/schema"
import { JWTPayload } from "../../types/auth";

// const TICKET_EXPIRATION_TIME = 20 * 60 * 1000; // 20 minutes
const TICKET_EXPIRATION_TIME = 1 * 60 * 1000; // 1 minute

export const getAvailableTickets = async (locale: string) => {
    const localeTickets = await db.select().from(tickets).where(and(
        eq(tickets.locale, locale),
        eq(tickets.status, "available")
    ))
    .orderBy(tickets.enqueuedAt)
    return localeTickets;
}

export const getReservedTicketsForReviewer = async (reviewerId: string) => {
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
        eq(assignments.reviewerId, reviewerId),
        eq(assignments.status, "reserved"),
        gte(assignments.expiresAt, new Date())
    ))
    .orderBy(assignments.reservedAt)
    return reservedTickets;
}

export const getConfirmedTicketsForReviewer = async (reviewerId: string) => {
    const confirmedTickets = await db.select({
        id: tickets.id,
        locale: tickets.locale,
        reviewerId: assignments.reviewerId,
        reservedAt: assignments.reservedAt,
        confirmedAt: assignments.confirmedAt,
        status: assignments.status
    })
    .from(tickets)
    .innerJoin(assignments, eq(tickets.id, assignments.ticketId))
    .where(and(
        eq(assignments.reviewerId, reviewerId),
        eq(assignments.status, "confirmed")
    ))
    .orderBy(desc(assignments.confirmedAt))
    return confirmedTickets;
}

export const reserveTicketForReviewer = async (ticketId: string, reviewer: JWTPayload) => {
    const reservedTicket = await db.transaction(async (tx) => {
        const updatedTickets = await tx.update(tickets).set({
            status: "reserved"
        })
        .where(and(
            eq(tickets.id, ticketId),
            eq(tickets.status, "available")
        ))
        .returning()

        if (updatedTickets.length == 0) {
            throw new Error("Ticket already reserved")
        }

        const [insertedAssignment] = await tx.insert(assignments).values({
            reviewerId: reviewer.id,
            ticketId: ticketId,
            status: "reserved",
            expiresAt: new Date(Date.now() + TICKET_EXPIRATION_TIME)
        }).returning({
            reservedAt: assignments.reservedAt,
            expiresAt: assignments.expiresAt,
            status: assignments.status,
        });

        return {
            id: ticketId,
            locale: reviewer.locale,
            reservedAt: insertedAssignment.reservedAt,
            expiresAt: insertedAssignment.expiresAt,
            status: insertedAssignment.status
        }
    })
    return reservedTicket;
}

export const confirmTicketForReviewer = async (ticketId: string, reviewer: JWTPayload) => {
    const confirmedTicket = await db.transaction(async (tx) => {
        console.log("ticketid", ticketId)
        console.log("reviewerid", reviewer.id)
        const updatedAssignments = await tx.update(assignments).set({
            status: "confirmed",
            confirmedAt: new Date()
        })
        .where(and(
            eq(assignments.reviewerId, reviewer.id),
            eq(assignments.ticketId, ticketId),
            eq(assignments.status, "reserved"),
            gt(assignments.expiresAt, new Date())
        ))
        .returning({
            reservedAt: assignments.reservedAt,
            confirmedAt: assignments.confirmedAt,
            status: assignments.status
        })
        console.log(updatedAssignments)
        if (updatedAssignments.length == 0) {
            throw new Error("Ticket not reserved or expired")
        }
        await tx.update(tickets).set({
            status: "confirmed"
        })
        .where(eq(tickets.id, ticketId))
        
        return {
            id: ticketId,
            locale: reviewer.locale,
            reservedAt: updatedAssignments[0].reservedAt,
            confirmedAt: updatedAssignments[0].confirmedAt,
            status: updatedAssignments[0].status
        }
    })
    return confirmedTicket;
}