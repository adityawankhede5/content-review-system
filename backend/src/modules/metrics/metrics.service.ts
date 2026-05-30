import { count, sql } from "drizzle-orm";
import { db } from "../../db";
import { LocaleMetrics } from "../../types/metrics.types";
import { tickets } from "../../db/schema";

export const getMetrics = async (): Promise<LocaleMetrics[]> => {
    const results = await db
        .select({
            locale: tickets.locale,
            totalTickets: count(tickets.id),
            available: count(
                sql`CASE WHEN ${tickets.status} = 'available' THEN 1 END`
            ),
            reserved: count(
                sql`CASE WHEN ${tickets.status} = 'reserved' THEN 1 END`
            ),
            confirmed: count(
                sql`CASE WHEN ${tickets.status} = 'confirmed' THEN 1 END`
            ),
        })
        .from(tickets)
        .groupBy(sql`ROLLUP(${tickets.locale})`);

    return results.map((result) => ({
        locale: result.locale ?? "all",
        totalTickets: Number(result.totalTickets ?? 0),
        available: Number(result.available ?? 0),
        reserved: Number(result.reserved ?? 0),
        confirmed: Number(result.confirmed ?? 0),
    }));
};