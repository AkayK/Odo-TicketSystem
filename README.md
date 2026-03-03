# odo

**A modern, role-based ticket management system for teams.**

odo helps organizations manage work requests across departments with a clean, intuitive interface. Built for teams that need clear ownership, status tracking, and departmental workflows.

---

## Features

### Role-Based Access Control

Three distinct roles with tailored permissions:

| Capability | Admin | Manager | Worker |
|---|:---:|:---:|:---:|
| View all tickets | ✓ | — | — |
| View department tickets | ✓ | ✓ | —** |
| Create tickets | ✓ | ✓ | ✓ |
| Edit ticket details | ✓ | — | — |
| Change priority | ✓ | ✓ | — |
| Change status | ✓ | ✓ | ✓* |
| Close own tickets | ✓ | ✓ | ✓ |
| Request close (assigned) | — | — | ✓ |
| Approve/deny close request | ✓ | ✓ | — |
| Assign tickets | ✓ | ✓ | — |
| Manage users | ✓ | — | — |
| Manage categories | ✓ | — | — |
| Manage departments | ✓ | — | — |

\*Workers can change status on tickets they created or are assigned to, but cannot close tickets they did not create — they must request close instead.
\*\*Workers only see tickets assigned to them and tickets they created. They cannot view the full department ticket list or self-assign unassigned tickets.

### Dashboard

Role-aware dashboard with real-time statistics:

- **Total tickets**, open, in-progress, and unassigned counts
- **Status distribution** — visual breakdown of ticket states
- **Priority distribution** — see how work is prioritized
- **Department breakdown** — admin-only cross-department overview
- **Recent activity** — latest updated tickets at a glance
- **Quick navigation** — jump to tickets, users, categories, or departments

### Ticket Management

Full lifecycle tracking from creation to resolution:

- **Create tickets** with title, description, category, and priority
- **Status workflow**: Open → In Progress → On Hold → Closed (with reopen)
- **Priority levels**: Low, Medium, High, Critical
- **Category system** — tickets organized by department-linked categories
- **Assignment** — admins and managers assign tickets to team members; workers cannot self-assign
- **Close request workflow** — workers who are assigned to a ticket (but didn't create it) cannot close it directly; instead they submit a close request that their manager or admin must approve or deny. Workers who created a ticket can close it themselves.
- **Split ticket views** — workers see tickets assigned to them and tickets they created, with a separate section for tickets they created in other departments
- **History log** — every field change tracked with who, what, and when; user names resolved for assignment changes, human-readable labels for status and priority

### Server-Side Filtering & Sorting

Powerful ticket list with:

- **Search** — find tickets by title or description
- **Filter by** status, priority, category, department, and assignee
- **Sort by** any column (created date, updated date, title, priority, status)
- **Unassigned filter** — quickly find tickets needing assignment

### User Management (Admin)

- Create, edit, and deactivate users
- Assign roles and departments
- View all users across the organization

### Category Management (Admin)

- Create and manage ticket categories
- Link categories to departments
- Activate/deactivate categories without losing data

### Department Management (Admin)

- Create and manage departments
- View department descriptions
- Activate/deactivate departments

### Authentication & Security

- JWT-based authentication with automatic session expiry
- Role-enforced API endpoints
- Rate limiting on write operations
- Input validation and sanitization
- Automatic redirect on session timeout

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router 7 |
| Backend | Node.js, Express 5 |
| Database | MySQL 8 |
| Auth | JWT (jsonwebtoken + bcryptjs) |

---

## Quick Start

See [INSTALLATION.md](INSTALLATION.md) for full setup instructions.

---

## Architecture

```
odo/
├── backend/          # Express API server
│   ├── controllers/  # Request handlers
│   ├── services/     # Business logic
│   ├── models/       # Database queries
│   ├── middleware/    # Auth & validation
│   └── routes/       # API endpoints
├── frontend/         # React SPA
│   ├── pages/        # Route-level components
│   ├── components/   # Shared UI
│   ├── services/     # API client
│   └── context/      # Auth state
└── docs/             # ER diagram
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user |
| `GET` | `/api/auth/me` | Current user info |
| `GET` | `/api/dashboard/stats` | Dashboard statistics |
| `GET` | `/api/tickets` | List tickets (filtered) |
| `POST` | `/api/tickets` | Create ticket |
| `GET` | `/api/tickets/:id` | Ticket detail |
| `PUT` | `/api/tickets/:id` | Update ticket |
| `PUT` | `/api/tickets/:id/status` | Change status |
| `PUT` | `/api/tickets/:id/assign` | Assign ticket |
| `PUT` | `/api/tickets/:id/request-close` | Worker requests close |
| `PUT` | `/api/tickets/:id/close-request` | Approve/deny close request |
| `GET` | `/api/tickets/:id/history` | Ticket history |
| `GET` | `/api/users` | List users |
| `POST` | `/api/users` | Create user |
| `PUT` | `/api/users/:id` | Update user |
| `DELETE` | `/api/users/:id` | Deactivate user |
| `GET` | `/api/categories` | List categories |
| `POST` | `/api/categories` | Create category |
| `PUT` | `/api/categories/:id` | Update category |
| `DELETE` | `/api/categories/:id` | Deactivate category |
| `GET` | `/api/departments` | List departments |
| `POST` | `/api/departments` | Create department |
| `PUT` | `/api/departments/:id` | Update department |
| `DELETE` | `/api/departments/:id` | Deactivate department |

