# Ticket Management System (Is Istem Yonetim Sistemi)

A role-based ticket management system where users can create, track, and resolve work requests across departments.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **Auth:** JWT

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
node src/seeds/seed.js            # creates test users
node src/seeds/seedCategories.js  # creates sample categories
npm run dev                       # starts on http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev   # starts on http://localhost:5173
```

## Test Users

| Role       | Email                  | Password    |
|------------|------------------------|-------------|
| Admin      | admin@ticketsys.com    | Admin123!   |
| Manager    | manager@ticketsys.com  | Manager123! |
| Worker     | worker@ticketsys.com   | Worker123!  |

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
