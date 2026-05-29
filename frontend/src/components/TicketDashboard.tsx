import { useState, useEffect } from "react";
import type { AvailableTicket, ConfirmedTicket, ReservedTicket } from "../types";
import { getTickets } from "../api/ticket.api";
import AvailableTickets from "./AvailableTickets";
import ReservedTickets from "./ReservedTickets";
import ConfirmedTickets from "./ConfirmedTickets";
export default function TicketDashboard() {
    const [availableTickets, setAvailableTickets] = useState<AvailableTicket[]>([]);
    const [reservedTickets, setReservedTickets] = useState<ReservedTicket[]>([]);
    const [confirmedTickets, setConfirmedTickets] = useState<ConfirmedTicket[]>([]);
    useEffect(() => {
        getTickets("available")
            .then(data => {
                setAvailableTickets(data as AvailableTicket[]);
            })
            .catch(console.error);
        getTickets("reserved")
            .then(data => {
                setReservedTickets(data as ReservedTicket[]);
            })
            .catch(console.error);
        getTickets("confirmed")
            .then(data => {
                setConfirmedTickets(data as ConfirmedTicket[]);
            })
            .catch(console.error);
    }, []);
    return (
        <div>
            <AvailableTickets tickets={availableTickets} setTickets={setAvailableTickets} />
            <ReservedTickets tickets={reservedTickets} setTickets={setReservedTickets} />
            <ConfirmedTickets tickets={confirmedTickets} setTickets={setConfirmedTickets} />
        </div>
    )
};