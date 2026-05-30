import { Router } from "express";
import { getMetrics } from "./metrics.service";

const router = Router();

router.get("/", async (_req, res) => {
    try{
        const metrics = await getMetrics();
        return res.json(metrics);
    } catch (error) {
        console.error("Error fetching confirmed tickets", error);
        return res.status(500).json({ message: "Failed to fetch confirmed tickets" })
    }
})

export default router;