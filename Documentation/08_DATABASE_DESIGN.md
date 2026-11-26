# **08 — Database Design**

**Project:** Clipflow Creator Studio\
**Document:** `08_DATABASE_DESIGN.md`\
**Database:** MongoDB Atlas\
**ODM:** Mongoose\
**Architecture:** Document-oriented database with referenced relationships.

## **1. Objective**

Design a scalable, secure and maintainable database that supports the complete Clipflow ecosystem, including:

- User authentication.
- Multiple brand workspaces.
- Campaign and affiliate opportunities.
- AI content generation.
- Video projects and storyboards.
- Native video editing.
- Media asset management.
- Background jobs.
- Social media publishing.
- Analytics.
- Earnings and expenses.
- AI usage and cost management.

The database should reuse existing Clipflow collections wherever possible instead of rebuilding everything from scratch.

## **2. Technology selection**

| Technology        | Responsibility                 | Cost                |
| ----------------- | ------------------------------ | ------------------- |
| MongoDB Atlas     | Cloud database                 | Free tier available |
| Mongoose          | Schema and database operations | Free                |
| MongoDB Compass   | Database inspection            | Free                |
| Zod               | Input validation               | Free                |
| MongoDB indexes   | Query optimization             | Included            |
| Local file system | Large media storage            | Existing hardware   |
| Cloudflare R2     | Optional future media storage  | Usage-based         |

## **3. Why MongoDB?**

MongoDB is suitable for Clipflow because different project types have different data structures.

For example:

- A clipping project contains video timestamps and transcripts.
- A UGC project contains product details and character references.
- An AI video project contains scenes and generation prompts.
- A reference project contains visual analysis and editing instructions.

MongoDB allows these structures to evolve while Mongoose provides controlled schemas and validation.

However, flexible schemas do not mean unstructured or unvalidated data.

## **4. Database architecture**

MongoDB stores structured application data and media metadata.

Actual video, audio and image files will be stored separately.

## **5. Proposed database collections**

| ID   | Collection          | Responsibility                          |
| ---- | ------------------- | --------------------------------------- |
| DB01 | `users`             | User accounts                           |
| DB02 | `sessions`          | Authentication sessions                 |
| DB03 | `workspaces`        | Brand workspaces                        |
| DB04 | `socialAccounts`    | Connected social accounts               |
| DB05 | `campaigns`         | Campaign opportunities                  |
| DB06 | `savedCampaigns`    | Saved opportunities                     |
| DB07 | `trends`            | Trend research                          |
| DB08 | `recommendations`   | AI recommendations                      |
| DB09 | `projects`          | Content creation projects               |
| DB10 | `storyboards`       | Video planning                          |
| DB11 | `scenes`            | Individual video scenes                 |
| DB12 | `assets`            | Media metadata                          |
| DB13 | `transcripts`       | Transcription and subtitles             |
| DB14 | `timelines`         | Video editor data                       |
| DB15 | `templates`         | Reusable templates                      |
| DB16 | `jobs`              | Background processing                   |
| DB17 | `aiGenerations`     | AI generation history                   |
| DB18 | `promptTemplates`   | AI prompt management                    |
| DB19 | `exports`           | Final video exports                     |
| DB20 | `publishingJobs`    | Publishing and scheduling               |
| DB21 | `analytics`         | Content performance                     |
| DB22 | `affiliateProducts` | Affiliate opportunities                 |
| DB23 | `submissions`       | Campaign submissions                    |
| DB24 | `transactions`      | Earnings and expenses                   |
| DB25 | `budgets`           | Spending limits                         |
| DB26 | `notifications`     | System notifications                    |
| DB27 | `settings`          | User preferences                        |
| DB28 | `integrations`      | External provider connections           |
| DB29 | `auditLogs`         | Important security and system events    |
| DB30 | `syncRuns`          | External source synchronization history |

These are 30 proposed logical collections for the complete product. Not all collections are required during the initial implementation.

## **6. Database relationships**

MongoDB will represent these relationships using ObjectId references and embedded documents where appropriate.

## **7. Common database fields**

Most user-owned collections should contain the following fields.

| Field         | Type        | Purpose                                      |
| ------------- | ----------- | -------------------------------------------- |
| `_id`         | ObjectId    | Unique database identifier                   |
| `userId`      | ObjectId    | Resource owner                               |
| `workspaceId` | ObjectId    | Associated brand workspace, where applicable |
| `createdAt`   | Date        | Creation timestamp                           |
| `updatedAt`   | Date        | Last modification timestamp                  |
| `deletedAt`   | Date / Null | Optional soft deletion                       |

Shared public campaign and trend data will not require individual user ownership. User-specific saved records and recommendations will maintain separate ownership.

All timestamps will be stored in UTC.

## **8. Detailed collection design**

The following schemas describe the proposed important fields. Final Mongoose schemas will be created during implementation.

### **DB01 — Users**

**Collection:** `users`

Stores user account information.

| Field           | Type     |
| --------------- | -------- |
| `_id`           | ObjectId |
| `name`          | String   |
| `email`         | String   |
| `passwordHash`  | String   |
| `avatar`        | String   |
| `role`          | Enum     |
| `emailVerified` | Boolean  |
| `status`        | Enum     |
| `lastLoginAt`   | Date     |
| `createdAt`     | Date     |
| `updatedAt`     | Date     |

**Roles:** `USER`, `ADMIN`

**Statuses:** `ACTIVE`, `INACTIVE`, `SUSPENDED`

**Rules:**

- Email must be unique and normalized.
- Passwords must be hashed using bcrypt.
- Password hashes must never be returned through APIs.

### **DB02 — Sessions**

**Collection:** `sessions`

Stores revocable authentication sessions.

| Field            | Type        |
| ---------------- | ----------- |
| `userId`         | ObjectId    |
| `sessionId`      | String      |
| `tokenHash`      | String      |
| `deviceInfo`     | String      |
| `lastActivityAt` | Date        |
| `expiresAt`      | Date        |
| `revokedAt`      | Date / Null |
| `createdAt`      | Date        |

Expired sessions should be removed using a TTL index. Session expiration must also be checked during authentication.

### **DB03 — Workspaces**

**Collection:** `workspaces`

Stores independent brand environments.

| Field                | Type     |
| -------------------- | -------- |
| `userId`             | ObjectId |
| `name`               | String   |
| `slug`               | String   |
| `description`        | String   |
| `niche`              | String   |
| `logoAssetId`        | ObjectId |
| `brandColors`        | Array    |
| `brandFonts`         | Array    |
| `targetAudience`     | Object   |
| `contentPreferences` | Object   |
| `defaultLanguage`    | String   |
| `status`             | Enum     |

Example workspaces:

| Workspace         | Niche                         |
| ----------------- | ----------------------------- |
| Vice City Witness | GTA and gaming clips          |
| Fashion Studio    | Clothing and fashion UGC      |
| Beauty Studio     | Makeup and skincare           |
| AI Viral Studio   | AI-generated faceless content |
| Affiliate Studio  | Affiliate product promotion   |

Each workspace maintains independent projects, assets, social accounts, analytics and financial records.

### **DB04 — Social Accounts**

**Collection:** `socialAccounts`

| Field                   | Type     |
| ----------------------- | -------- |
| `userId`                | ObjectId |
| `workspaceId`           | ObjectId |
| `platform`              | Enum     |
| `platformAccountId`     | String   |
| `username`              | String   |
| `displayName`           | String   |
| `profileImage`          | String   |
| `accessTokenEncrypted`  | String   |
| `refreshTokenEncrypted` | String   |
| `tokenExpiresAt`        | Date     |
| `permissions`           | Array    |
| `connectionStatus`      | Enum     |
| `lastSyncedAt`          | Date     |

**Platforms:** `INSTAGRAM`, `YOUTUBE`

Future platforms may be added after verifying API availability.

OAuth tokens must be encrypted and accessible only to authorized server-side services.

### **DB05 — Campaigns**

**Collection:** `campaigns`

| Field                | Type              |
| -------------------- | ----------------- |
| `externalId`         | String            |
| `source`             | Enum              |
| `title`              | String            |
| `description`        | String            |
| `category`           | String            |
| `campaignType`       | Enum              |
| `payoutModel`        | String            |
| `payoutAmount`       | Decimal128 / Null |
| `currency`           | String            |
| `requirements`       | Array             |
| `supportedPlatforms` | Array             |
| `campaignUrl`        | String            |
| `deadline`           | Date / Null       |
| `status`             | Enum              |
| `lastSyncedAt`       | Date              |
| `sourceUpdatedAt`    | Date              |

**Sources:** `WHOP`, `CONTENT_REWARDS`, `MANUAL`, supported future sources.

A compound unique index on source and external ID will prevent duplicate imported campaigns.

Unavailable payout information must remain null rather than being fabricated.

### **DB06 — Saved Campaigns**

**Collection:** `savedCampaigns`

| Field            | Type     |
| ---------------- | -------- |
| `userId`         | ObjectId |
| `workspaceId`    | ObjectId |
| `campaignId`     | ObjectId |
| `notes`          | String   |
| `priority`       | Enum     |
| `trackingStatus` | Enum     |
| `savedAt`        | Date     |

**Tracking statuses:** `SAVED`, `RESEARCHING`, `IN_PROGRESS`, `SUBMITTED`, `COMPLETED`, `REJECTED`.

### **DB07 — Trends**

**Collection:** `trends`

| Field          | Type   |
| -------------- | ------ |
| `source`       | String |
| `externalId`   | String |
| `platform`     | String |
| `title`        | String |
| `category`     | String |
| `keywords`     | Array  |
| `hashtags`     | Array  |
| `metrics`      | Object |
| `sourceUrl`    | String |
| `region`       | String |
| `observedAt`   | Date   |
| `lastSyncedAt` | Date   |

Trend metrics must originate from available source data.

### **DB08 — Recommendations**

**Collection:** `recommendations`

| Field              | Type     |
| ------------------ | -------- |
| `userId`           | ObjectId |
| `workspaceId`      | ObjectId |
| `type`             | Enum     |
| `title`            | String   |
| `description`      | String   |
| `reasoningSummary` | String   |
| `sourceReferences` | Array    |
| `score`            | Number   |
| `provider`         | String   |
| `model`            | String   |
| `status`           | Enum     |
| `generatedAt`      | Date     |
| `expiresAt`        | Date     |

Recommendation types include campaigns, trends, content ideas, affiliate products and performance improvements.

AI-generated scores represent recommendations, not verified predictions.

### **DB09 — Projects**

**Collection:** `projects`

This is the central collection for all content creation activities.

| Field                | Type            |
| -------------------- | --------------- |
| `userId`             | ObjectId        |
| `workspaceId`        | ObjectId        |
| `campaignId`         | ObjectId / Null |
| `affiliateProductId` | ObjectId / Null |
| `title`              | String          |
| `description`        | String          |
| `projectType`        | Enum            |
| `status`             | Enum            |
| `duration`           | Number          |
| `aspectRatio`        | String          |
| `resolution`         | Object          |
| `language`           | String          |
| `targetPlatforms`    | Array           |
| `sourceAssetIds`     | Array           |
| `thumbnailAssetId`   | ObjectId        |
| `configuration`      | Object          |
| `createdAt`          | Date            |
| `updatedAt`          | Date            |

**Project types:**

- `CLIPPING`
- `UGC`
- `AI_VIDEO`
- `REFERENCE_VIDEO`
- `VIDEO_EDITING`

**Project statuses:**

`DRAFT`, `PLANNING`, `GENERATING`, `EDITING`, `UNDER_REVIEW`, `READY`, `PUBLISHED`, `ARCHIVED`.

Example UGC project:

```
{
  "title": "Skincare Product Advertisement",
  "projectType": "UGC",
  "status": "PLANNING",
  "duration": 30,
  "aspectRatio": "9:16",
  "resolution": {
    "width": 1080,
    "height": 1920
  },
  "language": "English",
  "targetPlatforms": [
    "INSTAGRAM",
    "YOUTUBE"
  ],
  "configuration": {
    "category": "Skincare",
    "style": "Premium UGC",
    "voiceoverRequired": true,
    "captionsRequired": true
  }
}
```

Project-specific configuration must be validated according to the project type.

### **DB10 — Storyboards**

**Collection:** `storyboards`

| Field              | Type     |
| ------------------ | -------- |
| `userId`           | ObjectId |
| `workspaceId`      | ObjectId |
| `projectId`        | ObjectId |
| `title`            | String   |
| `concept`          | String   |
| `script`           | String   |
| `hook`             | String   |
| `cta`              | String   |
| `totalDuration`    | Number   |
| `visualStyle`      | Object   |
| `characterProfile` | Object   |
| `productProfile`   | Object   |
| `version`          | Number   |
| `approvalStatus`   | Enum     |

Storyboards support multiple versions so users can revise plans without losing previously approved configurations.

### **DB11 — Scenes**

**Collection:** `scenes`

| Field                   | Type     |
| ----------------------- | -------- |
| `projectId`             | ObjectId |
| `storyboardId`          | ObjectId |
| `userId`                | ObjectId |
| `workspaceId`           | ObjectId |
| `sceneNumber`           | Number   |
| `startTime`             | Number   |
| `endTime`               | Number   |
| `duration`              | Number   |
| `script`                | String   |
| `visualDescription`     | String   |
| `generationPrompt`      | String   |
| `cameraMovement`        | String   |
| `characterReferenceIds` | Array    |
| `productReferenceIds`   | Array    |
| `generatedAssetId`      | ObjectId |
| `voiceoverAssetId`      | ObjectId |
| `motionGraphics`        | Object   |
| `transition`            | Object   |
| `status`                | Enum     |
| `version`               | Number   |

Example scene:

```
{
  "sceneNumber": 1,
  "startTime": 0,
  "endTime": 5,
  "duration": 5,
  "script": "Looking for a lightweight moisturizer?",
  "visualDescription": "Product close-up",
  "cameraMovement": "Slow zoom",
  "generationPrompt": "Premium skincare product on a clean vanity",
  "status": "PENDING",
  "version": 1
}
```

Scenes are stored separately because they can be edited, regenerated and processed independently.

### **DB12 — Assets**

**Collection:** `assets`

| Field                | Type            |
| -------------------- | --------------- |
| `userId`             | ObjectId        |
| `workspaceId`        | ObjectId        |
| `projectId`          | ObjectId / Null |
| `name`               | String          |
| `originalFileName`   | String          |
| `assetType`          | Enum            |
| `sourceType`         | Enum            |
| `storageProvider`    | Enum            |
| `storageKey`         | String          |
| `mimeType`           | String          |
| `fileSize`           | Number          |
| `duration`           | Number          |
| `width`              | Number          |
| `height`             | Number          |
| `frameRate`          | Number          |
| `codec`              | String          |
| `checksum`           | String          |
| `thumbnailAssetId`   | ObjectId        |
| `licenseInformation` | Object          |
| `generationId`       | ObjectId / Null |
| `status`             | Enum            |

**Asset types:** `VIDEO`, `IMAGE`, `AUDIO`, `SUBTITLE`, `FONT`, `DOCUMENT`.

**Storage providers:** `LOCAL`, `R2`.

The database stores storage keys and metadata rather than actual large media files.

### **DB13 — Transcripts**

**Collection:** `transcripts`

| Field               | Type     |
| ------------------- | -------- |
| `userId`            | ObjectId |
| `workspaceId`       | ObjectId |
| `projectId`         | ObjectId |
| `assetId`           | ObjectId |
| `language`          | String   |
| `provider`          | String   |
| `model`             | String   |
| `fullText`          | String   |
| `segments`          | Array    |
| `transcriptAssetId` | ObjectId |
| `subtitleAssetIds`  | Array    |
| `status`            | Enum     |

Example transcript segment:

```
{
  "startTime": 0.5,
  "endTime": 2.4,
  "text": "Welcome to Clipflow",
  "words": [
    {
      "word": "Welcome",
      "startTime": 0.5,
      "endTime": 1.1
    },
    {
      "word": "to",
      "startTime": 1.1,
      "endTime": 1.4
    },
    {
      "word": "Clipflow",
      "startTime": 1.4,
      "endTime": 2.4
    }
  ]
}
```

Long transcripts should be stored as separate JSON assets or chunked records to avoid oversized MongoDB documents.

### **DB14 — Timelines**

**Collection:** `timelines`

Stores non-destructive video editor configurations.

| Field            | Type     |
| ---------------- | -------- |
| `userId`         | ObjectId |
| `workspaceId`    | ObjectId |
| `projectId`      | ObjectId |
| `version`        | Number   |
| `duration`       | Number   |
| `resolution`     | Object   |
| `frameRate`      | Number   |
| `tracks`         | Array    |
| `exportSettings` | Object   |
| `lastSavedAt`    | Date     |

Example timeline structure:

```
{
  "version": 1,
  "duration": 30,
  "frameRate": 30,
  "tracks": [
    {
      "trackId": "track_001",
      "type": "VIDEO",
      "items": [
        {
          "itemId": "item_001",
          "assetId": "asset_001",
          "startTime": 0,
          "duration": 5,
          "sourceStart": 0,
          "sourceEnd": 5,
          "volume": 1,
          "speed": 1
        }
      ]
    }
  ]
}
```

Supported tracks include video, B-roll, text, captions, motion graphics, voiceover, music and sound effects.

Large timelines may require separate track or item collections in the future.

### **DB15 — Templates**

**Collection:** `templates`

| Field            | Type            |
| ---------------- | --------------- |
| `userId`         | ObjectId        |
| `workspaceId`    | ObjectId / Null |
| `name`           | String          |
| `description`    | String          |
| `templateType`   | Enum            |
| `category`       | String          |
| `previewAssetId` | ObjectId        |
| `configuration`  | Object          |
| `version`        | Number          |
| `usageCount`     | Number          |
| `visibility`     | Enum            |

Template types include UGC, clipping, storyboard, motion graphics, caption styles and brand presets.

### **DB16 — Jobs**

**Collection:** `jobs`

| Field             | Type              |
| ----------------- | ----------------- |
| `userId`          | ObjectId          |
| `workspaceId`     | ObjectId          |
| `projectId`       | ObjectId / Null   |
| `parentJobId`     | ObjectId / Null   |
| `type`            | Enum              |
| `status`          | Enum              |
| `priority`        | Number            |
| `progress`        | Number / Null     |
| `currentStage`    | String            |
| `dependencies`    | Array             |
| `input`           | Object            |
| `output`          | Object            |
| `attempts`        | Number            |
| `maxAttempts`     | Number            |
| `workerId`        | String            |
| `leaseExpiresAt`  | Date              |
| `lastHeartbeatAt` | Date              |
| `claimVersion`    | Number            |
| `idempotencyKey`  | String            |
| `approvalStatus`  | Enum              |
| `estimatedCost`   | Decimal128        |
| `actualCost`      | Decimal128 / Null |
| `currency`        | String            |
| `scheduledAt`     | Date              |
| `nextRunAt`       | Date              |
| `error`           | Object            |
| `startedAt`       | Date              |
| `completedAt`     | Date              |

This collection implements the architecture defined in `07_BACKGROUND_JOB_ARCHITECTURE.md`.

The `claimVersion` field helps prevent an expired worker from overwriting the result of a newer worker claim.

### **DB17 — AI Generations**

**Collection:** `aiGenerations`

| Field               | Type              |
| ------------------- | ----------------- |
| `userId`            | ObjectId          |
| `workspaceId`       | ObjectId          |
| `projectId`         | ObjectId          |
| `sceneId`           | ObjectId / Null   |
| `jobId`             | ObjectId          |
| `provider`          | String            |
| `model`             | String            |
| `taskType`          | Enum              |
| `integrationMode`   | Enum              |
| `promptTemplateId`  | ObjectId          |
| `promptVersion`     | Number            |
| `prompt`            | String            |
| `inputAssetIds`     | Array             |
| `outputAssetIds`    | Array             |
| `providerRequestId` | String            |
| `inputTokens`       | Number            |
| `outputTokens`      | Number            |
| `generatedDuration` | Number            |
| `estimatedCost`     | Decimal128        |
| `actualCost`        | Decimal128 / Null |
| `currency`          | String            |
| `status`            | Enum              |
| `error`             | Object            |

Every generation attempt should have its own record, including failed and manually assisted generations.

### **DB18 — Prompt Templates**

**Collection:** `promptTemplates`

| Field                 | Type            |
| --------------------- | --------------- |
| `name`                | String          |
| `category`            | String          |
| `taskType`            | String          |
| `template`            | String          |
| `requiredInputs`      | Array           |
| `outputSchemaVersion` | String          |
| `version`             | Number          |
| `status`              | Enum            |
| `createdBy`           | ObjectId / Null |

Prompt versioning allows Clipflow to track which instructions generated a particular result.

### **DB19 — Exports**

**Collection:** `exports`

| Field              | Type     |
| ------------------ | -------- |
| `userId`           | ObjectId |
| `workspaceId`      | ObjectId |
| `projectId`        | ObjectId |
| `timelineId`       | ObjectId |
| `timelineVersion`  | Number   |
| `jobId`            | ObjectId |
| `videoAssetId`     | ObjectId |
| `coverAssetId`     | ObjectId |
| `subtitleAssetIds` | Array    |
| `caption`          | String   |
| `hashtags`         | Array    |
| `seoKeywords`      | Array    |
| `resolution`       | Object   |
| `duration`         | Number   |
| `frameRate`        | Number   |
| `format`           | String   |
| `fileSize`         | Number   |
| `qualityChecks`    | Object   |
| `approvalStatus`   | Enum     |
| `status`           | Enum     |

Each export should reference the exact timeline version used during rendering.

### **DB20 — Publishing Jobs**

**Collection:** `publishingJobs`

| Field             | Type     |
| ----------------- | -------- |
| `userId`          | ObjectId |
| `workspaceId`     | ObjectId |
| `projectId`       | ObjectId |
| `exportId`        | ObjectId |
| `socialAccountId` | ObjectId |
| `jobId`           | ObjectId |
| `platform`        | Enum     |
| `caption`         | String   |
| `hashtags`        | Array    |
| `scheduledAt`     | Date     |
| `approvedAt`      | Date     |
| `approvedBy`      | ObjectId |
| `publishedAt`     | Date     |
| `platformPostId`  | String   |
| `publishedUrl`    | String   |
| `idempotencyKey`  | String   |
| `status`          | Enum     |
| `error`           | Object   |

**Statuses:** `DRAFT`, `AWAITING_APPROVAL`, `SCHEDULED`, `PUBLISHING`, `PUBLISHED`, `FAILED`, `CANCELLED`, `RECONCILING`.

The generic `jobs` collection handles execution, while `publishingJobs` maintains publishing-specific business information.

### **DB21 — Analytics**

**Collection:** `analytics`

| Field                  | Type            |
| ---------------------- | --------------- |
| `userId`               | ObjectId        |
| `workspaceId`          | ObjectId        |
| `socialAccountId`      | ObjectId        |
| `publishingJobId`      | ObjectId / Null |
| `platform`             | String          |
| `platformPostId`       | String          |
| `metricScope`          | Enum            |
| `views`                | Number / Null   |
| `likes`                | Number / Null   |
| `comments`             | Number / Null   |
| `shares`               | Number / Null   |
| `saves`                | Number / Null   |
| `watchTime`            | Number / Null   |
| `averageWatchDuration` | Number / Null   |
| `followers`            | Number / Null   |
| `engagementRate`       | Number / Null   |
| `observedAt`           | Date            |
| `syncedAt`             | Date            |

Historical snapshots allow Clipflow to measure performance changes over time.

Unavailable metrics must remain null. Zero should represent an actual reported zero.

### **DB22 — Affiliate Products**

**Collection:** `affiliateProducts`

| Field             | Type              |
| ----------------- | ----------------- |
| `externalId`      | String            |
| `source`          | String            |
| `productName`     | String            |
| `brand`           | String            |
| `category`        | String            |
| `description`     | String            |
| `productUrl`      | String            |
| `productImages`   | Array             |
| `price`           | Decimal128 / Null |
| `currency`        | String            |
| `commissionType`  | Enum              |
| `commissionValue` | Decimal128 / Null |
| `availability`    | String            |
| `lastSyncedAt`    | Date              |

User-specific affiliate tracking links should be stored separately from shared product information, either in a dedicated link collection or in an authorized project-level record.

Cuelinks integration remains dependent on account approval and API access.

### **DB23 — Submissions**

**Collection:** `submissions`

| Field                  | Type              |
| ---------------------- | ----------------- |
| `userId`               | ObjectId          |
| `workspaceId`          | ObjectId          |
| `campaignId`           | ObjectId          |
| `projectId`            | ObjectId          |
| `publishingJobId`      | ObjectId / Null   |
| `submissionUrl`        | String            |
| `externalSubmissionId` | String            |
| `platform`             | String            |
| `views`                | Number / Null     |
| `estimatedEarnings`    | Decimal128 / Null |
| `approvedEarnings`     | Decimal128 / Null |
| `currency`             | String            |
| `submissionStatus`     | Enum              |
| `paymentStatus`        | Enum              |
| `verificationSource`   | String            |
| `submittedAt`          | Date              |
| `reviewedAt`           | Date              |
| `paidAt`               | Date              |

Users must not be able to mark external campaign earnings as verified through an ordinary submission update request.

Manual financial entries must be clearly distinguished from provider-verified earnings.

### **DB24 — Transactions**

**Collection:** `transactions`

| Field                | Type              |
| -------------------- | ----------------- |
| `userId`             | ObjectId          |
| `workspaceId`        | ObjectId / Null   |
| `projectId`          | ObjectId / Null   |
| `generationId`       | ObjectId / Null   |
| `submissionId`       | ObjectId / Null   |
| `transactionType`    | Enum              |
| `category`           | Enum              |
| `amount`             | Decimal128        |
| `currency`           | String            |
| `exchangeRate`       | Decimal128 / Null |
| `convertedAmountINR` | Decimal128 / Null |
| `description`        | String            |
| `source`             | String            |
| `verificationStatus` | Enum              |
| `paymentStatus`      | Enum              |
| `transactionDate`    | Date              |

**Income categories:** Campaign earnings, affiliate commissions, sponsorships, manual income.

**Expense categories:** AI generation, subscriptions, storage, rendering, other expenses.

Decimal128 will be used for financial values to avoid floating-point calculation errors.

### **DB25 — Budgets**

**Collection:** `budgets`

| Field              | Type            |
| ------------------ | --------------- |
| `userId`           | ObjectId        |
| `workspaceId`      | ObjectId / Null |
| `periodType`       | Enum            |
| `periodStart`      | Date            |
| `periodEnd`        | Date            |
| `spendingLimit`    | Decimal128      |
| `reservedAmount`   | Decimal128      |
| `spentAmount`      | Decimal128      |
| `currency`         | String          |
| `alertThreshold`   | Number          |
| `hardLimitEnabled` | Boolean         |

Budget reservations must be atomic to prevent simultaneous AI jobs from exceeding the configured spending limit.

### **DB26 — Notifications**

**Collection:** `notifications`

| Field               | Type            |
| ------------------- | --------------- |
| `userId`            | ObjectId        |
| `workspaceId`       | ObjectId / Null |
| `type`              | Enum            |
| `title`             | String          |
| `message`           | String          |
| `relatedEntityType` | String          |
| `relatedEntityId`   | ObjectId        |
| `priority`          | Enum            |
| `isRead`            | Boolean         |
| `readAt`            | Date            |
| `createdAt`         | Date            |

### **DB27 — Settings**

**Collection:** `settings`

| Field                     | Type     |
| ------------------------- | -------- |
| `userId`                  | ObjectId |
| `defaultWorkspaceId`      | ObjectId |
| `timezone`                | String   |
| `language`                | String   |
| `theme`                   | String   |
| `defaultExportSettings`   | Object   |
| `aiPreferences`           | Object   |
| `notificationPreferences` | Object   |
| `processingPreferences`   | Object   |
| `storagePreferences`      | Object   |
| `approvalPreferences`     | Object   |

Default timezone: `Asia/Kolkata`.

### **DB28 — Integrations**

**Collection:** `integrations`

| Field                     | Type            |
| ------------------------- | --------------- |
| `userId`                  | ObjectId        |
| `workspaceId`             | ObjectId / Null |
| `provider`                | String          |
| `integrationMode`         | Enum            |
| `credentialReference`     | String          |
| `capabilities`            | Array           |
| `connectionStatus`        | Enum            |
| `lastHealthCheckAt`       | Date            |
| `lastSuccessfulRequestAt` | Date            |
| `lastError`               | Object          |

This collection records integration configuration and health.

Raw API keys must not be stored in ordinary settings documents. Initially, application-level API credentials should remain in server-side environment variables.

### **DB29 — Audit Logs**

**Collection:** `auditLogs`

| Field         | Type            |
| ------------- | --------------- |
| `userId`      | ObjectId        |
| `workspaceId` | ObjectId / Null |
| `action`      | String          |
| `entityType`  | String          |
| `entityId`    | ObjectId        |
| `result`      | Enum            |
| `metadata`    | Object          |
| `createdAt`   | Date            |

Important audit events include login attempts, account connections, publishing approvals, budget changes, paid AI generation, credential changes and resource deletion.

Logs must not contain passwords, API keys or OAuth tokens.

### **DB30 — Synchronization Runs**

**Collection:** `syncRuns`

| Field            | Type            |
| ---------------- | --------------- |
| `source`         | String          |
| `userId`         | ObjectId / Null |
| `workspaceId`    | ObjectId / Null |
| `jobId`          | ObjectId        |
| `status`         | Enum            |
| `recordsFetched` | Number          |
| `recordsCreated` | Number          |
| `recordsUpdated` | Number          |
| `recordsFailed`  | Number          |
| `startedAt`      | Date            |
| `completedAt`    | Date            |
| `error`          | Object          |

This collection allows the system to display when a source was last checked successfully, even when no new opportunities were discovered.

## **9. Embedding vs referencing**

MongoDB supports two main ways of organizing related information.

### **Embedded documents**

Store small related information inside the parent document.

```
{
  "name": "Fashion Studio",
  "brandColors": {
    "primary": "#111111",
    "secondary": "#FFFFFF"
  }
}
```

Suitable for brand preferences, export settings, small configuration objects and quality check results.

### **Referenced documents**

Store related information in separate collections and connect them using IDs.

```
{
  "title": "Fashion Advertisement",
  "workspaceId": "workspace_001",
  "userId": "user_001"
}
```

Suitable for projects, assets, scenes, jobs, transactions and social accounts.

### **Final selection**

| Data                   | Approach                          |
| ---------------------- | --------------------------------- |
| User preferences       | Embedded                          |
| Brand configuration    | Embedded                          |
| Projects               | Referenced                        |
| Storyboards            | Referenced                        |
| Scenes                 | Referenced                        |
| Media assets           | Referenced                        |
| Timeline tracks        | Embedded initially                |
| Long transcripts       | Separate asset or chunked records |
| Background jobs        | Referenced                        |
| Financial transactions | Referenced                        |
| Analytics snapshots    | Referenced                        |

MongoDB documents have a maximum BSON size of 16 MiB. Unbounded arrays and large media data must therefore be avoided.

## **10. Database indexing strategy**

Indexes help MongoDB retrieve information efficiently without scanning every document.

| Collection      | Proposed index                                             | Purpose                        |
| --------------- | ---------------------------------------------------------- | ------------------------------ |
| Users           | `email` — unique                                           | Login and duplicate prevention |
| Sessions        | `sessionId` — unique                                       | Session lookup                 |
| Sessions        | `expiresAt` — TTL                                          | Expired session cleanup        |
| Workspaces      | `userId + slug` — unique                                   | Workspace identification       |
| Social Accounts | `userId + platform + platformAccountId` — unique           | Prevent duplicate connections  |
| Campaigns       | `source + externalId` — unique                             | Prevent duplicate imports      |
| Saved Campaigns | `userId + workspaceId + campaignId` — unique               | Prevent duplicate saves        |
| Projects        | `userId + workspaceId + updatedAt`                         | Project listing                |
| Storyboards     | `projectId + version` — unique                             | Version management             |
| Scenes          | `storyboardId + sceneNumber` — unique                      | Scene ordering                 |
| Assets          | `workspaceId + assetType + createdAt`                      | Asset filtering                |
| Timelines       | `projectId + version` — unique                             | Timeline versions              |
| Jobs            | `status + priority + nextRunAt`                            | Queue processing               |
| Jobs            | `userId + idempotencyKey` — unique where present           | Duplicate prevention           |
| Jobs            | `status + leaseExpiresAt`                                  | Worker recovery                |
| Publishing Jobs | `socialAccountId + idempotencyKey` — unique                | Publishing deduplication       |
| Analytics       | `socialAccountId + observedAt`                             | Historical analytics           |
| Transactions    | `workspaceId + transactionDate`                            | Financial reports              |
| Budgets         | `userId + workspaceId + periodType + periodStart` — unique | Budget lookup                  |
| Notifications   | `userId + isRead + createdAt`                              | Unread notifications           |
| Settings        | `userId` — unique                                          | User preferences               |
| Sync Runs       | `source + completedAt`                                     | Synchronization history        |

Final indexes should be validated against actual queries during implementation. Unnecessary indexes increase storage and write costs.

## **11. Database validation**

Clipflow will use three validation layers.

| Layer         | Responsibility                        |
| ------------- | ------------------------------------- |
| Zod           | Validate incoming API requests        |
| Mongoose      | Validate document structure           |
| Service layer | Validate business rules and ownership |

Examples of business validation:

- Scene duration must match its start and end timestamps.
- Project ownership must match workspace ownership.
- Timeline assets must belong to an authorized workspace.
- Paid generation must not exceed the approved budget.
- Publishing must reference an approved export.
- Completed jobs must contain valid output references.
- Duplicate campaign submissions must be rejected.

Database uniqueness constraints must enforce important duplicate-prevention rules even when multiple requests arrive simultaneously.

## **12. Database transaction strategy**

MongoDB transactions should be used when multiple database changes must succeed or fail together.

| Operation                                        | Transaction required?                    |
| ------------------------------------------------ | ---------------------------------------- |
| Creating a simple project                        | Usually no                               |
| Updating project title                           | No                                       |
| Reserving budget and creating paid job           | Yes                                      |
| Recording a charge and releasing reserved budget | Yes                                      |
| Updating related financial records               | Yes                                      |
| Approving publishing and creating execution job  | Where atomic consistency is required     |
| Uploading a media file                           | Separate storage reconciliation required |

Database transactions cannot roll back external AI charges, social media posts or file-system operations.

Those operations require idempotency, reconciliation and recovery mechanisms.

## **13. Data ownership and isolation**

Every protected query must verify the authenticated user and associated workspace.

Example of an unsafe query:

```
Project.findById(projectId);
```

Example of a safer ownership-scoped query:

```
Project.findOne({
  _id: projectId,
  userId: authenticatedUserId,
  workspaceId: authorizedWorkspaceId
});
```

The server must verify that the workspace belongs to the authenticated user.

Client-provided user IDs must never be trusted as proof of ownership.

## **14. Data deletion strategy**

| Data type              | Deletion strategy                                 |
| ---------------------- | ------------------------------------------------- |
| Projects               | Soft deletion initially                           |
| Workspaces             | Archive or controlled deletion                    |
| Media assets           | Delete only after dependency checks               |
| Temporary files        | Automatic cleanup                                 |
| Sessions               | Expiration and revocation                         |
| Notifications          | Configurable cleanup                              |
| Financial transactions | Preserve history and record corrections           |
| Audit logs             | Controlled retention                              |
| Social accounts        | Disconnect and revoke credentials where supported |
| AI generation history  | Retain usage and cost records                     |

Deleting a project must not automatically remove an asset that is still used by another project.

## **15. Database backup strategy**

| Data                | Backup approach                                |
| ------------------- | ---------------------------------------------- |
| MongoDB collections | Supported database backup or scheduled exports |
| Local media files   | Separate local backup                          |
| Storyboards         | Versioned database records                     |
| Timelines           | Versioned database records                     |
| Financial records   | Regular database backup                        |
| Configuration       | Secure configuration backup                    |
| API credentials     | Encrypted secret backup                        |

MongoDB Atlas free-tier backup capabilities must be verified. Automated managed backups should not be assumed to be included.

Database backups alone are insufficient because the actual media files are stored separately.

## **16. Data retention strategy**

| Data                       | Proposed retention                          |
| -------------------------- | ------------------------------------------- |
| Active projects            | Until user deletion                         |
| Original media             | Until user deletion                         |
| Final exports              | Until user deletion                         |
| Temporary processing files | 24–72 hours                                 |
| Proxy files                | Regenerate when required                    |
| Completed job logs         | 90 days                                     |
| Failed job logs            | 90 days                                     |
| Read notifications         | 30 days                                     |
| Analytics snapshots        | Long-term                                   |
| Financial records          | Long-term                                   |
| Expired sessions           | Automatic cleanup                           |
| Audit logs                 | Initially 180 days, subject to requirements |

Retention periods are proposed defaults and should be configurable.

## **17. Proposed database model structure**

```
src/
├── lib/
│   └── db/
│       ├── connection.ts
│       ├── transaction.ts
│       └── indexes.ts
│
└── models/
    ├── User.ts
    ├── Session.ts
    ├── Workspace.ts
    ├── SocialAccount.ts
    ├── Campaign.ts
    ├── SavedCampaign.ts
    ├── Trend.ts
    ├── Recommendation.ts
    ├── Project.ts
    ├── Storyboard.ts
    ├── Scene.ts
    ├── Asset.ts
    ├── Transcript.ts
    ├── Timeline.ts
    ├── Template.ts
    ├── Job.ts
    ├── AIGeneration.ts
    ├── PromptTemplate.ts
    ├── Export.ts
    ├── PublishingJob.ts
    ├── Analytics.ts
    ├── AffiliateProduct.ts
    ├── Submission.ts
    ├── Transaction.ts
    ├── Budget.ts
    ├── Notification.ts
    ├── Settings.ts
    ├── Integration.ts
    ├── AuditLog.ts
    └── SyncRun.ts
```

This is a proposed target structure, not an instruction to replace existing models.

## **18. Existing database reuse**

Clipflow already has an existing MongoDB and Mongoose implementation.

Before creating new collections, we must:

1. Inspect existing Mongoose models.
2. Inspect actual MongoDB collections.
3. Compare existing fields with the new requirements.
4. Identify reusable models.
5. Identify missing fields and indexes.
6. Identify obsolete or overlapping models.
7. Prepare a safe migration plan.
8. Preserve existing user and project data.

The existing project previously reported eight Mongoose collections. Their exact schemas must be inspected during the gap analysis before deciding which collections to extend or replace.

This comparison will be documented in `14_EXISTING_PROJECT_GAP_ANALYSIS.md`.

## **19. Database security requirements**

| Requirement            | Implementation                                      |
| ---------------------- | --------------------------------------------------- |
| Password protection    | bcrypt hashing                                      |
| Session protection     | Secure, revocable sessions                          |
| OAuth token protection | Encryption                                          |
| API credentials        | Server-side environment variables or secret storage |
| Database access        | Restricted database user permissions                |
| Network access         | Restricted Atlas IP access                          |
| User isolation         | Ownership-scoped queries                            |
| Input validation       | Zod and Mongoose                                    |
| Duplicate prevention   | Unique indexes                                      |
| Injection prevention   | Validated query parameters                          |
| Financial integrity    | Atomic updates and transactions                     |
| Audit history          | Audit logs                                          |
| Connection security    | TLS                                                 |

The existing MongoDB connectivity and authentication issues must be resolved before production implementation.

## **20. Database testing requirements**

| Test                         | Expected result                 |
| ---------------------------- | ------------------------------- |
| User creation                | Valid user stored               |
| Duplicate email              | Rejected                        |
| Workspace creation           | Correct ownership assigned      |
| Project creation             | Valid project stored            |
| Unauthorized project access  | Rejected                        |
| Cross-workspace access       | Rejected                        |
| Campaign synchronization     | No duplicate records            |
| Scene validation             | Correct timing enforced         |
| Asset references             | Valid and authorized            |
| Concurrent job claiming      | No simultaneous duplicate claim |
| Budget reservation           | Spending limit enforced         |
| Transaction failure          | Database changes rolled back    |
| Session expiration           | Access rejected                 |
| Duplicate publishing request | Duplicate prevented             |
| Data migration               | Existing records preserved      |
| Backup restoration           | Data successfully restored      |

## **21. Database implementation priority**

**1**

Phase 1

**Core database**\
Users and sessions · Workspaces · Projects · Assets · Jobs · Settings

**2**

Phase 2

**Content creation**\
Storyboards · Scenes · Transcripts · Timelines · Exports · Templates

**3**

Phase 3

**AI management**\
AI generations · Prompt templates · Integrations · Budgets · Transactions

**4**

Phase 4

**Discovery and earnings**\
Campaigns · Saved campaigns · Trends · Recommendations · Affiliate products · Submissions · Synchronization runs

**5**

Phase 5

**Social media and monitoring**\
Social accounts · Publishing jobs · Analytics · Notifications · Audit logs

These phases describe the proposed database development order. Existing working collections should remain available throughout implementation, and security controls must be implemented from the beginning rather than deferred to Phase 5.

## **22. Database design rules**

- Reuse existing collections wherever possible.
- Never store large video binaries inside MongoDB.
- Never store plaintext passwords or credentials.
- Use ObjectId references for database relationships.
- Use Decimal128 for financial calculations.
- Validate every incoming request.
- Maintain workspace isolation.
- Use indexes for frequently executed queries.
- Preserve original media references.
- Maintain storyboard and timeline versions.
- Prevent duplicate records and paid operations.
- Never store fabricated analytics or earnings.
- Avoid unbounded embedded arrays.
- Never delete existing production data without a verified migration and backup.

## **23. Final decision**

| Requirement              | Selected approach                     |
| ------------------------ | ------------------------------------- |
| Primary database         | MongoDB Atlas                         |
| Database ODM             | Mongoose                              |
| API validation           | Zod                                   |
| Proposed collections     | 30 logical collections                |
| Database relationships   | ObjectId references                   |
| Small configuration data | Embedded documents                    |
| Media storage            | Local file system                     |
| Financial values         | Decimal128                            |
| Background queue         | MongoDB jobs collection               |
| Authentication           | JWT with revocable session management |
| Data isolation           | User and workspace ownership          |
| Database optimization    | Query-specific indexes                |
| Backup                   | Database and media backups            |
| Future storage           | Cloudflare R2                         |
| Existing database        | Reuse and extend                      |

**Pending validation:** Existing model schemas, Atlas connectivity, storage limits, backup capabilities, index performance and migration requirements.

The 30 collections, field definitions, indexes and retention periods are proposed architecture decisions. They are not existing implemented collections, and we should not create all 30 immediately. The final schema changes will be determined after inspecting the existing project.

**Save in:** `Documentation/08_DATABASE_DESIGN.md`

**Completed planning progress:**

8 of 15 documents

53%

8 documents drafted or completed; 7 remaining.

**Next:** `09_API_DESIGN.md` — complete API architecture, endpoints, HTTP methods, request and response formats, authentication, validation, error handling and external API integrations.