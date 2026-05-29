import { eq } from "drizzle-orm";
import { db } from "../../db";
import { reviewers } from "../../db/schema";
import { Router } from "express";
import { signJWT } from "../auth/jwt";

const router = Router();

router.post("/login", async (_req, res) => {
    try {
        const email = _req.body.email;
        if (!email || typeof email !== "string") {
            return res.status(400).json({ message: "Invalid email" });
        }
        const reviewer = await db.select().from(reviewers).where(eq(reviewers.email, _req.body.email)).limit(1);
        if (reviewer.length === 0) {
            return res.status(404).json({ message: "Reviewer not found" });
        }
        const accessToken = signJWT(reviewer[0]);
        res.json({ accessToken });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }

});

export default router;