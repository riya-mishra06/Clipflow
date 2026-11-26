# **12 — Cost Management**

**Project:** Clipflow Creator Studio\
**Document:** `12_COST_MANAGEMENT.md`\
**Strategy:** Local-first, subscription-first and cost-controlled AI generation.\
**Primary currency:** INR\
**Initial objective:** Minimize additional expenses while building a functional content creation and earning platform.

## **1. Objective**

Design a centralized cost management system that allows Clipflow to generate, edit, publish and monetize content without unnecessary financial expenses.

The system must:

- Maximize existing subscriptions.
- Prioritize free and open-source tools.
- Minimize paid API usage.
- Estimate costs before generation.
- Prevent unexpected AI expenses.
- Track expenses by project and workspace.
- Track campaign and affiliate earnings.
- Calculate actual profitability.
- Identify cost-effective content creation workflows.
- Support future scaling based on revenue.

Clipflow should operate as a content creation business system, not simply an AI generation application.

## **2. Current available resources**

The following resources are already available or have previously been reported as available.

| Resource        | Availability                   | Purpose                                     |
| --------------- | ------------------------------ | ------------------------------------------- |
| ChatGPT Pro     | Existing subscription          | Research, reasoning, scripts and planning   |
| Gemini Pro      | Existing subscription          | Multimodal analysis and creative generation |
| Adobe Pro       | Existing subscription          | Professional editing and creative assets    |
| Claude          | Existing access                | Development and code review                 |
| Antigravity IDE | Existing access                | Application development                     |
| Google Flow     | Subject to account entitlement | AI video generation                         |
| HP laptop       | Existing hardware              | Local development and media processing      |
| MongoDB Atlas   | Existing setup                 | Application database                        |
| GitHub          | Existing access                | Source code management                      |
| MongoDB Compass | Existing setup                 | Database management                         |

### **Important distinction**

An existing ChatGPT, Gemini or Adobe subscription does not automatically provide unlimited API access.

Clipflow must distinguish between:

| Access type         | Meaning                                                 |
| ------------------- | ------------------------------------------------------- |
| Subscription access | Features available through the provider's application   |
| API access          | Programmatic integration, potentially billed separately |
| Free-tier access    | Limited usage under provider-specific conditions        |
| Local processing    | Processing performed using existing hardware            |
| Manual integration  | Generate externally and import into Clipflow            |

The initial architecture must maximize existing entitlements before introducing additional subscriptions.

## **3. Cost management principles**

| Principle                  | Requirement                                               |
| -------------------------- | --------------------------------------------------------- |
| Subscription-first         | Use existing subscriptions where practical                |
| Local-first                | Process media locally whenever feasible                   |
| Free-first                 | Prefer suitable open-source tools                         |
| API-on-demand              | Use paid APIs only when necessary                         |
| Approval-first             | Obtain approval before paid generation                    |
| Reuse-first                | Reuse existing assets and generated results               |
| Revenue-driven scaling     | Increase expenses based on measurable business value      |
| Transparent pricing        | Display estimated and actual expenses                     |
| No hidden spending         | Prevent automatic unauthorized charges                    |
| Quality-aware optimization | Reduce expenses without unnecessarily sacrificing quality |

## **4. Cost management architecture**

All paid generation requests must pass through the centralized Cost Management Service.

## **5. Complete tool and cost strategy**

### **5.1 Development and infrastructure**

| Tool              | Purpose                | Initial cost strategy      |
| ----------------- | ---------------------- | -------------------------- |
| Next.js           | Full-stack application | Free                       |
| React             | Frontend development   | Free                       |
| TypeScript        | Type safety            | Free                       |
| Tailwind CSS      | UI development         | Free                       |
| Node.js           | Backend and workers    | Free                       |
| MongoDB Atlas     | Database               | Free tier where sufficient |
| Mongoose          | Database integration   | Free                       |
| GitHub            | Version control        | Existing access            |
| Zod               | Validation             | Free                       |
| MongoDB Compass   | Database management    | Free                       |
| Local storage     | Media storage          | Existing hardware          |
| MongoDB job queue | Background processing  | Existing database          |

No additional infrastructure subscription is required initially, assuming existing hardware and free-tier limits are sufficient.

### **5.2 AI intelligence**

| Tool       | Purpose                                | Cost strategy                           |
| ---------- | -------------------------------------- | --------------------------------------- |
| ChatGPT    | Scripts, hooks, research and reasoning | Existing subscription, manual initially |
| OpenAI API | Automated AI intelligence              | Usage-based when enabled                |
| Gemini     | Reference and multimodal analysis      | Existing subscription                   |
| Gemini API | Automated analysis                     | Free tier or paid usage where available |
| Claude     | Development assistance                 | Existing access                         |

### **5.3 Image and video generation**

| Tool                    | Purpose                          | Priority | Cost strategy                        |
| ----------------------- | -------------------------------- | -------- | ------------------------------------ |
| Google Flow             | AI video generation              | Primary  | Existing entitlement where available |
| Veo                     | Text-to-video and image-to-video | Primary  | Subscription or authorized API       |
| Adobe Firefly           | Image and video generation       | Primary  | Existing credits where available     |
| Gemini image generation | Creative visual assets           | Primary  | Existing entitlement                 |
| fal.ai                  | Alternative generation models    | Backup   | Pay per use                          |
| Klap                    | Automated clipping               | Backup   | Paid if required                     |

HeyGen and Creatify are not included in the initial cost plan.

### **5.4 Video editing and media processing**

| Tool                | Purpose                                          | Additional software cost                   |
| ------------------- | ------------------------------------------------ | ------------------------------------------ |
| FFmpeg              | Cutting, cropping, encoding and audio processing | ₹0                                         |
| FFprobe             | Media inspection                                 | ₹0                                         |
| Local Whisper       | Transcription                                    | ₹0 API fees                                |
| Remotion            | Motion graphics and programmatic rendering       | ₹0 if eligible for applicable free license |
| Adobe Premiere Pro  | Advanced manual editing                          | Existing subscription, if included         |
| Adobe After Effects | Advanced motion graphics                         | Existing subscription, if included         |
| Adobe Audition      | Audio editing                                    | Existing subscription, if included         |
| Adobe Photoshop     | Image editing                                    | Existing subscription, if included         |
| Adobe Media Encoder | Video encoding                                   | Existing subscription, if included         |

Local processing still consumes electricity, hardware resources and processing time.

### **5.5 Voiceover and stock media**

| Tool                | Purpose                 | Cost strategy                           |
| ------------------- | ----------------------- | --------------------------------------- |
| User-recorded voice | Original narration      | No additional API expense               |
| Local TTS           | Basic narration         | Free where suitable and licensed        |
| ElevenLabs          | Premium AI narration    | Optional paid usage                     |
| Pexels              | Stock images and videos | Supported free access                   |
| Pixabay             | Stock media and audio   | Free licensed assets where applicable   |
| Adobe Stock         | Premium assets          | Only if included or separately approved |

### **5.6 Discovery and publishing integrations**

| Integration           | Purpose                  | Cost strategy               |
| --------------------- | ------------------------ | --------------------------- |
| YouTube Data API      | Discovery and publishing | Quota-controlled            |
| YouTube Analytics API | Performance analytics    | Authorized access           |
| Meta Graph API        | Instagram management     | Authorized access           |
| Google Trends         | Trend research           | Manual initially            |
| Whop                  | Campaign discovery       | Subject to approved access  |
| Cuelinks              | Affiliate opportunities  | Subject to account approval |

API access, quotas, commercial usage rights and current pricing must be verified before enabling each integration.

## **6. Three-level generation strategy**

Clipflow will support three cost levels.

| Level   | Strategy              | Example                                            |
| ------- | --------------------- | -------------------------------------------------- |
| Level 1 | Local processing      | FFmpeg clipping and Whisper subtitles              |
| Level 2 | Existing subscription | Generate scenes in Google Flow and import them     |
| Level 3 | Paid automation       | Generate scenes directly through an authorized API |

### **Level 1 — Local processing**

Suitable for transcription, clipping, video resizing, subtitle generation, audio mixing, motion graphics and rendering.

Additional API expense can be ₹0.

### **Level 2 — Subscription-assisted processing**

Suitable for AI-generated images, videos, scripts, product advertisements and advanced Adobe editing.

Clipflow prepares the prompts, storyboard and scene requirements. The user generates the content externally and imports the results.

### **Level 3 — Paid automated processing**

Suitable when manual generation becomes inefficient or existing tools cannot meet the required quality or volume.

Paid automation must remain disabled until the user configures a budget and approves the expense.

## **7. Provider selection engine**

The provider selection engine should recommend tools based on more than price.

| Selection factor         | Description                                  |
| ------------------------ | -------------------------------------------- |
| Capability               | Can the provider perform the requested task? |
| Availability             | Is the provider currently accessible?        |
| Subscription entitlement | Is the feature already included?             |
| API access               | Can Clipflow automate the operation?         |
| Estimated cost           | Expected additional expense                  |
| Remaining credits        | Available generation allowance               |
| Output quality           | Expected suitability for the project         |
| Processing time          | Estimated generation duration                |
| Commercial rights        | Whether output can be used commercially      |
| Reliability              | Previous generation success rate             |
| User preference          | Preferred provider or workflow               |

The cheapest provider is not always the most cost-effective if it produces unusable results.

## **8. Task-wise cost optimization**

| Task                     | Preferred method                     | Alternative               |
| ------------------------ | ------------------------------------ | ------------------------- |
| Campaign research        | Supported APIs and manual research   | Paid research API         |
| Script generation        | Existing ChatGPT access              | OpenAI API                |
| Viral moment analysis    | Whisper transcript + AI analysis     | Klap                      |
| Video transcription      | Local Whisper                        | Paid transcription API    |
| Video clipping           | FFmpeg                               | External clipping service |
| Subtitle generation      | Whisper + FFmpeg/Remotion            | Paid captioning service   |
| Product image generation | Existing Gemini or Firefly access    | fal.ai                    |
| AI video generation      | Google Flow or Firefly               | Authorized paid video API |
| Voiceover                | Recorded voice or suitable local TTS | ElevenLabs                |
| Motion graphics          | Remotion                             | Adobe After Effects       |
| Video editing            | Native editor + FFmpeg               | Adobe Premiere Pro        |
| Final rendering          | Local worker                         | Cloud rendering           |
| Media storage            | Local storage                        | Cloudflare R2             |
| Publishing               | Supported official APIs              | Manual publishing         |

## **9. Cost categories**

Clipflow must track different types of expenses independently.

| Category           | Examples                                  |
| ------------------ | ----------------------------------------- |
| AI text generation | OpenAI and Gemini API usage               |
| Image generation   | AI product images and characters          |
| Video generation   | AI-generated scenes                       |
| Voice generation   | Premium AI narration                      |
| Transcription      | External speech-to-text APIs              |
| Media processing   | Local electricity or cloud processing     |
| Storage            | Cloud storage and backup hardware         |
| Subscriptions      | ChatGPT, Gemini and Adobe                 |
| Stock assets       | Licensed images, music and video          |
| Infrastructure     | Hosting and worker servers                |
| Marketing          | Paid promotion                            |
| Miscellaneous      | Other manually recorded business expenses |

Existing subscription expenses should be tracked separately from new Clipflow-specific expenses.

## **10. Cost measurement units**

Different providers charge according to different usage units.

| Service               | Common billing unit                   |
| --------------------- | ------------------------------------- |
| Text generation       | Input and output tokens               |
| Image generation      | Images or generation credits          |
| Video generation      | Generated seconds or credits          |
| Voice generation      | Characters, audio duration or credits |
| Transcription         | Audio minutes                         |
| Storage               | GB-month                              |
| Cloud processing      | CPU/GPU processing time               |
| Stock media           | Asset or subscription                 |
| Software subscription | Monthly or annual fee                 |

The cost engine must support multiple billing models rather than assuming every provider charges per request.

## **11. Provider pricing registry**

Clipflow should maintain a centralized pricing configuration.

Example:

```
{
  "provider": "VIDEO_PROVIDER",
  "model": "example-video-model",
  "serviceType": "VIDEO_GENERATION",
  "billingUnit": "SECOND",
  "currency": "USD",
  "unitPrice": "0.10",
  "pricingSource": "Official provider pricing",
  "verifiedAt": null,
  "isIllustrative": true,
  "isActive": false
}
```

The price above is illustrative and does not represent an actual provider quotation.

### **Pricing registry requirements**

- Provider name.
- Model name.
- Billing unit.
- Unit price.
- Currency.
- Resolution-dependent pricing.
- Free allowance.
- Credit conversion where applicable.
- Pricing source.
- Last verification date.
- Pricing version.
- Availability status.

Pricing must be configurable without requiring application code changes.

## **12. Cost estimation engine**

Before executing a paid operation, Clipflow should calculate its estimated cost.

### **Text generation formula**

\\[ C=\frac{T_iP_i+T_oP_o}{1,000,000} \\]

Where:

- \\(T_i\\): Estimated input tokens.
- \\(T_o\\): Estimated output tokens.
- \\(P_i\\): Input price per million tokens.
- \\(P_o\\): Output price per million tokens.

### **Video generation formula**

\\[ C=S\times P\times N \\]

Where:

- \\(S\\): Generated duration in seconds.
- \\(P\\): Price per generated second.
- \\(N\\): Number of generation attempts.

### **Image generation formula**

\\[ C=I\times P \\]

Where \\(I\\) is the number of images and \\(P\\) is the price per image.

### **Total project cost**

\\[ C\_{\text{project}}=C\_{\text{AI}}+C\_{\text{media}}+C\_{\text{assets}}+C\_{\text{storage}}+C\_{\text{other}} \\]

The system should separately calculate incremental cash expenses and allocated existing subscription expenses.

## **13. Example: 30-second AI UGC video**

Consider a fashion advertisement containing five scenes.

| Scene     | Duration       | Purpose                |
| --------- | -------------- | ---------------------- |
| Scene 1   | 3 seconds      | Hook                   |
| Scene 2   | 5 seconds      | Product introduction   |
| Scene 3   | 10 seconds     | Product demonstration  |
| Scene 4   | 8 seconds      | Lifestyle presentation |
| Scene 5   | 4 seconds      | CTA                    |
| **Total** | **30 seconds** | Final advertisement    |

### **Workflow A — Existing subscriptions**

| Operation        | Tool                        | Additional estimated expense |
| ---------------- | --------------------------- | ---------------------------- |
| Product analysis | Gemini                      | ₹0\*                         |
| Script           | ChatGPT                     | ₹0\*                         |
| Storyboard       | ChatGPT                     | ₹0\*                         |
| Product images   | Firefly or Gemini           | ₹0\*                         |
| Video scenes     | Google Flow                 | ₹0\*                         |
| Voiceover        | Recorded voice or local TTS | ₹0                           |
| Subtitles        | Whisper                     | ₹0                           |
| Editing          | FFmpeg and Adobe            | ₹0\*                         |
| Motion graphics  | Remotion                    | ₹0\*                         |
| Final rendering  | Local laptop                | ₹0 API expense               |

\*Assuming the required features and generation credits are included in existing entitlements and applicable licenses.

**Potential additional API expense: ₹0.**

Existing subscriptions, electricity and production time are not included in this figure.

### **Workflow B — Paid automated generation**

Illustrative example only:

| Operation                    | Assumed expense |
| ---------------------------- | --------------- |
| AI script and storyboard     | ₹5              |
| Product image generation     | ₹20             |
| Video scene generation       | ₹240            |
| Voiceover generation         | ₹15             |
| Local editing and rendering  | ₹0 API expense  |
| **Total additional expense** | **₹280**        |

If video generation requires another complete attempt costing ₹240, the total increases to ₹520.

This demonstrates why scene-level regeneration is important.

## **14. Example: Bulk clipping workflow**

Consider one 60-minute source video used to create 20 short clips.

| Operation                   | Tool                    | Additional API expense |
| --------------------------- | ----------------------- | ---------------------- |
| Import authorized source    | Local import            | ₹0                     |
| Audio extraction            | FFmpeg                  | ₹0                     |
| Transcription               | Local Whisper           | ₹0                     |
| Viral moment identification | Existing ChatGPT access | ₹0\*                   |
| Clip extraction             | FFmpeg                  | ₹0                     |
| Vertical cropping           | FFmpeg                  | ₹0                     |
| Subtitle generation         | Whisper                 | ₹0                     |
| Animated captions           | Remotion                | ₹0\*                   |
| Cover creation              | Existing Adobe tools    | ₹0\*                   |
| Export                      | FFmpeg                  | ₹0                     |

Potentially, the entire clipping workflow can operate without additional paid API usage.

However, local processing time, laptop performance, content rights and available subscription features determine practical feasibility.

## **15. Monthly cost scenarios**

The following scenarios are proposed planning budgets, not confirmed provider prices.

| Expense category              | Lean   | Controlled | Growth     |
| ----------------------------- | ------ | ---------- | ---------- |
| AI text APIs                  | ₹0     | ₹200       | ₹500       |
| Image generation              | ₹0     | ₹200       | ₹500       |
| Video generation              | ₹0     | ₹500       | ₹2,500     |
| Premium voiceover             | ₹0     | ₹0         | ₹500       |
| Storage                       | ₹0     | ₹0         | ₹300       |
| Hosting                       | ₹0     | ₹0         | ₹500       |
| Other expenses                | ₹0     | ₹100       | ₹200       |
| **Additional monthly budget** | **₹0** | **₹1,000** | **₹5,000** |

Existing subscription fees, electricity, internet and hardware expenses are excluded.

### **Recommended starting strategy**

Start with the Lean scenario.

Move to the Controlled scenario only when a specific paid feature provides measurable benefits.

Move to the Growth scenario only when Clipflow has sufficient revenue or a validated business opportunity.

## **16. Budget management architecture**

Clipflow should support budgets at multiple levels.

| Budget type       | Purpose                                   |
| ----------------- | ----------------------------------------- |
| Global budget     | Total application spending                |
| Monthly budget    | Maximum monthly expense                   |
| Daily budget      | Prevent sudden excessive spending         |
| Workspace budget  | Control spending by brand                 |
| Project budget    | Control individual video production costs |
| Provider budget   | Limit spending with a specific provider   |
| Generation budget | Maximum cost of one generation            |
| Retry budget      | Limit additional regeneration expenses    |

### **Proposed initial budget configuration**

| Configuration                 | Starting value                   |
| ----------------------------- | -------------------------------- |
| Additional monthly API budget | ₹0                               |
| Automatic paid generation     | Disabled                         |
| Automatic paid fallback       | Disabled                         |
| Paid retry                    | Requires approval                |
| Paid cloud storage            | Disabled                         |
| Paid cloud rendering          | Disabled                         |
| Budget warning                | 70%                              |
| Critical budget warning       | 90%                              |
| Budget exhaustion             | 100% — block new paid operations |

The user can explicitly increase these limits when required.

## **17. Budget reservation system**

Multiple background jobs may attempt to use the same budget simultaneously.

Without budget reservation, the application could accidentally overspend.

Example:

- Monthly budget: ₹1,000.
- Already spent: ₹700.
- Job A requests: ₹200.
- Job B requests: ₹200.

If both jobs execute without coordination, total spending may reach ₹1,100.

The system must reserve funds atomically before executing paid jobs.

### **Budget calculation**

\\[ \text{Available Budget} = \text{Budget Limit} - \text{Actual Spending} - \text{Active Reservations} \\]

### **Reservation workflow**

A failed job must not automatically release its entire reservation if the provider may already have charged for generation.

## **18. Paid generation approval system**

Before executing a paid operation, Clipflow should display:

| Information              | Example                                       |
| ------------------------ | --------------------------------------------- |
| Operation                | Generate AI video scene                       |
| Provider                 | Selected video provider                       |
| Duration                 | 5 seconds                                     |
| Estimated cost           | ₹40                                           |
| Maximum approved cost    | ₹50                                           |
| Remaining monthly budget | ₹600                                          |
| Available alternatives   | Manual generation using existing subscription |
| Retry policy             | No additional paid retry without approval     |

The values above are illustrative.

Approval must be associated with the exact generation configuration.

If the model, duration, resolution, number of outputs or maximum cost changes materially, new approval must be obtained.

## **19. AI credit management**

Some providers use credits instead of direct monetary billing.

Clipflow should track credits separately from actual cash expenses.

| Field                | Purpose                                  |
| -------------------- | ---------------------------------------- |
| Provider             | Credit source                            |
| Total allowance      | Available subscription credits           |
| Used credits         | Credits already consumed                 |
| Remaining credits    | Estimated or verified balance            |
| Reserved credits     | Credits reserved for pending jobs        |
| Renewal date         | Credit refresh date                      |
| Expiration date      | Credit expiration where applicable       |
| Last synchronization | Balance verification date                |
| Verification status  | Verified, estimated or manually recorded |

If a provider does not expose credit balances through an authorized API, Clipflow should support manual balance entry.

It must not display fabricated real-time credit balances.

## **20. Cost optimization techniques**

### **20.1 Scene-level regeneration**

Instead of regenerating an entire 30-second video because one scene is incorrect, regenerate only the affected scene.

Example using an illustrative ₹8 per generated second:

| Regeneration method   | Generated duration | Expense  |
| --------------------- | ------------------ | -------- |
| Full video            | 30 seconds         | ₹240     |
| Individual scene      | 5 seconds          | ₹40      |
| **Potential savings** | **25 seconds**     | **₹200** |

### **20.2 Asset reuse**

Reusable assets should include brand logos, AI character references, product images, background music, sound effects, caption styles, motion templates and approved video scenes.

### **20.3 Preview-first generation**

Generate low-cost previews or storyboards before requesting expensive high-quality video generation.

Only approved concepts should proceed to final production.

### **20.4 Transcript reuse**

Transcribe each source video once and reuse the transcript for:

- Viral moment identification.
- Subtitle generation.
- Content summaries.
- Caption generation.
- SEO keywords.
- Multiple short clips.

### **20.5 Prompt optimization**

Avoid sending unnecessarily large conversation histories, duplicate instructions or unrelated project information to AI providers.

Use only the context required for the current task.

### **20.6 Duplicate generation prevention**

Identical generation requests should reuse an eligible previous result when appropriate.

Paid operations must support idempotency keys to prevent accidental duplicate charges.

### **20.7 Local rendering**

Use FFmpeg and Remotion locally rather than purchasing cloud rendering capacity before it is necessary.

### **20.8 Intelligent model selection**

Use suitable lower-cost models for straightforward tasks such as hashtag generation and formatting.

Reserve more capable models for complex research, creative planning and multimodal analysis.

## **21. Cost-aware retry and fallback strategy**

| Failure condition                | Required behavior                       |
| -------------------------------- | --------------------------------------- |
| Local processing failure         | Retry within configured resource limits |
| Invalid API credentials          | Stop and notify user                    |
| Free quota exhausted             | Recommend manual or local alternative   |
| Provider temporarily unavailable | Retry only when safe                    |
| Paid generation rejected         | Review provider billing outcome         |
| Paid generation timeout          | Reconcile existing request before retry |
| Output quality insufficient      | Regenerate affected component           |
| Budget exceeded                  | Block generation                        |
| Paid fallback required           | Request explicit approval               |

A provider failure must never automatically trigger a more expensive paid provider.

## **22. Financial database architecture**

The cost management system should maintain the following logical entities.

| Entity               | Responsibility                       |
| -------------------- | ------------------------------------ |
| ProviderPricing      | Provider and model pricing           |
| Budget               | Spending limits                      |
| BudgetReservation    | Reserved funds                       |
| AIUsage              | Actual AI consumption                |
| CreditBalance        | Provider credit tracking             |
| Expense              | Recorded expenses                    |
| Earnings             | Campaign and affiliate income        |
| Subscription         | Existing recurring software expenses |
| ExchangeRate         | Currency conversion references       |
| FinancialTransaction | Auditable financial events           |

These are logical entities. During implementation, overlapping collections from `08_DATABASE_DESIGN.md` should be reused rather than duplicated.

### **Example AI usage record**

```
{
  "id": "usage_001",
  "userId": "user_001",
  "workspaceId": "workspace_001",
  "projectId": "project_001",
  "jobId": "job_001",
  "provider": "VIDEO_PROVIDER",
  "model": "example-model",
  "operation": "VIDEO_GENERATION",
  "billingUnit": "SECOND",
  "quantity": 5,
  "estimatedCost": "45.00",
  "actualCost": "40.00",
  "currency": "INR",
  "billingStatus": "CONFIRMED",
  "providerRequestId": "provider_request_001"
}
```

All values are illustrative.

Financial values should use integer minor currency units or appropriate decimal representations rather than imprecise floating-point arithmetic.

## **23. Expense tracking**

Every paid operation should produce an expense record.

### **Expense fields**

| Field                 | Purpose                         |
| --------------------- | ------------------------------- |
| User ID               | Expense ownership               |
| Workspace ID          | Brand allocation                |
| Project ID            | Project allocation              |
| Job ID                | Related generation operation    |
| Category              | Expense classification          |
| Provider              | External service                |
| Amount                | Actual expense                  |
| Currency              | Original billing currency       |
| INR equivalent        | Converted reporting amount      |
| Exchange rate         | Conversion reference            |
| Payment status        | Estimated, pending or confirmed |
| Source                | API, invoice or manual          |
| Transaction reference | Duplicate prevention            |
| Created date          | Financial reporting             |

Manual expenses must be distinguishable from provider-confirmed expenses.

## **24. Subscription management**

Clipflow should track existing subscriptions without incorrectly treating them as free resources.

| Subscription       | Billing cycle           | Allocation strategy             |
| ------------------ | ----------------------- | ------------------------------- |
| ChatGPT            | Actual configured cycle | Shared across work and Clipflow |
| Gemini             | Actual configured cycle | Shared usage                    |
| Adobe              | Actual configured cycle | Creative production             |
| Claude             | Actual configured cycle | Development                     |
| Optional providers | Actual configured cycle | Clipflow-specific usage         |

The actual subscription amounts will be entered manually.

### **Subscription allocation example**

If a subscription costs ₹2,000 per month and approximately 25% of its usage relates to Clipflow:

\\[ ₹2,000\times25\\%=₹500 \\]

The allocated Clipflow subscription expense would be ₹500.

This allocation is an accounting estimate, not an additional payment.

## **25. Earnings management**

Clipflow will track income from multiple monetization sources.

| Revenue source         | Description                            |
| ---------------------- | -------------------------------------- |
| Whop campaigns         | Content rewards and clipping campaigns |
| Affiliate marketing    | Product promotion commissions          |
| UGC services           | Product advertisement creation         |
| Video editing          | Client editing services                |
| YouTube monetization   | Eligible platform revenue              |
| Brand sponsorships     | Paid promotional content               |
| Direct client projects | Custom content production              |
| Other earnings         | Manually recorded business income      |

Income must not be considered received until confirmed through a reliable source or manually recorded as received.

## **26. Earnings lifecycle**

### **Earnings statuses**

| Status    | Meaning                                           |
| --------- | ------------------------------------------------- |
| ESTIMATED | Potential earnings based on available information |
| PENDING   | Awaiting verification                             |
| APPROVED  | Provider or client has approved payment           |
| RECEIVED  | Payment actually received                         |
| REJECTED  | Submission or commission rejected                 |
| REVERSED  | Previously recorded earnings reversed             |

Estimated views-based earnings must account for campaign caps, eligibility requirements, deadlines and approval rules.

## **27. Campaign earnings calculation**

For a campaign that pays according to eligible views:

\\[ \text{Estimated Earnings} = \frac{\text{Eligible Views}}{1,000} \times \text{Payout Rate} \\]

Example assumptions:

| Metric                 | Value   |
| ---------------------- | ------- |
| Eligible views         | 100,000 |
| Payout per 1,000 views | ₹80     |
| Estimated earnings     | ₹8,000  |
| Production expense     | ₹500    |
| Estimated contribution | ₹7,500  |

These are hypothetical values, not a verified campaign payout.

Actual earnings depend on campaign-specific rules and approval.

## **28. Affiliate earnings calculation**

\\[ \text{Estimated Commission} = \text{Eligible Order Value} \times \text{Commission Rate} \\]

Example:

| Metric                     | Value  |
| -------------------------- | ------ |
| Product order value        | ₹2,000 |
| Commission rate            | 5%     |
| Estimated commission       | ₹100   |
| Eligible confirmed orders  | 10     |
| Estimated total commission | ₹1,000 |

Cancelled orders, returns, tracking failures and provider-specific conditions may reduce the final commission.

## **29. Profitability calculation**

### **Incremental project profit**

\\[ \text{Project Profit} = \text{Received Revenue} - \text{Direct Project Expenses} \\]

### **Fully allocated operating profit**

\\[ \text{Operating Profit} = \text{Received Revenue} - \text{Direct Expenses} - \text{Allocated Overheads} \\]

### **Return on investment**

\\[ ROI= \frac{\text{Revenue}-\text{Cost}}{\text{Cost}} \times100 \\]

ROI should only be calculated when cost is greater than zero.

### **Example monthly financial report**

| Category                        | Illustrative amount |
| ------------------------------- | ------------------- |
| Clipping revenue                | ₹5,000              |
| Affiliate revenue               | ₹3,000              |
| UGC client revenue              | ₹4,000              |
| **Total received revenue**      | **₹12,000**         |
| AI API expenses                 | ₹700                |
| Storage and infrastructure      | ₹300                |
| Allocated subscriptions         | ₹1,500              |
| Other expenses                  | ₹500                |
| **Total expenses**              | **₹3,000**          |
| **Operating profit before tax** | **₹9,000**          |
| **ROI**                         | **300%**            |

These figures demonstrate the reporting logic. They are not income forecasts.

## **30. Workspace-wise profitability**

Each brand workspace should have independent financial reporting.

| Workspace         | Example revenue | Example expenses | Example profit |
| ----------------- | --------------- | ---------------- | -------------- |
| Vice City Witness | ₹5,000          | ₹300             | ₹4,700         |
| Fashion Studio    | ₹4,000          | ₹800             | ₹3,200         |
| Beauty Studio     | ₹2,000          | ₹400             | ₹1,600         |
| AI Viral Studio   | ₹0              | ₹200             | -₹200          |
| Affiliate Studio  | ₹1,000          | ₹300             | ₹700           |
| **Total**         | **₹12,000**     | **₹2,000**       | **₹10,000**    |

The table contains hypothetical direct revenue and expense figures before shared overhead allocation.

This allows the user to identify which content niches are profitable and which consume resources without producing revenue.

## **31. Cost and earnings dashboard**

The financial dashboard should display:

## **Clipflow Finance Overview**

Illustrative data

Received revenue

# **₹12,000**

Total expenses

# **₹3,000**

Operating profit

# **₹9,000**

ROI

# **300%**

**Monthly API budget**

₹700 spent

₹1,000 limit

₹300 remaining, assuming no active reservations

**Expense breakdown**

Subscriptions

₹1,500

AI APIs

₹700

Infrastructure

₹300

Other

₹500

Proposed dashboard design. All amounts are demonstration values.

### **Dashboard requirements**

- Daily and monthly spending.
- Available budget.
- Reserved budget.
- Provider-wise expenses.
- Workspace-wise expenses.
- Project production cost.
- Subscription expenses.
- Available AI credits.
- Estimated earnings.
- Approved earnings.
- Received earnings.
- Net operating profit.
- ROI.
- Cost per completed video.
- Cost per usable generated scene.
- Most profitable workspace.

## **32. Cost performance indicators**

| KPI                       | Purpose                                 |
| ------------------------- | --------------------------------------- |
| Cost per video            | Average production expense              |
| Cost per approved scene   | Measure generation efficiency           |
| Cost per 1,000 views      | Compare content distribution efficiency |
| Revenue per video         | Measure monetization performance        |
| Profit per video          | Identify profitable content             |
| Generation rejection rate | Identify wasted AI generation           |
| Regeneration expense      | Measure quality-related spending        |
| Asset reuse rate          | Measure reusable content efficiency     |
| Subscription utilization  | Evaluate existing subscriptions         |
| Provider failure cost     | Identify unreliable providers           |
| Budget utilization        | Track spending discipline               |
| Production time           | Measure manual and automated efficiency |

These metrics should be calculated from actual usage and financial records.

## **33. Manual versus automated workflow economics**

Automation is valuable only when it saves sufficient time, improves quality or increases revenue.

Illustrative comparison:

| Factor                 | Manual-assisted | Paid automated |
| ---------------------- | --------------- | -------------- |
| Videos per month       | 30              | 30             |
| Time per video         | 40 minutes      | 10 minutes     |
| Additional API expense | ₹0              | ₹50 per video  |
| Total production time  | 20 hours        | 5 hours        |
| Monthly API expense    | ₹0              | ₹1,500         |
| Time saved             | —               | 15 hours       |

In this example, automation costs ₹100 per hour saved.

The decision should consider whether the saved time can generate greater value than the additional expense.

## **34. Cost alerts and notifications**

| Condition                           | System behavior                    |
| ----------------------------------- | ---------------------------------- |
| 70% budget consumed                 | Informational notification         |
| 90% budget consumed                 | Critical warning                   |
| 100% budget consumed                | Block new paid operations          |
| Insufficient provider credits       | Recommend alternative              |
| Unexpected generation expense       | Pause affected operation           |
| Provider pricing changed            | Refresh estimate and approval      |
| Repeated paid failures              | Disable automatic retries          |
| Subscription renewal approaching    | Notify user                        |
| Unverified provider charge          | Request reconciliation             |
| Workspace consistently unprofitable | Provide cost review recommendation |

Cost notifications must be based on actual or explicitly labeled estimated financial data.

## **35. Currency management**

Clipflow will use INR as its primary reporting currency while preserving original billing currencies.

### **Currency conversion**

\\[ \text{INR Amount} = \text{Original Amount} \times \text{Exchange Rate} \\]

The application should record:

- Original currency.
- Original amount.
- Exchange rate.
- Exchange rate date.
- Converted amount.
- Applicable taxes.
- Payment processing charges.
- Final billed amount where available.

Historical transactions should preserve their recorded exchange rates instead of recalculating past expenses using current rates.

## **36. Infrastructure cost management**

### **Initial infrastructure**

| Component          | Selected approach                        | Additional subscription expense |
| ------------------ | ---------------------------------------- | ------------------------------- |
| Frontend           | Local Next.js application                | ₹0                              |
| Backend            | Next.js Route Handlers                   | ₹0                              |
| Database           | MongoDB Atlas free tier where sufficient | ₹0                              |
| Background workers | Local Node.js process                    | ₹0                              |
| Media processing   | Local FFmpeg                             | ₹0                              |
| Transcription      | Local Whisper                            | ₹0                              |
| Storage            | Existing laptop storage                  | ₹0                              |
| Source code        | GitHub existing access                   | ₹0                              |

### **Future infrastructure**

| Component          | Upgrade condition                                     |
| ------------------ | ----------------------------------------------------- |
| Paid MongoDB tier  | Database capacity or performance becomes insufficient |
| Cloudflare R2      | Remote media access or storage capacity is required   |
| Cloud hosting      | Application needs continuous availability             |
| Cloud workers      | Local processing becomes insufficient                 |
| Redis/BullMQ       | MongoDB queue no longer meets workload requirements   |
| GPU processing     | Local generation or rendering becomes impractical     |
| Monitoring service | Operational complexity requires additional monitoring |

Infrastructure upgrades should be driven by actual usage rather than anticipated scale.

## **37. Local hardware operating expenses**

Local processing is not completely free.

Potential operating expenses include:

- Electricity consumption.
- Laptop battery and hardware maintenance.
- Internet usage.
- Additional SSD or external hard drive.
- Backup storage.
- Processing time.

### **Electricity estimation**

\\[ \text{Electricity Cost} = \frac{\text{Power in Watts}}{1000} \times \text{Processing Hours} \times \text{Electricity Rate} \\]

Example assumptions:

| Metric                    | Value     |
| ------------------------- | --------- |
| Average laptop power      | 65 W      |
| Daily processing          | 4 hours   |
| Monthly processing        | 120 hours |
| Electricity consumption   | 7.8 kWh   |
| Assumed electricity rate  | ₹8/kWh    |
| Estimated monthly expense | ₹62.40    |

Actual laptop power consumption and electricity tariffs must be measured or verified.

## **38. Cost management API endpoints**

| Method | Endpoint                          | Purpose                        |
| ------ | --------------------------------- | ------------------------------ |
| POST   | `/api/ai/estimate-cost`           | Estimate generation expense    |
| GET    | `/api/costs/usage`                | Retrieve AI usage              |
| GET    | `/api/costs/providers`            | Retrieve provider expenses     |
| GET    | `/api/costs/budgets`              | Retrieve budgets               |
| POST   | `/api/costs/budgets`              | Create budget                  |
| PATCH  | `/api/costs/budgets/[id]`         | Update budget                  |
| GET    | `/api/costs/credits`              | Retrieve credit balances       |
| GET    | `/api/costs/pricing`              | Retrieve pricing configuration |
| GET    | `/api/finance/overview`           | Retrieve financial overview    |
| GET    | `/api/finance/transactions`       | Retrieve transaction history   |
| POST   | `/api/finance/transactions`       | Record manual transaction      |
| GET    | `/api/finance/earnings`           | Retrieve earnings              |
| GET    | `/api/finance/expenses`           | Retrieve expenses              |
| GET    | `/api/finance/profit`             | Retrieve profitability         |
| GET    | `/api/finance/subscriptions`      | Retrieve subscription records  |
| POST   | `/api/finance/subscriptions`      | Record subscription            |
| PATCH  | `/api/finance/subscriptions/[id]` | Update subscription record     |

These endpoints extend the API design defined in `09_API_DESIGN.md`.

Budget reservation and reconciliation should primarily operate as internal service operations rather than unrestricted public endpoints.

## **39. Proposed source code structure**

```
src/
├── modules/
│   ├── costs/
│   │   ├── cost.service.ts
│   │   ├── cost-estimator.ts
│   │   ├── pricing.service.ts
│   │   ├── budget.service.ts
│   │   ├── reservation.service.ts
│   │   ├── credit.service.ts
│   │   ├── usage.service.ts
│   │   └── cost.validation.ts
│   │
│   └── finance/
│       ├── finance.service.ts
│       ├── expense.service.ts
│       ├── earnings.service.ts
│       ├── subscription.service.ts
│       ├── profitability.service.ts
│       └── finance.validation.ts
│
├── models/
│   ├── ProviderPricing.ts
│   ├── Budget.ts
│   ├── BudgetReservation.ts
│   ├── AIUsage.ts
│   ├── Expense.ts
│   ├── Earnings.ts
│   └── Subscription.ts
│
├── workers/
│   └── processors/
│       ├── usage-sync.processor.ts
│       └── cost-reconciliation.processor.ts
│
└── app/
    └── api/
        ├── costs/
        └── finance/
```

The final structure must reuse existing finance and earnings models wherever appropriate.

## **40. Financial security requirements**

| Risk                              | Protection                                 |
| --------------------------------- | ------------------------------------------ |
| Unauthorized spending             | Authentication and approval                |
| Concurrent overspending           | Atomic budget reservation                  |
| Duplicate AI charges              | Idempotency and reconciliation             |
| Fabricated earnings               | Verification status                        |
| Duplicate commissions             | Unique provider transaction references     |
| Unauthorized financial access     | Ownership validation                       |
| Incorrect currency conversion     | Recorded exchange rate                     |
| Unexpected provider price changes | Versioned pricing and renewed approval     |
| Financial record manipulation     | Auditable corrections                      |
| Unauthorized paid fallback        | Explicit approval                          |
| Incorrect cost estimates          | Maximum approved amount and reconciliation |

Financial protection must be enforced by backend services, not only by dashboard warnings.

## **41. Cost management testing requirements**

| Test                             | Expected result                           |
| -------------------------------- | ----------------------------------------- |
| Local processing request         | No external API charge recorded           |
| Paid generation without approval | Request blocked                           |
| Budget exceeded                  | Request blocked                           |
| Concurrent budget requests       | Overspending prevented                    |
| Duplicate generation request     | Duplicate charge prevented                |
| Successful generation            | Actual usage recorded                     |
| Failed paid generation           | Billing outcome reconciled                |
| Uncertain provider response      | Reservation retained until reconciliation |
| Changed generation configuration | New approval required                     |
| Free credits exhausted           | Alternative recommended                   |
| Subscription expense allocation  | Correct amount calculated                 |
| Currency conversion              | Correct recorded exchange rate used       |
| Duplicate affiliate commission   | Duplicate prevented                       |
| Estimated earnings               | Not counted as received revenue           |
| Reversed commission              | Financial adjustment recorded             |
| Cross-workspace finance access   | Access denied                             |
| Profit calculation               | Correct expenses deducted                 |
| Zero-cost ROI calculation        | No division-by-zero error                 |

## **42. Revenue-driven scaling strategy**

Clipflow should increase spending gradually based on verified business performance.

| Stage                         | Received monthly revenue | Proposed spending approach                           |
| ----------------------------- | ------------------------ | ---------------------------------------------------- |
| Stage 1 — Validation          | ₹0–₹5,000                | Existing subscriptions and local tools               |
| Stage 2 — Early monetization  | ₹5,000–₹15,000           | Consider limited API automation                      |
| Stage 3 — Consistent earnings | ₹15,000–₹30,000          | Automate proven workflows                            |
| Stage 4 — Growth              | ₹30,000–₹50,000          | Consider cloud infrastructure                        |
| Stage 5 — Scaling             | ₹50,000+                 | Evaluate higher-volume production and team workflows |

These thresholds are proposed business milestones, not guaranteed earnings or automatic spending authorizations.

Profitability, available cash and other business obligations must also be considered before reinvesting revenue.

## **43. Initial purchasing decisions**

| Resource                        | Purchase now?    | Reason                                   |
| ------------------------------- | ---------------- | ---------------------------------------- |
| Additional ChatGPT subscription | No               | Existing access                          |
| Additional Gemini subscription  | No               | Existing access                          |
| Additional Adobe subscription   | No               | Existing access                          |
| OpenAI API credits              | Not yet          | Verify automation requirements           |
| Paid Gemini API                 | Not yet          | Verify available quota and access        |
| ElevenLabs subscription         | Not yet          | Optional premium voice requirement       |
| fal.ai credits                  | Not yet          | Backup generation only                   |
| Klap subscription               | Not yet          | Build and benchmark local clipping first |
| HeyGen                          | No               | Excluded from initial architecture       |
| Creatify                        | No               | Excluded from initial architecture       |
| Paid MongoDB                    | No               | Use available free tier first            |
| Cloudflare R2                   | Not yet          | Local storage first                      |
| Cloud rendering                 | No               | Benchmark local rendering first          |
| Redis hosting                   | No               | MongoDB queue initially                  |
| External SSD                    | Only if required | Depends on actual available storage      |

No additional subscription should be purchased simply to complete the documentation or start basic development.

## **44. Cost management implementation phases**

| Phase   | Features                                                         |
| ------- | ---------------------------------------------------------------- |
| Phase 1 | Manual expense tracking, provider registry and global budget     |
| Phase 2 | Cost estimation, paid generation approval and budget reservation |
| Phase 3 | AI usage tracking, credit management and provider reconciliation |
| Phase 4 | Project and workspace profitability                              |
| Phase 5 | Campaign earnings and affiliate commission tracking              |
| Phase 6 | Cost optimization recommendations and financial reporting        |
| Phase 7 | Revenue-driven infrastructure scaling                            |

Budget enforcement must be implemented before enabling paid API generation.

## **45. Final decision**

Clipflow will follow a **subscription-first, local-first and revenue-driven cost management architecture.**

| Requirement                   | Final selection                               |
| ----------------------------- | --------------------------------------------- |
| Primary currency              | INR                                           |
| Initial additional API budget | ₹0                                            |
| Existing AI subscriptions     | Maximize available entitlements               |
| Primary AI intelligence       | ChatGPT and Gemini                            |
| Primary video generation      | Google Flow and Adobe Firefly where available |
| Local video processing        | FFmpeg                                        |
| Local transcription           | Whisper                                       |
| Motion graphics               | Remotion                                      |
| Advanced editing              | Existing Adobe applications                   |
| Primary media storage         | Local storage                                 |
| Database                      | MongoDB Atlas                                 |
| Backup AI providers           | fal.ai and Klap                               |
| Premium voice generation      | ElevenLabs, optional                          |
| Paid generation               | Explicit approval required                    |
| Budget enforcement            | Atomic reservations                           |
| Cost tracking                 | Provider, workspace and project level         |
| Earnings tracking             | Campaigns, affiliates and client projects     |
| Profitability                 | Actual received revenue minus expenses        |
| Infrastructure expansion      | Based on verified requirements                |
| Automatic paid fallback       | Disabled                                      |

## **46. Pending validation**

Before implementation, the following information must be verified:

- Exact ChatGPT subscription entitlements.
- Exact Gemini subscription entitlements.
- Google Flow and Veo generation allowances.
- Adobe subscription applications and Firefly credits.
- OpenAI API pricing and billing configuration.
- Gemini API availability and credential validity.
- Remotion licensing eligibility.
- Whop API permissions.
- Cuelinks approval and API availability.
- Laptop processing performance.
- Available local storage.
- Actual electricity consumption.
- Current provider pricing and commercial usage conditions.

All sample prices, monthly budgets, revenue examples and scaling thresholds in this document are proposed planning assumptions. Current provider pricing has not been independently verified.

The ₹0 initial budget refers to **additional API and infrastructure subscription expenses**, not the total cost of operating Clipflow.

No purchases, paid API requests or source code modifications have been performed during this documentation stage.

**Save in:** `Documentation/12_COST_MANAGEMENT.md`

## **Documentation progress**

**80%**

12 of 15 documents drafted — 3 remaining

01 — PRD

02 — High-Level Design

03 — Technology Stack

04 — Module Architecture

05 — AI Integration Architecture

06 — Media Processing Pipeline

07 — Background Job Architecture

08 — Database Design

09 — API Design

10 — Storage Architecture

11 — Security Architecture

12 — Cost Management

13 — Deployment Architecture

Next

14 — Existing Project Gap Analysis

15 — Implementation Planning

**Next:** `13_DEPLOYMENT_ARCHITECTURE.md` — how Clipflow will run on your laptop, how the frontend, backend, database and workers will communicate, how scheduled operations will work, and when we actually need cloud deployment.