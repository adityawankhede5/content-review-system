import type { ConfirmedTicket, ReservedTicket } from "../types";

export const getTickets = async (status: "available" | "reserved" | "confirmed") => {
    try {
        const respone = await fetch(`http://localhost:8080/api/v1/tickets/${status}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
        });
        if (!respone.ok) {
            const errorData = await respone.json();
            throw new Error(errorData.message || `Failed to fetch ${status} tickets`);
        }
        const data = await respone.json();
        return data;
    } catch (error) {
        console.error(`Error fetching ${status} tickets:`, error);
        throw error;
    }
}

export const reserveTicket = async (ticketId: string): Promise<ReservedTicket> => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/tickets/${ticketId}/reserve`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to reserve ticket");
        }
        const data = await response.json();
        return data as ReservedTicket;
    } catch (error) {
        console.error("Error reserving ticket:", error);
        throw error;
    }
};

export const confirmTicket = async (ticketId: string): Promise<ConfirmedTicket> => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/tickets/${ticketId}/confirm`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to confirm ticket");
        }
        const data = await response.json();
        return data as ConfirmedTicket;
    } catch (error) {
        console.error("Error confirming ticket:", error);
        throw error;
    }
};