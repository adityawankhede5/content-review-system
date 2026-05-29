export type ConfirmedTicket = {
    "id": string,
    "ticketId": string,
    "reviewerId": string,
    "locale": string,
    "status": "reserved" | "expired" | "confirmed",
    "reservedAt": string,
    "confirmedAt": string | null,
}

export type ReservedTicket = {
    "id": string,
    "ticketId": string,
    "reviewerId": string,
    "locale": string,
    "status": "reserved" | "expired" | "confirmed",
    "reservedAt": string,
    "expiresAt": string,
}

export type AvailableTicket = {
    "id": string,
    "locale": string,
    "status": "available" | "reserved" | "confirmed",
}