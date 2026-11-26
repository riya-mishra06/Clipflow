# **03 — Technology Stack & Justification**

PRD and HLD are done. Now we will finalize which technologies Clipflow will use, why we need them and their costs.

## **1. Core technology stack**

| Technology    | Purpose              | Why selected?                                       | Cost      |
| ------------- | -------------------- | --------------------------------------------------- | --------- |
| Next.js 16    | Full-stack framework | Frontend and backend in one application             | Free      |
| React 19      | Frontend             | Reusable UI components                              | Free      |
| TypeScript    | Programming language | Type safety and fewer errors                        | Free      |
| Tailwind CSS  | Styling              | Consistent and responsive UI                        | Free      |
| Lucide React  | Icons                | Lightweight, consistent icons                       | Free      |
| Node.js       | Backend workers      | Background video processing                         | Free      |
| MongoDB Atlas | Database             | Flexible document structure                         | Free tier |
| Mongoose      | Database operations  | Schemas and validation                              | Free      |
| Zod           | Input validation     | Validate API requests and forms                     | Free      |
| JWT           | Authentication       | Secure session management when properly implemented | Free      |
| bcrypt        | Password security    | Password hashing                                    | Free      |
| GitHub        | Version control      | Code management and history                         | Free tier |

## **2. AI technology stack**

| Tool                    | Purpose                                          | Priority    | Cost                               |
| ----------------------- | ------------------------------------------------ | ----------- | ---------------------------------- |
| OpenAI GPT API          | Reasoning, scripts, storyboards, recommendations | Primary     | API credits / paid                 |
| Gemini API              | Multimodal and reference analysis                | Secondary   | Free quota / paid                  |
| Google Flow / Veo       | AI video generation                              | Preferred   | Existing access, subject to limits |
| Gemini image generation | AI models and images                             | Preferred   | Existing access, subject to limits |
| Adobe Firefly           | AI creative assets                               | Alternative | Existing subscription              |
| ElevenLabs              | Voiceovers and sound effects                     | Optional    | Free limited / paid                |
| fal.ai                  | Automated AI generation                          | Backup      | Paid                               |
| Klap                    | Automated clipping                               | Backup      | Paid                               |

## **3. Video and audio processing**

| Technology           | Purpose                                         | Why selected?                    |
| -------------------- | ----------------------------------------------- | -------------------------------- |
| FFmpeg               | Cutting, merging, cropping, audio and export    | Free and automatable             |
| Remotion             | Motion graphics, animations and video rendering | React-based, customizable        |
| Whisper              | Transcription and subtitles                     | Free local processing            |
| React-based timeline | Native video editor                             | Complete control over editing UI |
| Premiere Pro         | Advanced manual editing                         | Existing Adobe subscription      |
| After Effects        | Advanced motion graphics                        | Existing Adobe subscription      |
| Adobe Audition       | Audio enhancement                               | Existing Adobe subscription      |
| Photoshop            | Product images and thumbnails                   | Existing Adobe subscription      |

## **4. External APIs**

| API                   | Purpose                             | Cost                       |
| --------------------- | ----------------------------------- | -------------------------- |
| YouTube Data API      | Video discovery and publishing      | Free quota                 |
| YouTube Analytics API | Channel performance                 | Free quota                 |
| Meta Graph API        | Instagram management and publishing | Free, permission dependent |
| Whop API              | Campaign discovery                  | Access dependent           |
| Cuelinks API          | Affiliate opportunities             | Approval required          |
| Pexels API            | Stock images and videos             | Free quota                 |
| Pixabay               | Licensed music and sound effects    | Free options               |
| Google Trends         | Trend research                      | Free manual access         |

## **5. Infrastructure and storage**

| Technology           | Purpose                        | Decision         |
| -------------------- | ------------------------------ | ---------------- |
| MongoDB Atlas        | Structured data storage        | Required         |
| Local file storage   | Videos, images and audio       | Initial solution |
| Cloudflare R2        | Cloud media storage            | Optional         |
| MongoDB-backed queue | Background job management      | Initial solution |
| Node.js workers      | Video generation and rendering | Required         |
| Node.js scheduler    | Scheduled tasks                | Required         |
| Redis + BullMQ       | Advanced job management        | Future scaling   |
| ESLint               | Code quality                   | Required         |
| Vitest               | Unit and integration testing   | Proposed         |
| Playwright           | Browser and end-to-end testing | Proposed         |

## **6. Development tools**

| Tool            | Usage                                     |
| --------------- | ----------------------------------------- |
| Antigravity     | Development and implementation            |
| Claude          | Coding and code review                    |
| ChatGPT Pro     | Planning, research and technical guidance |
| Google Stitch   | UI/UX design                              |
| MongoDB Compass | Database inspection                       |
| Postman         | Manual API testing                        |
| GitHub          | Version control                           |

## **7. Why this technology stack?**

- Reuses our existing Clipflow codebase.
- Avoids learning unnecessary programming languages.
- Utilizes existing paid subscriptions.
- Minimizes additional expenses.
- Supports automated video processing.
- Supports manual alternatives when APIs are unavailable.
- Allows future scaling without rebuilding everything.

## **8. Technologies we will avoid initially**

| Technology               | Reason                                        |
| ------------------------ | --------------------------------------------- |
| HeyGen                   | Overlapping functionality                     |
| Creatify                 | Overlapping UGC functionality                 |
| PostgreSQL               | Existing project uses MongoDB                 |
| Separate Express backend | Next.js already provides backend capabilities |
| Microservices            | Unnecessary initial complexity                |
| Kubernetes               | Unnecessary infrastructure                    |
| Paid cloud rendering     | Test local rendering first                    |

## **9. Pending technical validation**

- GPT API access and available credits.
- Gemini and Veo API availability.
- Adobe subscription capabilities.
- Laptop video-rendering performance.
- External API permissions.
- Commercial usage licenses.
- Remotion licensing eligibility.

## **10. Final decision**

Continue with **Next.js + React + TypeScript + MongoDB**, supported by GPT, Gemini, FFmpeg, Remotion and Whisper.

Use a local-first hybrid approach with existing subscriptions and authorized APIs.

Vitest and Playwright are my proposed additions for testing. The remaining stack follows our previously agreed decisions.

Save this content inside `Documentation/03_TECHNOLOGY_STACK.md`.

