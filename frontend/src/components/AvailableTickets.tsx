import { reserveTicket } from "../api/ticket.api";
import type { AvailableTicket, ReservedTicket } from "../types";
import { showToast } from "./utils/toast";

export default function AvailableTickets({ tickets, onReserveSuccess }: { tickets: AvailableTicket[], onReserveSuccess: (ticket: ReservedTicket) => void }) {

    const handleReserve = (ticketId: string) => {
        reserveTicket(ticketId)
            .then((reservedTicket) => {
                console.log("Ticket reserved:", reservedTicket);
                showToast("Ticket reserved successfully! Please complete your review within 20 minutes.");
                onReserveSuccess(reservedTicket);
            })
            .catch(() => {
                alert("Failed to reserve ticket. It might have been reserved by someone else.");
            });
    }
    return (
        <div className="flex h-full max-h-[500px] flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 shrink-0">
                Available Tickets
            </h3>

            <div className="min-h-0 flex-1 overflow-auto">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b border-gray-200 text-left text-gray-500">
                            <th className="pb-3 font-medium">Ticket ID</th>
                            <th className="pb-3 font-medium">Locale</th>
                            <th className="pb-3 font-medium">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tickets.map((ticket: AvailableTicket) => (
                            <tr
                                key={ticket.id}
                                className="border-b border-gray-100 last:border-none"
                            >
                                <td className="py-4 text-gray-900">
                                    {ticket.id}
                                </td>

                                <td className="py-4 text-gray-600">
                                    {ticket.locale}
                                </td>

                                <td className="py-4">
                                    <button
                                        onClick={() => handleReserve(ticket.id)}
                                        className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                                    >
                                        Reserve
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};