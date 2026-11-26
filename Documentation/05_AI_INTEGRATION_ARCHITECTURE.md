# **05 — AI Integration Architecture**

**Project:** Clipflow Creator Studio\
**Document:** `05_AI_INTEGRATION_ARCHITECTURE.md`\
**Architecture:** Multi-provider AI integration with automated and manual workflows.

## **1. Objective**

Integrate multiple AI tools into Clipflow through a centralized AI integration layer.

The system should select the appropriate AI tool according to the task, quality requirements, availability and generation cost.

Our objective is to utilize existing subscriptions as much as possible and avoid unnecessary additional expenses.

## **2. AI provider responsibilities**

| AI provider             | Responsibility                                | Priority  |
| ----------------------- | --------------------------------------------- | --------- |
| GPT                     | Reasoning, planning, scripts, recommendations | Primary   |
| Gemini                  | Image, video and reference analysis           | Secondary |
| Google Flow / Veo       | AI video generation                           | Preferred |
| Gemini Image Generation | AI characters and product images              | Preferred |
| Adobe Firefly           | Creative images and video assets              | Preferred |
| Whisper                 | Transcription and subtitles                   | Primary   |
| Remotion                | Programmatic motion graphics                  | Primary   |
| ElevenLabs              | Voiceovers and sound effects                  | Optional  |
| fal.ai                  | Automated image and video generation          | Backup    |
| Klap                    | Automated video clipping                      | Backup    |

FFmpeg and Remotion are media-processing and rendering technologies, not AI models.

## **3. AI integration architecture**

**Clipflow User Interface**

Clipping · UGC · AI Video · Research

**Next.js Backend**

Authentication · Validation · Request handling

**Central AI Orchestrator**

Task routing · Prompt management · Cost estimation · Provider selection

**Intelligence**

GPT · Gemini

**Image generation**

Gemini · Firefly

**Video generation**

Veo · Flow · fal.ai

**Audio & transcription**

Whisper · ElevenLabs

**Background Job Workers**

Generation · Processing · Rendering · Retries

**MongoDB**

Metadata and job status

**Media Storage**

Images, audio and videos

## **4. Central AI Orchestrator**

The AI Orchestrator will manage communication between Clipflow and different AI providers.

Its responsibilities include:

- Understanding the requested task.
- Selecting the appropriate AI provider.
- Preparing structured prompts.
- Checking provider availability.
- Estimating generation costs.
- Checking user approval and spending limits.
- Sending generation requests.
- Validating AI responses.
- Handling errors and approved fallbacks.
- Recording usage and generation history.

Individual modules should not directly integrate with every AI provider.

## **5. AI task routing**

| Task                        | Primary tool                    | Alternative                              |
| --------------------------- | ------------------------------- | ---------------------------------------- |
| Content strategy            | GPT                             | Gemini                                   |
| Campaign recommendations    | GPT                             | Gemini                                   |
| Script generation           | GPT                             | Gemini                                   |
| Storyboard generation       | GPT                             | Gemini                                   |
| Reference video analysis    | Gemini                          | GPT with extracted frames and transcript |
| Viral moment identification | GPT + Whisper                   | Gemini                                   |
| AI character generation     | Gemini                          | Firefly                                  |
| Product image generation    | Gemini                          | Firefly                                  |
| Video generation            | Veo / Flow                      | Firefly / fal.ai                         |
| Virtual try-on              | Supported generation model      | Manual creative workflow                 |
| Voiceover                   | Available approved TTS provider | ElevenLabs                               |
| Transcription               | Local Whisper                   | Approved cloud transcription             |
| Subtitle animation          | Remotion                        | FFmpeg                                   |
| Motion graphics             | Remotion                        | After Effects                            |
| Video clipping              | FFmpeg + AI analysis            | Klap                                     |
| Caption and SEO             | GPT                             | Gemini                                   |
| Performance analysis        | GPT                             | Gemini                                   |

Fallbacks must support the requested capability. A paid fallback must not run without appropriate approval.

## **6. Integration modes**

Clipflow will support three integration modes.

**Mode A — Direct API integration**

Clipflow sends requests directly to an authorized AI API and automatically receives the results.

Example: GPT API generates a storyboard.

**Mode B — Local automation**

Clipflow executes installed tools on the local computer without requiring a paid generation API.

Example: Whisper generates subtitles and FFmpeg renders clips.

**Mode C — Manual assisted integration**

Clipflow prepares prompts, references and scene instructions. The user generates assets in an external tool and imports the results.

Example: Generate a scene in Google Flow and import it into Clipflow.

### **Why manual integration is necessary**

We already have access to ChatGPT, Gemini and Adobe subscriptions. However, application subscriptions do not automatically provide API access or API credits.

Therefore, Clipflow must remain functional even when direct API integration is unavailable.

## **7. AI workflows**

### **7.1 AI Clipping workflow**

**Authorized video URL or upload**

**FFmpeg — Extract audio**

**Whisper — Generate transcript**

**GPT / Gemini — Identify viral moments**

**FFmpeg — Extract and crop clips**

**Remotion — Subtitles and motion graphics**

**User review and approval**

**Final HD export**

### **7.2 AI UGC workflow**

**Product image / URL / description**

**GPT + Gemini — Product analysis**

**GPT — Script and storyboard**

**Gemini / Firefly — Character and images**

**User approval of character and product**

**Veo / Flow — Individual scene generation**

**Voiceover and audio generation**

**FFmpeg + Remotion — Video assembly**

**User review and final export**

### **7.3 Reference-to-Video workflow**

**Upload reference video**

**FFmpeg — Extract frames and audio**

**Gemini — Analyze visual style**

**Whisper — Analyze spoken content**

**GPT — Create original storyboard**

**Generate new visual assets and scenes**

**Apply similar production techniques**

**Review and export original content**

### **7.4 AI Research and Recommendations**

The system collects available campaign, trend and account performance data through authorized APIs.

GPT analyzes the collected information and recommends suitable campaigns, content ideas, publishing strategies and improvement opportunities.

Recommendations must include the underlying source information. AI must not invent campaign payouts, trends or analytics.

## **8. AI Prompt Management System**

Instead of hardcoding prompts throughout the application, Clipflow will maintain centralized, reusable prompt templates.

| Prompt category       | Purpose                               |
| --------------------- | ------------------------------------- |
| Campaign analysis     | Evaluate earning opportunities        |
| Viral analysis        | Identify high-potential video moments |
| Script generation     | Generate video scripts                |
| Storyboard generation | Create scene-by-scene plans           |
| Character generation  | Maintain character appearance         |
| Product generation    | Maintain product consistency          |
| Video generation      | Generate individual scenes            |
| Reference analysis    | Understand production style           |
| SEO generation        | Generate captions and keywords        |
| Analytics analysis    | Recommend improvements                |

Each prompt template should contain a unique ID, version, required inputs, instructions, expected output format and associated task.

## **9. Structured AI responses**

AI-generated data should use structured JSON wherever possible.

Example storyboard response:

```
{
  "projectType": "UGC",
  "title": "Skincare Product Advertisement",
  "duration": 30,
  "aspectRatio": "9:16",
  "scenes": [
    {
      "sceneNumber": 1,
      "startTime": 0,
      "endTime": 5,
      "duration": 5,
      "script": "Looking for a lightweight moisturizer?",
      "visual": "Close-up of the product",
      "cameraMovement": "Slow zoom",
      "generationPrompt": "Product on a clean vanity",
      "transition": "Fade",
      "status": "pending"
    }
  ]
}
```

This is an illustrative single-scene response, not a complete 30-second storyboard.

Zod will validate AI-generated responses before saving them to MongoDB. Complete storyboards must satisfy the requested duration and scene timing requirements.

## **10. Character and product consistency**

This is particularly important for UGC and AI-generated advertisements.

Every project should maintain a consistency profile.

| Character profile          | Product profile          |
| -------------------------- | ------------------------ |
| Character reference images | Product reference images |
| Facial appearance          | Product shape            |
| Hairstyle                  | Product colour           |
| Clothing                   | Packaging                |
| Body proportions           | Brand identity           |
| Voice profile              | Logo and text            |
| Visual style               | Product dimensions       |

Every scene generation request should reuse the relevant reference assets and consistency instructions.

AI-generated scenes must be reviewed because perfect character and product consistency cannot be guaranteed.

## **11. Provider adapter architecture**

Each AI provider will have its own adapter.

Proposed folder structure:

```
src/
└── lib/
    └── ai/
        ├── orchestrator.ts
        ├── provider-registry.ts
        ├── task-router.ts
        ├── prompt-manager.ts
        ├── response-validator.ts
        ├── cost-estimator.ts
        ├── providers/
        │   ├── openai.provider.ts
        │   ├── gemini.provider.ts
        │   ├── veo.provider.ts
        │   ├── firefly.provider.ts
        │   ├── elevenlabs.provider.ts
        │   ├── fal.provider.ts
        │   └── klap.provider.ts
        ├── prompts/
        ├── schemas/
        └── types/
```

Only providers with verified API access should receive active implementations. Manual-only providers can use a separate assisted-generation workflow.

This structure is proposed and will be reconciled with the existing codebase during gap analysis.

## **12. AI provider fallback system**

AI generation request

Check primary provider

Available

Execute request

Validate result

Unavailable / Failed

Check eligible fallback

Approval or manual workflow

The system must distinguish temporary failures, invalid credentials, insufficient credits, rate limits and unsupported capabilities.

Retries must be limited to avoid duplicate generation and unnecessary charges.

## **13. AI generation lifecycle**

| Status            | Meaning                              |
| ----------------- | ------------------------------------ |
| Draft             | Generation request is being prepared |
| Awaiting Approval | User approval required               |
| Queued            | Waiting for worker                   |
| Processing        | Generation in progress               |
| Awaiting Import   | External manual generation required  |
| Generated         | Output received                      |
| Under Review      | User reviewing output                |
| Approved          | Output accepted                      |
| Failed            | Generation unsuccessful              |
| Cancelled         | Generation cancelled                 |
| Completed         | Final output saved                   |

## **14. AI cost tracking**

Every paid generation request must record:

- AI provider and model.
- Project and brand workspace.
- Task type.
- Input and output token usage, where applicable.
- Number of images generated.
- Video generation duration.
- Estimated cost.
- Actual cost, when available.
- Generation attempts.
- Generation date and status.

Detailed budgeting rules will be defined in `12_COST_MANAGEMENT.md`.

## **15. AI security**

All AI integrations must follow these rules:

- Store API keys securely on the server.
- Never expose credentials to the frontend.
- Validate all AI-generated responses.
- Treat external content as untrusted input.
- Prevent prompt injection from external websites and reference content.
- Protect user and workspace data.
- Avoid sending unnecessary personal information to AI providers.
- Require approval before paid generation.
- Respect content ownership and commercial usage rights.
- Prevent unauthorized automatic publishing.
- Never fabricate campaign, revenue or analytics data.

## **16. Integration priority**

| Phase   | Integration                           | Purpose                           |
| ------- | ------------------------------------- | --------------------------------- |
| Phase 1 | GPT / Gemini                          | Intelligence and content planning |
| Phase 1 | FFmpeg / Whisper                      | Clipping and transcription        |
| Phase 1 | Google Flow / Firefly manual workflow | Image and video creation          |
| Phase 2 | Remotion                              | Automated motion graphics         |
| Phase 2 | Supported image generation APIs       | Automated image creation          |
| Phase 2 | Supported video generation APIs       | Automated scene creation          |
| Phase 3 | ElevenLabs                            | Advanced audio                    |
| Phase 3 | fal.ai / Klap                         | Optional backup automation        |

## **17. Pending technical validation**

| Integration       | Current status                                            |
| ----------------- | --------------------------------------------------------- |
| GPT API           | API access and billing verification required              |
| Gemini API        | Existing credential issue requires verification           |
| Google Flow       | Manual workflow preferred initially                       |
| Veo API           | Access and pricing verification required                  |
| Adobe Firefly API | Subscription and API entitlement verification required    |
| Whisper           | Local performance testing required                        |
| FFmpeg            | Installation and processing verification required         |
| Remotion          | Rendering performance and licensing verification required |
| ElevenLabs        | Optional, not required initially                          |
| fal.ai            | Backup only                                               |
| Klap              | Backup only                                               |

## **18. Final decision**

Clipflow will use a centralized, multi-provider AI architecture with three supported integration modes:

- Direct API integration.
- Local automation.
- Manual assisted generation.

GPT will remain the primary intelligence provider, Gemini the secondary provider, and Google Flow, Veo and Adobe Firefly the preferred creative generation tools.

The system will prioritize existing subscriptions, local processing and minimum additional expenses.

The proposed architecture does not assume that all providers are currently connected or that subscriptions include API access. Those capabilities must be verified before implementation.

**Save in:** `Documentation/05_AI_INTEGRATION_ARCHITECTURE.md`

**Next:** `06_MEDIA_PROCESSING_PIPELINE.md` — how Clipflow will process raw videos, images, subtitles, audio, animations and AI-generated scenes into a complete professional video.