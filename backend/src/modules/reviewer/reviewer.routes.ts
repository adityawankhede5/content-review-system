import {Router} from "express";
import { db } from "../../db";
import { reviewers } from "../../db/schema";

const router = Router();

router.get("/", async (_req, res) => {
    const allReviewers = await db.select().from(reviewers);
    res.json(allReviewers);
});

export default router;