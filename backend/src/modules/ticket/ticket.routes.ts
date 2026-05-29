import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { confirmTicketForReviewer, getAvailableTickets, getConfirmedTicketsForReviewer, getReservedTicketsForReviewer, reserveTicketForReviewer } from "./ticket.service";
import { JWTPayload } from "../../types/auth";

const router = Router();


router.get("/available", authMiddleware, async (_req, res) => {
    try {
        const currentReviewer = _req.user as JWTPayload;
        const availableTickets = await getAvailableTickets(currentReviewer.locale);
        return res.json(availableTickets);
    } catch (error) {
        console.error("Error fetching available tickets:", error);
        res.status(500).json({ message: "Failed to fetch available tickets" });
    }
});

router.get("/reserved", authMiddleware, async (_req, res) => {
    try {
        const currentReviewer = _req.user as JWTPayload;
        const reservedTickets = await getReservedTicketsForReviewer(currentReviewer.id)
        return res.json(reservedTickets);
    } catch (error) {
        console.error("Error fetching reserved tickets", error);
        res.status(500).json({ message: "Failed to fetch reserved ticktes" })
    }

});

router.get("/confirmed", authMiddleware, async (_req, res) => {
    try {
        const currentReviewer = _req.user as JWTPayload;
        const confirmedTickets = await getConfirmedTicketsForReviewer(currentReviewer.id)
        return res.json(confirmedTickets);
    } catch (error) {
        console.error("Error fetching confirmed tickets", error);
        return res.status(500).json({ message: "Failed to fetch confirmed tickets" })
    }

});

router.post("/:id/reserve", authMiddleware, async (_req, res) => {
    const ticketId = _req.params.id;
    if (!ticketId || typeof ticketId !== "string") {
        return res.status(400).json({ message: "Invalid ticket ID" });
    }
    const currentReviewer = _req.user;
    try {
        const reservedTicket = await reserveTicketForReviewer(ticketId, currentReviewer)
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
        const confirmedTicket = await confirmTicketForReviewer(ticketId, currentReviewer);
        return res.json(confirmedTicket);
    } catch (error) {
        console.error("Error confirming ticket:", error);
        res.status(500).json({ message: "Failed to confirm ticket" });
        return;
    }
});

export default router;