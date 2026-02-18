# Felicity Event Management System - Implementation Tasks

## Phase 1: Core Backend (The Engine)
*Status: Mostly Complete*

### 1.1 Initialization & Configuration
- [x] **Project Setup**: Node.js, Express, MongoDB connection.
- [x] **Security Packages**: Install `bcrypt` (hashing), `jsonwebtoken` (auth), `cors`, `dotenv`.
- [x] **Database Models**:
  - [x] `User` (Base schema for Auth).
  - [x] `Participant` (Profile details).
  - [x] `Organizer` (Club details).
  - [x] `Event` (Attributes, Dates, Registration Limit).

### 1.2 Authentication & Authorization
- [x] **Registration**:
  - [x] Participant Signup (IIIT email validation logic).
  - [x] Organizer Creation (Admin only - via backend seed or endpoint).
- [x] **Login**:
  - [x] JWT Token generation.
  - [x] Password hashing with bcrypt.
- [x] **Middleware**:
  - [x] `verifyToken` for protected routes.
  - [x] Role-based access control (Admin vs Organizer vs Participant).

### 1.3 Event Management API
- [x] **CRUD Operations**:
  - [x] `POST /create`: Create Event (Organizer only).
  - [x] `GET /all`: Fetch all events.
  - [x] `PUT /update/:id`: Edit event details (Organizer only).
  - [x] `DELETE /delete/:id`: Remove event (Organizer only).
- [x] **Registration Logic**:
  - [x] `POST /register/:id`: Handle participant registration.
  - [x] Validation: Check deadlines and registration limits.

### 1.4 Remaining Backend Tasks
- [ ] **Email Service**: Implement `nodemailer` to send tickets upon registration.
- [ ] **Advanced Queries**: Implement fuzzy search for events/organizers.
- [ ] **Admin Routes**:
  - [ ] `POST /admin/approve-organizer`: Provision organizer accounts.
  - [ ] `DELETE /admin/remove-user`: Ban/remove users.

---

## Phase 2: Frontend Core (The Interface)
*Status: In Progress*

### 2.1 Initialization
- [x] **Setup**: Vite + React + TypeScript.
- [x] **UI Library**: Shadcn UI components installed (`field`, `card`, `button`, etc.).
- [x] **Routing**: Next.js App Router structure set up.

### 2.2 Dashboard Architecture (Role-Based)
- [x] **Unified Dashboard**: `[userID]/dashboard/page.tsx` created.
- [x] **Security**: URL parameter protection (prevent accessing others' dashboards).
- [x] **Organizer View**:
  - [x] "Create Event" Form (Zod validation + API integration).
  - [ ] **To Do**: Event Analytics & "My Created Events" Carousel.
- [x] **Participant View**:
  - [x] Browse Events (Placeholder created).
  - [ ] **To Do**: Participation History Tab (Tabs: Normal, Merch, Completed).
- [x] **Admin View**:
  - [x] User Management (Placeholder created).
  - [ ] **To Do**: Interface to approve/remove Organizers.

---

## Phase 3: Missing Feature Implementation
*Status: To Do (Critical for PDF Compliance)*

### 3.1 Participant Features
- [ ] **Browse Events Page**:
  - [ ] Implement Search Bar (Fuzzy matching).
  - [ ] Implement Filters: Event Type, Eligibility, Date Range.
  - [ ] "Trending" Section (Top 5 events).
- [ ] **Event Details Page**:
  - [ ] Display full info (Description, Eligibility, Fee).
  - [ ] "Register" Button (Changes to "Registered" if already joined).
- [ ] **Profile Page**:
  - [ ] Editable Fields: Interests, Followed Clubs.
  - [ ] Read-only Fields: Email, Participant Type.

### 3.2 Organizer Features
- [ ] **Event Management**:
  - [ ] **Form Builder**: UI to add custom fields (text, dropdown) to event registration.
  - [ ] **Draft vs Publish**: Logic to save drafts before publishing.
- [ ] **Organizer Analytics**:
  - [ ] View list of registered participants for an event.
  - [ ] Export Participant List to CSV.

### 3.3 Admin Features
- [ ] **Club Management**:
  - [ ] Form to Create New Organizer (Auto-generate password).
  - [ ] List of all Clubs with "Remove" button.
- [ ] **Password Resets**:
  - [ ] View and approve Organizer password reset requests.

---

## Phase 4: Advanced Features (The "Easiest" Path)
*Selection Rationale: Focused on standard CRUD and simple libraries to minimize complexity.*

### 4.1 Tier A: Core Advanced (Choose 2)
- [ ] **1. Merchandise Payment Approval Workflow**
  - *Why:* It is essentially a status update flow.
  - *Task:* Create `Order` model with `status: Pending`. User uploads image (store as Base64 or simple file). Admin clicks "Approve" -> `status: Paid`.
- [ ] **2. QR Scanner & Attendance Tracking**
  - *Why:* Libraries like `react-qr-reader` handle the hard part (camera logic).
  - *Task:* Create Organizer view with Camera. Scan Ticket ID. Backend endpoint `POST /attend` marks `attended: true`.

### 4.2 Tier B: Real-time & Communication (Choose 2)
- [ ] **1. Organizer Password Reset Workflow**
  - *Why:* Pure CRUD operation. No sockets or complex real-time logic required.
  - *Task:* Organizer requests reset -> Admin table shows request -> Admin clicks button -> New password generated.
- [ ] **2. Real-Time Discussion Forum**
  - *Why:* Simpler than "Team Chat" because it doesn't require the complex "Team Registration" logic from Tier A.
  - *Task:* Simple message list on Event Page. Use polling (fetching every 5s) or basic `socket.io` to append new messages.

### 4.3 Tier C: Integration (Choose 1)
- [ ] **1. Anonymous Feedback System**
  - *Why:* Simplest data model.
  - *Task:* Add `Feedback` model (stars, comment). Show simple form on past events. Calculate average stars.

---

## Phase 5: Final Polish & Deployment
*Status: To Do*

- [ ] **Documentation**:
  - [ ] `README.md`: List libraries used + Justification.
  - [ ] Document the chosen Advanced Features (Payment, QR, Reset, Forum, Feedback).
- [ ] **Deployment**:
  - [ ] Frontend: Vercel/Netlify.
  - [ ] Backend: Render/Railway.
  - [ ] Database: MongoDB Atlas.
  - [ ] Create `deployment.txt` with URLs.
- [ ] **Submission**:
  - [ ] Zip file structure: `<roll_no>/backend`, `<roll_no>/frontend`, `README.md`.