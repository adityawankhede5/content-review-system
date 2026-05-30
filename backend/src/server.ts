import dotenv from "dotenv";
import app from "./app";
import { startIngestTickets } from "./cron/ingestTickets";
import { startReleaseTicketOnExpiryCron } from "./cron/releaseTicketOnExpiry";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startIngestTickets();
  startReleaseTicketOnExpiryCron();
});
