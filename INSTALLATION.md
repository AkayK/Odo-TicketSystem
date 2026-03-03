# odo - Installation Guide

## Prerequisites

- Node.js (v18+)
- MySQL (v8+)

## Setup

### 1. Database

```bash
mysql -u root < database/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env   # edit DB credentials if needed
npm install
npm run seed:all       # seeds departments, categories, users, and sample tickets
npm run dev            # starts on http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev   # starts on http://localhost:5173
```

## Environment Variables

Create `backend/.env`:

```
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ticket_system
JWT_SECRET=<your-secret>
JWT_EXPIRES_IN=24h
```

## Test Users

| Role             | Email                        | Password     | Department       |
|-----------------|------------------------------|-------------|------------------|
| Admin            | admin@ticketsys.com          | Admin123!   | —                |
| IT Manager       | it.manager@ticketsys.com     | Manager123! | IT               |
| IT Worker 1      | it.worker1@ticketsys.com     | Worker123!  | IT               |
| IT Worker 2      | it.worker2@ticketsys.com     | Worker123!  | IT               |
| IT Worker 3      | it.worker3@ticketsys.com     | Worker123!  | IT               |
| HR Manager       | hr.manager@ticketsys.com     | Manager123! | HR               |
| HR Worker 1      | hr.worker1@ticketsys.com     | Worker123!  | HR               |
| HR Worker 2      | hr.worker2@ticketsys.com     | Worker123!  | HR               |
| Finance Manager  | fin.manager@ticketsys.com    | Manager123! | Finance          |
| Finance Worker 1 | fin.worker1@ticketsys.com    | Worker123!  | Finance          |
| Finance Worker 2 | fin.worker2@ticketsys.com    | Worker123!  | Finance          |
| Ops Manager      | ops.manager@ticketsys.com    | Manager123! | Operations       |
| Ops Worker 1     | ops.worker1@ticketsys.com    | Worker123!  | Operations       |
| Ops Worker 2     | ops.worker2@ticketsys.com    | Worker123!  | Operations       |
| Mkt Manager      | mkt.manager@ticketsys.com    | Manager123! | Marketing        |
| Mkt Worker 1     | mkt.worker1@ticketsys.com    | Worker123!  | Marketing        |
| Mkt Worker 2     | mkt.worker2@ticketsys.com    | Worker123!  | Marketing        |
| Legal Manager    | legal.manager@ticketsys.com  | Manager123! | Legal            |
| Legal Worker     | legal.worker1@ticketsys.com  | Worker123!  | Legal            |
| CS Manager       | cs.manager@ticketsys.com     | Manager123! | Customer Support |
| CS Worker 1      | cs.worker1@ticketsys.com     | Worker123!  | Customer Support |
| CS Worker 2      | cs.worker2@ticketsys.com     | Worker123!  | Customer Support |
| General Manager  | gen.manager@ticketsys.com    | Manager123! | General          |
| General Worker   | gen.worker1@ticketsys.com    | Worker123!  | General          |

## Role Permissions

| Capability | Admin | Manager | Worker |
|---|:---:|:---:|:---:|
| View all tickets | Y | — | — |
| View department tickets | Y | Y | — |
| Create tickets | Y | Y | Y |
| Edit ticket details | Y | — | — |
| Change priority | Y | Y | — |
| Change status | Y | Y | Y* |
| Close own tickets | Y | Y | Y |
| Request close (assigned) | — | — | Y |
| Approve/deny close request | Y | Y | — |
| Assign tickets | Y | Y | — |
| Manage users | Y | — | — |
| Manage categories | Y | — | — |
| Manage departments | Y | — | — |

\*Workers can change status on tickets they created or are assigned to, but cannot close tickets they did not create — they must request close instead. Workers only see tickets assigned to them and tickets they created.

## Ticket Status Workflow

```
Open → In Progress → On Hold → Closed
                                  ↓
                              (Reopen → Open)
```

**Close Request Flow:** Workers assigned to a ticket (but not the creator) cannot close it directly. They submit a close request that a manager or admin must approve or deny.
