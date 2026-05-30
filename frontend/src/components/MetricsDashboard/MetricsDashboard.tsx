import { useState } from "react";
import type { LocaleMetrics } from "./metrics.types";
import { getMetrics } from "../../api/metrics.api";

export default function MetricsDashboard() {
    const [metrics, setMetrics] = useState<LocaleMetrics[]>([]);
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

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Metrics
                    </h3>

                    <p className="text-sm text-gray-500">
                        Ticket system overview by locale
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

            {metrics.length > 0 && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {metrics.map((localeMetric) => {
                        const metricCards = [
                            {
                                label: "Total Tickets",
                                value: localeMetric.totalTickets,
                            },
                            {
                                label: "Available",
                                value: localeMetric.available,
                            },
                            {
                                label: "Reserved",
                                value: localeMetric.reserved,
                            },
                            {
                                label: "Confirmed",
                                value: localeMetric.confirmed,
                            },
                        ];

                        return (
                            <div
                                key={localeMetric.locale}
                                className="rounded-lg border border-gray-200 bg-gray-50 p-5"
                            >
                                <div className="mb-4">
                                    <h4 className="text-md font-semibold text-gray-900">
                                        {localeMetric.locale}
                                    </h4>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {metricCards.map((metric) => (
                                        <div
                                            key={metric.label}
                                            className="rounded-md border border-gray-200 bg-white p-3"
                                        >
                                            <p className="text-sm text-gray-500">
                                                {metric.label}
                                            </p>

                                            <p className="mt-1 text-xl font-semibold text-gray-900">
                                                {metric.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}