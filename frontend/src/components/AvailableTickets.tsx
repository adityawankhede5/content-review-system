import { reserveTicket } from "../api/ticket.api";
import type { AvailableTicket } from "../types";

export default function AvailableTickets({ tickets, setTickets }: { tickets: AvailableTicket[], setTickets: React.Dispatch<React.SetStateAction<AvailableTicket[]>> }) {
    
    const handleReserve = (ticketId: string) => {
        reserveTicket(ticketId)
        .then(() => {
            alert("Ticket reserved successfully! Please complete your review within 20 minutes.");
            setTickets(prev => prev.filter((ticket: any) => ticket.id !== ticketId));
        })
        .catch(() => {
            alert("Failed to reserve ticket. It might have been reserved by someone else.");
        });
    }
    return (
        <div>
            <h3>Available Tickets</h3>
            <table
                style={{
                    borderCollapse: "separate",
                    borderSpacing: "15px 10px",
                }}
            >
                <thead>
                    <tr>
                        <th>Ticket ID</th>
                        <th>Locale</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket: AvailableTicket) => (
                        <tr key={ticket.id}>
                            <td style={{ textAlign: "left" }}>{ticket.id}</td>
                            <td>{ticket.locale}</td>
                            <td><button onClick={() => handleReserve(ticket.id)}>Reserve</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};