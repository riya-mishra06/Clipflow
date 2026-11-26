# **Clipflow — Product Requirements Document (PRD)**

# CLIPFLOW — Product Requirements Document

**Version:** 1.0\
**Date:** 26 November 2026\
**Product:** Clipflow Creator Studio\
**Platform:** Web Application\
**Status:** Planning finalized — technical validation pending\
**Initial release:** Personal-use application

---

## 1. Product Overview

Clipflow is an all-in-one AI-powered content creation, video editing, social media management and earning platform.

It combines campaign discovery, trend research, AI content generation, automated video clipping, UGC creation, professional editing, publishing and revenue tracking within a single application.

Clipflow will prioritize existing AI subscriptions, free automation tools and minimum additional operational expenses.

## 2. Problem Statement

Content creators currently depend on multiple disconnected platforms for:

- Finding paid clipping campaigns.
- Discovering trending content.
- Finding affiliate opportunities.
- Researching competitors.
- Generating scripts and storyboards.
- Creating AI videos and UGC advertisements.
- Editing videos and adding motion graphics.
- Managing multiple social media accounts.
- Publishing and tracking performance.
- Monitoring expenses and earnings.

Switching between these platforms increases costs, manual effort and production time.

## 3. Proposed Solution

Clipflow provides a centralized creator workspace that connects the entire content production and monetization lifecycle.

**End-to-end workflow:**

Discover → Research → Recommend → Plan → Generate → Edit → Review → Publish → Analyze → Earn → Improve.

The system should automate supported activities while retaining manual controls for creative decisions, financial approvals and final publishing.

## 4. Product Objectives

- Reduce manual content production time.
- Discover relevant earning opportunities daily.
- Generate professional short-form content.
- Support multiple content niches and social accounts.
- Automate repetitive video editing activities.
- Utilize existing paid subscriptions.
- Minimize additional API expenses.
- Track content performance and profitability.
- Provide a simple, professional creator experience.

## 5. Target Users

### Initial release

Personal use by a creator managing multiple content accounts and earning opportunities.

### Future release

- Content creators.
- Video editors.
- UGC creators.
- Affiliate marketers.
- Social media managers.
- Freelancers.
- Digital marketing agencies.

## 6. Supported Content Categories

- Gaming and streamer clipping.
- Podcast and interview clipping.
- Fashion and clothing UGC.
- Makeup and skincare UGC.
- Accessories and gadgets.
- Product advertisements.
- Affiliate marketing content.
- AI-generated viral videos.
- Faceless educational videos.
- Storytelling and animated content.
- Reference-inspired original content.

## 7. Homepage and Navigation

The homepage should begin with:

**“What do you want to create today?”**

Users can select:

1. AI Clipping Studio.
2. AI UGC Studio.
3. AI Video Studio.
4. Reference-to-Video Studio.
5. Video Editing Studio.
6. Earning Opportunities.
7. Trend Research.
8. Social Media Management.

Additional homepage sections:

- Daily AI recommendations.
- Trending opportunities.
- Recent projects.
- Saved templates.
- Scheduled content.
- Pending approvals.
- Generation progress.
- Earnings summary.
- AI credit usage and expenses.

Each workspace must display only relevant features to avoid overwhelming the user.

## 8. Functional Requirements

### FR-01: Campaign Discovery

Discover earning opportunities from supported sources:

- Whop.
- Content Rewards.
- Cuelinks.
- Affiliate marketing platforms.
- Creator reward programs.
- Manually added opportunities.

Display campaign requirements, payouts, deadlines, eligibility, source links and availability.

Support search, filtering, saving, duplicate detection and daily updates.

Record the last successful synchronization time for each source.

### FR-02: Trend Research

Discover relevant trends from supported sources, including YouTube, Instagram, Google Trends and manually submitted references.

Features:

- Trending topics and niches.
- Viral video formats.
- Trending hooks and hashtags.
- Popular AI-generated content.
- Competitor research.
- Content performance comparison.
- Account-specific trend recommendations.

Restricted platform information must support manual reference submission instead of fabricated data.

### FR-03: AI Recommendation Engine

GPT will be the primary reasoning and recommendation engine.

The system should recommend:

- Suitable campaigns.
- Profitable content opportunities.
- Relevant products.
- Content niches.
- Video ideas.
- Hooks and scripts.
- Recommended duration.
- Editing styles.
- Publishing strategies.
- Content improvements.

Recommendations should consider available campaign information, account niche, historical performance, estimated costs and potential earnings.

### FR-04: AI Clipping Studio

Accept:

- Authorized YouTube video URLs.
- Supported public video URLs.
- Livestream recordings.
- Uploaded video files.

Features:

- Video discovery.
- Transcript generation.
- Viral moment identification.
- Timestamp recommendations.
- Automatic clip extraction.
- Multiple clips from one source.
- Smart vertical cropping.
- Speaker-focused framing.
- Silence removal.
- Animated captions.
- Motion graphics.
- Zoom effects.
- Background music.
- Sound effects.
- Thumbnail and cover generation.
- Caption and hashtag generation.
- HD video export.

Local processing should be prioritized. Klap may be integrated if local clipping quality is insufficient.

### FR-05: AI UGC Studio

Create product-focused advertisements using AI-generated visuals and models.

Supported categories:

- Clothing.
- Makeup.
- Skincare.
- Jewellery.
- Accessories.
- Gadgets.
- General consumer products.

Inputs:

- Product image.
- Product URL.
- Product description.
- Reference video.
- Target audience.
- Brand identity.
- Video duration.
- Preferred model and visual style.

Features:

- Product analysis.
- AI model generation.
- Script generation.
- Storyboard generation.
- Virtual try-on where supported.
- Product demonstrations.
- Unboxing videos.
- Lifestyle advertisements.
- Product and character consistency.
- AI voiceovers.
- Lip-sync where supported.
- Motion graphics.
- Captions.
- Calls to action.
- Final video assembly.

UGC must not contain fabricated personal experiences, misleading testimonials or unsupported product claims.

### FR-06: AI Video Studio

Generate original content using:

- Text-to-video.
- Image-to-video.
- Reference-to-video.
- AI animation.
- Faceless videos.
- Storytelling.
- Educational content.
- Cinematic content.
- Viral short-form formats.

Support custom scripts, multiple scenes, visual styles, camera movements, voiceovers and sound design.

Google Flow, Veo and available Adobe Firefly capabilities should be evaluated first using existing subscriptions.

### FR-07: Reference-to-Video Studio

Allow users to upload a reference video or provide a supported reference URL.

Analyze:

- Video structure.
- Scene timing.
- Visual style.
- Camera movements.
- Editing patterns.
- Motion graphics.
- Hooks.
- Captions.
- Audio style.
- Transitions.
- Storytelling techniques.

Generate an original storyboard inspired by the reference without unauthorized copying of protected content or identities.

Allow users to regenerate individual scenes.

### FR-08: AI Scriptwriter

Generate:

- Video hooks.
- Short-form scripts.
- UGC scripts.
- Product advertisements.
- Voiceover scripts.
- Storytelling scripts.
- Scene descriptions.
- Calls to action.
- Captions.
- Hashtags.
- SEO keywords.
- AI generation prompts.

Scripts must be editable and reusable.

### FR-09: Storyboard and Scene Management

Every generated video should have an editable storyboard.

Supported durations:

- 10 seconds.
- 15 seconds.
- 30 seconds.
- 60 seconds.
- Custom duration.

Each scene must support:

- Scene number.
- Start and end time.
- Duration.
- Script.
- Visual description.
- Generation prompt.
- Reference assets.
- Camera movement.
- Character details.
- Product details.
- Voiceover.
- Motion graphics.
- Captions.
- Sound effects.
- Transition.
- Generation status.

Users must be able to add, delete, duplicate, reorder, preview and regenerate scenes.

The system must validate that scene durations match the selected total video duration.

### FR-10: Video Editing Studio

Provide a simplified CapCut-inspired editing experience.

Features:

- Multi-track timeline.
- Drag-and-drop editing.
- Video trimming and splitting.
- Scene rearrangement.
- Audio synchronization.
- Smart cropping.
- Zoom and pan.
- Speed adjustment.
- Filters and colour adjustments.
- Transitions.
- B-roll insertion.
- Text overlays.
- Undo and redo.
- Auto-save.
- Scene regeneration.
- Individual scene preview.
- Complete video preview.

Supported timeline tracks:

- Video.
- Images.
- Voiceover.
- Background music.
- Sound effects.
- Captions.
- Motion graphics.
- Text and overlays.

### FR-11: Motion Graphics

Support automated and customizable:

- Animated text.
- Animated icons.
- Kinetic typography.
- Product highlights.
- Callout animations.
- Lower thirds.
- Progress indicators.
- Logo animations.
- Social media CTAs.
- Intro and outro animations.
- Custom animation templates.

Remotion will be evaluated for automated rendering.

Adobe After Effects can support advanced manual refinement where available.

### FR-12: Voiceover and Audio Studio

Features:

- AI-generated voiceovers.
- Multiple languages.
- Male and female voice options.
- Voice speed and tone controls.
- Scene-specific narration.
- Voiceover regeneration.
- Audio synchronization.
- Background music.
- Sound effects.
- Noise reduction.
- Volume adjustment.
- Audio enhancement.
- Audio ducking.
- Lip-sync where supported.

Use existing tools first. ElevenLabs will be an optional integration when additional voice generation capabilities are required.

### FR-13: Subtitle and Caption Engine

Features:

- Automatic transcription.
- Word-level timestamps.
- Animated subtitles.
- Word-by-word highlighting.
- Multiple caption styles.
- Font and colour customization.
- Subtitle positioning.
- Manual corrections.
- SRT export.
- Burned-in captions.
- Multilingual subtitles where supported.

Use local Whisper and Remotion or FFmpeg.

### FR-14: Asset Management

Maintain a reusable media library containing:

- Images.
- Videos.
- AI-generated assets.
- Product images.
- AI characters.
- Voiceovers.
- Background music.
- Sound effects.
- Fonts.
- Logos.
- Templates.
- Reference videos.
- Exported videos.

Support folders, search, tags, previews and brand-specific asset organization.

### FR-15: Templates and Bulk Generation

Allow users to:

- Save successful storyboards.
- Save editing styles.
- Save caption styles.
- Reuse AI characters.
- Reuse brand assets.
- Duplicate projects.
- Generate multiple clips.
- Generate multiple product advertisements.
- Create different hooks for the same video.
- Generate platform-specific variations.

Bulk generation must respect configured spending limits.

### FR-16: Multi-Account and Brand Management

Support multiple Instagram and YouTube accounts.

Example workspaces:

- Gaming and clipping.
- Fashion and clothing.
- Makeup and skincare.
- AI viral and faceless content.
- Affiliate marketing.

Each workspace must maintain independent:

- Brand identity.
- Social account connections.
- Content strategy.
- Projects.
- Asset library.
- Templates.
- Calendar.
- Analytics.
- Earnings.
- Generation expenses.

Prevent accidental publishing to the wrong account.

### FR-17: Publishing and Scheduling

Features:

- Instagram Reels publishing where authorized.
- YouTube Shorts publishing where authorized.
- Manual export for unsupported platforms.
- AI-generated captions.
- Hashtags and SEO keywords.
- Cover generation.
- Account selection.
- Scheduled publishing.
- Content calendar.
- Draft management.
- Publishing approval.
- Publishing status.
- Failure handling.

Publishing must require user approval and valid platform permissions.

### FR-18: Analytics

Track available platform metrics:

- Views.
- Likes.
- Comments.
- Shares.
- Engagement.
- Followers.
- Watch time.
- Retention.
- Best-performing content.
- Best-performing formats.
- Account growth.
- Publishing frequency.

GPT should analyze available performance data and recommend improvements.

### FR-19: Affiliate Management

Features:

- Affiliate opportunity discovery.
- Product management.
- Affiliate link storage.
- Tracking link management.
- Product-to-content mapping.
- Commission tracking.
- Conversion tracking where supported.
- Affiliate campaign performance.
- Required advertising disclosures.

### FR-20: Earnings and Profit Tracking

Track:

- Campaign submissions.
- Submission status.
- Approved earnings.
- Pending earnings.
- Affiliate commissions.
- Received payments.
- Generation expenses.
- Subscription expenses.
- Revenue per account.
- Revenue per campaign.
- Profit per video.
- Monthly profit.

Distinguish estimated earnings from confirmed payments.

### FR-21: AI Cost Management

Features:

- Estimated generation cost.
- API credit usage.
- Daily and monthly budgets.
- Spending approval.
- Provider-wise expenses.
- Cost per project.
- Failed generation expenses.
- Cost comparison.
- Budget alerts.

The system must not automatically purchase credits or exceed approved spending limits.

### FR-22: Notifications and Reliability

Provide notifications for:

- New campaigns.
- Campaign deadlines.
- Completed generations.
- Failed generations.
- Scheduled posts.
- Publishing failures.
- API connection failures.
- Budget limits.
- Pending approvals.

Support generation queues, controlled retries, generation history, project recovery and API health monitoring.

## 9. Final Technology Stack

| Technology     | Purpose                       |
| -------------- | ----------------------------- |
| Next.js 16     | Full-stack web application    |
| React 19       | Frontend                      |
| TypeScript     | Type-safe development         |
| Tailwind CSS   | UI styling                    |
| MongoDB Atlas  | Database                      |
| Mongoose       | Database operations           |
| JWT and bcrypt | Authentication                |
| Zod            | Validation                    |
| Lucide         | Icons                         |
| FFmpeg         | Media processing              |
| Remotion       | Motion graphics and rendering |
| Local Whisper  | Transcription                 |
| GitHub         | Version control               |
| Local storage  | Initial media storage         |
| Cloudflare R2  | Optional cloud storage        |

Continue with the existing Clipflow codebase rather than rebuilding the application.

## 10. Existing Subscription Utilization

### ChatGPT Pro

Primary AI tool for:

- Research.
- Recommendations.
- Scripts.
- Storyboards.
- Content strategy.
- Prompt generation.
- Performance analysis.

Verify available OpenAI API access and credits separately.

### Gemini Pro

Secondary AI tool for:

- Multimodal analysis.
- Reference analysis.
- Image generation.
- AI character creation.
- Video generation through available Google Flow and Veo features.

Verify plan entitlements and programmatic API availability.

### Adobe Pro

Use available Adobe applications:

| Application   | Purpose                       |
| ------------- | ----------------------------- |
| Premiere Pro  | Advanced video editing        |
| After Effects | Motion graphics               |
| Audition      | Audio editing                 |
| Firefly       | AI image and video generation |
| Photoshop     | Image and product editing     |
| Adobe Express | Social media creatives        |
| Media Encoder | Rendering and export          |

Exact application availability depends on the existing Adobe subscription.

### Claude and Antigravity

Use for development, debugging, documentation, architecture and code review.

## 11. Final Tools and Cost Classification

| Tool              | Cost category                       | Decision                         |
| ----------------- | ----------------------------------- | -------------------------------- |
| GPT API           | Included credits if eligible / paid | Primary AI                       |
| Gemini API        | Free quota / paid                   | Secondary AI                     |
| Google Flow / Veo | Existing access, subject to limits  | Preferred video generation       |
| Adobe Firefly     | Existing access, subject to credits | Preferred creative alternative   |
| FFmpeg            | Free                                | Required                         |
| Remotion          | Free for eligible individual use    | Required                         |
| Local Whisper     | Free                                | Required                         |
| YouTube Data API  | Free quota                          | Required                         |
| Meta Graph API    | Free, permissions required          | Required                         |
| Whop API          | Access dependent                    | Required for supported discovery |
| Cuelinks API      | Approval dependent                  | Affiliate integration            |
| Pexels API        | Free quota                          | Stock assets                     |
| Pixabay           | Free licensed options               | Audio assets                     |
| Google Trends     | Free manual access                  | Trend research                   |
| ElevenLabs        | Free limited / paid                 | Optional                         |
| Klap              | Paid                                | Backup clipping provider         |
| fal.ai            | Paid per generation                 | Backup generation provider       |
| HeyGen            | Paid                                | Removed                          |
| Creatify          | Paid                                | Removed                          |

No additional paid subscription should be purchased until existing tools have been tested.

## 12. Automation and Manual Workflows

### Automated workflow

Clipflow should automate supported activities through authorized APIs and local processing:

- Campaign synchronization.
- Trend collection.
- Recommendations.
- Scripts.
- Storyboards.
- Video clipping.
- Transcription.
- Captions.
- Motion graphics.
- Video assembly.
- Export.
- Scheduling.
- Analytics synchronization.
- Expense tracking.

### Hybrid workflow

When a subscription provides a web application but no accessible API:

1. Clipflow generates the storyboard and prompts.
2. User generates assets in Google Flow, Gemini or Adobe Firefly.
3. User imports generated assets into Clipflow.
4. Clipflow assembles, edits, captions and exports the video.

### Manual requirements

- Initial API setup.
- Social account authorization.
- Restricted campaign imports.
- Campaign participation approvals.
- Product and reference uploads.
- Content rights verification.
- Storyboard approval.
- Spending approval.
- Final quality review.
- Publishing approval.
- Payment verification and withdrawal.

## 13. High-Level System Architecture

### Frontend

Next.js and React application containing all creator workspaces.

### Backend

Next.js API routes and background processing workers responsible for authentication, business logic, provider integrations and job management.

### AI Integration Layer

Provider adapters for GPT, Gemini and optional generation providers.

Each provider should have independent configuration, capability checks, error handling and cost tracking.

### Media Processing Layer

FFmpeg, Remotion and Whisper for video editing, transcription, audio processing and rendering.

### Database Layer

MongoDB for users, accounts, campaigns, projects, storyboards, jobs, publishing and financial records.

### Storage Layer

Local storage initially, with optional cloud storage for persistent media and remote publishing.

Long-running media processing should use background workers rather than blocking normal API requests.

## 14. Proposed Database Entities

- Users
- Sessions
- BrandWorkspaces
- SocialAccounts
- Campaigns
- CampaignSources
- SavedCampaigns
- Trends
- Competitors
- Recommendations
- Projects
- ProjectTasks
- Storyboards
- Scenes
- TimelineTracks
- MediaAssets
- AICharacters
- Templates
- GenerationJobs
- ClipJobs
- Voiceovers
- Subtitles
- PublishingJobs
- ScheduledPosts
- AnalyticsSnapshots
- AffiliateProducts
- AffiliateLinks
- Submissions
- Earnings
- Expenses
- APIUsage
- Notifications
- AuditLogs
- Settings

Existing collections should be audited before introducing new collections.

## 15. Non-Functional Requirements

### Security

- Secure authentication.
- User and workspace authorization.
- Protected API credentials.
- Secure OAuth token storage.
- Input validation.
- Rate limiting.
- Safe external URL handling.
- No hardcoded production secrets.
- Audit logs for publishing and financial actions.

### Performance

- Responsive UI.
- Lazy-loaded media.
- Background generation jobs.
- Paginated results.
- Cached supported API responses.
- Optimized video previews.

### Reliability

- Automatic project saving.
- Controlled retries.
- Recoverable failed jobs.
- Duplicate prevention.
- Backup and recovery.
- Clear integration error messages.

### Usability

- Simple navigation.
- Workspace-specific controls.
- Consistent design system.
- Loading, empty, error and success states.
- Clear generation progress.
- Accessible controls.

### Compliance

- Authorized source content.
- Commercially licensed assets.
- Required AI-content disclosures.
- Affiliate advertising disclosures.
- Platform API and publishing compliance.
- No unauthorized account automation.

## 16. Video Output Requirements

| Property              | Requirement                             |
| --------------------- | --------------------------------------- |
| Format                | MP4                                     |
| Default aspect ratio  | 9:16                                    |
| Additional ratios     | 16:9 and 1:1                            |
| Default resolution    | 1080 × 1920 for vertical videos         |
| Additional resolution | 720p and 4K where supported             |
| Duration              | 10, 15, 30, 60 seconds or custom        |
| Audio                 | Voiceover, music and effects            |
| Subtitles             | Embedded or separate SRT                |
| Preview               | Scene-level and full video              |
| Export                | Final video and reusable project assets |

## 17. UI/UX Requirements

The application should feel like a professional creator studio rather than a complicated administration dashboard.

Main navigation:

- Home.
- Discover.
- Clipping Studio.
- UGC Studio.
- AI Video Studio.
- Reference Studio.
- Editing Studio.
- Asset Library.
- Templates.
- Brand Workspaces.
- Publishing.
- Analytics.
- Earnings.
- Settings.

Use progressive disclosure, showing advanced controls only when required.

The existing design system should be reviewed before deciding whether a redesign is necessary.

## 18. Seven-Day Development Roadmap

### Day 1 — Foundation

- Audit existing implementation.
- Resolve critical security issues.
- Finalize UI and navigation.
- Verify existing subscriptions.
- Verify API permissions and access.
- Finalize database and API architecture.

### Day 2 — Discovery

- Campaign integrations.
- Trend discovery.
- Competitor research.
- GPT recommendations.
- Daily opportunity dashboard.

### Day 3 — Clipping

- Video discovery.
- Video ingestion.
- Transcript generation.
- Viral moment identification.
- Automated clipping.
- Captions and HD export.

### Day 4 — AI Video

- AI Video Studio.
- Reference analysis.
- Script generation.
- Storyboard generation.
- Google and Adobe generation workflows.
- Asset import.

### Day 5 — UGC and Editing

- UGC Studio.
- AI character and product workflows.
- Scene management.
- Basic timeline.
- Voiceover.
- Motion graphics.
- Video assembly.

### Day 6 — Social Media and Earnings

- Brand workspaces.
- Account connections.
- Publishing.
- Content calendar.
- Analytics.
- Affiliate management.
- Earnings and cost tracking.

### Day 7 — Integration and Testing

- End-to-end workflow testing.
- Security testing.
- Generation failure testing.
- Publishing verification.
- Performance improvements.
- Bug fixes.
- Deployment preparation.
- Documentation.

The seven-day target applies to a basic functional personal-use version. Advanced editing and fully automated generation may require additional development.

## 19. Acceptance Criteria

The initial release should demonstrate:

- A user can select a creation workspace.
- A user can discover or manually import a campaign.
- GPT can generate relevant recommendations.
- A user can create a clipping project.
- An authorized video can be converted into short clips.
- A user can create a UGC or AI video storyboard.
- Scene durations can be customized.
- Generated assets can be imported or retrieved through supported APIs.
- Voiceovers, captions and basic motion graphics can be added.
- A complete video can be previewed and exported.
- Projects remain separated by brand workspace.
- Publishing works for authorized accounts or provides manual export.
- Available analytics can be retrieved.
- Earnings and expenses can be recorded.
- Generation failures are handled without losing project data.
- Paid generation requires budget approval.
- Unauthorized users cannot access another user's projects.

## 20. Success Metrics

Track:

- Time required to create a video.
- Videos produced per day.
- Percentage of successful generation jobs.
- Percentage of automated workflow steps.
- Average generation cost per video.
- Content publishing success rate.
- Campaign submission approval rate.
- Content engagement and account growth.
- Confirmed monthly revenue.
- Net profit after expenses.

Establish numerical targets after testing the initial workflows.

## 21. Dependencies and Risks

- OpenAI API access and available credits require verification.
- Gemini and Adobe subscriptions may not include equivalent API access.
- Instagram trend discovery is restricted by platform permissions.
- Whop and Content Rewards data availability must be validated.
- Cuelinks approval is pending.
- AI-generated product and character consistency may vary.
- Local video processing depends on available hardware.
- Advanced timeline editing requires substantial development.
- Temporary provider media URLs require persistent storage.
- AI generation retries may increase expenses.
- Social publishing requires valid account permissions.

## 22. Development Rules

- Reuse existing working functionality.
- Do not introduce duplicate features.
- Do not display fake data as real.
- Prioritize free and existing tools.
- Do not purchase subscriptions without approval.
- Protect user data and credentials.
- Maintain clear technical documentation.
- Test each integration before marking it complete.
- Preserve manual alternatives when API automation is unavailable.
- Do not begin implementation until the existing codebase has been compared against this PRD.

## 23. Final Product Definition

Clipflow combines the capabilities of:

- AI research and content strategy.
- Automated clipping.
- AI video generation.
- AI UGC creation.
- Professional video editing.
- Motion graphics and audio production.
- Social media management.
- Campaign and affiliate discovery.
- Earnings and profitability tracking.

The ultimate goal is to build a centralized AI creator operating system that helps users discover opportunities, produce quality content, manage multiple accounts and generate measurable revenue.

This is our **final product scope**, including the latest decisions about GPT Pro, Gemini Pro and Adobe Pro.

I have kept HeyGen and Creatify removed, fal.ai and Klap as backup options, and ElevenLabs optional. All core creation modules remain in scope.

The next document should be the **Technical Architecture & Existing Project Gap Analysis**, where we compare this PRD against the current Clipflow codebase before implementing anything.