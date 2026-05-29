import { db } from "./index";
import { reviewers, tickets } from "./schema";

const locales = ["East Coast", "West Coast", "Midwest", "South"];

const reviewersSeed = [
  { name: 'Emily Johnson', locale: 'East Coast', email: 'emily.johnson@example.com' },
  { name: 'Sarah Taylor', locale: 'West Coast', email: 'sarah.taylor@example.com' },
  { name: 'Chris Miller', locale: 'South', email: 'chris.miller@example.com' },
  { name: 'Jane Brown', locale: 'East Coast', email: 'jane.brown@example.com' },
  { name: 'David Doe', locale: 'Midwest', email: 'david.doe@example.com' },
  { name: 'Sarah Smith', locale: 'Midwest', email: 'sarah.smith@example.com' },
  { name: 'Daniel Miller', locale: 'West Coast', email: 'daniel.miller@example.com' },
  { name: 'David Wilson', locale: 'South', email: 'david.wilson@example.com' },
  { name: 'Sarah Jones', locale: 'Midwest', email: 'sarah.jones@example.com' },
  { name: 'Daniel Smith', locale: 'Midwest', email: 'daniel.smith@example.com' },
  { name: 'Chris Taylor', locale: 'Midwest', email: 'chris.taylor@example.com' },
  { name: 'Sarah Doe', locale: 'East Coast', email: 'sarah.doe@example.com' },
  { name: 'Chris Brown', locale: 'East Coast', email: 'chris.brown@example.com' },
  { name: 'David Davis', locale: 'East Coast', email: 'david.davis@example.com' },
  { name: 'Chris Doe', locale: 'South', email: 'chris.doe@example.com' },
  { name: 'Sophia Smith', locale: 'East Coast', email: 'sophia.smith@example.com' },
  { name: 'Jane Jones', locale: 'East Coast', email: 'jane.jones@example.com' },
  { name: 'Sophia Doe', locale: 'West Coast', email: 'sophia.doe@example.com' },
  { name: 'Sophia Taylor', locale: 'South', email: 'sophia.taylor@example.com' },
  { name: 'Sarah Brown', locale: 'East Coast', email: 'sarah.brown@example.com' },
];

const ticketsSeed = new Array(100).fill(0).map((_, index) => ({
  locale: locales[Math.floor(Math.random() * locales.length)],
}));

async function seed() {
  const reviewersCount = await db.$count(reviewers);
  if (reviewersCount === 0) { 
    await db.insert(reviewers)
    .values(reviewersSeed)
  }
  const ticketsCount = await db.$count(tickets);
  if (ticketsCount === 0) {
    await db.insert(tickets).values(ticketsSeed);
  }
}

seed()
.then(() => {
  console.log("Seeding completed");
  process.exit(0);
})
.catch((error) => {
  console.error("Error seeding data:", error);
  process.exit(1);
});




