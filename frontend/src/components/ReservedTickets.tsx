import { confirmTicket } from "../api/ticket.api";
import ExpiryCountDown from "./ExpirtyCountDown";
import type { ReservedTicket } from "../types";

export default function ReservedTickets({ tickets, setTickets }: { tickets: ReservedTicket[], setTickets: React.Dispatch<React.SetStateAction<ReservedTicket[]>> }) {
    const handleConfirm = (ticketId: string) => {
        confirmTicket(ticketId)
        .then(() => {
            alert("Ticket confirmed successfully!");
            setTickets(prev => prev.filter((ticket: any) => ticket.id !== ticketId));
        })
        .catch(() => {
            alert("Failed to confirm ticket. Reservation might have expired.");
        });
    }
    return (
        <div>
            <h3>Reserved Tickets</h3>
            <table
                style={{
                    borderCollapse: "separate",
                    borderSpacing: "15px 10px",
                }}
            >
                <thead>
                    <tr>
                        <th>Ticket ID</th>
                        <th>Expires at</th>
                        <th>Expires in</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket: ReservedTicket) => (
                        <tr key={ticket.id}>
                            <td style={{ textAlign: "left" }}>{ticket.id}</td>
                            <td>{ticket.expiresAt}</td>
                            <td><ExpiryCountDown expiryTime={ticket.expiresAt} /></td>
                            <td><button onClick={() => handleConfirm(ticket.id)}>Confirm</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};