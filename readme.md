# Clipflow 🎬

> **Video Production & Content Operations Platform**  
> An all-in-one creator workspace built with **Next.js (App Router)**, **TypeScript**, **Mongoose / MongoDB**, and **Tailwind CSS**.

---

## 📌 Overview

**Clipflow** is designed for content creators, clippers, and UGC creators. It connects the full content lifecycle from finding paid opportunities and organizing raw footage to editing, reviewing, and tracking earnings:

```
Discover ➔ Learn ➔ Plan ➔ Organize ➔ Edit ➔ Publish ➔ Track ➔ Grow
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions & Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom *Premium Dark Workspace* theme)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Architecture

```
CLIPFLOW/
├── Document/
│   └── SRD                        # Software Requirements Document
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # REST API Handlers
│   │   │   ├── campaigns/route.ts # Campaign Discovery & Manual Entry API
│   │   │   └── projects/route.ts  # Projects Workspace API
│   │   ├── globals.css            # Tailwind directives & base styles
│   │   ├── layout.tsx             # Root layout with dark theme
│   │   └── page.tsx               # Creator Dashboard & Workspace UI
│   ├── lib/
│   │   └── db.ts                  # Cached Mongoose connection helper
│   └── models/                    # Mongoose Schemas per SRD specifications
│       ├── Campaign.ts            # Campaign discovery, source metadata, payouts & deadlines
│       ├── Project.ts             # Projects, briefs, content plans & checklist items
│       └── Asset.ts               # Raw data store (footage, audio, links, drive references)
├── .env.example                   # Environment variable template
├── next.config.js
├── tailwind.config.js             # Studio dark palette configuration
├── tsconfig.json
└── package.json
```

---

## 🚀 Key Modules (SRD Specification) 

1. **Daily Creator Dashboard**: Today's tasks, active projects, upcoming deadlines, and month-to-date earnings.
2. **Campaign Discovery**: Browse and track clipping/UGC opportunities from sources like Whop, Content Rewards, and manual submissions.
3. **Editing Project Workspace**: Connects briefs, content plans, hooks, scripts, raw assets, tasks, draft versions, and final exports.
4. **Raw Data Store**: Upload or link footage, audio, transcripts, and external Google Drive files reusable across multiple projects.
5. **Tasks & Scheduling**: Calendar views for campaign cutoffs, editing due dates, and publishing schedules.
6. **Submissions & Payouts**: Record published URLs, review approval states, and track earnings per clip.

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js** v18+ (tested on v26+)
- **MongoDB** running locally (`mongodb://localhost:27017`) or a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string.

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Set your MongoDB connection:
```env
MONGODB_URI=mongodb://localhost:27017/clipflow
NEXTAUTH_SECRET=your_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the Clipflow workspace.

### 5. Build for Production
```bash
npm run build
npm start

