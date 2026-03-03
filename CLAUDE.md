# Ticket Management System (Is Istem Yonetim Sistemi)

## Tech Stack
- **Frontend**: React (Vite + React Router)
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Auth**: JWT (jsonwebtoken + bcryptjs)

## Project Structure
```
odo/
├── backend/
│   ├── src/
│   │   ├── config/          # Database and env config
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/       # Auth, role-guard, validation
│   │   ├── models/          # Database query functions
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic layer
│   │   ├── utils/           # Helpers (logger, errors)
│   │   └── seeds/           # Seed data scripts
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Shared UI components
│   │   ├── pages/           # Route-level page components
│   │   ├── context/         # React context (auth)
│   │   ├── services/        # API client functions
│   │   └── utils/           # Helpers, constants
│   └── package.json
├── docs/
│   └── er-diagram.png       # ER diagram (required)
├── CLAUDE.md
└── README.md
```

## Database Schema

### Tables
1. **roles** - id, name (admin/manager/worker), description
2. **departments** - id, name (IT/HR/Finance/Operations/General), description
3. **users** - id, email, password_hash, first_name, last_name, role_id (FK), department_id (FK), is_active, created_at, updated_at
4. **categories** - id, name, description, department_id (FK), is_active, created_at
5. **tickets** - id, title, description, category_id (FK), priority (enum), status (enum), created_by (FK users), assigned_to (FK users), department_id (FK), close_requested_at, close_requested_by (FK users), created_at, updated_at
6. **ticket_history** - id, ticket_id (FK), changed_by (FK users), field_changed, old_value, new_value, created_at

### Enums
- **priority**: low, medium, high, critical
- **status**: open, in_progress, on_hold, closed
- **role**: admin, manager, worker

## Roles & Permissions

| Action                     | Admin | Manager | Worker |
|---------------------------|-------|---------|--------|
| Create users              | Y     | N       | N      |
| Assign roles              | Y     | N       | N      |
| Manage categories         | Y     | N       | N      |
| View all tickets          | Y     | N       | N      |
| View department tickets   | Y     | Y       | N      |
| Create tickets            | Y     | Y       | Y      |
| Edit ticket fields        | Y     | N       | N      |
| Update ticket status      | Y     | Y       | Y*     |
| Change priority           | Y     | Y       | N      |
| Close tickets (own)       | Y     | Y       | Y**    |
| Request close (assigned)  | N     | N       | Y***   |
| Approve/deny close req    | Y     | Y       | N      |
| Assign tickets            | Y     | Y       | N      |
| Self-assign (dept pool)   | N     | N       | N      |

*Worker can change status on tickets they created or are assigned to (except closing assigned-only tickets).
**Worker can close tickets they created directly.
***Worker requests close on tickets assigned to them (not created by them); manager/admin approves or denies.

## Implementation Phases

### Phase 1: Authentication & Authorization
- [x] Project scaffolding (backend + frontend)
- [x] MySQL database + tables (users, roles, departments)
- [x] JWT login endpoint (POST /api/auth/login)
- [x] GET /api/auth/me - current user info
- [x] Auth middleware (verifyToken)
- [x] Role-guard middleware (requireRole)
- [x] Seed 3 test users
- [x] React login page
- [x] Auth context + protected routes
- [x] Role-based dashboard stub

### Phase 2: User Management (Admin)
- [x] GET /api/users - list users (admin only)
- [x] POST /api/users - create user (admin only)
- [x] PUT /api/users/:id - update user (admin only)
- [x] DELETE /api/users/:id - deactivate user (admin only)
- [x] Admin user management page
- [x] Role assignment UI

### Phase 3: Category Management
- [x] CRUD /api/categories (admin only)
- [x] Category-department linking
- [x] Admin category management page

### Phase 4: Ticket CRUD (CURRENT)
- [x] POST /api/tickets - create ticket
- [x] GET /api/tickets - list tickets (role-filtered)
- [x] GET /api/tickets/:id - ticket detail
- [x] PUT /api/tickets/:id - update ticket
- [x] PUT /api/tickets/:id/status - change status
- [x] PUT /api/tickets/:id/assign - assign ticket (admin/manager)
- [x] GET /api/tickets/:id/history - ticket history
- [x] Ticket status transition validation (open->in_progress->on_hold->closed)
- [x] Ticket history logging
- [x] Frontend: ticket list, detail, create form

### Phase 5: Ticket Workflow & Department Management
- [x] Ticket assignment (manager assigns to self or worker)
- [x] Priority update (manager/admin only)
- [x] Status change with history tracking
- [x] Reopen closed tickets (closed -> open)
- [x] Department-filtered views for managers
- [x] CRUD /api/departments (admin only)
- [x] Admin department management page

### Phase 6: Dashboard & Polish
- [x] Role-based dashboard with stats
- [x] Ticket filtering/sorting
- [x] ER diagram generation
- [x] README documentation
- [x] Final cleanup and testing

## API Endpoints

### Auth
- `POST /api/auth/login` - Login with email/password, returns JWT
- `GET /api/auth/me` - Get current user (requires token)

### Users (Phase 2)
- `GET /api/users` - List users (admin, manager)
- `POST /api/users` - Create user (admin)
- `PUT /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Deactivate user (admin)

### Categories (Phase 3)
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Deactivate category (admin)

### Tickets (Phase 4-5)
- `GET /api/tickets` - List tickets (role-filtered, supports `scope=crossDeptCreated` for workers)
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/:id` - Get ticket detail
- `PUT /api/tickets/:id` - Update ticket
- `PUT /api/tickets/:id/status` - Change status
- `PUT /api/tickets/:id/assign` - Assign ticket (manager/admin)
- `PUT /api/tickets/:id/request-close` - Worker requests close on assigned ticket
- `PUT /api/tickets/:id/close-request` - Manager/admin approves or denies close request (`{ action: "approve" | "deny" }`)
- `GET /api/tickets/:id/history` - Get ticket history

### Departments (Phase 5)
- `GET /api/departments` - List departments
- `POST /api/departments` - Create department (admin)
- `PUT /api/departments/:id` - Update department (admin)
- `DELETE /api/departments/:id` - Deactivate department (admin)

### Dashboard (Phase 6)
- `GET /api/dashboard/stats` - Dashboard statistics (role-filtered)

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

## Git Workflow
- Conventional commits: feat:, fix:, refactor:, docs:, chore:
- Small, logical commits per feature
- Feature branches when applicable
