# Clipflow 🎬

> **Video Production, Content Operations & Automated Clipping Platform**  
> An all-in-one creator workspace built with **Next.js (App Router)**, **TypeScript**, **Mongoose / MongoDB**, and **Tailwind CSS**.

---

## 📌 Overview

**Clipflow** is built for modern video editors, clippers, and UGC creators. It unifies manual campaign & project workflows with an **Automated Clipping & Multi-Channel Social Publishing Pipeline**:

```
Discover ➔ Learn ➔ Plan ➔ Organize ➔ AI Clip & Auto-Frame ➔ Review ➔ Publish (IG/YT) ➔ Track Earnings
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions, Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom *Premium Dark Workspace* theme)
- **Social Integrations**: Instagram Graph API & YouTube Data API v3
- **Media & Processing**: FFmpeg / Headless Video Framing & OpenAI Whisper (Word-level timestamps)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Architecture

```
CLIPFLOW/
├── Document/
│   └── SRD                        # Software Requirements Document (Updated)
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # REST API Handlers
│   │   │   ├── campaigns/route.ts # Campaign Discovery API
│   │   │   └── projects/route.ts  # Projects Workspace API
│   │   ├── globals.css            # Tailwind directives & dark theme styles
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Creator Dashboard & Workspace UI
│   ├── lib/
│   │   └── db.ts                  # Cached Mongoose connection helper
│   └── models/                    # Mongoose Schemas per SRD
│       ├── Campaign.ts            # Campaign opportunities, payouts & deadlines
│       ├── Project.ts             # Workspace briefs, content plans & checklists
│       ├── Asset.ts               # Raw data store (footage, audio, Drive links)
│       ├── SocialAccount.ts       # Connected Instagram & YouTube channels
│       └── ClipJob.ts             # Automated clipping pipeline & detected hooks
├── .env.example
├── next.config.js
├── tailwind.config.js             # Studio dark palette configuration
├── tsconfig.json
└── package.json
```

---

## 🚀 Key Modules (SRD Specification)

1. **Daily Creator Dashboard**: Today's priorities, active projects, upcoming deadlines, and month-to-date earnings.
2. **Campaign Discovery & Tracking**: Browse clipping and UGC opportunities from Whop, Content Rewards, or add manual links.
3. **Editing Project Workspace**: Connects briefs, content plans, hooks, scripts, raw assets, tasks, draft versions, and exports.
4. **Raw Data Store (Hybrid Storage)**: Store uploaded media and external Google Drive / YouTube references reusable across projects.
5. **Automated AI Clipping Engine**:
   - Ingest long-form podcasts/streams.
   - Detect viral moments & emotional hooks with Whisper timestamps.
   - Auto-frame 9:16 vertical cuts, animated dynamic captions, and background music beats.
6. **Multi-Account Social Publishing**:
   - Connect multiple Instagram and YouTube accounts (Clipping, UGC, Podcasts).
   - One-click review or automated scheduled publishing via Instagram Graph API & YouTube Data API.
7. **Submissions, Metrics & Payouts**: Trace published URLs back to specific versions, monitor view stats, and track payments.

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js** v18+
- **MongoDB** running locally (`mongodb://localhost:27017`) or [MongoDB Atlas](https://www.mongodb.com/atlas).

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your environment:
```env
MONGODB_URI=mongodb://localhost:27017/clipflow
NEXTAUTH_SECRET=your_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Social APIs (Optional for Phase 1, required for Publishing)
INSTAGRAM_APP_ID=your_meta_app_id
INSTAGRAM_APP_SECRET=your_meta_app_secret
YOUTUBE_CLIENT_ID=your_google_client_id
YOUTUBE_CLIENT_SECRET=your_google_client_secret
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
```
