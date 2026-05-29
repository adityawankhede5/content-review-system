import type { ConfirmedTicket } from "../types";

export default function ConfirmedTickets({ tickets, setTickets }: { tickets: ConfirmedTicket[], setTickets: React.Dispatch<React.SetStateAction<ConfirmedTicket[]>> }) {

    return (
        <div>
            <h3>Confirmed Tickets</h3>
            <table
                style={{
                    borderCollapse: "separate",
                    borderSpacing: "15px 10px",
                }}
            >
                <thead>
                    <tr>
                        <th>Ticket ID</th>
                        <th>Confirmed At</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket: ConfirmedTicket) => (
                        <tr key={ticket.id}>
                            <td style={{ textAlign: "left" }}>{ticket.id}</td>
                            <td>{ticket.confirmedAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};