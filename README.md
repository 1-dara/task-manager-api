# Task Manager API

A production-grade task management backend built with **Node.js**, **Express**, and **PostgreSQL** via **Prisma ORM**. Deployed and live.

 **Live API:** https://task-manager-api-n7wv.onrender.com  
 **GitHub:** https://github.com/1-dara/task-manager-api
---

## Features

- **JWT Authentication** — Secure register and login with access tokens
- **Task CRUD** — Create, read, update and delete tasks
- **Task Properties** — Title, description, status, priority and due date
- **Filters** — Filter tasks by status and priority
- **Protected Routes** — All task endpoints require authentication
- **User Isolation** — Users can only access their own tasks 

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express | Web framework |
| PostgreSQL | Database |
| Prisma ORM | Database access and schema management |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Render | Deployment |

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login and get JWT token | ❌ |

### Tasks
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/tasks` | Get all tasks (filter by status/priority) | ✅ |
| POST | `/api/tasks` | Create a new task | ✅ |
| GET | `/api/tasks/:id` | Get a single task | ✅ |
| PUT | `/api/tasks/:id` | Update a task | ✅ |
| DELETE | `/api/tasks/:id` | Delete a task | ✅ |

---

## Setup & Installation

1. **Clone the repository**
```bash
git clone https://github.com/1-dara/task-manager-api.git
cd task-manager-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Create a `.env` file**
```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-secret-key"
```

4. **Generate Prisma client**
```bash
npx prisma generate
```

5. **Push schema to database**
```bash
npx prisma db push
```

6. **Start the server**
```bash
npm run dev
```

---

##  Author

**Irene Peter-Okon Idara**  
**Backend Engineer**
**Email** - 1ireneokon@gmail.com  
**Git** - github.com/1-dara