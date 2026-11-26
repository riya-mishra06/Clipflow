# **10 — Storage Architecture**

**Project:** Clipflow Creator Studio\
**Document:** `10_STORAGE_ARCHITECTURE.md`\
**Architecture:** Local-first media storage with optional cloud storage expansion.\
**Primary storage:** Local file system\
**Metadata storage:** MongoDB Atlas\
**Future cloud storage:** Cloudflare R2

## **1. Objective**

Design a centralized, secure and cost-efficient storage system that manages all media assets generated, uploaded, processed and exported through Clipflow.

The storage architecture must support:

- Large video files.
- Product and reference images.
- AI-generated images and videos.
- Audio, music and sound effects.
- Transcripts and subtitles.
- Temporary processing files.
- Video editor assets.
- Reusable brand assets.
- Final video exports.
- Backup and recovery.
- Automatic storage cleanup.
- Future cloud storage migration.

The primary objective is to minimize additional expenses while maintaining organized and reliable media storage.

## **2. Storage technology selection**

| Technology          | Responsibility                   | Cost                     |
| ------------------- | -------------------------------- | ------------------------ |
| Local file system   | Primary media storage            | Existing hardware        |
| MongoDB Atlas       | Media metadata and references    | Free tier available      |
| Node.js File System | File management                  | Free                     |
| Node.js Streams     | Large file transfer              | Free                     |
| FFmpeg              | Media processing and compression | Free                     |
| FFprobe             | Media metadata extraction        | Free                     |
| Cloudflare R2       | Future cloud object storage      | Usage-based              |
| External hard drive | Optional backup                  | Additional hardware cost |

Initially, Clipflow will not require a paid cloud storage subscription.

## **3. Why separate database and media storage?**

MongoDB is designed to store application data, while large video files are better managed through file systems or object storage.

For example, when a user uploads a 500 MB video:

| MongoDB stores    | Local storage stores |
| ----------------- | -------------------- |
| Asset ID          | Actual video file    |
| File name         | Extracted audio      |
| File size         | Generated thumbnails |
| Video duration    | Processed clips      |
| Resolution        | Preview files        |
| Storage reference | Final rendered video |
| User ownership    | Generated media      |

MongoDB has a maximum BSON document size of 16 MiB. Although GridFS supports larger files, Clipflow will use separate media storage to simplify processing and control database storage costs.

## **4. High-level storage architecture**

All modules must access media through the centralized Storage Service rather than independently managing files.

## **5. Storage categories**

| Category         | Purpose                              |
| ---------------- | ------------------------------------ |
| Original media   | Uploaded source videos and images    |
| Reference media  | Creative and competitor references   |
| Generated images | AI-generated visual assets           |
| Generated videos | AI-generated video scenes            |
| Audio            | Voiceovers and extracted audio       |
| Music            | Licensed background music            |
| Sound effects    | Licensed SFX                         |
| Transcripts      | Speech-to-text outputs               |
| Subtitles        | SRT, VTT and caption data            |
| Clips            | Extracted short-form videos          |
| Proxies          | Lightweight editing copies           |
| Previews         | Temporary composition previews       |
| Thumbnails       | Asset and project thumbnails         |
| Brand assets     | Logos, fonts and reusable visuals    |
| Templates        | Reusable creative configurations     |
| Exports          | Final rendered videos                |
| Temporary files  | Intermediate processing files        |
| Backups          | Recoverable copies of important data |

## **6. Local storage folder structure**

```
clipflow-media/
├── users/
│   └── user-id/
│       ├── workspaces/
│       │   └── workspace-id/
│       │       ├── brand-assets/
│       │       │   ├── logos/
│       │       │   ├── fonts/
│       │       │   ├── characters/
│       │       │   └── templates/
│       │       │
│       │       ├── library/
│       │       │   ├── images/
│       │       │   ├── videos/
│       │       │   ├── music/
│       │       │   └── sound-effects/
│       │       │
│       │       └── projects/
│       │           └── project-id/
│       │               ├── originals/
│       │               ├── references/
│       │               ├── generated/
│       │               │   ├── images/
│       │               │   ├── videos/
│       │               │   └── voiceovers/
│       │               ├── audio/
│       │               ├── transcripts/
│       │               ├── subtitles/
│       │               ├── clips/
│       │               ├── motion/
│       │               ├── proxies/
│       │               ├── previews/
│       │               ├── thumbnails/
│       │               ├── temporary/
│       │               └── exports/
│       │
│       └── shared-assets/
│
├── system/
│   ├── temporary/
│   ├── logs/
│   └── cache/
│
└── backups/
```

The storage root must be configurable and located outside the application's source code and public directory.

## **7. Multi-workspace storage isolation**

Each brand workspace will have independent storage organization.

| Workspace         | Stored assets                                            |
| ----------------- | -------------------------------------------------------- |
| Vice City Witness | GTA footage, gaming clips, covers and subtitles          |
| Fashion Studio    | Clothing images, AI models and fashion advertisements    |
| Beauty Studio     | Makeup, skincare and product demonstrations              |
| AI Viral Studio   | AI-generated characters, animations and faceless videos  |
| Affiliate Studio  | Product images, promotional videos and affiliate content |

Assets should not be accessible across workspaces unless the user explicitly shares or imports them.

Workspace isolation must be enforced through backend authorization, not merely through folder separation.

## **8. Storage location configuration**

Clipflow should support configurable storage locations through environment variables.

```
STORAGE_PROVIDER=local

LOCAL_STORAGE_ROOT=D:/ClipflowMedia

TEMP_STORAGE_ROOT=D:/ClipflowMedia/system/temporary

BACKUP_STORAGE_ROOT=E:/ClipflowBackups

MAX_UPLOAD_SIZE_MB=2048

MIN_FREE_DISK_SPACE_GB=10
```

These values are illustrative.

If the laptop does not have separate D or E drives, another available location can be configured.

The application should not depend on hardcoded Windows-specific paths.

## **9. Centralized Storage Service**

The Storage Service will provide a common interface for every module.

| Operation             | Responsibility                   |
| --------------------- | -------------------------------- |
| `upload()`            | Store uploaded files             |
| `import()`            | Import authorized external media |
| `getMetadata()`       | Retrieve file information        |
| `read()`              | Read stored media                |
| `stream()`            | Stream media for playback        |
| `download()`          | Download files                   |
| `copy()`              | Copy assets                      |
| `move()`              | Move files safely                |
| `delete()`            | Remove eligible files            |
| `exists()`            | Verify file availability         |
| `getUsage()`          | Calculate storage consumption    |
| `generateThumbnail()` | Create asset thumbnail           |
| `cleanup()`           | Remove eligible temporary files  |
| `backup()`            | Create recoverable copies        |

The service must verify authorization before performing user-facing storage operations.

## **10. Storage provider abstraction**

The application should not directly depend on one storage provider.

```
interface StorageProvider {
  upload(
    input: NodeJS.ReadableStream,
    storageKey: string
  ): Promise<StorageResult>;

  read(
    storageKey: string
  ): Promise<NodeJS.ReadableStream>;

  delete(
    storageKey: string
  ): Promise<void>;

  exists(
    storageKey: string
  ): Promise<boolean>;

  getMetadata(
    storageKey: string
  ): Promise<StorageMetadata>;
}
```

This is an illustrative interface, not final implementation code.

### **Supported providers**

| Provider              | Availability | Purpose                             |
| --------------------- | ------------ | ----------------------------------- |
| LocalStorageProvider  | Initial      | Local media storage                 |
| R2StorageProvider     | Future       | Cloud media storage                 |
| HybridStorageProvider | Future       | Local processing and cloud delivery |

Using provider abstraction allows future storage migration without rewriting the entire application.

## **11. File upload pipeline**

If database creation fails after the file is stored, the system must remove or reconcile the orphaned file.

## **12. Supported media formats**

| Asset type      | Supported formats    |
| --------------- | -------------------- |
| Video           | MP4, MOV, WebM, MKV  |
| Images          | JPG, JPEG, PNG, WebP |
| Audio           | MP3, WAV, AAC, M4A   |
| Subtitles       | SRT, VTT, ASS        |
| Fonts           | TTF, OTF, WOFF2      |
| Structured data | JSON                 |
| Documents       | PDF, TXT, MD         |
| Export packages | ZIP                  |

Support depends on the actual installed processing tools and codecs.

Executable files, scripts and unsupported formats must not be accepted through ordinary media upload endpoints.

## **13. Proposed file size limits**

| File category                 | Initial maximum |
| ----------------------------- | --------------- |
| Product image                 | 25 MB           |
| Reference image               | 25 MB           |
| Brand logo                    | 10 MB           |
| Audio file                    | 200 MB          |
| Individual AI-generated scene | 500 MB          |
| Source video                  | 2 GB            |
| Subtitle file                 | 10 MB           |
| Font file                     | 20 MB           |
| Reference document            | 25 MB           |

These limits are configurable and must be tested against the laptop's storage capacity and upload architecture.

Large video uploads should use streaming instead of loading the entire file into RAM.

## **14. Asset naming and identification**

Uploaded files must not rely on their original filenames for storage identification.

For example:

Original filename:

```
GTA Funny Moments Final (1).mp4
```

Generated storage filename:

```
asset_550e8400-e29b-41d4-a716-446655440000.mp4
```

Storage key:

```
users/user-id/workspaces/workspace-id/projects/project-id/originals/asset-id.mp4
```

The original filename will remain available in MongoDB metadata.

### **Naming rules**

- Use unique asset identifiers.
- Preserve validated file extensions.
- Prevent directory traversal.
- Avoid filename collisions.
- Never trust user-provided file paths.
- Maintain consistent relative storage keys.
- Preserve original names as metadata.

## **15. Media metadata storage**

Every stored asset must have an associated database record.

```
{
  "id": "asset_001",
  "userId": "user_001",
  "workspaceId": "workspace_001",
  "projectId": "project_001",
  "name": "GTA Source Video",
  "originalFileName": "gta-gameplay.mp4",
  "assetType": "VIDEO",
  "sourceType": "UPLOAD",
  "storageProvider": "LOCAL",
  "storageKey": "users/user_001/workspaces/workspace_001/projects/project_001/originals/asset_001.mp4",
  "mimeType": "video/mp4",
  "fileSize": 524288000,
  "duration": 1800,
  "width": 1920,
  "height": 1080,
  "frameRate": 30,
  "codec": "h264",
  "checksum": "example-sha256-checksum",
  "status": "AVAILABLE"
}
```

The example contains illustrative identifiers and metadata.

File size will be stored in bytes and video duration in seconds.

## **16. Original media preservation**

Original source media must remain unchanged throughout the editing and processing lifecycle.

### **Rules**

- Never overwrite original uploaded files.
- Save processed media as separate assets.
- Preserve source references.
- Allow users to regenerate derived assets.
- Prevent accidental deletion of required source files.
- Maintain relationships between original and generated media.

This supports Clipflow's non-destructive editing architecture.

## **17. AI-generated asset storage**

Every AI generation attempt should maintain references to its input and output assets.

| Asset              | Stored information                       |
| ------------------ | ---------------------------------------- |
| Character image    | Character reference and generation ID    |
| Product image      | Product reference and generation ID      |
| Generated scene    | Scene ID and provider                    |
| Voiceover          | Script and voice configuration reference |
| Animation          | Template and generation configuration    |
| Regenerated scene  | Previous version reference               |
| Reference analysis | Analysis output and source reference     |

For manually generated Google Flow or Adobe Firefly videos, the user imports the completed file into Clipflow.

Clipflow then validates the media, stores it and connects it to the appropriate storyboard scene.

## **18. Asset version management**

Users must be able to regenerate assets without losing previously approved versions.

```
generated/
└── videos/
    └── scene-001/
        ├── version-001.mp4
        ├── version-002.mp4
        └── version-003.mp4
```

| Version   | Status       |
| --------- | ------------ |
| Version 1 | Rejected     |
| Version 2 | Approved     |
| Version 3 | Under review |

Each version should have an independent asset record.

The storyboard scene references the currently selected version. Older versions can be deleted after dependency checks and user confirmation.

## **19. Proxy media architecture**

High-resolution media can consume significant CPU, RAM and storage resources during editing.

Proxy files are lightweight copies of original videos.

| Property             | Original video  | Proxy video         |
| -------------------- | --------------- | ------------------- |
| Resolution           | 1080p or 4K     | 360p or 480p        |
| Quality              | High            | Reduced             |
| File size            | Large           | Smaller             |
| Purpose              | Final rendering | Editing and preview |
| Required permanently | Yes             | No                  |

### **Proxy workflow**

The final video must be rendered using original high-quality media, not low-resolution proxies.

## **20. Thumbnail and preview storage**

Clipflow will generate lightweight visual previews for media browsing.

| Preview type     | Proposed configuration           |
| ---------------- | -------------------------------- |
| Image thumbnail  | WebP or JPEG                     |
| Video thumbnail  | Extracted representative frame   |
| Project cover    | User-selected or generated image |
| Timeline preview | Low-resolution video             |
| Scene preview    | Individual scene video           |
| Audio preview    | Audio playback or waveform data  |

Thumbnails and proxies should be cached and reused rather than regenerated every time the user opens a project.

## **21. Video streaming architecture**

The native video editor and asset library require media playback without downloading entire files first.

The storage API should support HTTP Range requests.

```
GET /api/assets/asset-id/content
```

Example request:

```
Range: bytes=0-1048575
```

The server returns the requested portion of the video with the appropriate HTTP `206 Partial Content` response.

### **Streaming requirements**

- Authenticate media requests.
- Verify asset ownership.
- Support seeking within videos.
- Stream files in chunks.
- Avoid loading complete videos into memory.
- Return correct content types.
- Handle interrupted connections.
- Prevent unauthorized direct file access.

## **22. Temporary storage management**

FFmpeg, Whisper and rendering tools may generate intermediate files.

Examples include extracted audio, individual frames, temporary clips, incomplete renders and intermediate composition files.

Temporary files should be organized by job ID.

```
temporary/
└── job-id/
    ├── extracted-audio.wav
    ├── frames/
    ├── intermediate-video.mp4
    └── partial-render.mp4
```

### **Temporary storage rules**

- Active job files must never be automatically deleted.
- Completed jobs should release unnecessary intermediate files.
- Failed jobs may retain recoverable files temporarily.
- Cancelled jobs should remove unusable partial outputs.
- Cleanup must verify that files are not referenced by active jobs.
- Temporary files must not become permanent assets without validation.

## **23. Storage retention policy**

| Asset category                | Proposed retention                 |
| ----------------------------- | ---------------------------------- |
| Original media                | Until user deletion                |
| Approved AI-generated assets  | Until user deletion                |
| Final exports                 | Until user deletion                |
| Brand assets                  | Until user deletion                |
| Transcripts                   | Until associated resource deletion |
| Rejected generation versions  | Until manual cleanup               |
| Temporary processing files    | 24–72 hours after job completion   |
| Cached previews               | 7 days of inactivity               |
| Proxy files                   | 30 days of inactivity              |
| Failed job intermediate files | Up to 72 hours                     |
| Incomplete uploads            | 24 hours                           |
| Local operational logs        | 30 days                            |

Retention periods are configurable starting defaults.

The system must not automatically delete important original media or final exports merely because storage is running low.

## **24. Storage capacity management**

Video processing can consume considerably more storage than the final exported video.

## **Clipflow storage estimator**

Adjust the assumptions to estimate local storage requirements.

Number of projects

**10**

Source media per project

**500 MB**

Generated assets per project

**200 MB**

Exports per project

**100 MB**

Temporary files per project

**300 MB**

Estimated combined storage

# **11.0 GB**

Original media

5.0 GB

Generated assets

2.0 GB

Exports

1.0 GB

Temporary files

3.0 GB

With 30% additional headroom

**14.3 GB**

Illustrative estimate. Actual storage depends on bitrate, duration, resolution, processing stages and cleanup frequency.

### **Recommended initial storage allocation**

| Category                  | Suggested allocation |
| ------------------------- | -------------------- |
| Original media            | 30 GB                |
| AI-generated assets       | 20 GB                |
| Final exports             | 20 GB                |
| Temporary processing      | 20 GB                |
| Proxies and previews      | 5 GB                 |
| Brand and reusable assets | 5 GB                 |
| Total working allocation  | 100 GB               |

A 100 GB working allocation is a planning recommendation, not a mandatory minimum. Backups and operating-system free space should be considered separately.

## **25. Storage monitoring dashboard**

The application should provide a dedicated storage management interface.

## **Storage Management**

Proposed UI

Workspace storage usage

# **42.5 GB**

/ 100 GB allocated

Original media

**18 GB**

AI-generated assets

**10 GB**

Final exports

**7.5 GB**

Temporary files

**5 GB**

Proxies and previews

**2 GB**

Available allocation

## **57.5 GB**

Temporary storage

## **5 GB**

All displayed values are illustrative, not actual laptop storage readings.

### **Dashboard features**

- Total storage usage.
- Available disk space.
- Storage usage by workspace.
- Storage usage by project.
- Largest media files.
- Temporary file usage.
- Duplicate asset detection.
- Cleanup recommendations.
- Missing file detection.
- Backup status.

## **26. Storage alerts and limits**

| Condition                    | System behavior               |
| ---------------------------- | ----------------------------- |
| 70% of allocation used       | Informational notification    |
| 85% used                     | Storage warning               |
| 95% used                     | Restrict new heavy operations |
| Insufficient free disk space | Block unsafe processing       |
| Missing media file           | Mark asset unavailable        |
| Backup failure               | Notify user                   |
| Temporary storage excessive  | Recommend cleanup             |

Before starting a rendering or transcription job, the worker should estimate required temporary storage.

The system should stop accepting heavy jobs if there is insufficient space to complete them safely.

## **27. Duplicate file prevention**

Users may upload the same media multiple times.

Clipflow should calculate a SHA-256 checksum to identify identical file content.

### **Duplicate prevention rules**

- Compare checksums and file sizes.
- Reuse content only within authorized ownership boundaries.
- Maintain independent project references.
- Never reveal another user's asset existence.
- Delete physical files only when no valid references remain.

Advanced physical deduplication can be implemented after the basic storage system is stable.

## **28. Asset deletion architecture**

Deleting an asset from one project must not break another project that uses the same asset.

Before physical deletion, the system should check references from:

- Projects.
- Storyboards.
- Scenes.
- Timelines.
- Templates.
- AI generation records.
- Final exports.
- Active background jobs.
- Brand libraries.

### **Deletion workflow**

If file deletion fails, the asset should remain in a recoverable pending-deletion state.

## **29. Export package storage**

Each completed video should have its own export folder.

```
exports/
└── export-id/
    ├── final_video.mp4
    ├── cover.jpg
    ├── subtitles.srt
    ├── subtitles.vtt
    ├── transcript.json
    ├── caption.txt
    ├── hashtags.txt
    ├── seo_keywords.txt
    └── export_metadata.json
```

Only relevant files should be generated.

Users should be able to download:

| Download option        | Contents                               |
| ---------------------- | -------------------------------------- |
| Video only             | Final MP4                              |
| Cover only             | Cover image                            |
| Subtitles              | SRT or VTT                             |
| Publishing information | Caption, hashtags and SEO              |
| Complete package       | ZIP containing available export assets |

ZIP packages should preferably be generated on demand and cleaned up after their retention period.

## **30. Cloud storage expansion**

Cloudflare R2 is proposed as the future cloud object storage provider.

| Feature                               | Local storage             | Cloudflare R2                         |
| ------------------------------------- | ------------------------- | ------------------------------------- |
| Initial software/storage subscription | Not required              | Usage-based                           |
| Internet required for media access    | No, for local files       | Yes                                   |
| Local FFmpeg processing               | Direct file access        | Download or stream required           |
| Remote media access                   | Limited                   | Supported through authorized delivery |
| Laptop shutdown availability          | Unavailable               | Cloud files remain available          |
| Storage scalability                   | Hardware dependent        | Cloud scalable                        |
| Social platform media delivery        | Requires suitable hosting | Can support authorized media URLs     |
| Multi-device access                   | Limited                   | Possible with application support     |

### **When should we introduce cloud storage?**

- When local storage becomes insufficient.
- When accessing projects from multiple devices.
- When deploying Clipflow online.
- When social publishing requires externally accessible media URLs.
- When multiple users need media access.
- When remote workers are introduced.

Cloud storage should not be purchased before these requirements become necessary.

## **31. Hybrid storage architecture**

In the future, Clipflow may combine local and cloud storage.

### **Hybrid storage strategy**

| Asset category            | Preferred location       |
| ------------------------- | ------------------------ |
| Temporary files           | Local                    |
| Extracted frames          | Local                    |
| Proxy videos              | Local                    |
| Intermediate renders      | Local                    |
| Original media            | Local or cloud           |
| Approved generated assets | Local or cloud           |
| Final exports             | Local and optional cloud |
| Publishing-ready media    | Cloud when required      |
| Backup media              | Separate backup storage  |

Instagram publishing workflows may require media to be accessible through a supported external URL. The exact requirements must be verified for the selected Meta API publishing method.

## **32. Cloud storage migration strategy**

When migrating assets from local storage to cloud storage:

1. Identify eligible assets.
2. Upload the file to cloud storage.
3. Verify uploaded file size and integrity.
4. Update the storage provider and storage key in MongoDB.
5. Test authorized access.
6. Preserve the local copy until verification succeeds.
7. Remove the local copy only when permitted by the retention policy.

Migration must be resumable and must not invalidate existing asset references.

## **33. Backup and disaster recovery**

Local-first storage introduces a risk of losing media if the laptop fails or files are accidentally deleted.

### **Backup categories**

| Data                      | Backup method                             |
| ------------------------- | ----------------------------------------- |
| MongoDB metadata          | Supported database export or backup       |
| Original videos           | External drive or approved backup storage |
| Brand assets              | Separate backup copy                      |
| Approved generated scenes | Separate backup copy                      |
| Final exports             | Separate backup copy                      |
| Storyboards and timelines | Database backup                           |
| Temporary files           | No permanent backup required              |
| Proxy files               | Regenerate when required                  |
| Source code               | GitHub                                    |
| Credentials               | Secure encrypted backup                   |

### **Proposed backup schedule**

| Backup type                   | Frequency                 |
| ----------------------------- | ------------------------- |
| Database export               | Daily                     |
| Important media backup        | Weekly                    |
| Brand asset backup            | After significant changes |
| Final export backup           | After project completion  |
| Backup integrity verification | Monthly                   |

GitHub is for source code and documentation. Large media files and private credentials must not be committed to the repository.

A backup on the same physical disk does not protect against disk failure.

## **34. Storage security architecture**

| Security risk              | Protection                                          |
| -------------------------- | --------------------------------------------------- |
| Unauthorized media access  | Authentication and ownership checks                 |
| Directory traversal        | Validated storage keys and path containment         |
| Malicious uploads          | File type and content validation                    |
| Filename collisions        | Unique asset IDs                                    |
| Storage exhaustion         | File size and capacity limits                       |
| Credential leakage         | Server-side secret management                       |
| Unauthorized cloud access  | Private buckets and authorized URLs                 |
| Accidental deletion        | Dependency checks and backups                       |
| File corruption            | Checksums and integrity validation                  |
| Unsafe remote imports      | SSRF protection and download limits                 |
| Malicious media processing | Restricted subprocess execution and resource limits |

### **Additional security rules**

- Never expose absolute local file paths through APIs.
- Never serve private assets directly from the Next.js public directory.
- Never trust file extensions alone.
- Never execute uploaded files.
- Never expose cloud storage credentials to the frontend.
- Use expiring signed URLs where supported and appropriate.
- Restrict imported media to authorized sources.
- Maintain licensing information for commercial assets.

## **35. Storage-related API endpoints**

| Method | Endpoint                       | Purpose                             |
| ------ | ------------------------------ | ----------------------------------- |
| POST   | `/api/assets/upload`           | Upload media                        |
| POST   | `/api/assets/import`           | Import authorized media             |
| GET    | `/api/assets`                  | List assets                         |
| GET    | `/api/assets/[id]`             | Retrieve metadata                   |
| GET    | `/api/assets/[id]/content`     | Stream media                        |
| GET    | `/api/assets/[id]/download`    | Download media                      |
| DELETE | `/api/assets/[id]`             | Delete eligible asset               |
| POST   | `/api/assets/[id]/thumbnail`   | Generate thumbnail                  |
| GET    | `/api/system/storage`          | Retrieve storage usage              |
| GET    | `/api/storage/usage`           | Retrieve detailed storage breakdown |
| POST   | `/api/storage/cleanup`         | Queue authorized cleanup            |
| GET    | `/api/storage/cleanup/preview` | Preview cleanup candidates          |
| GET    | `/api/exports/[id]/package`    | Download export package             |

Storage-specific endpoints extend the API architecture defined in `09_API_DESIGN.md`.

Overlapping endpoints should be consolidated during implementation.

## **36. Proposed source code structure**

```
src/
├── lib/
│   └── storage/
│       ├── storage.service.ts
│       ├── storage.types.ts
│       ├── storage.config.ts
│       ├── storage.validation.ts
│       ├── storage.utils.ts
│       └── providers/
│           ├── local.provider.ts
│           └── r2.provider.ts
│
├── modules/
│   └── assets/
│       ├── asset.service.ts
│       ├── asset.repository.ts
│       ├── asset.validation.ts
│       └── asset.types.ts
│
├── models/
│   └── Asset.ts
│
├── workers/
│   └── processors/
│       ├── storage.processor.ts
│       ├── media.processor.ts
│       └── maintenance.processor.ts
│
└── app/
    └── api/
        ├── assets/
        ├── storage/
        └── exports/
```

The R2 provider does not need to be implemented during the initial local-storage phase.

## **37. Git and repository management**

Large media files must remain outside the source code repository.

Proposed `.gitignore` additions:

```
# Private environment variables
.env
.env.local
.env.*.local

# Local media storage
clipflow-media/
media-storage/
uploads/
exports/
backups/
temporary/

# Generated media
*.mp4
*.mov
*.mkv
*.wav

# Runtime logs
logs/
*.log
```

Media exclusions should be scoped appropriately so that intentional small application assets and test fixtures are not accidentally ignored.

The existing `.gitignore` must be reviewed before applying changes.

## **38. Storage error handling**

| Error                       | Recovery strategy                     |
| --------------------------- | ------------------------------------- |
| Insufficient disk space     | Block upload or processing            |
| Corrupted file              | Reject or request replacement         |
| Missing asset               | Mark unavailable and request recovery |
| Interrupted upload          | Remove incomplete file or resume      |
| Failed thumbnail generation | Retry thumbnail job                   |
| Failed proxy generation     | Retry or use original if practical    |
| Failed render               | Preserve source assets and timeline   |
| Database write failure      | Reconcile orphaned file               |
| Cloud upload failure        | Preserve local file and retry         |
| Backup failure              | Notify user and preserve original     |
| File permission error       | Report configuration issue            |
| Duplicate upload            | Reuse eligible existing asset         |

The system must never report a file as successfully stored unless its availability has been verified.

## **39. Storage testing requirements**

| Test                             | Expected result                     |
| -------------------------------- | ----------------------------------- |
| Valid media upload               | File and metadata stored            |
| Invalid media upload             | File rejected                       |
| Large video upload               | Memory usage remains controlled     |
| Duplicate upload                 | Eligible asset reused               |
| Unauthorized download            | Access denied                       |
| Cross-workspace media access     | Access denied                       |
| Video seeking                    | Range requests work correctly       |
| Thumbnail generation             | Thumbnail available                 |
| Proxy generation                 | Lightweight preview available       |
| Asset deletion with dependencies | Physical deletion blocked           |
| Temporary cleanup                | Only eligible files removed         |
| Insufficient storage             | Unsafe operation blocked            |
| Worker interruption              | Original files preserved            |
| Missing physical file            | Asset status updated                |
| Backup restoration               | Media and metadata recovered        |
| Cloud migration                  | Existing asset references preserved |

## **40. Storage implementation priority**

| Phase          | Features                                                              |
| -------------- | --------------------------------------------------------------------- |
| Phase 1        | Local storage service, upload, metadata, download and authorization   |
| Phase 2        | Video streaming, thumbnails, FFmpeg outputs and temporary storage     |
| Phase 3        | Proxy generation, asset versioning and export packages                |
| Phase 4        | Storage dashboard, cleanup, duplicate detection and backups           |
| Phase 5        | Cloudflare R2 integration and hybrid storage                          |
| Future scaling | Remote workers, multi-device access and advanced storage optimization |

Security, ownership validation and basic storage capacity checks must be included from Phase 1.

## **41. Final decision**

Clipflow will initially use a **local-first storage architecture with centralized media management and MongoDB metadata storage**.

| Requirement                             | Final selection                             |
| --------------------------------------- | ------------------------------------------- |
| Primary media storage                   | Local file system                           |
| Metadata storage                        | MongoDB Atlas                               |
| File management                         | Node.js File System                         |
| Large file transfer                     | Node.js Streams                             |
| Media analysis                          | FFprobe                                     |
| Media processing                        | FFmpeg                                      |
| File identification                     | Unique asset IDs                            |
| Integrity verification                  | SHA-256                                     |
| Video playback                          | HTTP Range streaming                        |
| Editing performance                     | Proxy media                                 |
| Original media                          | Preserved                                   |
| Temporary storage                       | Job-based folders                           |
| Asset organization                      | User and workspace isolation                |
| Backup                                  | Separate local or external backup           |
| Future cloud storage                    | Cloudflare R2                               |
| Initial additional storage subscription | ₹0, assuming sufficient existing disk space |

**Pending validation:**

- Actual laptop storage capacity and available disk space.
- Existing asset management implementation.
- Maximum practical upload size.
- FFmpeg temporary storage requirements.
- Local backup availability.
- Cloudflare R2 pricing and publishing compatibility when required.

The 100 GB allocation, upload limits, retention periods, backup schedules and storage alert thresholds are proposed starting configurations. They have not been implemented or benchmarked. No cloud storage purchase or source code modification is required at this stage.

