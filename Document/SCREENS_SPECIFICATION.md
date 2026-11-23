# Clipflow — 32 Screen Architecture & Routing Specification

This document maps all 32 screens across **Phase 1 (MVP: 23 Screens)** and **Phase 2 (Advanced & Collaboration: 9 Screens)** into Next.js App Router routes, components, and design status.

---

## 📌 Phase 1 — MVP (23 Screens)

| #  | Screen Name | Route Path | Core Functionality & Components |
|---|---|---|---|
| **01** | Login | `/login` or Modal | Email & password form, JWT session cookie, remember me, link to register/forgot |
| **02** | Register | `/register` or Modal | Display name, email, password, instant session creation & onboarding |
| **03** | Forgot / Reset Password | `/forgot-password` | Email reset link request, password reset confirmation form |
| **04** | Creator Dashboard | `/dashboard` | Today’s priorities, active projects count, campaign alerts, monthly earnings badge |
| **05** | Campaign Explorer | `/campaigns` | Filterable discovery feed (Whop, Content Rewards), search, payout & deadline tags |
| **06** | Campaign Details | `/campaigns/[id]` | Full campaign brief, eligibility, requirements, payout terms, "Start Project" action |
| **07** | Saved Campaigns | `/campaigns/saved` | Personal bookmarks, status tabs (`considering`, `saved`, `in_progress`) |
| **08** | Add / Import Campaign | `/campaigns/new` | URL importer with fallback manual entry modal/page |
| **09** | Campaign Updates & Status | `/campaigns/sources` | Source adapter health, last sync time, rate limits, field changes log |
| **10** | All Projects | `/projects` | Grid/list view of projects, status filters (`planned`, `active`, `completed`) |
| **11** | Create Project | `/projects/new` | Blank project or converted from campaign, title, kind, deadline selector |
| **12** | Project Overview | `/projects/[id]` | Project hub: attached campaign brief, progress bar, quick actions, team summary |
| **13** | Content Planning | `/projects/[id]/plan` | Video concept, viral hook editor, script drafting, source timestamps, checklist |
| **14** | Project Tasks & Checklist | `/projects/[id]/tasks`| Production task manager: to-dos, priorities, subtasks, completion checkboxes |
| **15** | Drafts & Revisions | `/projects/[id]/drafts`| Versioned export list (v1, v2, v3), file download, revision notes, final export badge |
| **16** | Asset Library | `/assets` | Unified media repository (footage, audio, images, transcripts, Google Drive links) |
| **17** | Asset Details & Preview | `/assets/[id]` | Video/audio player, metadata (duration, resolution, size), attached project list |
| **18** | Upload / Add Assets | `/assets/upload` | Drag-and-drop file uploader (S3 presigned), external URL & Drive link adder |
| **19** | Submissions Tracker | `/submissions` | List of submitted videos, target brands/campaigns, status badges |
| **20** | Submission Details & Stats | `/submissions/[id]` | Approval/rejection reason, revision requests, view/like metrics |
| **21** | Earnings & Payouts | `/earnings` | Earnings summary, approved payout list, currencies (USD/INR), receipt status |
| **22** | Calendar & Deadlines | `/calendar` | Monthly/weekly calendar showing campaign cutoffs, draft due dates, publishing days |
| **23** | Notifications & Settings | `/settings` | In-app alerts, timezone preferences (IANA), profile details, password update |

---

## 🚀 Phase 2 — Advanced Features (9 Screens)

| #  | Screen Name | Route Path | Core Functionality & Components |
|---|---|---|---|
| **24** | Editing Toolkit | `/toolkit` | Curated directory of video tools (CapCut, Premiere, caption tools, sound fx) |
| **25** | Learning Hub | `/learn` | Structured skill roadmaps for video editing, clipping, and UGC creation |
| **26** | Lesson / Path Details | `/learn/[lessonId]` | Embedded video tutorial, technique checklist, link to practice project |
| **27** | Reference Library | `/references` | Bookmark viral TikToks, Reels, hooks, and editing styles with category tags |
| **28** | Trend Discovery | `/trends` | Daily feed of trending short-form audio, formats, and high-retention hooks |
| **29** | AI Production Assistant | `/ai-assistant` | Automated clipping engine: transcript hook detector, 9:16 auto-cropper, captioner |
| **30** | Team Workspace & Members| `/team` | Invite editors/reviewers, role-based access control (Admin, Editor, Reviewer) |
| **31** | Shared Video Review | `/review/[token]` | External client/reviewer link with frame-accurate comments & timestamps |
| **32** | Project Activity & Discussions | `/projects/[id]/activity` | Team chat thread, @mentions, full audit log of project changes and draft uploads |

---

## 🎨 Remaining Google Stitch UI Prompt (Screen 32)

Here is the exact prompt ready to plug into Google Stitch for the last remaining screen:

```text
Design Screen 32: "Project Activity & Discussions" for Clipflow, a premium dark workspace web app for video creators and clippers.

- Style & Atmosphere: High-end dark studio aesthetic (#0B0D13 background, #171B26 surface cards, subtle #23293A borders, with indigo/purple accents). Desktop-first layout with clean typography.
- Layout: 
  1. Top Header: Project breadcrumb ("Workspace > Projects > Tech Podcast Highlights > Activity & Discussion") with active collaborator avatars and online indicators.
  2. Split View / Two-Column Layout:
     - Left Column (60%): Project Discussion Thread. Message bubbles with sender avatar, timestamp, formatted text, and @mentions for teammates. Includes an input box at the bottom with rich formatting icons, file attachment clip, timestamp reference pill ("e.g., @01:24"), and a prominent Send button.
     - Right Column (40%): Chronological Activity Timeline / Audit Log. Visual timeline with clean icons showing historical events:
       * "Alex R. uploaded Draft Version 2 (1080p, 58s)"
       * "Client requested revisions on hook timing"
       * "Deadline changed from Dec 10 to Dec 12 by Lead Editor"
       * "Asset 'Episode_42_Raw.mp4' attached by Sarah M."
- Key Elements: Filter buttons ("All Activity", "Comments Only", "Version Changes"), search within discussion, and subtle status badges ("Resolved", "Action Needed").
```
