# CLIPFLOW MASTER PLAN — Development Guide, Learning Roadmap & Architecture Reference

> **Purpose**: Central reference for the entire Clipflow project — what we built, why, how it works, what's next, and what to learn.  
> **Created**: November 24, 2026  
> **Status**: Internal Planning Document (temporary — to be reviewed and archived after transfer)  
> **Rule**: No code changes today. Read, understand, plan.

---

## A. Project Overview

### What is Clipflow?

Clipflow Creator Studio is a **web application** for short-form video editors and UGC (User Generated Content) creators. Think of it as a workstation where creators can:

- Find paid video editing gigs (campaigns/bounties)
- Organize their video projects
- Track earnings from completed work
- Manage their social media channels
- Learn editing skills

### What problem are we solving?

Right now, short-form video creators juggle multiple tools:
- They find gigs on platforms like Whop and Content Rewards
- They track projects in spreadsheets or Notion
- They manage assets across folders on their computer
- They have no centralized dashboard for earnings

Clipflow brings all of this into **one professional workspace** — like how DaVinci Resolve is one tool for color grading, editing, and audio, Clipflow is one tool for the business side of being a creator.

### Who are our target users?

1. **Short-form video editors** who make Reels, TikToks, YouTube Shorts
2. **UGC creators** who produce sponsored content for brands
3. **Clip agencies** that manage multiple editors and campaigns

### What is our MVP (Minimum Viable Product)?

A working web app where a creator can:
1. Register and log in securely
2. Create and browse campaign briefs
3. Create video projects linked to campaigns
4. See a clean, professional dashboard

### What is our long-term vision?

A full production studio platform with AI-powered clip generation, automated social publishing, earnings tracking, and team collaboration.

---

## B. Technology Stack — What Each Tool Does and Why

### 1. Next.js 16 (The Framework)

- **What it is**: A React framework that lets you build both the frontend (what users see) AND the backend (server logic, APIs) in one project.
- **Why we use it**: Instead of building a separate React app + a separate Node.js server, Next.js combines both. When you visit `/campaigns`, Next.js serves the page. When the page calls `/api/campaigns`, Next.js also handles that server request.
- **Where we use it**: Everywhere. It's the foundation of our entire app.
- **Key concept**: Next.js "App Router" uses a folder-based routing system. A file at `src/app/campaigns/page.tsx` automatically becomes the `/campaigns` URL. A file at `src/app/api/campaigns/route.ts` automatically becomes the `/api/campaigns` API endpoint.
- **What to learn**: How folder-based routing works, the difference between "pages" (frontend) and "API routes" (backend), what `'use client'` means.

### 2. React 19 (The UI Library)

- **What it is**: A JavaScript library for building user interfaces using reusable "components" (small building blocks like buttons, cards, forms).
- **Why we use it**: You already know this — it's what makes our UI interactive.
- **Where we use it**: Every `.tsx` file in `src/app/` and `src/components/`.
- **What to learn**: You already understand React. Focus on how React components talk to the backend (using `fetch()`).

### 3. TypeScript (The Language)

- **What it is**: JavaScript with added "type safety" — it forces you to declare what type of data variables hold (string, number, object, etc.).
- **Why we use it**: Catches bugs before they happen. If a function expects a number but you pass a string, TypeScript shows an error immediately instead of breaking at runtime.
- **Where we use it**: Every `.ts` and `.tsx` file.
- **What to learn**: Basic types, interfaces (like `IUser`, `ICampaign`), and why they prevent bugs.

### 4. Tailwind CSS (The Styling)

- **What it is**: A utility-first CSS framework where you style elements using small class names directly in HTML/JSX.
- **Why we use it**: Fast to write, consistent design, no separate CSS files needed.
- **Where we use it**: Every page component uses Tailwind classes like `bg-[#09090b]`, `text-white`, `rounded-xl`.
- **What to learn**: You already know Tailwind from frontend work.

### 5. MongoDB Atlas (The Database — Cloud)

- **What it is**: A cloud-hosted NoSQL database. Instead of storing data in tables with rows and columns (like Excel), MongoDB stores data as "documents" — flexible JSON-like objects.
- **Why we use it**: Perfect for JavaScript developers because data is stored in the same format (JSON) that JavaScript natively understands. No need to learn SQL.
- **Where we use it**: All our data lives here — users, campaigns, projects.
- **What you did**: You created a MongoDB Atlas account, set up a cluster (a cloud server running MongoDB), created a database called `clipflow`, and got a connection string.
- **What the connection string is**: It's like a URL that tells our app exactly where to find our database, including the username and password. Example format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/clipflow`
- **What to learn**: What a "document" is, what a "collection" is (like a folder of documents), why NoSQL differs from SQL.

### 6. MongoDB Compass (The Database Viewer) 

- **What it is**: A desktop application to visually browse your MongoDB database — see collections, view documents, run queries.
- **Why we use it**: So you can visually confirm that data was actually saved when our app creates a user or campaign.
- **Where we use it**: You connect Compass to the same Atlas cluster using the same connection string.
- **What to learn**: How to browse collections, view individual documents, verify data.

### 7. Mongoose (The Database Connector)

- **What it is**: A Node.js library that connects our Next.js app to MongoDB. It also lets us define "schemas" — rules about what shape our data should have.
- **Why we use it**: Raw MongoDB queries are messy. Mongoose gives us clean, structured code like `User.findOne({ email })` instead of raw database commands.
- **Where we use it**: `src/lib/db.ts` (connection), `src/models/*.ts` (schemas).
- **Key file — `src/lib/db.ts`**: This file creates a single shared connection to MongoDB and reuses it across all requests (instead of opening a new connection every time, which would be slow and wasteful).
- **What to learn**: What a schema is, what a model is, basic CRUD operations (Create, Read, Update, Delete).

### 8. Bcrypt (Password Security)

- **What it is**: A library that "hashes" passwords — converts them into an unreadable scrambled string before saving to the database.
- **Why we use it**: NEVER store plain-text passwords. If someone hacks the database, they see scrambled hashes, not real passwords.
- **Where we use it**: `src/app/api/auth/register/route.ts` (hashing) and `src/app/api/auth/login/route.ts` (comparing).
- **How it works**: When a user registers with password "hello123", bcrypt converts it to something like `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZA`. When they log in, bcrypt compares "hello123" against that hash — it can verify they match without ever storing the original password.
- **What to learn**: What hashing is, why it's one-way (you can't reverse it), what "salt rounds" means (10 rounds = 10 layers of randomization).

### 9. JSON Web Tokens / JWT (Session Management)

- **What it is**: A small encrypted token (a long string) that proves "this user is logged in."
- **Why we use it**: After login, the server creates a JWT containing the user's ID and email, and sends it to the browser as a cookie. On every future request, the browser automatically sends this cookie back, so the server knows who's making the request without asking for username/password again.
- **Where we use it**: `src/lib/auth.ts` (creating and verifying tokens), cookies set in login/register routes.
- **How it works in Clipflow**: User logs in → server creates JWT with `{ userId, email, displayName }` → server puts JWT into a cookie named `clipflow_session` → browser stores cookie → on every page load, `AuthContext` reads this cookie via `/api/auth/me` → sidebar shows user's name.
- **What to learn**: What a token is, what a cookie is, why HttpOnly cookies are safer than localStorage, what "expiry" means.

### 10. Zod (Input Validation)

- **What it is**: A library that checks whether incoming data matches expected rules BEFORE processing it.
- **Why we use it**: Users (or attackers) can send anything to our API. Zod rejects invalid data immediately — like rejecting an email that doesn't contain "@" or a password shorter than 6 characters.
- **Where we use it**: Every `POST` API route validates input with Zod schemas before touching the database.
- **What to learn**: What validation is, why you should never trust user input, how schemas define rules.

### 11. Lucide React (Icons)

- **What it is**: An icon library providing clean SVG icons as React components.
- **Why we use it**: Consistent, professional icons throughout our UI.
- **Where we use it**: Every page imports icons like `<Film />`, `<Search />`, `<Loader2 />`.

### How They All Connect

```
User's Browser
    ↓ types URL or clicks link
Next.js (App Router)
    ↓ matches URL to file in src/app/
React Component (page.tsx)
    ↓ calls fetch('/api/...')
Next.js API Route (route.ts)
    ↓ validates input with Zod
    ↓ connects to MongoDB via Mongoose (src/lib/db.ts)
MongoDB Atlas (Cloud Database)
    ↓ returns data
API Route
    ↓ sends JSON response
React Component
    ↓ updates UI with real data
User sees the result
```

---

## C. Complete Development History

### Phase 1: Project Initialization

**What we did**: Created a new Next.js project with TypeScript and Tailwind CSS.

**Files created**:
- `package.json` — Lists all dependencies (libraries our project uses)
- `tsconfig.json` — TypeScript configuration
- `next.config.js` — Next.js configuration (currently minimal: just `reactStrictMode: true`)
- `tailwind.config.ts` — Tailwind theme customization
- `src/app/layout.tsx` — Root layout wrapping every page with fonts, AuthProvider, and AppShell
- `src/app/globals.css` — Global CSS with Tailwind directives

**Concepts to understand**: What `npm install` does (downloads dependencies into `node_modules/`), what `package.json` tracks.

### Phase 2: UI/UX Design System

**What we did**: Established the visual design language — obsidian matte dark theme.

**Design decisions**:
- Background: `#09090b` (near-black)
- Card surfaces: `#121215` (slightly lighter)
- Borders: `border-white/[0.08]` (barely visible hairline borders)
- Primary accent: `#6366f1` (electric indigo)
- Success color: `#10b981` (mint emerald)
- Fonts: Inter (body) + Plus Jakarta Sans (headlines)

**Why**: Professional workstation feel, not a flashy consumer app. Inspired by tools like Linear, DaVinci Resolve, and Frame.io.

### Phase 3: Frontend Screen Development (31 Routes)

**What we did**: Built all 31 page components (the visual UI for every screen).

**Important distinction**: Most of these screens are **frontend-only** at this point. They look complete, but many show empty states or static layouts without real backend data. See the Feature Completion Tracker (Section E) for the exact status of each.

**Key architectural decision — `AppShell.tsx`**:
- File: `src/components/AppShell.tsx`
- What it does: Wraps every page with a persistent left sidebar navigation. Auth pages (`/login`, `/register`, `/welcome`) are excluded — they render full-screen without the sidebar.
- How it works: `layout.tsx` renders `<AuthProvider><AppShell>{children}</AppShell></AuthProvider>`. AppShell checks the current pathname — if it's an auth page, it renders only `{children}`. Otherwise, it renders the sidebar + children.
- Why: One unified navigation experience across all routes.

### Phase 4: Database Setup (MongoDB Atlas)

**What you did (step by step)**:
1. Created a MongoDB Atlas account at `cloud.mongodb.com`
2. Created a "Cluster" (a cloud server that runs MongoDB) — named `cluster0`
3. Created a database user with a username and password
4. Added your IP address to the "Network Access" whitelist (so your computer can connect)
5. Got the "connection string" — a URL like `mongodb+srv://user:pass@cluster0.hflgh4u.mongodb.net/clipflow`
6. Created a `.env.local` file in the project root and pasted the connection string there

**What `.env.local` contains** (structure, not actual secrets):
```
MONGODB_URI=mongodb+srv://[username]:[password]@cluster0.hflgh4u.mongodb.net/clipflow
JWT_SECRET=[a-secret-string-for-signing-tokens]
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Why `.env.local`**: Environment variables keep secrets OUT of your code. Git ignores this file (via `.gitignore`), so passwords never get uploaded to GitHub.

**What you did in Compass**: Connected using the same connection string. Initially saw only system databases (`local`, `admin`, `config`). After creating your first user through the app, the `clipflow` database appeared with a `users` collection.

**Files involved**:
- `.env.local` — Stores connection string and secrets
- `src/lib/db.ts` — Reads `MONGODB_URI` from environment, creates a cached Mongoose connection
- **How to verify**: Open MongoDB Compass → click your cluster → you should see `clipflow` database with `users`, `campaigns`, and `projects` collections.

### Phase 5: Database Models (Schemas)

**What we did**: Defined the "shape" of our data — what fields each type of document should have.

**Models created** (files in `src/models/`):

| Model | File | Collections in Atlas | Has API? | Has Frontend? | Status |
|---|---|---|---|---|---|
| `User` | `User.ts` | `clipflow.users` | ✅ Auth routes | ✅ Login/Register | **Working** |
| `Campaign` | `Campaign.ts` | `clipflow.campaigns` | ✅ CRUD routes | ✅ Explorer + Detail | **Working** |
| `Project` | `Project.ts` | `clipflow.projects` | ✅ CRUD routes | ✅ Hub + Wizard | **Working** |
| `Asset` | `Asset.ts` | *(not yet created)* | ❌ No API | ✅ UI only | **Schema only** |
| `ClipJob` | `ClipJob.ts` | *(not yet created)* | ❌ No API | ❌ No UI | **Schema only** |
| `SocialAccount` | `SocialAccount.ts` | *(not yet created)* | ❌ No API | ❌ No UI | **Schema only** |

**What a schema defines (example — User)**:
```
User document = {
  email: string (required, unique, lowercase)
  passwordHash: string (required — the bcrypt hash, NOT the real password)
  displayName: string (required)
  role: "creator" or "admin" (default: "creator")
  timeZone: string (default: "UTC")
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

**What to understand**: A "model" is like a template. When you call `User.create({ email, passwordHash, displayName })`, Mongoose checks if the data matches the template, then saves it to MongoDB as a document.

### Phase 6: Authentication System (Full-Stack)

This is the most important backend work we've done. Here's exactly what happens:

#### Registration Flow (`POST /api/auth/register`)

```
User fills form → clicks "Create Account"
    ↓
Browser sends POST request to /api/auth/register
Body: { displayName: "Alex", email: "alex@test.com", password: "hello123" }
    ↓
API Route (src/app/api/auth/register/route.ts):
  1. Connects to MongoDB (await connectDB())
  2. Validates input with Zod (is email valid? is password ≥ 6 chars?)
  3. Checks if email already exists (User.findOne({ email }))
  4. Hashes the password with bcrypt (10 salt rounds)
  5. Creates user document in MongoDB (User.create({ email, passwordHash, displayName }))
  6. Creates a JWT token containing { userId, email, displayName }
  7. Sets the token as an HttpOnly cookie named "clipflow_session" (expires in 7 days)
  8. Returns JSON response: { data: { id, email, displayName } }
    ↓
Browser receives response:
  1. refreshUser() calls /api/auth/me which reads the cookie and returns user data
  2. AuthContext stores user in React memory
  3. Redirects to /welcome page
  4. Sidebar now shows user's name and avatar
```

**Files involved**:
- `src/app/register/page.tsx` — The registration form UI
- `src/app/api/auth/register/route.ts` — The backend logic
- `src/lib/db.ts` — Database connection
- `src/models/User.ts` — User schema
- `src/lib/auth.ts` — JWT token creation
- `src/context/AuthContext.tsx` — Stores user in React memory

#### Login Flow (`POST /api/auth/login`)

Same as registration, except:
- Step 3 becomes: Find user by email, then compare submitted password against stored hash using `bcrypt.compare()`
- Uses same generic error message for both "email not found" and "wrong password" (security: prevents attackers from discovering which emails are registered)

**Files involved**:
- `src/app/login/page.tsx` — The login form UI
- `src/app/api/auth/login/route.ts` — The backend logic

#### Session Check (`GET /api/auth/me`)

Every time the app loads, `AuthContext` calls this endpoint to check "am I still logged in?"
- Reads the `clipflow_session` cookie
- Verifies the JWT token is valid and not expired
- Returns the user data if valid, or 401 if not

**File**: `src/app/api/auth/me/route.ts`

#### Logout Flow (`POST /api/auth/logout`)

- Sets the `clipflow_session` cookie with an expiry date in the past (`new Date(0)` = January 1, 1970), which tells the browser to delete it immediately
- Frontend does `window.location.href = '/login'` (hard redirect to clear all cached state)

**File**: `src/app/api/auth/logout/route.ts`

#### How to verify authentication works:
1. Open browser → go to `http://localhost:3000/register` → create an account
2. Open MongoDB Compass → look at `clipflow.users` collection → your document should be there
3. The `passwordHash` field should be a long scrambled string (NOT your actual password)
4. Navigate around the app → sidebar should show your name
5. Click logout → should redirect to `/login`, sidebar should show "Sign In to Studio"

### Phase 7: Campaigns Module (Full-Stack Wireup)

**What we did**: Connected the campaign creation form and explorer to MongoDB Atlas.

**API endpoints created**:
- `POST /api/campaigns` — Creates a new campaign in the database (with Zod validation)
- `GET /api/campaigns` — Fetches all campaigns (supports `?category=` and `?search=` query parameters)
- `GET /api/campaigns/[id]` — Fetches a single campaign by its MongoDB ObjectId

**Frontend pages wired**:
- `/campaigns/new` — Form sends `POST /api/campaigns`, redirects to `/campaigns` on success
- `/campaigns` — Fetches from `GET /api/campaigns` on mount, shows loading spinner, then renders cards or empty state
- `/campaigns/[id]` — Fetches from `GET /api/campaigns/[id]`, renders detail view with interactive yield calculator

**Files involved**:
- `src/app/api/campaigns/route.ts` — API for create + list
- `src/app/api/campaigns/[id]/route.ts` — API for single campaign
- `src/models/Campaign.ts` — Campaign schema with indexes
- `src/app/campaigns/new/page.tsx` — Creation form
- `src/app/campaigns/page.tsx` — Explorer with live search
- `src/app/campaigns/[id]/page.tsx` — Detail page

### Phase 8: Projects Module (Full-Stack Wireup)

**What we did**: Connected the project creation wizard and projects hub to MongoDB Atlas.

**API endpoints created**:
- `POST /api/projects` — Creates a new project (requires authentication — returns 401 if not logged in)
- `GET /api/projects` — Fetches all projects for the logged-in user (filtered by `ownerId`)
- `GET /api/projects/[id]` — Fetches a single project by ID

**Frontend pages wired**:
- `/projects/new` — 3-step wizard form sends `POST /api/projects`
- `/projects` — Fetches from `GET /api/projects`, shows loading/empty/data states

**Files involved**:
- `src/app/api/projects/route.ts` — API for create + list
- `src/app/api/projects/[id]/route.ts` — API for single project
- `src/models/Project.ts` — Project schema with indexes
- `src/app/projects/new/page.tsx` — 3-step wizard
- `src/app/projects/page.tsx` — Projects hub

### Phase 9: Code Quality Improvements

**What we did today**:
1. **Removed duplicate POST handler** from `/api/auth/me` (was duplicating logout logic)
2. **Added Proxy (formerly Middleware)** (`src/proxy.ts`) — redirects unauthenticated users away from `/projects/new` and `/campaigns/new` at the server level
3. **Created reusable `useDebounce` hook** (`src/hooks/useDebounce.ts`) — extracted duplicate setTimeout logic from campaigns and projects pages
4. **Code Review** — documented in `docs/CODE_REVIEW.md`

---

## D. End-to-End System Architecture

### How a Request Flows Through Our App

```mermaid
flowchart LR
    A["User Browser"] -->|"types URL"| B["Next.js Server"]
    B -->|"matches src/app/..."| C["React Page Component"]
    C -->|"fetch('/api/...')"| D["API Route Handler"]
    D -->|"Zod validates"| E["Validation Layer"]
    E -->|"Mongoose query"| F["MongoDB Atlas Cloud"]
    F -->|"returns document"| D
    D -->|"JSON response"| C
    C -->|"setState(data)"| A
```

### Concrete Example: User Creates a Campaign

**Step 1 — User fills the form at `/campaigns/new`**
- React component manages form state with `useState`
- User types title, brand, selects category, enters base rate

**Step 2 — User clicks "Publish Campaign Brief"**
- `handleSubmit` function calls `fetch('/api/campaigns', { method: 'POST', body: JSON.stringify(formData) })`
- Browser sends HTTP POST request with JSON body to our server

**Step 3 — Next.js routes request to `src/app/api/campaigns/route.ts`**
- The `POST` function runs
- `await connectDB()` — ensures we have a MongoDB connection
- `await getCurrentUser()` — reads the JWT cookie to identify who's making the request
- `CreateCampaignSchema.safeParse(body)` — Zod validates all fields
- If validation fails → returns `{ error: "..." }` with status 400

**Step 4 — Data saved to MongoDB**
- `Campaign.create({ ...validatedData, ownerId: user.userId })` — Mongoose creates a new document in the `campaigns` collection
- MongoDB assigns a unique `_id` (ObjectId) automatically

**Step 5 — Response sent back**
- API returns `{ data: campaignDocument }` with status 201 (Created)
- React component receives the response, calls `router.push('/campaigns')` to redirect

**Step 6 — Campaigns page loads**
- `/campaigns` page mounts, `useEffect` triggers `fetch('/api/campaigns')`
- API reads query params (`?category=`, `?search=`), builds MongoDB filter, runs `Campaign.find(filter)`
- Returns array of campaign documents
- React maps over the array, renders a card for each campaign

### Concrete Example: Session Authentication Lifecycle

```mermaid
sequenceDiagram
    participant B as Browser
    participant S as Next.js Server
    participant DB as MongoDB Atlas

    B->>S: POST /api/auth/login {email, password}
    S->>DB: User.findOne({ email })
    DB-->>S: User document (with passwordHash)
    S->>S: bcrypt.compare(password, hash)
    S->>S: jwt.sign({ userId, email })
    S-->>B: Set-Cookie: clipflow_session=JWT_TOKEN
    Note over B: Cookie stored automatically

    B->>S: GET /api/campaigns (cookie sent automatically)
    S->>S: Read cookie → jwt.verify(token)
    S->>DB: Campaign.find({ ownerId })
    DB-->>S: Campaign documents
    S-->>B: { data: [...campaigns] }

    B->>S: POST /api/auth/logout
    S-->>B: Set-Cookie: clipflow_session= (expired)
    Note over B: Cookie deleted
```

---

## E. Feature Completion Tracker

### Legend

| Status | Meaning |
|---|---|
| ✅ Completed | Fully working frontend + backend + database, verified with tests |
| 🔧 Frontend Only | UI exists but NOT connected to any backend/database |
| 📋 Schema Only | Database model exists but no API routes or frontend integration |
| ⏳ Pending | Not started yet |
| ⚠️ Needs Verification | May work but hasn't been manually tested in browser |

### Core Infrastructure

| Feature | Frontend | Backend | Database | API | Testing | Status |
|---|---|---|---|---|---|---|
| Project Setup (Next.js, TS, Tailwind) | ✅ | ✅ | — | — | ✅ Build passes | ✅ Completed |
| Design System (Obsidian theme) | ✅ | — | — | — | ✅ Visual | ✅ Completed |
| AppShell Sidebar Navigation | ✅ | — | — | — | ✅ Visual | ✅ Completed |
| MongoDB Atlas Connection | — | ✅ | ✅ | — | ✅ E2E tested | ✅ Completed |
| Environment Variables (.env.local) | — | ✅ | — | — | ✅ | ✅ Completed |
| Main Dashboard (`/`) | ✅ Live metrics + recent lists | ✅ Promise.all | ✅ | ✅ GET /api/dashboard | ✅ Live API + Build tested | ✅ Completed |
| Proxy (route protection) | — | ✅ | — | — | ✅ Live 307 redirect tested | ✅ Completed |
| useDebounce Custom Hook | ✅ | — | — | — | ✅ Used in 2 pages | ✅ Completed |

### Authentication & User Management

| Feature | Frontend | Backend | Database | API | Testing | Status |
|---|---|---|---|---|---|---|
| User Registration | ✅ | ✅ Zod + Bcrypt | ✅ User model | ✅ POST /api/auth/register | ✅ E2E tested | ✅ Completed |
| User Login | ✅ | ✅ Zod + Bcrypt | ✅ User model | ✅ POST /api/auth/login | ✅ E2E tested | ✅ Completed |
| Session Check (JWT cookie) | ✅ AuthContext | ✅ JWT verify | — | ✅ GET /api/auth/me | ✅ E2E tested | ✅ Completed |
| Logout + Cookie Expiry | ✅ Sidebar button | ✅ | — | ✅ POST /api/auth/logout | ✅ E2E tested | ✅ Completed |
| Welcome Onboarding Screen | ✅ | ✅ Fetches user name | — | Uses /api/auth/me | ✅ | ✅ Completed |
| Forgot Password | ✅ UI only | ❌ No backend | ❌ | ❌ | ❌ | 🔧 Frontend Only |
| AuthModal (legacy component) | ✅ | ✅ | — | — | ❌ Not used in current flow | ⚠️ Unused/Legacy |

### Campaigns Module

| Feature | Frontend | Backend | Database | API | Testing | Status |
|---|---|---|---|---|---|---|
| Campaign Explorer (listing) | ✅ Live fetch | ✅ | ✅ | ✅ GET /api/campaigns | ✅ E2E tested | ✅ Completed |
| Campaign Creation Form | ✅ Live POST | ✅ Zod validated | ✅ | ✅ POST /api/campaigns | ✅ E2E tested | ✅ Completed |
| Campaign Detail Page | ✅ Live fetch | ✅ | ✅ | ✅ GET /api/campaigns/[id] | ✅ E2E tested | ✅ Completed |
| Yield Projection Calculator | ✅ Interactive sliders | — Client-side only | — | — | ⚠️ Visual only | ✅ Completed |
| Campaign Search + Category Filter | ✅ Debounced | ✅ Regex query | ✅ Indexed | ✅ Query params | ✅ | ✅ Completed |
| Saved/Bookmarked Campaigns | ✅ UI only | ❌ | ❌ | ❌ | ❌ | 🔧 Frontend Only |
| Ingest Sources Page | ✅ UI only | ❌ | ❌ | ❌ | ❌ | 🔧 Frontend Only |

### Projects Module

| Feature | Frontend | Backend | Database | API | Testing | Status |
|---|---|---|---|---|---|---|
| Projects Hub (listing) | ✅ Live fetch | ✅ | ✅ | ✅ GET /api/projects | ✅ E2E tested | ✅ Completed |
| Project Creation Wizard (3-step) | ✅ Live POST | ✅ Zod validated | ✅ | ✅ POST /api/projects | ✅ E2E tested | ✅ Completed |
| Project Detail Page | ✅ Live fetch | ✅ | ✅ | ✅ GET /api/projects/[id] | ✅ Live API + 404 tested | ✅ Completed |
| Project → AI Script Plan | ✅ UI exists | ❌ | ❌ | ❌ | ❌ | 🔧 Frontend Only |
| Project → Task Board | ✅ UI exists | ❌ | ❌ | ❌ | ❌ | 🔧 Frontend Only |
| Project → Draft Review | ✅ UI exists | ❌ | ❌ | ❌ | ❌ | 🔧 Frontend Only |

### Assets & Media

| Feature | Frontend | Backend | Database | API | Testing | Status |
|---|---|---|---|---|---|---|
| Asset Library (listing + CRUD + 7d Trash) | ✅ Live fetch + Edit + Soft Delete + Restore | ✅ | ✅ Indexed + TTL | ✅ GET/PATCH/DELETE /api/assets | ✅ Live E2E tested | ✅ Completed |
| Asset Upload Form | ✅ Live POST + File/Link | ✅ Zod validated | ✅ Asset model | ✅ POST /api/assets | ✅ Live E2E tested | ✅ Completed |
| Asset Detail / Preview | ✅ UI only | ❌ | 📋 | ❌ | ❌ | 🔧 Frontend Only |

### Academy & Intelligence

| Feature | Frontend | Backend | Database | API | Testing | Status |
|---|---|---|---|---|---|---|
| Learning Hub | ✅ Static content | ❌ | ❌ | ❌ | ❌ | 🔧 Frontend Only |
| Trend Radar | ✅ Static layout | ❌ | ❌ | ❌ | ❌ | 🔧 Frontend Only |
| Viral References | ✅ Static layout | ❌ | ❌ | ❌ | ❌ | 🔧 Frontend Only |
| AI Script Lab | ✅ Static layout | ❌ | ❌ | ❌ | ❌ | 🔧 Frontend Only |
| Editor Toolkit | ✅ Static layout | ❌ | ❌ | ❌ | ❌ | 🔧 Frontend Only |

### Operations & Settings

| Feature | Frontend | Backend | Database | API | Testing | Status |
|---|---|---|---|---|---|---|
| Submissions Tracker | ✅ Live list + New Modal + Status + Withdraw | ✅ Zod + Ownership | ✅ Submission model + Indexes | ✅ GET/POST/PATCH/DELETE /api/submissions | ✅ Live E2E tested | ✅ Completed |
| Social Channels | ✅ Empty state UI | ❌ | 📋 Schema exists | ❌ | ❌ | 🔧 Frontend Only |
| Earnings Dashboard | ✅ Static \$0.00 UI | ❌ | ❌ | ❌ | ❌ | 🔧 Frontend Only |
| Calendar / Schedule | ✅ Empty state UI | ❌ | ❌ | ❌ | ❌ | 🔧 Frontend Only |
| Settings | ✅ Static layout | ❌ | ❌ | ❌ | ❌ | 🔧 Frontend Only |

### AI & Automation (Future)

| Feature | Frontend | Backend | Database | API | Testing | Status |
|---|---|---|---|---|---|---|
| ClipJob Pipeline | ❌ | ❌ | 📋 Schema exists | ❌ | ❌ | 📋 Schema Only |
| Auto Clip Generation | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Pending |
| Auto Social Publishing | ❌ | ❌ | ❌ | ❌ | ❌ | ⏳ Pending |

---

## F. Backend Learning Roadmap

Learn these in order. Each builds on the previous one.

### 1. Client-Server Architecture

- **Simple explanation**: Your browser (the "client") asks a server for things. The server processes the request and sends back a response. Like ordering food at a restaurant — you (client) tell the waiter (HTTP request) what you want, the kitchen (server) makes it, the waiter brings it back (HTTP response).
- **Clipflow example**: When you open `/campaigns`, your browser asks our Next.js server for campaign data. The server queries MongoDB and sends back JSON.
- **Relevant files**: Any page that calls `fetch()` is a client. Any file in `src/app/api/` is the server.
- **Exercise**: Open browser DevTools → Network tab → navigate to `/campaigns`. Watch the request to `/api/campaigns` and the JSON response.
- **Interview question**: "What is the difference between client-side and server-side code in Next.js?"

### 2. HTTP Request-Response Lifecycle

- **Simple explanation**: HTTP is the protocol (set of rules) browsers and servers use to communicate. Every interaction is a request → response pair.
- **Key parts of a request**: Method (GET/POST/PUT/DELETE), URL, Headers, Body (for POST)
- **Key parts of a response**: Status Code (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error), Headers, Body (usually JSON)
- **Clipflow example**: `POST /api/auth/login` with body `{ email, password }` returns either `200 { data: user }` or `401 { error: "Invalid email or password" }`
- **Relevant files**: Every `route.ts` file handles specific HTTP methods
- **Exercise**: Use browser DevTools Network tab to inspect the exact request/response when you log in.
- **Interview question**: "What is the difference between GET and POST? When would you use each?"

### 3. REST APIs

- **Simple explanation**: REST is a convention for organizing your API URLs. Resources (users, campaigns, projects) each get their own URL pattern.
- **Our REST pattern**:
  - `GET /api/campaigns` → List all campaigns
  - `POST /api/campaigns` → Create a new campaign
  - `GET /api/campaigns/[id]` → Get one specific campaign
- **Clipflow files**: `src/app/api/campaigns/route.ts` (list + create), `src/app/api/campaigns/[id]/route.ts` (get one)
- **Exercise**: Can you predict what `PUT /api/campaigns/[id]` and `DELETE /api/campaigns/[id]` would do? (Update and delete a campaign — we haven't built these yet!)
- **Interview question**: "Design a REST API for a blog. What endpoints would you create?"

### 4. MongoDB & Mongoose

- **Simple explanation**: MongoDB stores data as "documents" (JSON objects) inside "collections" (groups of documents). Mongoose is the bridge between our Node.js code and MongoDB.
- **Key terms**:
  - **Document** = one record (one user, one campaign)
  - **Collection** = a group of documents (all users, all campaigns)
  - **Schema** = the template defining what fields a document should have
  - **Model** = a JavaScript class created from a schema that lets you query the database
- **Clipflow example**: `User.findOne({ email: "alex@test.com" })` — Mongoose sends a query to the `users` collection asking for a document where `email` equals `"alex@test.com"`
- **Relevant files**: `src/models/*.ts` (schemas), `src/lib/db.ts` (connection)
- **Exercise**: Open MongoDB Compass → browse the `clipflow.campaigns` collection → understand each field.
- **Interview question**: "What is the difference between SQL and NoSQL databases? When would you choose MongoDB over PostgreSQL?"

### 5. Environment Variables & Configuration

- **Simple explanation**: Secrets (passwords, API keys) should NEVER be in your code. They go in a `.env.local` file that Git ignores.
- **How it works**: `process.env.MONGODB_URI` reads the value from `.env.local`. If the file is missing, it falls back to a default.
- **Clipflow files**: `.env.local` (secrets), `src/lib/db.ts` (reads `MONGODB_URI`), `src/lib/auth.ts` (reads `JWT_SECRET`)
- **Interview question**: "Why should environment variables not be committed to version control?"

### 6. Authentication & Authorization

- **Authentication** = "Who are you?" (login/register — proving identity)
- **Authorization** = "What are you allowed to do?" (checking if a user can access a specific resource)
- **Clipflow example**: Authentication happens at `/api/auth/login`. Authorization happens in `/api/projects` where we filter by `ownerId` — you can only see YOUR projects, not other users' projects.
- **Relevant files**: `src/lib/auth.ts`, all files in `src/app/api/auth/`
- **Exercise**: After logging in, open DevTools → Application → Cookies → find `clipflow_session`. That's your JWT. Copy it and paste into jwt.io — you'll see your userId, email, and displayName decoded.
- **Interview question**: "Explain the difference between authentication and authorization with an example."

### 7. Cookies, Tokens & Sessions

- **Cookie**: A small piece of data the server tells the browser to store. The browser automatically sends it back with every future request to the same domain.
- **JWT (JSON Web Token)**: A specific type of token that contains encoded data (like user ID). It's "signed" by the server so nobody can tamper with it.
- **HttpOnly**: A flag on a cookie that says "JavaScript cannot read this cookie." Only the server can. This prevents XSS attacks from stealing session tokens.
- **Clipflow**: Our JWT is stored as an HttpOnly cookie. The frontend can never read the token directly — it can only call `/api/auth/me` and the server reads the cookie.
- **Interview question**: "Why use HttpOnly cookies instead of localStorage for session tokens?"

### 8. Input Validation

- **Simple explanation**: Never trust data from users. Always check that it matches your expected format before processing it.
- **Clipflow example**: Zod schema `z.string().email()` ensures the email field contains a valid email. Without this, someone could send `email: 12345` and potentially break our database query.
- **Relevant files**: Every `route.ts` file with a `POST` handler has a Zod schema at the top.
- **Exercise**: Try sending a POST request to `/api/auth/register` with `password: "hi"` (less than 6 chars). The API should reject it with a Zod validation error.
- **Interview question**: "Where should input validation happen — client-side, server-side, or both? Why?"

### 9. Error Handling & Security

- **Key principle**: Never expose internal error details to the client. Database errors can reveal your schema structure to attackers.
- **Clipflow example**: Our catch blocks log the real error to the server console (`console.error`) but send a generic message to the client (`"An unexpected error occurred"`).
- **Another example**: Login returns the SAME error message whether the email doesn't exist or the password is wrong. This prevents "user enumeration" attacks.
- **Interview question**: "Why should you never return raw database error messages to the client?"

### 10. Database Indexing

- **Simple explanation**: An index is like a book's table of contents. Without it, MongoDB has to scan every single document to find what you're looking for. With an index, it can jump directly to the right spot.
- **Clipflow example**: `CampaignSchema.index({ availability: 1, category: 1 })` creates an index so that filtering campaigns by availability and category is fast even with millions of documents.
- **Interview question**: "What is a database index? When would you NOT want to add an index?"

---

## G. Remaining Development Roadmap

### Phase 1: Core MVP Completion

> **Goal**: Every core feature has real backend data flowing. No more frontend-only screens.

#### Task 1.1: Wire Project Detail Page to MongoDB
- **Objective**: `/projects/[id]` should fetch real project data instead of showing a hardcoded title.
- **Why**: Currently shows "NeonPulse AI Glitch Cuts Pack" for every project.
- **Prerequisites**: Projects API already exists (`GET /api/projects/[id]`).
- **Concepts**: Dynamic routes, `useEffect` + `fetch`, loading states.
- **Files**: `src/app/projects/[id]/page.tsx`
- **Complexity**: Low

#### Task 1.2: Wire Assets Module to MongoDB
- **Objective**: Create API routes for assets, wire `/assets` listing and `/assets/upload` to real database.
- **Why**: Assets module is frontend-only. Schema already exists.
- **Prerequisites**: Understanding of how we wired campaigns (same pattern).
- **Concepts**: File metadata storage, CRUD API pattern.
- **Files**: `src/app/api/assets/route.ts` (new), `src/app/assets/page.tsx`, `src/app/assets/upload/page.tsx`
- **Complexity**: Medium

#### Task 1.3: Wire Dashboard to Real Data
- **Objective**: Dashboard (`/`) should show real counts — number of active projects, campaigns, total earnings.
- **Why**: Currently shows static `$0.00` and `0` counts.
- **Prerequisites**: Working campaigns and projects APIs.
- **Concepts**: Aggregation queries, displaying computed data.
- **Files**: `src/app/page.tsx`, possibly a new `/api/dashboard/route.ts`
- **Complexity**: Medium

#### Task 1.4: Wire Submissions Module
- **Objective**: Allow creators to submit video cuts for campaign review.
- **Why**: This closes the loop: find campaign → create project → submit cut → track approval.
- **Prerequisites**: Working campaigns and projects.
- **Concepts**: Relational data (submission links to both project and campaign).
- **Complexity**: Medium

### Phase 2: Production-Ready Application

#### Task 2.1: Wire Earnings & Payments Tracking
#### Task 2.2: Wire Settings (profile update, password change)
#### Task 2.3: Forgot Password (email reset flow)
#### Task 2.4: Social Channels OAuth Integration
#### Task 2.5: Calendar with Real Deadlines

### Phase 3: Advanced Features

#### Task 3.1: Real-time Notifications
#### Task 3.2: Team Collaboration (multiple editors)
#### Task 3.3: Advanced Search & Filtering

### Phase 4: AI-Powered Features

#### Task 4.1: AI Script Generator (using Gemini API)
#### Task 4.2: Viral Hook Analyzer
#### Task 4.3: Auto-Captioning & Subtitle Generation

### Phase 5: Agentic AI Integration

#### Task 5.1: Automated Clip Detection Pipeline (ClipJob model)
#### Task 5.2: Auto Social Publishing via APIs
#### Task 5.3: AI-Powered Trend Analysis

### Phase 6: Scaling & Commercialization

#### Task 6.1: Deployment to Vercel
#### Task 6.2: Custom Domain & SSL
#### Task 6.3: Analytics & Monitoring
#### Task 6.4: Stripe/Razorpay Payment Integration

---

## H. Tomorrow's Action Plan

### Where we stopped today

We completed:
- ✅ Full authentication (register, login, logout, session management)
- ✅ Campaigns module (create, list, detail, search, filter)
- ✅ Projects module (create, list)
- ✅ Code review and three architectural improvements
- ✅ E2E testing via HTTP (7/7 tests passed)

### What we should do tomorrow

**Single recommended path: Task 1.1 — Wire Project Detail Page to MongoDB**

**Why this is the correct next step**:
1. It's the smallest, simplest remaining task
2. The API already exists (`GET /api/projects/[id]`)
3. It follows the exact same pattern we used for campaigns (you'll be repeating a pattern you've now seen twice)
4. It completes the projects flow end-to-end (create → list → view detail)

**But before writing any code**, we will:
1. Review the concepts from Section F together (specifically: HTTP lifecycle, REST APIs, `useEffect` + `fetch` pattern)
2. I'll explain what we're about to change and why
3. You'll approve the plan
4. We implement together
5. I'll ask you conceptual questions to verify understanding
6. We test in the browser

**What you should be able to explain independently after completing it**:
- What happens when a user clicks "Open Workspace" on a project card
- How the browser knows which project to fetch (dynamic `[id]` routing)
- Why we check `mongoose.Types.ObjectId.isValid(id)` before querying
- How the loading → error → data state machine works in React

---

## I. Development Method Going Forward

For every task, we follow this process:

```
Understand → Learn → Plan → Implement → Explain → Test → Review → Document
```

1. **Understand**: I explain what we're building and why
2. **Learn**: I teach the underlying backend concept
3. **Plan**: I show the implementation plan with files and changes
4. **Implement**: We write the code together (you approve first)
5. **Explain**: I walk through the code and ask you questions
6. **Test**: We verify in the browser and with API calls
7. **Review**: We check for bugs and improvements
8. **Document**: We update this master plan file

I am your **senior software engineer and technical mentor**, not just a code generator.

---

*This document was generated from a thorough audit of the Clipflow codebase on November 24, 2026. No code was modified during its creation.*
