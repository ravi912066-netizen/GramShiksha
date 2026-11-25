# GramShiksha – Rural E-Learning & Interactive XR Platform

> **"Learn Without Limits, Grow Without Boundaries."**

**GramShiksha (ग्राम शिक्षा)** is an open, scalable, and resilient educational platform designed specifically for rural education and village learning. The platform bridges the digital education divide through a unified ecosystem:
1. **Interactive Unity XR Client (`unity_client/`)**: Immersive Virtual Reality (VR) village tour, Augmented Reality (AR) tabletop lab, and 3D Interactive Model Inspector with multilingual voiceover support (English & Hindi).
2. **Modern Web Application (`frontend/`)**: React.js, Vite, and Tailwind CSS PWA with offline caching, responsive course catalogs, and interactive student learning interfaces.
3. **Robust Backend API (`backend/`)**: Node.js, Express, Prisma ORM, and PostgreSQL providing student enrollment, multimedia curriculum delivery, analytics, and authentication.

---

## 🥽 Unity VR / AR / 3D Client (`unity_client`)

GramShiksha features a complete Unity XR educational application supporting:
- **Virtual Reality (VR)**: Immersive village walkthrough with XR Origin, locomotion, teleportation, VR ray interactor popups, and an interactive Village Elder guide NPC.
- **Augmented Reality (AR)**: Mobile camera AR placement (AR Foundation, ARCore, ARKit) with multi-touch gestures (drag, pinch-to-scale, rotate) and photo capture.
- **3D Interactive Inspector**: 360° turntable, smooth orbit camera, sub-part highlighting, and bilingual educational explanations.
- **Interactive Models**: Traditional Mud Houses, Primary Schools, Hand Pumps (India Mark II), Agricultural Tractors & Ploughs, Banyan Trees, and Water Resources.

👉 **Full Unity project architecture, C# scripts, scene hierarchies, and build instructions are documented in [unity_client/README.md](unity_client/README.md).**

---

## 1. Project Architecture

The repository maintains independent, modular sub-projects for the backend API, web frontend, and Unity XR client:

```text
GramShiksha/
├── unity_client/                    # Unity VR, AR & 3D Interactive Client
│   ├── Assets/Scripts/              # Core, VR, AR, 3DViewer, UI, and Data systems
│   ├── Assets/Scenes/               # MainMenu, 3D Inspector, VR Tour, AR Lab
│   ├── Packages/manifest.json       # URP, XR Interaction Toolkit, AR Foundation
│   └── README.md                    # Dedicated Unity architecture and setup guide
│
├── backend/                         # Node.js, Express, Prisma ORM, PostgreSQL backend
│   ├── src/
│   │   ├── controllers/             # Auth, Course, Lesson, Enrollment, Progress controllers
│   │   ├── middleware/              # JWT auth and Admin authorization guards
│   │   ├── routes/                  # Express REST API routes
│   │   └── server.js                # Server entry point (Port 5001)
│   ├── prisma/                      # Prisma schema and migrations
│   └── package.json
│
├── frontend/                        # React.js + Vite + Tailwind CSS Single Page Application
│   ├── public/
│   │   ├── favicon.svg              # GramShiksha brand vector icon
│   │   ├── manifest.json            # Web App Manifest for PWA installation
│   │   └── sw.js                    # Service Worker for offline asset caching
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/               # AdminLayout with dedicated management sidebar
│   │   │   ├── common/              # Button, Input, Card, Badge, Modal, Toast, LoadingSpinner
│   │   │   ├── courses/             # CourseCard, CourseFilter, CourseSkeleton
│   │   │   ├── dashboard/           # StatCard, ProgressBar
│   │   │   ├── layout/              # Navbar, Footer, Main Layout
│   │   │   └── lessons/             # VideoPlayer, PdfViewer, NoteViewer, LessonSidebar
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # JWT auth state, hydration, login/logout methods
│   │   │   └── ToastContext.jsx     # Global alert toast notifications
│   │   ├── hooks/
│   │   │   ├── useAuth.js           # Auth context consumer hook
│   │   │   ├── useOnlineStatus.js   # Browser online/offline event listener
│   │   │   └── useToast.js          # Toast notification trigger hook
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ManageCourses.jsx
│   │   │   │   ├── ManageLessons.jsx
│   │   │   │   └── ManageStudents.jsx
│   │   │   ├── CourseDetails.jsx
│   │   │   ├── ExploreCourses.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── LessonPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyLearning.jsx
│   │   │   ├── OfflinePage.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── routes/
│   │   │   ├── AdminRoute.jsx       # Protected route requiring role === "ADMIN"
│   │   │   ├── ProtectedRoute.jsx   # Protected route requiring authentication
│   │   │   └── PublicOnlyRoute.jsx  # Route accessible only when unauthenticated
│   │   ├── services/
│   │   │   ├── adminService.js      # Admin CRUD operations and metric calculations
│   │   │   ├── api.js               # Centralized Axios instance with JWT interceptors
│   │   │   ├── authService.js       # Register, login, and profile API calls
│   │   │   ├── courseService.js     # Public course browse and details API calls
│   │   │   ├── enrollmentService.js # Course enrollment actions
│   │   │   ├── lessonService.js     # Protected lesson access and progress updates
│   │   │   └── userService.js       # Student dashboard, enrollments, and progress
│   │   ├── utils/
│   │   │   ├── validators.js        # Form validation and regex helpers
│   │   │   └── validators.test.js   # Unit validation test suite
│   │   ├── App.jsx                  # Main routing configuration
│   │   ├── index.css                # Tailwind CSS base and components
│   │   └── main.jsx                 # React root and Service Worker registration
│   ├── .env.example                 # Example frontend environment variables
│   ├── index.html                   # HTML entry point with PWA metadata
│   ├── package.json                 # Frontend dependencies and npm scripts
│   ├── tailwind.config.js           # Educational color palette & layout config
│   └── vite.config.js               # Vite configuration
│
└── README.md                        # Project documentation
```

---

## 2. Technology Stack

### Frontend
* **Core:** React 18, Vite 6, JavaScript (ES2022)
* **Styling & UI:** Tailwind CSS (Soft Blue `#2563EB`, Rural Green `#059669`, Neutral Slate), Lucide React Icons
* **Routing:** React Router DOM v6 with role-based routing guards
* **HTTP Client:** Axios with automated Bearer token injection and global 401 interception
* **State Management:** React Context API (`AuthContext`, `ToastContext`)
* **PWA & Offline:** Web App Manifest (`manifest.json`), Service Worker (`sw.js`), and online/offline detection hooks

### Backend (Existing)
* **Runtime:** Node.js, Express 5
* **Database:** PostgreSQL via Prisma ORM
* **Authentication:** bcryptjs password hashing, JSON Web Tokens (JWT)

---

## 3. Backend API Integration Map

The frontend integrates directly with the existing backend REST APIs:

| Domain | Method | Endpoint | Access | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Public | Student account registration |
| **Auth** | `POST` | `/api/auth/login` | Public | User authentication & JWT issuance |
| **User** | `GET` | `/api/users/profile` | Auth | Current user profile |
| **User** | `GET` | `/api/users/dashboard` | Auth | Student dashboard stats & course summary |
| **User** | `GET` | `/api/users/enrollments`| Auth | Enrolled courses list |
| **User** | `GET` | `/api/users/progress` | Auth | Student learning progress records |
| **Courses**| `GET` | `/api/courses` | Public | Explore courses with search & pagination |
| **Courses**| `GET` | `/api/courses/:id` | Public | Course overview & syllabus curriculum |
| **Courses**| `POST` | `/api/courses` | Admin | Create a new course |
| **Courses**| `PUT` | `/api/courses/:id` | Admin | Update existing course |
| **Courses**| `DELETE`| `/api/courses/:id`| Admin | Delete course & cascade to lessons |
| **Courses**| `POST` | `/api/courses/:id/enroll` | Auth | Enroll in course |
| **Courses**| `GET` | `/api/courses/:id/enrollment-status` | Auth | Check enrollment status |
| **Courses**| `GET` | `/api/courses/:id/lessons` | Public | Public lesson outline |
| **Courses**| `GET` | `/api/courses/:id/lessons/access` | Auth (Enrolled) | Full lessons with protected `contentUrl` |
| **Lessons**| `GET` | `/api/lessons/:id` | Auth (Enrolled) | Lesson content viewer |
| **Lessons**| `POST` | `/api/lessons/:id/progress` | Auth (Enrolled) | Toggle completion status |
| **Lessons**| `POST` | `/api/courses/:id/lessons` | Admin | Create a lesson for course |
| **Lessons**| `PUT` | `/api/lessons/:id` | Admin | Update lesson content |
| **Lessons**| `DELETE`| `/api/lessons/:id`| Admin | Delete lesson |
| **Admin** | `GET` | `/api/admin/dashboard`| Admin | Verify admin credentials |

### Backend Integration Notes
* **Student Directory (`GET /api/admin/students`)**: Currently pending implementation on the backend. The frontend provides a clear integration notice banner on the `ManageStudents` page and is architecturally wired in `adminService.js` to immediately display student records once deployed.
* **Platform Metrics**: Total course, lesson, and enrollment counts in the Admin Dashboard are computed in real time from database records fetched via `GET /api/courses?limit=100`.

---

## 4. Progressive Web App (PWA) & Offline Capabilities

To support rural students with intermittent or low-bandwidth internet connectivity:
1. **Application Manifest:** Configured via `frontend/public/manifest.json` enabling one-click mobile installation to home screens.
2. **Service Worker:** Located at `frontend/public/sw.js`, caching static bundles (HTML, JS, CSS) and caching course metadata.
3. **Offline Detection:** `useOnlineStatus` hook detects network drops and renders a persistent `OfflineBanner` across the site.
4. **Offline Fallback:** Accessible at `/offline` with study tips for studying downloaded materials offline.

---

## 5. Security & Authentication Strategy

* **Token Handling:** JSON Web Tokens issued by the backend are stored in `localStorage` for PWA persistence across sessions.
* **Axios Interceptors:** Every request automatically attaches `Authorization: Bearer <token>`.
* **Expired Token Interception:** Responses returning `401 Unauthorized` automatically trigger session cleanup, clearing local storage and dispatching an unauthorized event to reset `AuthContext`.
* **Role Protection:**
  * `ProtectedRoute`: Redirects unauthenticated guests to `/login`, preserving the intended destination in router state.
  * `AdminRoute`: Verifies both active session and `role === "ADMIN"`. Student accounts attempting to access `/admin/*` are automatically redirected to `/dashboard`.
  * `PublicOnlyRoute`: Prevents logged-in users from accessing `/login` and `/register`.

---

## 6. Getting Started & Local Setup

### Prerequisites
* **Node.js:** v18.0.0 or later (tested on v25)
* **npm:** v9.0.0 or later

### Backend Setup (Separate Terminal)
```bash
cd backend
npm install
# Ensure .env contains DATABASE_URL and JWT_SECRET
npm run dev
# Backend server runs on http://localhost:5001
```

### Frontend Setup (Separate Terminal)
```bash
cd frontend
npm install

# Copy environment template
cp .env.example .env

# Start the Vite development server
npm run dev
# Frontend application runs on http://localhost:5173
```

### Running Unit Tests
```bash
cd frontend
npm test
```

### Building for Production
```bash
cd frontend
npm run build
```

---

## 7. Git Commit History (10 Incremental Commits)

The entire frontend was built incrementally through exactly 10 distinct, verified commits on the `feature/frontend` branch:

1. `feat: initialize React frontend and responsive design system`
   * Initialized React + Vite in `frontend/`, configured Tailwind CSS, Lucide icons, base layout components (`Navbar`, `Footer`, `Layout`), and design system primitives.
2. `feat: implement landing page and authentication UI`
   * Built rural education landing page with hero, featured tracks, value propositions, and authentication UI (`Login.jsx`, `Register.jsx`, `Toast.jsx`).
3. `feat: integrate JWT authentication and protected routes`
   * Built centralized Axios client (`api.js`), `authService.js`, `AuthContext.jsx`, `useAuth.js`, and route guards (`ProtectedRoute`, `AdminRoute`, `PublicOnlyRoute`).
4. `feat: implement student dashboard and profile`
   * Integrated `GET /api/users/dashboard` and `/api/users/profile`, stat cards, learning progress bar, and user profile page.
5. `feat: integrate course browsing and course details`
   * Built `ExploreCourses.jsx` with search, subject filter, and pagination; built `CourseDetails.jsx` with public curriculum outline and enrollment status.
6. `feat: implement student enrollment and my learning`
   * Integrated course enrollment action (`POST /api/courses/:id/enroll`) and created `MyLearning.jsx` with active course progress filters.
7. `feat: build lesson learning interface and progress tracking`
   * Implemented `LessonPage.jsx` supporting `VIDEO`, `PDF`, and `NOTE` viewers, curriculum sidebar, and lesson progress completion toggle.
8. `feat: implement admin dashboard and course management`
   * Created dedicated `AdminLayout.jsx`, `AdminDashboard.jsx` with platform metric aggregation, and full course CRUD operations in `ManageCourses.jsx`.
9. `feat: add lesson management and PWA offline support`
   * Built `ManageLessons.jsx`, `ManageStudents.jsx`, PWA manifest, service worker (`sw.js`), and online/offline detection banner.
10. `test: validate frontend integration and update documentation`
    * Added validation test suite, verified zero build warnings, and authored comprehensive repository documentation in `README.md`.
