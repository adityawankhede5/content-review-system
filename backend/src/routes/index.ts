import { Router } from "express";
import reviewerRouter from "../modules/reviewer/reviewer.routes";
import authRouter from "../modules/auth/auth.routes";
import ticketRouter from "../modules/ticket/ticket.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/reviewers", reviewerRouter);
router.use("/tickets", ticketRouter);

export default router;