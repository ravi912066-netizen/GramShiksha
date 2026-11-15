# GramShiksha – Rural E-Learning Platform

**Learn Without Limits, Grow Without Boundaries.**

GramShiksha is a rural e-learning platform designed to make quality education accessible to students from rural areas. It provides a digital learning environment where students can explore courses, enroll in courses, access study materials, and track their learning progress.

## Project Overview

The goal of GramShiksha is to reduce educational accessibility barriers by providing a simple and structured online learning platform.

The platform supports two user roles:

- **Student:** Explore courses, enroll, access lessons, and track learning progress.
- **Admin:** Manage courses, lessons, students, and platform statistics.

## Technology Stack

| Layer | Technology |
|---|---|
| Backend | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma ORM 7 |
| Authentication | JWT |
| Password Security | bcryptjs |
| API Testing | Postman |
| Frontend | React.js (planned) |

## Implemented Backend Features

### 1. Authentication
- Student registration.
- User login.
- Password hashing using bcryptjs.
- JWT-based authentication.
- Protected routes.

### 2. Course Management
- Create courses.
- View all courses.
- Search courses by title.
- Filter courses by subject.
- View course details.
- Update and delete courses.
- Pagination support.

### 3. Lesson Management
- Create lessons.
- View lessons.
- Update lessons.
- Delete lessons.
- Support VIDEO, PDF, and NOTE lesson types.

### 4. Student Enrollment
- Enroll in courses.
- Prevent duplicate enrollments.
- Check enrollment status.
- View enrolled courses.

### 5. Learning Progress
- Mark lessons as completed.
- Track completed and pending lessons.
- Calculate course completion percentage.
- View student learning progress.

### 6. Admin Management
- Admin dashboard.
- User management.
- Course management.
- Platform statistics.
- Enrollment analytics.

### 7. Security
- JWT authentication.
- Role-based authorization.
- Input validation.
- Centralized error handling.
- Secure password storage.
- Protected learning content.

## Project Structure

```text
GramShiksha/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── config/
│   │   └── db.js
│   │
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── README.md
└── frontend/ (planned)
```

*Note: Adjust the structure to match the actual repository files.*

## Installation and Setup

### Prerequisites

- Node.js
- npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/ravi912066-netizen/GramShiksha.git

cd GramShiksha
```

### 2. Navigate to backend

```bash
cd backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the backend folder.

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/gramshiksha_db?schema=public"

PORT=5001

JWT_SECRET="YOUR_SECRET_KEY"

JWT_EXPIRES_IN="1d"
```

Replace the database password and JWT secret with your own values.

Never upload your actual `.env` file to GitHub.

### 5. Run database migrations

Use the Prisma configuration and migration commands appropriate to the installed Prisma 7 setup:

```bash
npx prisma migrate deploy
npx prisma generate
```

For local development, use `npx prisma migrate dev` when creating new migrations.

### 6. Start the server

```bash
npm run dev
```

Server URL:

```text
http://localhost:5001
```

Health check:

```text
GET http://localhost:5001/health
```

## API Endpoints

Base URL:

```text
http://localhost:5001/api
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Register student |
| POST | /auth/login | Login user |

### Courses

| Method | Endpoint | Description |
|---|---|---|
| GET | /courses | Get all courses |
| GET | /courses/:id | Get course details |
| POST | /courses | Create course |
| PUT | /courses/:id | Update course |
| PATCH | /courses/:id | Partially update course |
| DELETE | /courses/:id | Delete course |

### Lessons

| Method | Endpoint | Description |
|---|---|---|
| POST | /courses/:courseId/lessons | Create lesson |
| GET | /courses/:courseId/lessons | Get course lessons |
| GET | /lessons/:id | Get lesson |
| PUT | /lessons/:id | Update lesson |
| DELETE | /lessons/:id | Delete lesson |

### Enrollment

| Method | Endpoint | Description |
|---|---|---|
| POST | /courses/:courseId/enroll | Enroll in course |
| GET | /users/enrollments | Get enrolled courses |
| GET | /courses/:courseId/enrollment-status | Check enrollment |

### Student Dashboard and Progress

| Method | Endpoint | Description |
|---|---|---|
| GET | /users/dashboard | Student dashboard |
| POST | /lessons/:lessonId/progress | Update lesson progress |
| GET | /lessons/:lessonId/progress | Get lesson progress |
| GET | /users/progress | Get learning progress |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| GET | /admin/dashboard | Admin dashboard |
| GET | /admin/users | Get users |
| GET | /admin/courses | Get courses |
| GET | /admin/stats | Get platform statistics |

Protected endpoints require a valid JWT access token.

Use this authorization header:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Testing

Run the automated backend test suite:

```bash
npm test
```

The current implementation report states that 29 automated tests passed. Re-run the tests to verify the current repository state.

## Git Development History

The backend implementation was organized into 10 meaningful commits:

1. Course read and search APIs.
2. Course update and delete APIs.
3. Lesson management APIs.
4. Student course enrollment.
5. Student learning dashboard.
6. Protected lesson access.
7. Learning progress tracking.
8. Admin management and analytics.
9. Security and error handling.
10. Automated tests and API documentation.

## Future Enhancements

- React-based student frontend.
- Admin dashboard UI.
- Progressive Web App (PWA).
- Offline learning support.
- Better mobile learning experience.
- Additional assessment and quiz functionality.

## Project Information

**Project Name:** GramShiksha

**Category:** Rural E-Learning Platform

**Backend Developer:** Ravi Yadav

**Repository:** https://github.com/ravi912066-netizen/GramShiksha

---

**GramShiksha – Making Education Accessible to Everyone.**
