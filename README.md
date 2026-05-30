# Content Review System

## Setup & Run Instructions

### Installation

```bash
git clone https://github.com/adityawankhede5/content-review-system.git
cd content-review-system
```

### Run Project

```bash
docker compose up --build
```

### Application URL

```http
http://localhost:5173
```

---

## Ticket Ingestion Strategy

The system uses a database-backed queue model.

### Initial Seed

When the application starts, 50 tickets are seeded into the `tickets` table with randomized locales and an initial `available` status.

### Continuous Ingestion

A background ingestion job runs every `t` seconds (default: 10s) and inserts `n` new tickets (default: 10).

### Initial Ticket State

All newly created tickets are inserted with:

- `status = available`
- `enqueued_at = current_timestamp`

### FIFO Strategy

Ticket ordering follows a FIFO strategy using the `enqueued_at` timestamp.

- Newly created tickets receive the current timestamp.
- Expired reservations re-enter the queue by updating `enqueued_at` to the current timestamp.
- Available ticket queries order by `enqueued_at ASC`.

This ensures the oldest available ticket is processed first while re-queued expired tickets move to the back of the queue.

### Reasoning

A database-backed queue was chosen to keep ticket ordering, reservation state, and concurrency guarantees centralized in PostgreSQL without introducing additional infrastructure such as Redis or Kafka.

---

## API Reference

### Base URL

```http
http://localhost:8080/api/v1/
```

### Authentication

#### Login

```http
POST auth/login
```

Authenticates a reviewer and returns an access token.

---

### Tickets

Authenticated endpoints require:

```http
Authorization: Bearer <token>
```

#### Get Available Tickets

```http
GET tickets/available
```

Returns available tickets for the authenticated reviewer's locale.

#### Reserve Ticket

```http
POST tickets/:id/reserve
```

Reserves a ticket if it is currently available.

#### Confirm Ticket

```http
POST tickets/:id/confirm
```

Confirms a ticket if:

* the ticket is currently reserved
* the reservation belongs to the authenticated reviewer
* the reservation has not expired


---

## Key Design Decisions

### Concurrency Handling

Ticket reservation and confirmation are performed inside database transactions to avoid race conditions.

Reservation succeeds only when:

- ticket status is `available`

Confirmation succeeds only when:

- ticket is `reserved`
- reservation belongs to the requesting reviewer
- reservation has not expired

A partial unique index enforces database-level consistency by ensuring only one active reservation exists per ticket:

```ts
uniqueIndex("unique_reserved_ticket")
  .on(table.ticketId)
  .where(sql`${table.status} = 'reserved'`)
```

### FIFO ticket assignment

Available tickets are ordered by `enqueued_at` ASC, which is updated every time a ticket is created or expired. `enqueued_at` is part of the composite index `idx_tickets_locale_status_enqueued`, allowing performant reads.

Reserved tickets are ordered by `reserved_at` ASC, which is updated every time a ticket is reserved. 

### Reservation expiry mechanism
A cron job is scheduled every 1 min that gets all the tickets with `expires_at <= now` and updates them to be available in a batch.
To prevent inconsistencies caused by cron timing delays, ticket confirmation additionally validates that `expires_at > now` during the confirmation transaction.

### Locale scoping
Index on Available tickets include `locale`, hence locale based filtering is performant.

### Database as Source of Truth

PostgreSQL acts as the single source of truth for ticket state, reservation ownership, expiry, and queue ordering. This avoids synchronization issues across multiple in-memory queues or workers.

---

## Assumptions

- Ticket ingestion during application startup is acceptable for this assignment and does not require an external scheduler.
- Reservation expiry precision within a cron interval (up to 59 seconds) is acceptable because confirmation performs an additional expiry validation.


---


## Trade-offs

- A cron-based expiry system was chosen for simplicity over event-driven timers, at the cost of up to ~59 seconds delay in releasing reservations.
- PostgreSQL is used as a lightweight queueing mechanism instead of dedicated queue infrastructure (Redis/Kafka), reducing complexity but limiting horizontal scalability for very high throughput workloads.

---

## Walkthrough Video

Loom link: `<add-link>`