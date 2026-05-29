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

    const handleReserveSuccess = (reservedTicket: ReservedTicket) => {
        setReservedTickets(prev => {
            const reservedTickets = prev.filter(ticket => ticket.id !== reservedTicket.id);
            return [...reservedTickets, reservedTicket];
        });
        setAvailableTickets(prev => prev.filter(ticket => ticket.id !== reservedTicket.id));
    }
    const handleConfirmSuccess = (confirmedTicket: ConfirmedTicket) => {
        setConfirmedTickets(prev => {
            const confirmedTickets = prev.filter(ticket => ticket.id !== confirmedTicket.id);
            return [...confirmedTickets, confirmedTicket];
        });
        setReservedTickets(prev => prev.filter(ticket => ticket.id !== confirmedTicket.id));
    }
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AvailableTickets
                tickets={availableTickets}
                onReserveSuccess={handleReserveSuccess}
            />

            <ReservedTickets
                tickets={reservedTickets}
                onConfirmSuccess={handleConfirmSuccess}
            />

            <div className="lg:col-span-2">
                <ConfirmedTickets
                    tickets={confirmedTickets}
                />
            </div>
        </div>
    );
};