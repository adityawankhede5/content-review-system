import { confirmTicket } from "../api/ticket.api";
import ExpiryCountDown from "./ExpirtyCountDown";
import type { ReservedTicket, ConfirmedTicket } from "../types";
import { showToast } from "./utils/toast";

export default function ReservedTickets({ tickets, onConfirmSuccess }: { tickets: ReservedTicket[], onConfirmSuccess: (confirmedTicket: ConfirmedTicket) => void }) {
    const handleConfirm = (ticketId: string) => {
        confirmTicket(ticketId)
        .then((confirmedTicket) => {
            showToast("Ticket confirmed successfully!")
            onConfirmSuccess(confirmedTicket);
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