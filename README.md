# 🎓 EduFlow — AI-Powered Learning Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logo=groq&logoColor=white" alt="Groq AI" />
</div>

<br />

**🚀 Live Deployment:** [https://eduflow-ten-pi.vercel.app/](https://eduflow-ten-pi.vercel.app/)

EduFlow is a production-grade, full-stack educational technology platform built to transform passive learning into active mastery. Designed with an advanced Role-Based Access Control (RBAC) architecture, EduFlow seamlessly integrates **Groq's LLaMA 3.3 AI** to auto-generate courses, grade quizzes in real-time, and provide an intelligent, context-aware Study Assistant for students.

This project was built as a demonstration of advanced full-stack capabilities for the **House of Edtech Fullstack Developer Assignment**.

---

## 📸 Platform Preview

Here are some previews of the working platform in action:

<details>
<summary><b>1. Student Dashboard (Overview)</b></summary>
<img src="screenshots/1.png" width="100%" alt="Student Dashboard" />
</details>

<details>
<summary><b>2. Enrolled Courses</b></summary>
<img src="screenshots/2.png" width="100%" alt="Enrolled Courses" />
</details>

<details>
<summary><b>3. AI Quiz Generator UI</b></summary>
<img src="screenshots/3.png" width="100%" alt="AI Quiz Generator" />
</details>

<details>
<summary><b>4. AI Quiz Grading & Explanations</b></summary>
<img src="screenshots/4.png" width="100%" alt="AI Quiz Results" />
</details>

<details>
<summary><b>5. Real-Time AI Study Assistant</b></summary>
<img src="screenshots/5.png" width="100%" alt="AI Study Assistant" />
</details>

---

## ✨ Core Features

### 🔐 Granular Role-Based Access Control (RBAC)
- **Admin Dashboard:** Monitor platform-wide statistics, manage all registered users, and oversee the global course catalog.
- **Instructor Dashboard:** Create and manage courses, build rich-text modules, track student enrollment, and monitor student progress metrics.
- **Student Dashboard:** Enroll in courses, track module progress, interact with AI study tools, and pick up right where they left off.

### 🤖 Intelligent AI Integrations (Groq LLaMA 3.3)
- **AI Quiz Generator:** Generates hyper-contextual multiple-choice quizzes directly from course module content in seconds, complete with automatic grading and detailed explanations.
- **Real-Time Study Assistant:** A context-aware chatbot that helps students understand complex module topics by streaming AI-generated responses instantly.
- **Smart Course Creation:** Instructors can utilize AI to auto-generate highly engaging course descriptions and curricula based on a single title prompt.

### ⚡ Enterprise-Grade Architecture
- **Next.js 15+ App Router:** Fully leverages Server Components, Server Actions, and Turbopack for lightning-fast performance and SEO optimization.
- **Secure Authentication:** `NextAuth.js v5` handles robust, secure credential authorization and session management.
- **Data Persistence:** Relational database management using **Supabase (PostgreSQL)** via the **Prisma ORM** for fully typed database queries.
- **Continuous Integration:** Automated GitHub Actions pipeline ensuring code quality (ESLint, TypeScript verification, Prisma generation) prior to deployment.

---

## 🔑 Demo Access

To explore the different role-based functionalities, use the following seeded credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@demo.com` | `demo1234` |
| **Instructor** | `instructor@demo.com` | `demo1234` |
| **Student** | `student@demo.com` | `demo1234` |

---

## 🛠️ Local Development Setup

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/mayank123hangsh00/Eduflow.git
cd eduflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
# Next Auth
AUTH_SECRET="your-super-secret-random-string"

# Supabase PostgreSQL Database
DATABASE_URL="postgresql://postgres.[YOUR-SUPABASE-ID]:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-SUPABASE-ID]:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"

# Groq AI
GROQ_API_KEY="gsk_your_groq_api_key_here"
```

### 4. Setup the Database
Push the Prisma schema to your Supabase database and run the seed script to populate demo data:
```bash
npx prisma db push
npm run seed
```

### 5. Start the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

---

## 🏗️ Technology Stack

* **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons, Radix UI Primitives.
* **Backend:** Next.js Server Actions, NextAuth.js v5 (JWT Strategy).
* **Database & ORM:** Supabase (PostgreSQL Connection Pooling), Prisma v5.
* **AI Integration:** Groq SDK (LLaMA-3.3-70B-Versatile).
* **CI/CD:** GitHub Actions (CI) & Vercel Edge Network (CD).

---

<div align="center">
  <p>Built with ❤️ and AI for the House of Edtech</p>
</div>
