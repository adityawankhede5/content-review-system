import type { ConfirmedTicket } from "../types";

export default function ConfirmedTickets({ tickets }: { tickets: ConfirmedTicket[] }) {

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Confirmed Tickets ({tickets.length})
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 text-left text-gray-500">
                            <th className="pb-3 font-medium">Ticket ID</th>
                            <th className="pb-3 font-medium">Confirmed At</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tickets.map((ticket: ConfirmedTicket) => (
                            <tr
                                key={ticket.id}
                                className="border-b border-gray-100 last:border-none"
                            >
                                <td className="py-4 text-gray-900">
                                    {ticket.id}
                                </td>

                                <td className="py-4 text-gray-600">
                                    {ticket.confirmedAt}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};