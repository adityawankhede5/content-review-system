import type { Metrics } from "../components/MetricsDashboard/metrics.types";

export const getMetrics = async () : Promise<Metrics> => {
    try {
        const respone = await fetch(`http://localhost:8080/api/v1/metrics`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!respone.ok) {
            const errorData = await respone.json();
            throw new Error(errorData.message || `Failed to fetch metrics`);
        }
        const data = await respone.json();
        return data;
    } catch (error) {
        console.error(`Error fetching metrics:`, error);
        throw error;
    }
}