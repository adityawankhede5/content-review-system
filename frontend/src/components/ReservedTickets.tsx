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
        <div className="flex h-full max-h-[500px] flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 shrink-0">
                Reserved Tickets ({tickets.length})
            </h3>

            <div className="min-h-0 flex-1 overflow-auto">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-white">
                        <tr className="border-b border-gray-200 text-left text-gray-500">
                            <th className="pb-3 font-medium">Ticket ID</th>
                            <th className="pb-3 font-medium">Expires At</th>
                            <th className="pb-3 font-medium">Expires In</th>
                            <th className="pb-3 font-medium">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tickets.map((ticket: ReservedTicket) => (
                            <tr
                                key={ticket.id}
                                className="border-b border-gray-100 last:border-none"
                            >
                                <td className="py-4 text-gray-900">
                                    {ticket.id}
                                </td>

                                <td className="py-4 text-gray-600">
                                    {ticket.expiresAt}
                                </td>

                                <td className="py-4 text-gray-600">
                                    <ExpiryCountDown
                                        expiryTime={ticket.expiresAt}
                                    />
                                </td>

                                <td className="py-4">
                                    <button
                                        onClick={() => handleConfirm(ticket.id)}
                                        className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                                    >
                                        Confirm
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