# 🚀 START HERE - Quick Setup Guide

## Step-by-Step Installation (Windows)

### Step 1: Setup Environment Files
```bash
setup.bat
```
This creates `.env` files with database configuration.

### Step 2: Install Dependencies
```bash
INSTALL.bat
```
This installs all npm packages for backend and frontend.

### Step 3: Setup Database
```bash
setup-db.bat
```
This generates Prisma client, runs migrations, and seeds the database.

### Step 4: Start Application
```bash
START.bat
```
This starts both backend and frontend servers.

---

## Alternative: One Command Setup

Run all steps at once:
```bash
setup.bat && INSTALL.bat && setup-db.bat && START.bat
```

---

## Alternative: Docker Setup

```bash
docker-compose up -d
```

---

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | Admin@123 |
| PM | pm1@company.com | PM@123 |
| Developer | dev1@company.com | Dev@123 |

---

## Troubleshooting

### If you get TypeScript errors in frontend:
```bash
cd frontend
npm install --legacy-peer-deps
```

### If you get Prisma errors in backend:
```bash
cd backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### If ports are already in use:
Edit `backend/.env` and change PORT to 5001
Edit `frontend/.env` and update URLs to use port 5001

### If database connection fails:
Check that `backend/.env` has the correct DATABASE_URL

---

## What to Test

1. **Login** with different roles (Admin, PM, Developer)
2. **Create a project** (as Admin or PM)
3. **Create tasks** and assign to developers
4. **Open two browser windows** and update a task in one - see real-time update in the other
5. **Check notifications** when tasks are assigned or moved to review
6. **View activity feed** to see who did what and when

---

## Need Help?

- Check **README.md** for full documentation
- Check **TESTING_GUIDE.md** for comprehensive testing instructions
- Check **QUICK_START.md** for detailed setup guide
- Check **SETUP_COMPLETE.md** for feature overview

---

## Submission

When ready to submit:
- Check **SUBMISSION.md** for submission details
- Submit at: https://bit.ly/4bGXmZV

---

Good luck! 🎉
