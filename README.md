# Real-Time Client Project Dashboard

A full-stack web application for managing client projects with role-based access control and real-time activity tracking built for Velozity Global Solutions Technical Assessment.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (Node 20 may have compatibility issues - use Node 18 recommended)
- npm or yarn
- No PostgreSQL installation needed (using Neon cloud database)

### Installation Steps

**Step 1: Setup Environment Files**
```bash
setup.bat
```

**Step 2: Install Backend**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

**Step 3: Install Frontend**
```bash
cd frontend
npm install --legacy-peer-deps
```

**Step 4: Start Application**

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
set NODE_OPTIONS=--openssl-legacy-provider
npm start
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@company.com | Admin@123 |
| **Project Manager** | pm1@company.com | PM@123 |
| **Developer** | dev1@company.com | Dev@123 |

---

## 📋 Features

### Role-Based Access Control
- **Admin**: Full system access - manage users, view all projects
- **Project Manager**: Create/manage own projects, assign tasks, view team activity
- **Developer**: View assigned tasks only, update task status

### Real-Time Features
- Live activity feed with WebSocket (Socket.io)
- Real-time notifications
- Online user count
- Instant task updates across all connected clients
- Missed event catchup on reconnection

### Task Management
- Create, update, delete tasks
- Status tracking (TODO, IN_PROGRESS, IN_REVIEW, DONE)
- Priority levels (LOW, MEDIUM, HIGH, CRITICAL)
- Due date management
- Automatic overdue detection (background job)
- Task assignment to developers

### Dashboard
- Role-specific statistics
- Task breakdown by status and priority
- Overdue task alerts
- Upcoming due dates

---

## 🏗️ Tech Stack

### Backend
- **Node.js + Express** - REST API server
- **TypeScript** - Type-safe development
- **PostgreSQL (Neon)** - Cloud database
- **Prisma ORM** - Database access with type safety
- **Socket.io** - WebSocket for real-time updates
- **JWT** - Authentication with refresh tokens
- **node-cron** - Background job scheduler
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe components
- **Socket.io-client** - Real-time communication
- **Axios** - HTTP client with interceptors
- **React Router** - Client-side routing
- **Context API** - State management

---

## 📁 Project Structure

```
project-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/      # API route handlers
│   │   ├── middleware/       # Auth & role middleware
│   │   ├── routes/           # API routes
│   │   ├── jobs/             # Background jobs
│   │   ├── socket/           # WebSocket handlers
│   │   ├── config/           # JWT configuration
│   │   ├── utils/            # Helper functions
│   │   └── server.ts         # Entry point
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── seed.ts           # Seed data
│   │   └── migrations/       # Database migrations
│   ├── .env                  # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API & Socket services
│   │   ├── context/          # React context (Auth)
│   │   ├── types/            # TypeScript types
│   │   └── App.tsx           # Main app component
│   ├── public/
│   ├── .env                  # Environment variables
│   └── package.json
│
├── docker-compose.yml        # Docker configuration
├── setup.bat                 # Environment setup
├── INSTALL.bat              # Dependency installer
├── setup-db.bat             # Database setup
├── START.bat                # Start both servers
├── README.md                # This file
├── START_HERE.md            # Quick start guide
├── TESTING_GUIDE.md         # Testing instructions
├── SUBMISSION.md            # Submission details
└── EXPLANATION.md           # Technical explanation
```

---

## 🗄️ Database Schema

### Tables
- **User** - Users with roles (Admin, PM, Developer)
- **RefreshToken** - JWT refresh tokens
- **Project** - Client projects
- **Task** - Project tasks with status, priority, due dates
- **Activity** - Activity log for task changes
- **Notification** - In-app notifications

### Key Indexes
- `users.email` - Unique index for login
- `tasks.projectId` - Index for project queries
- `tasks.assignedTo` - Index for developer queries
- `tasks.status` - Index for filtering
- `tasks.dueDate` - Index for overdue detection
- `activities.projectId + createdAt` - Composite index for feed
- `notifications.userId + isRead` - Composite index for notifications

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and clear tokens

### Projects
- `GET /api/projects` - List projects (role-filtered)
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create project (Admin/PM)
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - List tasks (role-filtered)
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update status
- `DELETE /api/tasks/:id` - Delete task

### Activities
- `GET /api/activities` - Get activity feed
- `GET /api/activities/missed` - Get missed activities

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all as read

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard stats

### Users (Admin only)
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

---

## 🔌 WebSocket Events

### Client → Server
- `join:project` - Join project room for updates
- `leave:project` - Leave project room

### Server → Client
- `task:updated` - Task status changed
- `activity:new` - New activity in feed
- `notification:new` - New notification
- `users:online` - Online user count updated

---

## 🛠️ Common Issues & Solutions

### Issue 1: TypeScript Version Conflict (Frontend)
```bash
cd frontend
npm install --legacy-peer-deps --force
```

### Issue 2: Prisma OpenSSL Error
```bash
cd backend
set PRISMA_ENGINES_MIRROR=https://binaries.prisma.sh
npm install @prisma/client@5.9.1 prisma@5.9.1 --save-exact
npx prisma generate
```

### Issue 3: Port 5000 Already in Use
```bash
# Check what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Issue 4: Node 20 Compatibility
If using Node 20, set this before starting frontend:
```bash
set NODE_OPTIONS=--openssl-legacy-provider
```

Or downgrade to Node 18 (recommended).

### Issue 5: ts-node Seed Error
```bash
cd backend
npm install ts-node@10.9.2 --save-dev
npx prisma db seed
```

### Issue 6: Complete Clean Install

**Backend:**
```bash
cd backend
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

**Frontend:**
```bash
cd frontend
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install --legacy-peer-deps --force
set NODE_OPTIONS=--openssl-legacy-provider
npm start
```

---

## 🐳 Docker Setup

If manual setup is problematic:

1. Install Docker Desktop
2. Start Docker Desktop
3. Run:
```bash
docker-compose up --build
```

This will start both backend and frontend in containers.

---

## 🧪 Testing

### Check if Services are Running

**Backend Health Check:**
```bash
curl http://localhost:5000/health
```

**Frontend:**
Open http://localhost:3000 in browser

### Database Connection Test
```bash
cd backend
npx prisma studio
```

This opens Prisma Studio in browser to view/edit database.

### Real-Time Testing
1. Open two browser windows
2. Login as PM in one, Developer in another
3. Update task status in one window
4. See real-time update in the other window

---

## 🏛️ Architecture Decisions

### WebSocket Library: Socket.io
- **Why**: Automatic reconnection, room-based broadcasting, fallback to long-polling
- **Alternative**: Native WebSocket - rejected due to lack of automatic reconnection

### Job Queue: node-cron
- **Why**: Simple, in-process scheduler for periodic overdue checks
- **Alternative**: Bull - rejected as overkill for single scheduled job

### Token Storage
- **Access Token**: localStorage (short-lived, 15min)
- **Refresh Token**: HttpOnly cookie (long-lived, 7 days)
- **Why**: Prevents XSS attacks on refresh token

### Database: PostgreSQL with Prisma
- **Why**: Relational data with proper foreign keys, type-safe queries
- **Neon**: Serverless PostgreSQL for easy deployment

---

## 📝 Seed Data

The database is pre-populated with:
- 1 Admin user
- 2 Project Managers
- 4 Developers
- 3 Projects (E-Commerce, Banking App, Healthcare Portal)
- 16 Tasks across all projects
- 2 Overdue tasks
- Activity logs
- Sample notifications

---

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secrets (32+ characters)
3. Enable HTTPS
4. Set secure cookie flags
5. Configure CORS properly
6. Use Redis adapter for Socket.io (for horizontal scaling)
7. Set up proper logging (Winston/Pino)
8. Configure rate limiting
9. Set up monitoring (PM2/New Relic)
10. Enable database connection pooling

---

## 📚 Additional Documentation

- **START_HERE.md** - Quick start guide
- **TESTING_GUIDE.md** - Complete testing instructions
- **SUBMISSION.md** - Submission details and checklist
- **EXPLANATION.md** - Technical implementation explanation (150-250 words)
- **QUICK_START.md** - Detailed setup guide
- **SETUP_COMPLETE.md** - Feature overview and testing guide

---

## 🎯 Submission

**Submit at**: https://bit.ly/4bGXmZV

**Deadline**: 25/03/2026, 11:59 PM IST

---

## 📄 License

MIT

---


---

