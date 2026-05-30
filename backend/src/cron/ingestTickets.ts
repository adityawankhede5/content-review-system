import cron from "node-cron";
import { locales, tickets } from "../db/schema";
import { db } from "../db";
export const startIngestTickets = (intervalInSec = 10, throughPut = 10) => {
    cron.schedule(`*/${intervalInSec} * * * * *`, async () => {
        try {
            const ticketsSeed = new Array(throughPut).fill(0).map((_, index) => ({
                locale: locales[Math.floor(Math.random() * locales.length)],
            }));

            await db.insert(tickets).values(ticketsSeed)
            console.log(`[CRON][TICKET][INGEST] Ticket ingestion successful: ${throughPut}`)
        } catch (error) {
            console.log("[CRON][TICKET][INGEST] Failed to ingest ticket")
            console.error(error)
        }

    });

}