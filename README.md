# Resource Management System

A comprehensive, real-time Resource Management application built with Next.js, React, and Prisma, designed to manage institutional block resources, facility bookings, user feedback, and maintenance tasks seamlessly.

## 🚀 Features

### Role-Based Access Control (RBAC)
The system supports multiple distinct user roles, each with their own specialized dashboards and capabilities:

- **Admin**: Complete overview of the system. Can manage users, alter roles, add/edit/delete resources, buildings, and resource types.
- **Approver**: Dedicated portal to review, edit, approve, or reject student booking requests. Includes conflict-checking for resource availability.
- **Staff / Maintenance**: Views and acts upon maintenance/repair tasks assigned by administrators based on student feedback.
- **Student**: Can browse available resources, place booking requests (with strictly validated start/end times), and submit feedback/issues regarding specific resources.

### ⚡ Real-Time Auto-Refresh
No manual reloading required! The application features a global auto-refresh mechanism. Next.js server actions are combined with an `AutoRefresh` client component that seamlessly polls the server every 3 seconds to keep your browser perfectly in sync with the live database state.

### 📅 Advanced Booking & Validation
- **Conflict Prevention**: Approvers can instantly check if a requested time slot overlaps with an already-approved booking.
- **Strict Time Validation**: Frontend and backend both strictly enforce that a booking's End Time must occur *after* the Start Time.

### 🛠️ Maintenance & Feedback Loop
- Students can submit issue tickets linked to specific resources.
- Admins can convert these tickets into active Maintenance Tasks, categorize them (Repair, Cleaning, Inspection), and assign them to specific staff members.
- Staff members can update task statuses (`PENDING`, `IN_PROGRESS`, `COMPLETED`), which automatically updates the student's original ticket.

## 💻 Tech Stack

- **Frontend**: Next.js (App Router), React 19, TypeScript, Bootstrap 5.
- **Backend**: Next.js Server Actions, Node.js.
- **Database**: PostgreSQL operated via Prisma ORM (`@prisma/client`).
- **Security**: Authentication utilizing `bcrypt` & `jose` for secure routing and session handling.
- **Styling**: Bootstrap and custom CSS modules.

## 📂 Project Structure

```
├── app/
│   ├── (auth)/             # Authenticated routes protected by middleware
│   │   ├── admin/          # Admin dashboard & controls
│   │   ├── approver/       # Booking approval workflow
│   │   ├── staff/          # Maintenance task management
│   │   └── student/        # Resource booking & feedback forms
│   ├── (public)/           # Public routes (Login/Register)
│   ├── api/                # API Routes (Auth handlers)
│   └── layout.tsx          # Root layout housing the global AutoRefresh component
├── components/
│   ├── admin/              # Admin client components
│   ├── approver/           # Approver client components
│   ├── staff/              # Staff client components
│   └── student/            # Student client components
├── lib/
│   └── actions/            # Next.js Server Actions (Database mutations)
└── prisma/
    └── schema.prisma       # Database schema definition
```

## 🏗️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL database
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd resource_managment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and configure your PostgreSQL database connection:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   ```

4. **Initialize Database:**
   Push the Prisma schema to your database and generate the client.
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Seed the Database (Optional):**
   ```bash
   npm run seed
   ```

6. **Run the Development Server:**
   ```bash
   npm run dev
   ```

7. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Database Schema Summary
- **Users**: Authentication info and role mappings.
- **Resources**: Target items available for booking (e.g., Labs, Equipment). Belongs to a specific Building and Resource Type.
- **Buildings & Resource Types**: Classification models for organizational grouping.
- **Bookings**: Tracks who booked what, when, and the approval status (`PENDING`, `APPROVED`, `REJECTED`).
- **Feedback & Maintenance**: Links student reports tightly to actionable staff tasks.

---

