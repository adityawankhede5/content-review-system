import express from "express";
import cors from "cors";
import routes from "./routes";
import {startReleaseTicketOnExpiryCron} from "./cron/releaseTicketOnExpiry";
const app = express();
startReleaseTicketOnExpiryCron();

app.use(cors());
app.use(express.json());
app.use("/api/v1", routes);

export default app;
