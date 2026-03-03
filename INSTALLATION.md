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

| Role            | Email                        | Password     | Department       |
|----------------|------------------------------|-------------|------------------|
| Admin           | admin@ticketsys.com          | Admin123!   | —                |
| IT Manager      | it.manager@ticketsys.com     | Manager123! | IT               |
| IT Worker 1     | it.worker1@ticketsys.com     | Worker123!  | IT               |
| IT Worker 2     | it.worker2@ticketsys.com     | Worker123!  | IT               |
| HR Manager      | hr.manager@ticketsys.com     | Manager123! | HR               |
| HR Worker       | hr.worker1@ticketsys.com     | Worker123!  | HR               |
| Finance Manager | fin.manager@ticketsys.com    | Manager123! | Finance          |
| Finance Worker  | fin.worker1@ticketsys.com    | Worker123!  | Finance          |
| Ops Manager     | ops.manager@ticketsys.com    | Manager123! | Operations       |
| Ops Worker      | ops.worker1@ticketsys.com    | Worker123!  | Operations       |
| Mkt Manager     | mkt.manager@ticketsys.com    | Manager123! | Marketing        |
| Mkt Worker      | mkt.worker1@ticketsys.com    | Worker123!  | Marketing        |
| CS Manager      | cs.manager@ticketsys.com     | Manager123! | Customer Support |
| CS Worker       | cs.worker1@ticketsys.com     | Worker123!  | Customer Support |

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
