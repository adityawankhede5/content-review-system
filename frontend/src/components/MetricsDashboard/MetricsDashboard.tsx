import { useState } from "react";
import type { Metrics } from "./metrics.types";
import { getMetrics } from "../../api/metrics.api";

export default function MetricsDashboard() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGetMetrics = async () => {
        try {
            setLoading(true);

            const data = await getMetrics();
            setMetrics(data);
        } finally {
            setLoading(false);
        }
    };

    const metricCards = [
        {
            label: "Total Tickets",
            value: metrics?.totalTickets,
        },
        {
            label: "Available",
            value: metrics?.available,
        },
        {
            label: "Reserved",
            value: metrics?.reserved,
        },
        {
            label: "Confirmed",
            value: metrics?.confirmed,
        },
    ];

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Metrics
                    </h3>
                    <p className="text-sm text-gray-500">
                        Ticket system overview
                    </p>
                </div>

                <button
                    onClick={handleGetMetrics}
                    disabled={loading}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Loading..." : "Get Metrics"}
                </button>
            </div>

            {metrics && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {metricCards.map((metric) => (
                        <div
                            key={metric.label}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                        >
                            <p className="text-sm text-gray-500">
                                {metric.label}
                            </p>

                            <p className="mt-2 text-2xl font-semibold text-gray-900">
                                {metric.value}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}