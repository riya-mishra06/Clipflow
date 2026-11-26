# **Clipflow — High-Level System Design (HLD)**

**Version:** 1.0\
**Architecture:** Modular Monolith with Background Workers\
**Objective:** Maximum automation, minimum operational cost and future scalability.

## **1. High-level architecture**

## **2. Architecture selection**

We will use a **Modular Monolith with separate background workers**.

| Architecture            | Decision                                                        |
| ----------------------- | --------------------------------------------------------------- |
| Monolithic architecture | Too tightly coupled if not organized                            |
| Modular monolith        | Selected                                                        |
| Microservices           | Not required initially                                          |
| Fully serverless        | Unsuitable as the only solution for long video-processing tasks |

A modular monolith means we have one main application, but every feature has its own organized module.

For example, Clipping, UGC, Publishing and Earnings will have separate business logic without requiring separate backend servers for every feature.

## **3. System components**

| Component         | Responsibility                         | Technology                        |
| ----------------- | -------------------------------------- | --------------------------------- |
| Frontend          | All screens and user interactions      | Next.js, React                    |
| Backend           | Business logic and API requests        | Next.js API routes                |
| Database          | Store structured application data      | MongoDB                           |
| AI engine         | Research, scripts and recommendations  | GPT, Gemini                       |
| Generation layer  | AI images, videos and audio            | Authorized APIs or manual imports |
| Media engine      | Video editing and processing           | FFmpeg, Remotion, Whisper         |
| Job queue         | Manage long-running tasks              | MongoDB-backed queue initially    |
| Background worker | Execute generation and rendering jobs  | Node.js                           |
| Storage           | Store videos, images and audio         | Local storage / R2                |
| Scheduler         | Daily updates and scheduled publishing | Node.js scheduler                 |
| Security          | Authentication and access control      | JWT, bcrypt, Zod                  |

## **4. Module architecture**

We will divide Clipflow into 14 logical modules.

| Module           | Responsibility                                  |
| ---------------- | ----------------------------------------------- |
| Authentication   | Login, registration and sessions                |
| Dashboard        | Daily recommendations and overview              |
| Discovery        | Campaigns, trends and competitors               |
| AI Intelligence  | Recommendations, scripts and prompts            |
| Clipping         | Video analysis and automated clips              |
| UGC              | Product advertisements and AI models            |
| AI Video         | AI-generated and faceless content               |
| Reference Studio | Reference analysis and original storyboards     |
| Editing          | Timeline, motion graphics, audio and captions   |
| Assets           | Media files, templates and brand assets         |
| Brand Management | Multiple account workspaces                     |
| Publishing       | Scheduling and social publishing                |
| Analytics        | Content performance and improvements            |
| Finance          | Earnings, affiliate links, expenses and budgets |

## **5. How the complete system works**

Let's understand it using a practical example: creating a 30-second clothing UGC video.

| Step | Action                              | Responsible component         |
| ---- | ----------------------------------- | ----------------------------- |
| 1    | Select UGC Studio                   | Frontend                      |
| 2    | Upload product image                | Storage                       |
| 3    | Create project                      | Backend + MongoDB             |
| 4    | Analyze product                     | AI engine                     |
| 5    | Generate script                     | GPT                           |
| 6    | Generate 30-second storyboard       | GPT                           |
| 7    | Approve storyboard                  | User                          |
| 8    | Generate scene visuals              | Available AI generation tools |
| 9    | Import or retrieve generated assets | Storage                       |
| 10   | Generate voiceover                  | Audio provider                |
| 11   | Add motion graphics                 | Remotion                      |
| 12   | Add subtitles                       | Whisper / script alignment    |
| 13   | Combine all scenes                  | FFmpeg                        |
| 14   | Preview final video                 | Frontend                      |
| 15   | Approve and publish                 | Social media API              |
| 16   | Retrieve performance                | Analytics module              |
| 17   | Calculate expenses and earnings     | Finance module                |

## **6. AI provider architecture**

Instead of directly connecting every feature to GPT or Gemini, we will create a common AI integration layer.

| Provider            | Responsibility                            | Priority              |
| ------------------- | ----------------------------------------- | --------------------- |
| GPT                 | Reasoning, scripts, storyboards, strategy | Primary               |
| Gemini              | Multimodal analysis and creative tasks    | Secondary             |
| Google Flow / Veo   | Video generation                          | Preferred             |
| Adobe Firefly       | Creative asset generation                 | Preferred alternative |
| Adobe desktop tools | Advanced manual editing                   | Existing subscription |
| ElevenLabs          | Voiceovers and sound effects              | Optional              |
| fal.ai              | Automated image and video generation      | Backup                |
| Klap                | Automated clipping                        | Backup                |

This allows us to change providers without rewriting the entire application.

Google Flow and Adobe tools will use manual asset import wherever direct API access is unavailable.

## **7. Background job architecture**

This is particularly important because video generation and rendering can take several minutes.

A normal API request should not remain open until a complete video is generated.

User clicks Generate Video

Backend creates generation job

Job Queue — Pending

Background worker processes job

Completed

Save output

Failed

Controlled retry

Update project status in UI

Initially, we can use MongoDB to maintain job records and atomic job claiming. We can introduce Redis and BullMQ later if processing volume increases.

## **8. Database and storage separation**

We should not store large video files directly inside MongoDB documents.

| MongoDB           | Media storage    |
| ----------------- | ---------------- |
| User details      | MP4 videos       |
| Project details   | Product images   |
| Storyboards       | Generated images |
| Scene timing      | Voiceover files  |
| File paths        | Background music |
| Generation status | Reference videos |
| Analytics         | Exported videos  |
| Earnings          | Thumbnails       |

MongoDB stores the information about each asset, while media storage contains the actual file.

## **9. Proposed project folder structure**

```
clipflow/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   └── api/
│   ├── modules/
│   │   ├── auth/
│   │   ├── campaigns/
│   │   ├── trends/
│   │   ├── intelligence/
│   │   ├── clipping/
│   │   ├── ugc/
│   │   ├── ai-video/
│   │   ├── references/
│   │   ├── storyboard/
│   │   ├── editor/
│   │   ├── assets/
│   │   ├── brands/
│   │   ├── publishing/
│   │   ├── analytics/
│   │   └── finance/
│   ├── integrations/
│   │   ├── openai/
│   │   ├── gemini/
│   │   ├── youtube/
│   │   ├── instagram/
│   │   ├── whop/
│   │   └── cuelinks/
│   ├── workers/
│   ├── media/
│   │   ├── ffmpeg/
│   │   ├── remotion/
│   │   └── whisper/
│   ├── models/
│   ├── components/
│   ├── lib/
│   └── types/
├── storage/
├── tests/
├── docs/
└── .env.local
```

This is a proposed structure. We should compare it with the existing Clipflow repository before reorganizing anything.

## **10. Deployment architecture**

Initially, we will use a local-first hybrid architecture.

| Component         | Location           |
| ----------------- | ------------------ |
| Web application   | Local laptop       |
| Backend           | Local laptop       |
| MongoDB           | MongoDB Atlas      |
| Media processing  | Local laptop       |
| AI generation     | External providers |
| Media storage     | Local laptop       |
| Social APIs       | External platforms |
| Background worker | Local laptop       |

This avoids unnecessary hosting expenses.

However, your laptop must remain running for local background processing and scheduled publishing. We also need to benchmark its video-rendering performance before committing to this approach.

## **11. Final architecture decisions**

| Decision                 | Selection                   |
| ------------------------ | --------------------------- |
| Application architecture | Modular monolith            |
| Backend                  | Next.js                     |
| Database                 | MongoDB                     |
| Primary AI               | GPT                         |
| Secondary AI             | Gemini                      |
| Media processing         | FFmpeg, Remotion, Whisper   |
| Background processing    | Separate Node.js worker     |
| Job queue                | MongoDB initially           |
| Storage                  | Local-first                 |
| Deployment               | Local-first hybrid          |
| Paid integrations        | Only when necessary         |
| Generation approach      | Automated + manual fallback |
| Publishing               | Human approval required     |

**Pending validation:** Existing repository structure, API access, subscription entitlements, laptop rendering capacity and platform publishing permissions.

## **System design progress**

Product Requirements Document

Finalized

High-Level Design (HLD)

Proposed

Technology Stack & Justification

Detailed Module Architecture

AI Integration Architecture

Media Processing Pipeline

Background Job Architecture

Database Design

API Design

Storage Architecture

Security Architecture

Cost Management

Deployment Architecture

Existing Project Gap Analysis

Implementation Planning
