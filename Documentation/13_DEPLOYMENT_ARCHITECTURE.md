# **13 — Deployment Architecture**

**Project:** Clipflow Creator Studio\
**Document:** `13_DEPLOYMENT_ARCHITECTURE.md`\
**Architecture:** Local-first hybrid deployment\
**Initial environment:** Windows laptop\
**Future environment:** Cloud application with independent media processing workers\
**Deployment strategy:** Start locally, validate functionality, and scale according to actual requirements and revenue.

## **1. Objective**

Design a reliable, secure and cost-effective deployment architecture that supports Clipflow's application, database, AI integrations, media processing, background jobs, storage and social media operations.

The deployment architecture must support:

- Local application development.
- Personal production usage.
- Frontend and backend communication.
- Persistent database connectivity.
- Independent background workers.
- Local video processing.
- AI provider integrations.
- Scheduled campaign synchronization.
- Scheduled social media publishing.
- Media storage and backups.
- Application monitoring.
- Future cloud deployment.
- Future multi-user scalability.

The initial objective is to make Clipflow functional on existing hardware without purchasing unnecessary hosting services.

## **2. Deployment principles**

| Principle              | Description                                        |
| ---------------------- | -------------------------------------------------- |
| Local-first            | Run application and media processing locally       |
| Cost-effective         | Avoid unnecessary infrastructure expenses          |
| Modular deployment     | Separate application and worker processes          |
| Persistent data        | Preserve application data across restarts          |
| Secure configuration   | Protect credentials and private resources          |
| Independent processing | Long-running jobs must not block web requests      |
| Recoverability         | Resume interrupted operations safely               |
| Environment separation | Separate development and production configurations |
| Scalability            | Support future infrastructure expansion            |
| Observability          | Monitor actual application and worker health       |

## **3. Initial deployment technology stack**

| Component             | Technology                    | Deployment location |
| --------------------- | ----------------------------- | ------------------- |
| Frontend              | React 19 + Next.js 16         | Local laptop        |
| Backend               | Next.js Route Handlers        | Local laptop        |
| Runtime               | Node.js                       | Local laptop        |
| Database              | MongoDB Atlas                 | Cloud               |
| Database management   | MongoDB Compass               | Local laptop        |
| Background queue      | MongoDB                       | Cloud database      |
| Background workers    | Node.js                       | Local laptop        |
| Video processing      | FFmpeg                        | Local laptop        |
| Media inspection      | FFprobe                       | Local laptop        |
| Transcription         | Whisper                       | Local laptop        |
| Python runtime        | Python                        | Local laptop        |
| Motion graphics       | Remotion                      | Local laptop        |
| Media storage         | Local file system             | Local laptop        |
| AI intelligence       | GPT and Gemini                | External providers  |
| Video generation      | Google Flow and Adobe Firefly | External providers  |
| Version control       | GitHub                        | Cloud               |
| Future object storage | Cloudflare R2                 | Cloud               |

## **4. Deployment model selection**

Three deployment models were considered.

| Factor                    | Local deployment           | Cloud deployment         | Hybrid deployment          |
| ------------------------- | -------------------------- | ------------------------ | -------------------------- |
| Initial additional cost   | Low                        | Potentially higher       | Low                        |
| Local media processing    | Supported                  | Requires suitable server | Supported                  |
| Remote access             | Limited                    | Supported                | Partially supported        |
| Continuous availability   | Laptop dependent           | Possible                 | Component dependent        |
| Large media storage       | Existing disk              | Cloud storage            | Both                       |
| Scheduled operations      | Laptop must remain running | Supported                | Depends on worker location |
| Infrastructure complexity | Low                        | Higher                   | Moderate                   |
| Future scalability        | Limited                    | High                     | High                       |

### **Final selection**

Clipflow will initially use a hybrid architecture consisting of:

- Locally hosted Next.js application.
- Locally running background workers.
- Cloud-hosted MongoDB Atlas database.
- Local media storage.
- External AI and social media providers.

This provides the benefits of local processing while preserving structured application data in a cloud database.

## **5. High-level deployment architecture**

MongoDB Atlas stores application records and persistent job information. The laptop performs actual media processing.

## **6. Application deployment components**

| Component           | Responsibility                            |
| ------------------- | ----------------------------------------- |
| Web application     | User interface and application APIs       |
| Background worker   | Long-running media and AI operations      |
| Scheduler           | Identify and enqueue scheduled operations |
| Database            | Persistent structured application data    |
| Storage service     | Manage local and future cloud media       |
| AI orchestrator     | Coordinate external AI providers          |
| Integration service | Communicate with external platforms       |
| Monitoring service  | Track application and worker health       |

These components are logical responsibilities. They do not require separate microservices during the initial implementation.

## **7. Development environments**

Clipflow should maintain three logical environments.

### **7.1 Development environment**

Used for:

- Feature development.
- Backend learning.
- UI improvements.
- API testing.
- Debugging.
- Database schema development.
- Integration experiments.

Proposed URL:

```
http://localhost:3000
```

Development must use test data and restricted credentials wherever possible.

### **7.2 Local production environment**

Used for actual personal content production.

Features include:

- Optimized Next.js production build.
- Persistent background workers.
- Actual brand workspaces.
- Real media assets.
- Approved provider integrations.
- Financial tracking.
- Scheduled publishing.

Proposed URL:

```
http://localhost:3001
```

Development and local production should use separate databases and storage directories.

### **7.3 Cloud production environment**

Future environment used when Clipflow requires:

- Continuous availability.
- Remote access.
- Multiple users.
- Public OAuth callbacks.
- External webhook reception.
- Cloud media delivery.
- Independent background processing.

Cloud deployment is not required to begin local development.

## **8. Environment separation**

| Resource         | Development           | Local production          | Future cloud production       |
| ---------------- | --------------------- | ------------------------- | ----------------------------- |
| Application port | 3000                  | 3001                      | HTTPS                         |
| Database         | clipflow_dev          | clipflow_prod             | Dedicated production database |
| Media storage    | Development folder    | Production folder         | Cloud/hybrid storage          |
| API credentials  | Restricted/test       | Approved real credentials | Managed production secrets    |
| Publishing       | Disabled or test mode | User-approved             | User-approved                 |
| Paid generation  | Disabled by default   | Budget-controlled         | Budget-controlled             |
| Logging          | Detailed              | Operational               | Centralized                   |
| Test data        | Allowed               | Restricted                | Restricted                    |

The actual database names and ports must be reconciled with the existing project configuration.

## **9. Local machine requirements**

Clipflow's local processing capabilities depend on available hardware.

| Component                | Suggested starting configuration                     |
| ------------------------ | ---------------------------------------------------- |
| Operating system         | Windows 10 or Windows 11                             |
| Processor                | Modern 64-bit multi-core CPU                         |
| RAM                      | 8 GB for basic development; 16 GB preferred          |
| Storage                  | SSD preferred                                        |
| Working media allocation | Approximately 100 GB where available                 |
| Internet                 | Stable broadband connection                          |
| GPU                      | Optional for initial workflows                       |
| Power supply             | Reliable continuous power                            |
| Node.js                  | Supported LTS version compatible with Next.js        |
| Python                   | Version compatible with Whisper and its dependencies |

### **Hardware validation**

Before enabling high-volume video processing, inspect:

- Processor model.
- Installed RAM.
- Available SSD space.
- GPU availability.
- CPU temperature during rendering.
- Transcription processing speed.
- Video rendering speed.
- Battery and power stability.

The existing laptop has not yet been benchmarked for Clipflow's complete media pipeline.

## **10. Local software dependencies**

| Software                    | Purpose                          | Requirement                      |
| --------------------------- | -------------------------------- | -------------------------------- |
| Node.js                     | Application and worker runtime   | Required                         |
| npm                         | JavaScript dependency management | Required                         |
| Git                         | Source control                   | Required                         |
| MongoDB Compass             | Database inspection              | Recommended                      |
| Python                      | Whisper execution                | Required for local Whisper       |
| FFmpeg                      | Video and audio processing       | Required                         |
| FFprobe                     | Media metadata extraction        | Required                         |
| Whisper                     | Speech transcription             | Required for local transcription |
| Chromium-compatible browser | Application usage and rendering  | Required                         |
| Adobe applications          | Advanced manual editing          | Optional                         |
| Antigravity IDE             | Development assistance           | Existing tool                    |

Docker, Kubernetes and dedicated cloud servers are not required initially.

## **11. Proposed local directory structure**

```
D:/Clipflow/
├── application/
│   ├── src/
│   ├── Documentation/
│   ├── docs/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── .env.local
│
├── media/
│   ├── development/
│   └── production/
│
├── runtime/
│   ├── logs/
│   ├── temporary/
│   └── worker-state/
│
├── tools/
│   ├── ffmpeg/
│   └── python-environment/
│
└── backups/
    ├── database/
    └── media/
```

This is an illustrative deployment directory structure.

The existing Git repository does not need to be relocated. Media, runtime and backup directories can be configured independently.

## **12. Application process architecture**

Initially, Clipflow should run with two primary application processes.

| Process             | Responsibility                                       |
| ------------------- | ---------------------------------------------------- |
| Next.js application | Frontend, APIs, authentication and application logic |
| Node.js worker      | Queue processing, scheduling and media operations    |

The scheduler can initially run inside the worker process.

Separating the worker from the web application prevents long-running processing tasks from blocking ordinary API requests.

## **13. Why background workers must run separately**

Video processing operations may take several minutes or longer.

Examples include:

| Operation                 | Processing characteristics      |
| ------------------------- | ------------------------------- |
| Long video transcription  | CPU/GPU intensive               |
| Bulk clip extraction      | Multiple processing operations  |
| AI video generation       | External asynchronous request   |
| Motion graphics rendering | CPU and memory intensive        |
| Final video rendering     | CPU/GPU intensive               |
| Campaign synchronization  | External network requests       |
| Social publishing         | Asynchronous external operation |

These operations should not execute directly inside normal Next.js API requests.

### **Correct execution flow**

```
User requests video generation
        ↓
Next.js validates request
        ↓
Create persistent MongoDB job
        ↓
Return job ID to frontend
        ↓
Worker claims job
        ↓
Worker processes operation
        ↓
Worker updates progress
        ↓
Frontend retrieves progress
        ↓
Completed output becomes available
```

The frontend remains responsive while the background worker performs the operation.

## **14. Development startup commands**

The existing Next.js application should continue using its development command.

```
npm run dev
```

A separate worker command should be introduced during implementation.

```
npm run worker:dev
```

A combined development command may be added later.

```
npm run dev:all
```

### **Proposed command responsibilities**

| Command               | Responsibility                     |
| --------------------- | ---------------------------------- |
| `npm run dev`         | Start Next.js development server   |
| `npm run worker:dev`  | Start development worker           |
| `npm run dev:all`     | Start application and worker       |
| `npm run build`       | Create optimized application build |
| `npm run start`       | Start production application       |
| `npm run worker`      | Start production worker            |
| `npm run typecheck`   | Validate TypeScript                |
| `npm run lint`        | Run lint checks                    |
| `npm run test`        | Execute automated tests            |
| `npm run test:e2e`    | Execute end-to-end tests           |
| `npm run healthcheck` | Verify runtime dependencies        |

Only commands already defined in the existing `package.json` will work immediately. Worker, testing and health-check scripts are proposed additions.

## **15. Local production deployment**

After the required features are implemented and tested, Clipflow can run locally in production mode.

### **Deployment workflow**

```
Retrieve approved source code
        ↓
Install locked dependencies
        ↓
Validate environment configuration
        ↓
Verify database connectivity
        ↓
Run TypeScript checks
        ↓
Run lint and automated tests
        ↓
Create production build
        ↓
Start Next.js production process
        ↓
Start background worker
        ↓
Verify system health
        ↓
Begin personal production usage
```

Typical application commands:

```
npm ci
npm run build
npm run start
```

The background worker must have its own verified production startup command.

## **16. Process management**

Initially, the application and worker can run in separate terminal windows.

| Stage                     | Process management approach                        |
| ------------------------- | -------------------------------------------------- |
| Development               | Separate terminal windows                          |
| Integrated development    | Combined npm script                                |
| Personal production       | Controlled startup scripts                         |
| Windows automatic startup | Windows Task Scheduler or suitable service manager |
| Future Linux deployment   | systemd, containers or suitable process manager    |
| Cloud scaling             | Managed application and worker services            |

### **Process management requirements**

- Restart failed processes safely.
- Prevent uncontrolled restart loops.
- Preserve operational logs.
- Support graceful shutdown.
- Prevent duplicate scheduler execution.
- Detect unavailable workers.
- Preserve queued jobs.
- Avoid restarting jobs that may have already incurred external charges.

Automatic startup should only be enabled after the application and worker are stable.

## **17. Windows startup architecture**

For personal production usage, Clipflow may eventually start automatically when the laptop starts or the user logs in.

Proposed startup sequence:

```
Windows Startup
        ↓
Network Availability Check
        ↓
MongoDB Connectivity Check
        ↓
Environment Configuration Validation
        ↓
Start Next.js Application
        ↓
Start Background Worker
        ↓
Recover Interrupted Jobs
        ↓
Resume Eligible Scheduled Operations
```

Windows Task Scheduler is a suitable initial option for managing startup.

The startup configuration must not expose Clipflow publicly or execute unapproved paid operations.

## **18. Laptop shutdown and sleep behavior**

Local deployment introduces an important limitation: processing stops when the laptop is unavailable.

| Laptop condition      | Application behavior                                           |
| --------------------- | -------------------------------------------------------------- |
| Powered on and awake  | Application and workers can operate                            |
| Screen locked         | Processing can continue if configured                          |
| Screen turned off     | Processing can continue                                        |
| Sleep mode            | Processing generally pauses                                    |
| Hibernate             | Processing stops                                               |
| Shut down             | Application and workers unavailable                            |
| Internet disconnected | Local processing may continue; cloud-dependent operations fail |
| Unexpected power loss | Active operations may be interrupted                           |

### **Important limitation**

MongoDB Atlas remains cloud-hosted, but it does not execute Clipflow's local workers.

If the laptop is switched off:

- Scheduled campaign updates cannot execute locally.
- Scheduled publishing cannot execute locally.
- Local video rendering stops.
- Local transcription stops.
- Local AI orchestration stops.
- Locally stored media becomes unavailable.

Persistent job records allow eligible operations to resume when the application restarts.

## **19. Background job recovery**

Clipflow must recover interrupted operations safely.

### **Recovery requirements**

- Detect expired worker leases.
- Preserve completed job outputs.
- Reuse validated intermediate files.
- Avoid duplicate paid AI requests.
- Avoid duplicate social media publishing.
- Resume eligible processing jobs.
- Mark unrecoverable jobs as failed.
- Notify the user when manual intervention is required.

Detailed job recovery rules are defined in `07_BACKGROUND_JOB_ARCHITECTURE.md`.

## **20. Scheduled operation architecture**

Clipflow will use a persistent scheduler rather than relying only on in-memory timers.

| Operation                             | Proposed frequency |
| ------------------------------------- | ------------------ |
| Campaign discovery                    | Daily              |
| Affiliate opportunity synchronization | Daily              |
| Trend research synchronization        | Daily              |
| YouTube analytics                     | Every 6 hours      |
| Instagram analytics                   | Every 6 hours      |
| Scheduled publishing                  | User-selected time |
| Temporary file cleanup                | Daily              |
| Worker recovery check                 | Every minute       |
| Storage capacity check                | Hourly             |
| Database backup                       | Daily              |
| Media backup                          | Weekly             |
| Provider health checks                | Periodically       |

The frequencies above are proposed defaults and must respect external API quotas.

Scheduled jobs should store their next execution time in MongoDB.

## **21. Missed schedule handling**

When the laptop is unavailable during a scheduled operation, Clipflow must follow a defined recovery policy.

| Missed operation          | Recovery behavior                              |
| ------------------------- | ---------------------------------------------- |
| Campaign synchronization  | Execute after restart                          |
| Affiliate synchronization | Execute after restart                          |
| Trend research            | Refresh latest available information           |
| Analytics synchronization | Retrieve missing supported data                |
| Temporary cleanup         | Execute when safe                              |
| Database backup           | Execute after restart                          |
| Video processing          | Resume or retry when eligible                  |
| Paid generation           | Revalidate approval and budget                 |
| Social media publishing   | Apply user-configured missed publishing policy |

### **Publishing recovery policy**

Missed publishing jobs should support:

- Publish when the system becomes available.
- Request fresh user confirmation.
- Reschedule for the next selected time.
- Cancel the missed publication.

The recommended default is to request confirmation when a publishing deadline has materially passed.

## **22. Time zone management**

Clipflow should store timestamps in UTC.

The application should display dates and schedules according to the user's configured time zone.

Initial time zone:

```
Asia/Kolkata
```

Future brand workspaces may target different audiences.

| Workspace              | Example audience time zone |
| ---------------------- | -------------------------- |
| Indian fashion content | Asia/Kolkata               |
| US gaming content      | America/New_York           |
| US affiliate content   | America/Los_Angeles        |
| International content  | User-selected              |

Audience time zones must remain separate from the user's local display time zone.

The scheduler must correctly handle daylight saving changes where applicable.

## **23. MongoDB Atlas deployment**

MongoDB Atlas will initially remain the primary database provider.

### **Database responsibilities**

- User accounts.
- Authentication sessions.
- Workspaces.
- Campaigns.
- Projects.
- Storyboards.
- Media metadata.
- Background jobs.
- Publishing schedules.
- Analytics.
- AI usage.
- Expenses.
- Earnings.
- Audit records.

### **Database deployment requirements**

| Requirement           | Implementation                           |
| --------------------- | ---------------------------------------- |
| Connection            | Secure MongoDB connection URI            |
| Authentication        | Dedicated database user                  |
| Network access        | Restricted IP access                     |
| Encryption in transit | TLS                                      |
| Connection management | Reusable connection pools                |
| Schema management     | Mongoose models                          |
| Performance           | Appropriate indexes                      |
| Backup                | Supported exports or backup features     |
| Environment isolation | Separate development and production data |
| Monitoring            | Database connection and query health     |

MongoDB Compass is a database management interface. It does not need to remain open for Clipflow to communicate with MongoDB Atlas.

## **24. Database connection lifecycle**

### **Connection management rules**

- Reuse database connections.
- Avoid opening a new connection for every request.
- Configure connection timeouts.
- Apply controlled retry backoff.
- Report actual connection health.
- Do not accept database-dependent operations when connectivity is unavailable.
- Do not silently replace database data with fabricated static data.

The existing MongoDB connectivity problem must be resolved before full production usage.

## **25. Environment variable architecture**

Configuration should be managed centrally through environment variables.

```
# Application
NODE_ENV=development
APP_URL=http://localhost:3000
APP_TIMEZONE=Asia/Kolkata

# Database
MONGODB_URI=

# Authentication
JWT_SECRET=
SESSION_SECRET=
TOKEN_ENCRYPTION_KEY=

# Storage
STORAGE_PROVIDER=local
LOCAL_STORAGE_ROOT=
TEMP_STORAGE_ROOT=
BACKUP_STORAGE_ROOT=

# Background worker
WORKER_ENABLED=true
WORKER_CONCURRENCY=1
WORKER_HEARTBEAT_INTERVAL_MS=15000
WORKER_LEASE_DURATION_MS=90000

# Scheduler
SCHEDULER_ENABLED=true

# Media processing
FFMPEG_PATH=
FFPROBE_PATH=
PYTHON_PATH=
WHISPER_MODEL=base

# AI providers
OPENAI_API_KEY=
GEMINI_API_KEY=
ELEVENLABS_API_KEY=
FAL_API_KEY=
KLAP_API_KEY=

# YouTube
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
YOUTUBE_API_KEY=

# Instagram
META_APP_ID=
META_APP_SECRET=

# Campaigns and affiliates
WHOP_API_KEY=
CUELINKS_API_KEY=

# Stock media
PEXELS_API_KEY=

# Cost controls
PAID_GENERATION_ENABLED=false
MONTHLY_API_BUDGET_INR=0

# Publishing
PUBLISHING_ENABLED=false

# Logging
LOG_LEVEL=info
```

These are proposed configuration names, not a replacement for the existing environment file.

## **26. Configuration validation**

Clipflow must validate required configuration during startup.

| Missing configuration    | Required behavior                           |
| ------------------------ | ------------------------------------------- |
| MongoDB URI              | Block database-dependent startup            |
| JWT secret               | Fail securely                               |
| Storage directory        | Validate or create approved directory       |
| FFmpeg                   | Disable dependent processing features       |
| Whisper                  | Disable local transcription                 |
| OpenAI API key           | Disable OpenAI API integration              |
| Gemini API key           | Disable Gemini API integration              |
| Social OAuth credentials | Disable affected integration                |
| Whop credentials         | Disable automated Whop synchronization      |
| Cuelinks credentials     | Disable automated affiliate synchronization |
| Paid generation budget   | Keep paid generation disabled               |

Optional integration failures should not prevent unrelated features from working.

## **27. Feature availability and feature flags**

Clipflow should support feature flags to control incomplete or unavailable integrations.

| Feature flag             | Initial proposed status                |
| ------------------------ | -------------------------------------- |
| Authentication           | Enabled after security verification    |
| Campaign management      | Enabled after verification             |
| Project management       | Enabled after verification             |
| Local media upload       | Enabled after implementation           |
| Local clipping           | Enabled after implementation           |
| Whisper transcription    | Enabled after installation and testing |
| Remotion rendering       | Enabled after validation               |
| OpenAI API generation    | Disabled until configured              |
| Gemini API generation    | Disabled until verified                |
| Paid video generation    | Disabled                               |
| ElevenLabs integration   | Disabled                               |
| Instagram publishing     | Disabled until authorized              |
| YouTube publishing       | Disabled until authorized              |
| Cuelinks synchronization | Disabled until approved                |
| Cloud storage            | Disabled                               |
| Cloud rendering          | Disabled                               |

Unavailable features should display meaningful configuration or availability messages rather than simulated functionality.

## **28. AI provider deployment architecture**

External AI providers will be accessed through server-side adapters.

### **Deployment modes**

| Mode                       | Execution location         |
| -------------------------- | -------------------------- |
| Local AI processing        | Laptop                     |
| Direct AI API              | External provider          |
| Manual assisted generation | Provider application       |
| AI result import           | Local Clipflow application |
| Paid automated generation  | Authorized external API    |

Existing consumer subscriptions must not be treated as automatically available programmatic APIs.

## **29. Manual AI generation deployment**

Google Flow and Adobe Firefly may initially operate outside Clipflow's automated backend.

### **Workflow**

```
Create project in Clipflow
        ↓
Generate script and storyboard
        ↓
Prepare scene-level prompts
        ↓
Open supported generation application
        ↓
Generate media using existing entitlement
        ↓
Export generated media
        ↓
Import media into Clipflow
        ↓
Validate and connect media to scene
        ↓
Continue editing and rendering
```

This approach allows Clipflow to support AI video production without requiring every generation provider to have a working API integration.

Manual generation jobs should remain in an awaiting-import state rather than occupying a background worker.

## **30. FFmpeg deployment architecture**

FFmpeg will be installed as a local processing dependency.

### **Responsibilities**

- Video clipping.
- Audio extraction.
- Video resizing.
- Aspect ratio conversion.
- Video concatenation.
- Audio mixing.
- Subtitle rendering.
- Proxy generation.
- Thumbnail extraction.
- Final encoding.

### **Deployment requirements**

- Configure the executable path.
- Verify the installed version.
- Verify required codecs.
- Restrict unsafe command execution.
- Use controlled input and output directories.
- Apply process timeouts.
- Monitor disk space.
- Limit concurrent processing.
- Capture sanitized execution logs.

FFmpeg should run through background workers rather than directly through the browser.

## **31. Whisper deployment architecture**

Whisper will initially run locally through a dedicated Python environment.

### **Initial configuration**

| Setting             | Proposed selection                       |
| ------------------- | ---------------------------------------- |
| Execution mode      | Local                                    |
| Model               | Base                                     |
| Runtime             | Python                                   |
| Device              | CPU initially, GPU if supported          |
| Language            | Automatic or user-selected               |
| Output              | Structured transcript and subtitle files |
| Additional API cost | ₹0                                       |

Whisper model files should be downloaded once and reused.

Actual processing speed and transcription accuracy must be tested using representative source videos.

## **32. Remotion deployment architecture**

Remotion will support programmatic video composition and motion graphics.

### **Responsibilities**

- Animated subtitles.
- Text overlays.
- Brand animations.
- Motion graphics.
- Scene composition.
- Video templates.
- Programmatic rendering.

### **Deployment requirements**

- Install compatible dependencies.
- Configure the rendering environment.
- Verify browser compatibility.
- Validate fonts and media assets.
- Limit rendering concurrency.
- Use original media for final exports.
- Monitor memory consumption.
- Confirm applicable licensing requirements.

Remotion should not introduce a separate paid rendering infrastructure during the initial deployment.

## **33. Media storage deployment**

Local media storage will remain outside the Next.js public directory.

### **Storage deployment requirements**

- Configurable storage root.
- Separate development and production folders.
- Workspace-level organization.
- Authorized media streaming.
- Disk capacity monitoring.
- Temporary file cleanup.
- Backup support.
- Original media preservation.
- Future provider migration.

Detailed storage rules are defined in `10_STORAGE_ARCHITECTURE.md`.

## **34. Social media integration deployment**

Clipflow will integrate Instagram and YouTube using supported official APIs.

| Platform  | Integration requirements                                                                  |
| --------- | ----------------------------------------------------------------------------------------- |
| YouTube   | Google project, OAuth credentials, required scopes and channel authorization              |
| Instagram | Meta application, eligible account configuration, supported permissions and authorization |
| Whop      | Approved credentials and supported API endpoints                                          |
| Cuelinks  | Account approval and API access                                                           |

### **Local deployment considerations**

Some integrations may require:

- Registered OAuth redirect URLs.
- HTTPS callback endpoints.
- Publicly reachable webhook endpoints.
- Application verification.
- Platform-specific approval.
- Externally accessible media URLs.
- Production permissions.

These requirements vary by provider and integration method.

Manual publishing and manual synchronization should remain available when automated access is unavailable.

## **35. OAuth callback architecture**

Localhost OAuth callbacks should be used only when explicitly supported by the selected provider.

If a public HTTPS callback is required, Clipflow may introduce a limited cloud integration service or a securely configured temporary development tunnel.

## **36. Public webhook architecture**

Some external services may send asynchronous notifications.

Examples include:

- AI generation completion.
- Publishing status updates.
- Affiliate transaction updates.
- Campaign events.
- Provider processing failures.

A purely local application cannot reliably receive public webhooks without an externally reachable endpoint.

### **Initial strategy**

| Integration type          | Initial approach                               |
| ------------------------- | ---------------------------------------------- |
| Provider status checks    | Authorized polling                             |
| AI generation completion  | Polling or manual import                       |
| Publishing verification   | Supported status APIs                          |
| Affiliate synchronization | Scheduled API requests                         |
| Mandatory webhooks        | Introduce secure public endpoint when required |

Webhook-based infrastructure should not be purchased until an enabled integration requires it.

## **37. Instagram media delivery considerations**

Locally stored video files cannot automatically be accessed by external social media servers.

Depending on the selected Instagram publishing API, Clipflow may require:

- A supported direct media upload mechanism.
- An externally accessible media URL.
- Temporary cloud object storage.
- A valid HTTPS media delivery endpoint.

### **Proposed publishing workflow**

```
Final video export
        ↓
Validate platform requirements
        ↓
User approves publishing
        ↓
Determine supported upload method
        ↓
Upload directly or stage media securely
        ↓
Create publishing request
        ↓
Verify processing status
        ↓
Complete publication
        ↓
Record platform post ID
        ↓
Clean up temporary delivery assets
```

The exact Instagram publishing method must be verified against the application's approved Meta API capabilities.

## **38. Internet dependency architecture**

Clipflow is local-first, but it is not fully offline.

| Feature                        | Internet required?                       |
| ------------------------------ | ---------------------------------------- |
| Local FFmpeg processing        | No                                       |
| Local Whisper execution        | No, after required files are installed   |
| Local Remotion rendering       | No, if dependencies and assets are local |
| Local file management          | No                                       |
| MongoDB Atlas access           | Yes                                      |
| Authentication using Atlas     | Yes                                      |
| OpenAI API                     | Yes                                      |
| Gemini API                     | Yes                                      |
| Google Flow                    | Yes                                      |
| Adobe Firefly cloud generation | Yes                                      |
| Campaign synchronization       | Yes                                      |
| Affiliate synchronization      | Yes                                      |
| Social publishing              | Yes                                      |
| GitHub synchronization         | Yes                                      |

### **Offline behavior**

If the internet connection is interrupted:

- Preserve local files.
- Preserve validated intermediate media.
- Stop operations that require database or provider connectivity.
- Avoid duplicate external requests.
- Reconcile interrupted jobs after connectivity returns.
- Display the actual connection status.

Fully offline application operation would require additional local database and synchronization architecture, which is outside the initial scope.

## **39. System health monitoring**

Clipflow should provide a centralized system health endpoint.

Proposed endpoint:

```
GET /api/system/health
```

### **Health checks**

| Component           | Health information                        |
| ------------------- | ----------------------------------------- |
| Next.js application | Running status                            |
| MongoDB Atlas       | Connection status                         |
| Background worker   | Heartbeat and availability                |
| Scheduler           | Last successful execution                 |
| FFmpeg              | Installation and version                  |
| FFprobe             | Installation and version                  |
| Whisper             | Runtime and model availability            |
| Remotion            | Rendering dependency availability         |
| Local storage       | Availability and free space               |
| AI providers        | Configuration and known connection status |
| Social integrations | Authorization status                      |
| Backup service      | Last successful backup                    |

### **Example response**

```
{
  "status": "DEGRADED",
  "services": {
    "application": "HEALTHY",
    "database": "HEALTHY",
    "worker": "HEALTHY",
    "storage": "HEALTHY",
    "ffmpeg": "HEALTHY",
    "whisper": "NOT_CONFIGURED",
    "openai": "NOT_CONFIGURED",
    "gemini": "NOT_VERIFIED",
    "instagram": "NOT_CONNECTED"
  }
}
```

This is an illustrative response, not the actual current Clipflow system status.

Public health responses must not expose private infrastructure information or credentials.

## **40. System monitoring dashboard**

The proposed System Settings page should display:

| Section         | Information                         |
| --------------- | ----------------------------------- |
| Application     | Version and environment             |
| Database        | Connection status                   |
| Workers         | Active workers and running jobs     |
| Queue           | Pending, completed and failed jobs  |
| Storage         | Used and available disk space       |
| Media tools     | Installed versions and availability |
| AI integrations | Configured providers                |
| Social accounts | Connection and authorization status |
| Scheduler       | Upcoming and missed operations      |
| Costs           | Available budget and usage          |
| Backups         | Last successful backup              |
| Logs            | Recent operational errors           |

All dashboard values must originate from actual application health checks and operational records.

## **41. Logging architecture**

Clipflow should maintain structured logs for application and worker operations.

### **Log categories**

| Category         | Purpose                                 |
| ---------------- | --------------------------------------- |
| Application logs | General application events              |
| API logs         | Request outcomes and errors             |
| Worker logs      | Background processing events            |
| Media logs       | FFmpeg and rendering outcomes           |
| AI logs          | Provider requests and outcomes          |
| Integration logs | External synchronization results        |
| Scheduler logs   | Scheduled operation history             |
| Security logs    | Authentication and authorization events |
| Financial logs   | Cost and reconciliation events          |
| Backup logs      | Backup and restoration outcomes         |

### **Log levels**

| Level | Usage                    |
| ----- | ------------------------ |
| DEBUG | Development diagnostics  |
| INFO  | Normal operations        |
| WARN  | Recoverable problems     |
| ERROR | Failed operations        |
| FATAL | Critical process failure |

Logs should include timestamps, request IDs and job IDs where appropriate.

Passwords, access tokens, OTPs and API keys must never appear in logs.

## **42. Resource management**

Local development and media processing share the same laptop resources.

### **Proposed initial concurrency**

| Operation                       | Maximum concurrent operations |
| ------------------------------- | ----------------------------- |
| Heavy FFmpeg processing         | 1                             |
| Whisper transcription           | 1                             |
| Remotion rendering              | 1                             |
| Combined heavy local processing | 1                             |
| AI network requests             | 2                             |
| External synchronization        | 2                             |
| Lightweight metadata operations | Configurable                  |
| Publishing jobs                 | Initially serialized          |

The combined heavy processing limit means FFmpeg, Whisper and Remotion should not all run intensive jobs simultaneously.

### **Resource protection**

- Monitor CPU usage.
- Monitor available RAM.
- Monitor disk space.
- Prevent excessive concurrent processing.
- Limit temporary storage.
- Queue large operations.
- Support safe cancellation.
- Avoid uncontrolled retries.
- Pause new heavy jobs when resources are insufficient.

These limits must be adjusted after hardware benchmarking.

## **43. Performance benchmarking**

Before enabling bulk production, Clipflow should measure representative workloads.

| Benchmark                     | Measurement                         |
| ----------------------------- | ----------------------------------- |
| 10-minute video transcription | Processing duration and memory      |
| 60-minute video transcription | Processing duration and CPU usage   |
| Single 30-second clip         | Extraction duration                 |
| 20 short clips                | Total batch processing time         |
| Vertical video conversion     | Processing speed                    |
| Animated subtitle rendering   | Rendering time                      |
| 30-second UGC export          | Total rendering time                |
| 1080p video export            | Output quality and processing time  |
| Proxy generation              | Storage and processing requirements |
| Concurrent application usage  | UI responsiveness                   |
| Worker interruption           | Recovery behavior                   |

Benchmark results should determine realistic production capacity.

Clipflow must not promise 20–30 completed videos per day until the workflow and hardware have been tested.

## **44. GitHub repository architecture**

GitHub will remain the central source code repository.

### **Proposed branch strategy**

```
main
├── develop
├── feature/auth-security
├── feature/storage
├── feature/background-jobs
├── feature/clipping
├── feature/ugc-studio
├── feature/ai-integration
└── feature/publishing
```

| Branch           | Purpose                      |
| ---------------- | ---------------------------- |
| main             | Verified stable application  |
| develop          | Integrated development       |
| feature branches | Individual functionality     |
| fix branches     | Bug and security fixes       |
| release branches | Optional release preparation |

For a single developer, a simpler main-plus-feature-branches workflow is also acceptable.

Existing repository history and working functionality must be preserved.

## **45. Continuous integration architecture**

GitHub Actions may be introduced to automatically verify code changes.

### **CI requirements**

- Use locked dependency versions.
- Run TypeScript validation.
- Run ESLint.
- Run automated tests.
- Verify production builds.
- Scan dependencies.
- Detect exposed secrets.
- Avoid actual paid AI generation.
- Avoid publishing real social media content.
- Use isolated test databases and mock providers.

CI verification should not automatically deploy unfinished features.

## **46. Continuous deployment strategy**

Automatic production deployment is not necessary initially.

| Stage                    | Deployment approach                          |
| ------------------------ | -------------------------------------------- |
| Current development      | Manual local startup                         |
| Stable personal usage    | Manual verified local release                |
| Mature local production  | Controlled startup and release scripts       |
| Initial cloud deployment | Manual approved deployment                   |
| Stable cloud production  | Automated deployment after successful checks |
| Future scaling           | Independent application and worker releases  |

Production deployment should remain an explicitly controlled operation until automated tests and rollback procedures are reliable.

## **47. Release management**

Clipflow should maintain versioned application releases.

Proposed versioning:

```
0.1.0 — Core foundation
0.2.0 — Media storage and background jobs
0.3.0 — Clipping studio
0.4.0 — UGC and AI video workflows
0.5.0 — Native editor and rendering
0.6.0 — Social integrations
0.7.0 — Analytics and financial management
1.0.0 — Verified stable production release
```

These versions represent proposed milestones, not current release status.

### **Release documentation**

Each release should record:

- Version number.
- Release date.
- Implemented features.
- Fixed bugs.
- Security changes.
- Database changes.
- Configuration changes.
- Known limitations.
- Verification results.
- Rollback instructions.

## **48. Database migration deployment**

MongoDB allows flexible document structures, but schema changes still require controlled migration.

### **Migration workflow**

```
Review existing database schema
        ↓
Identify required changes
        ↓
Create database backup
        ↓
Prepare migration script
        ↓
Test against development database
        ↓
Validate existing records
        ↓
Execute approved production migration
        ↓
Verify data integrity
        ↓
Record migration result
```

### **Migration requirements**

- Preserve existing projects and campaigns.
- Preserve user ownership.
- Avoid unnecessary collection duplication.
- Add required indexes carefully.
- Support old records during transitions.
- Make migration scripts repeatable where practical.
- Prevent partial migration corruption.
- Maintain recovery procedures.

Existing collections should be extended where appropriate instead of replacing the entire database.

## **49. Deployment rollback architecture**

If a new release fails, Clipflow must support controlled rollback.

| Failure                     | Recovery approach                            |
| --------------------------- | -------------------------------------------- |
| Application build failure   | Keep previous stable version                 |
| Application startup failure | Restore previous release                     |
| Worker failure              | Stop affected worker and recover jobs        |
| Database migration failure  | Apply verified recovery procedure            |
| Integration failure         | Disable affected feature                     |
| AI provider failure         | Disable provider or use approved alternative |
| Publishing failure          | Reconcile external platform state            |
| Media corruption            | Restore verified backup                      |

Rolling back source code does not automatically reverse database migrations or external operations.

Database and external provider recovery must be handled separately.

## **50. Backup deployment architecture**

Clipflow must maintain separate backups for structured data and media.

### **Backup schedule**

| Resource                     | Proposed frequency                   |
| ---------------------------- | ------------------------------------ |
| Database                     | Daily                                |
| Important media              | Weekly                               |
| Brand assets                 | After significant changes            |
| Approved AI-generated assets | After approval or project completion |
| Final exports                | After project completion             |
| Source code                  | After verified development changes   |
| Backup restoration test      | Monthly                              |

A backup on the same physical disk does not protect against complete disk failure.

## **51. Future cloud deployment architecture**

Cloud deployment should be introduced when local deployment no longer satisfies operational requirements.

This architecture allows the application to remain available remotely while expensive media processing can continue locally or move to cloud workers when necessary.

## **52. Future cloud hosting options**

| Component           | Potential deployment options                   |
| ------------------- | ---------------------------------------------- |
| Next.js application | Vercel or compatible Node.js hosting           |
| Background worker   | Railway, Render, VPS or managed worker hosting |
| Database            | MongoDB Atlas                                  |
| Object storage      | Cloudflare R2                                  |
| Scheduler           | Managed cron or persistent worker scheduler    |
| Queue               | MongoDB initially; Redis/BullMQ later          |
| Media processing    | Local worker or dedicated cloud worker         |
| GPU processing      | Specialized GPU infrastructure if required     |
| Monitoring          | Hosting logs or dedicated monitoring service   |

No final cloud hosting provider is selected at this stage.

Current pricing, execution limits, storage requirements and service availability must be evaluated before deployment.

## **53. Serverless deployment limitations**

Serverless hosting may be suitable for the Next.js application but is not automatically suitable for heavy media processing.

| Operation                | Serverless suitability                 |
| ------------------------ | -------------------------------------- |
| Authentication API       | Suitable                               |
| Campaign listing         | Suitable                               |
| Project management       | Suitable                               |
| Database CRUD            | Suitable                               |
| AI request orchestration | Suitable within execution limits       |
| Long video transcription | Dedicated worker preferred             |
| Large video uploads      | Direct object storage preferred        |
| Bulk video clipping      | Dedicated worker preferred             |
| Long Remotion rendering  | Dedicated worker preferred             |
| Persistent job polling   | Dedicated worker preferred             |
| Continuous scheduling    | Managed scheduler or persistent worker |

Clipflow must not assume that deploying Next.js automatically provides persistent background processing.

## **54. Recommended cloud migration stages**

### **Stage 1 — Local-first**

- Next.js runs locally.
- Worker runs locally.
- MongoDB Atlas stores structured data.
- Media remains local.
- No additional hosting subscription.

### **Stage 2 — Cloud media delivery**

- Introduce Cloudflare R2 where required.
- Upload selected publishing-ready media.
- Preserve local processing.
- Enable authorized external media delivery.

### **Stage 3 — Cloud scheduling and integrations**

- Deploy lightweight persistent scheduling.
- Run campaign and affiliate synchronization independently.
- Run authorized publishing jobs.
- Receive required public webhooks.
- Access publishing-ready media from cloud storage.

### **Stage 4 — Remote web application**

- Deploy Next.js to suitable cloud hosting.
- Enable remote project management.
- Connect cloud storage.
- Keep heavy processing on the local worker where practical.

### **Stage 5 — Independent cloud workers**

- Introduce cloud media processing.
- Add dedicated processing capacity.
- Support higher concurrency.
- Reduce laptop dependency.

### **Stage 6 — Multi-user scaling**

- Introduce advanced queue infrastructure.
- Add worker pools.
- Add tenant-level resource limits.
- Introduce centralized monitoring.
- Support team workflows.

## **55. Local versus cloud operation allocation**

| Operation                 | Initial location     | Future location      |
| ------------------------- | -------------------- | -------------------- |
| Frontend                  | Local                | Cloud                |
| Backend APIs              | Local                | Cloud                |
| Authentication            | Local API + Atlas    | Cloud API + Atlas    |
| Database                  | Atlas                | Atlas                |
| Campaign discovery        | Local worker         | Cloud worker         |
| Affiliate synchronization | Local worker         | Cloud worker         |
| Trend research            | Local worker         | Cloud worker         |
| AI orchestration          | Local backend/worker | Cloud backend/worker |
| FFmpeg processing         | Local                | Local or cloud       |
| Whisper transcription     | Local                | Local or cloud       |
| Remotion rendering        | Local                | Local or cloud       |
| Media storage             | Local                | Hybrid               |
| Social publishing         | Local worker         | Cloud worker         |
| Analytics synchronization | Local worker         | Cloud worker         |
| Financial reporting       | Local application    | Cloud application    |

This allocation avoids migrating expensive processing operations prematurely.

## **56. When cloud deployment becomes necessary**

Cloud infrastructure should be considered when one or more of the following requirements become important.

| Requirement                               | Infrastructure consideration                 |
| ----------------------------------------- | -------------------------------------------- |
| Publish while laptop is off               | Cloud publishing worker and accessible media |
| Daily updates without laptop availability | Cloud scheduler and synchronization worker   |
| Access Clipflow from mobile               | Cloud web application                        |
| Receive public webhooks                   | Public HTTPS endpoint                        |
| Deliver media externally                  | Cloud object storage                         |
| Insufficient local disk space             | Cloud or additional physical storage         |
| Slow video rendering                      | Dedicated processing worker                  |
| Multiple users                            | Hosted application and isolated storage      |
| Continuous business operations            | Reliable cloud infrastructure                |

### **Recommended first cloud upgrade**

If continuous social publishing and campaign updates become necessary, move lightweight scheduling and integration jobs to the cloud before moving heavy video processing.

This can reduce laptop dependency without immediately paying for cloud video rendering.

## **57. Future worker scaling architecture**

Initially, one worker process is sufficient.

Future workers may be separated by capability.

### **Worker capabilities**

| Worker               | Responsibility                         |
| -------------------- | -------------------------------------- |
| Media worker         | FFmpeg processing                      |
| Transcription worker | Whisper                                |
| Rendering worker     | Remotion                               |
| AI worker            | External AI generation                 |
| Integration worker   | Campaign and affiliate synchronization |
| Publishing worker    | Social media publishing                |
| Maintenance worker   | Cleanup, recovery and backups          |

These should remain logical processor groups inside the initial worker until workload measurements justify separate deployments.

## **58. Queue scaling strategy**

| Stage                  | Queue technology                           |
| ---------------------- | ------------------------------------------ |
| Initial development    | MongoDB-backed persistent queue            |
| Personal production    | MongoDB queue with leases and recovery     |
| Increased workload     | Multiple capability-based workers          |
| High concurrency       | Evaluate Redis and BullMQ                  |
| Large-scale processing | Dedicated distributed queue infrastructure |

MongoDB remains the initial queue choice to avoid introducing another infrastructure dependency.

Redis should be considered only when actual queue performance, scheduling requirements or concurrency justify migration.

## **59. Deployment cost strategy**

| Component                                | Initial additional subscription cost |
| ---------------------------------------- | ------------------------------------ |
| Next.js local hosting                    | ₹0                                   |
| Node.js worker                           | ₹0                                   |
| MongoDB Atlas free tier where sufficient | ₹0                                   |
| Local media storage                      | ₹0                                   |
| FFmpeg                                   | ₹0                                   |
| Local Whisper                            | ₹0                                   |
| GitHub existing access                   | ₹0                                   |
| Windows Task Scheduler                   | ₹0                                   |
| Cloud storage                            | Not enabled                          |
| Cloud workers                            | Not enabled                          |
| Cloud rendering                          | Not enabled                          |

**Initial additional infrastructure subscription target: ₹0 per month.**

Existing subscriptions, electricity, hardware maintenance and internet expenses remain applicable.

Detailed financial rules are defined in `12_COST_MANAGEMENT.md`.

## **60. Deployment security requirements**

| Security requirement     | Implementation                              |
| ------------------------ | ------------------------------------------- |
| Local network exposure   | Bind to localhost initially                 |
| Production communication | HTTPS                                       |
| Database access          | Restricted network configuration            |
| Credentials              | Protected server-side environment variables |
| Social tokens            | Encrypted storage                           |
| Media access             | Authorized streaming and downloads          |
| Worker permissions       | Minimum necessary privileges                |
| External imports         | SSRF protection                             |
| Process execution        | Validated executable arguments              |
| Public endpoints         | Authentication and rate limiting            |
| Cloud storage            | Private buckets                             |
| Publishing               | Explicit approval                           |
| Paid generation          | Budget and approval enforcement             |
| Backups                  | Restricted access                           |

Detailed security requirements are defined in `11_SECURITY_ARCHITECTURE.md`.

## **61. Deployment failure handling**

| Failure condition                 | Expected behavior                               |
| --------------------------------- | ----------------------------------------------- |
| Next.js process crashes           | Restart safely                                  |
| Worker process crashes            | Recover expired jobs                            |
| Laptop shuts down                 | Preserve persistent job state                   |
| Internet disconnects              | Pause cloud-dependent operations                |
| MongoDB unavailable               | Block database-dependent operations             |
| FFmpeg unavailable                | Disable media processing                        |
| Whisper unavailable               | Disable transcription                           |
| AI provider unavailable           | Recommend approved alternative                  |
| Storage full                      | Block new heavy operations                      |
| OAuth token expired               | Refresh where supported or request reconnection |
| Publishing outcome uncertain      | Reconcile before retrying                       |
| Invalid environment configuration | Fail securely                                   |
| Backup failure                    | Notify user                                     |
| Production build failure          | Preserve previous stable release                |

## **62. Deployment testing requirements**

| Test                           | Expected result                |
| ------------------------------ | ------------------------------ |
| Application startup            | Frontend and APIs available    |
| Production build               | Successful compilation         |
| Database connectivity          | Secure connection established  |
| Missing database configuration | Safe startup failure           |
| Worker startup                 | Worker heartbeat available     |
| Job creation                   | Persistent job stored          |
| Worker execution               | Job processed correctly        |
| Worker crash                   | Eligible job recovered         |
| Duplicate worker execution     | Duplicate processing prevented |
| FFmpeg health check            | Installed version detected     |
| Whisper health check           | Runtime and model detected     |
| Remotion test render           | Valid media output             |
| Large media upload             | Controlled memory usage        |
| Disk space exhaustion          | Unsafe operations blocked      |
| Internet interruption          | Safe failure and recovery      |
| Laptop restart                 | Persistent jobs preserved      |
| Missed scheduled operation     | Recovery policy applied        |
| Unauthorized media request     | Access denied                  |
| OAuth callback                 | Valid authorization processed  |
| Paid generation disabled       | No unauthorized paid request   |
| Publishing disabled            | No external publication        |
| Backup restoration             | Verified data recovered        |
| Release rollback               | Stable application restored    |

## **63. Proposed deployment-related source structure**

```
clipflow/
├── Documentation/
│   └── 13_DEPLOYMENT_ARCHITECTURE.md
│
├── src/
│   ├── app/
│   │   └── api/
│   │       └── system/
│   │           ├── health/
│   │           ├── workers/
│   │           └── storage/
│   │
│   ├── lib/
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   ├── runtime.ts
│   │   │   └── feature-flags.ts
│   │   │
│   │   └── monitoring/
│   │       ├── logger.ts
│   │       ├── health.service.ts
│   │       └── resource-monitor.ts
│   │
│   └── workers/
│       ├── index.ts
│       ├── worker-manager.ts
│       ├── scheduler.ts
│       ├── recovery.ts
│       └── processors/
│
├── scripts/
│   ├── check-environment.ts
│   ├── check-dependencies.ts
│   ├── healthcheck.ts
│   ├── backup-database.ts
│   ├── restore-database.ts
│   ├── migrations/
│   └── deployment/
│       ├── start-local.ps1
│       ├── stop-local.ps1
│       └── restart-local.ps1
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

This structure represents the proposed target architecture. Existing configuration and utilities should be reused wherever possible.

## **64. Deployment implementation phases**

| Phase    | Deployment deliverables                             |
| -------- | --------------------------------------------------- |
| Phase 0  | Existing application and security verification      |
| Phase 1  | Environment validation and database connectivity    |
| Phase 2  | Local storage and media dependency setup            |
| Phase 3  | Independent background worker and persistent queue  |
| Phase 4  | Scheduler, job recovery and system monitoring       |
| Phase 5  | Local production startup and resource benchmarking  |
| Phase 6  | AI provider and social media integration deployment |
| Phase 7  | Automated testing, CI and backup verification       |
| Phase 8  | Cloud media delivery when required                  |
| Phase 9  | Cloud scheduling and publishing                     |
| Phase 10 | Remote application hosting and scalable workers     |

The actual implementation sequence will be finalized in `15_IMPLEMENTATION_PLANNING.md`.

## **65. Deployment acceptance criteria**

Clipflow's initial local production environment should be considered ready only when:

- The application starts successfully in production mode.
- MongoDB connectivity is reliable.
- Existing critical security issues are resolved.
- Environment configuration is validated.
- Background workers run independently.
- Persistent jobs survive application restarts.
- FFmpeg processing works.
- Local Whisper transcription works.
- Media storage and streaming work.
- Resource limits are enforced.
- Failed jobs recover safely.
- Paid operations require approval.
- Publishing cannot occur without authorization.
- System health reflects actual availability.
- Backups can be restored.
- Production builds and automated tests pass.
- Existing functional features remain operational.

## **66. Final deployment decision**

Clipflow will initially follow a **local-first hybrid deployment architecture with cloud-hosted structured data and independent local media processing workers.**

| Requirement                       | Final selection                               |
| --------------------------------- | --------------------------------------------- |
| Initial hosting                   | Local Windows laptop                          |
| Frontend                          | Next.js + React                               |
| Backend                           | Next.js Route Handlers                        |
| Database                          | MongoDB Atlas                                 |
| Background processing             | Independent Node.js worker                    |
| Persistent queue                  | MongoDB                                       |
| Scheduler                         | Persistent worker-based scheduler             |
| Video processing                  | Local FFmpeg                                  |
| Transcription                     | Local Whisper                                 |
| Motion graphics                   | Local Remotion                                |
| Media storage                     | Local file system                             |
| AI intelligence                   | External GPT and Gemini providers             |
| AI video generation               | Google Flow and Adobe Firefly where available |
| Process management                | Local scripts; Windows Task Scheduler later   |
| Source control                    | GitHub                                        |
| Continuous integration            | GitHub Actions, proposed                      |
| Backup                            | Database and separate media backups           |
| Future object storage             | Cloudflare R2                                 |
| Future web hosting                | Provider selection deferred                   |
| Future cloud workers              | Based on operational requirements             |
| Initial additional hosting budget | ₹0 target                                     |
| Docker                            | Not required initially                        |
| Kubernetes                        | Not required initially                        |
| Redis                             | Deferred                                      |
| Microservices                     | Not required initially                        |

## **67. Pending validation**

Before deployment implementation, the following items must be verified:

- Existing Next.js project configuration.
- Actual `package.json` scripts.
- Existing database models and indexes.
- MongoDB Atlas connectivity.
- Existing authentication and security implementation.
- Laptop processor and RAM.
- Available local storage.
- Laptop power and battery reliability.
- FFmpeg installation and codec support.
- Python and Whisper compatibility.
- Remotion performance and licensing.
- Existing AI subscription entitlements.
- OpenAI API configuration.
- Gemini API credential validity.
- Instagram OAuth permissions.
- YouTube OAuth permissions.
- Whop API access.
- Cuelinks account approval.
- Public callback and webhook requirements.
- Actual cloud hosting requirements.
- Backup storage availability.

The proposed ports, folder structures, startup scripts, scheduling frequencies, concurrency limits and cloud hosting options are architecture recommendations. They have not been implemented or benchmarked.

No source code modifications, software installations, cloud deployments or infrastructure purchases have been performed during this documentation stage.

**Save in:** `Documentation/13_DEPLOYMENT_ARCHITECTURE.md`

## **Documentation progress**

**86.7%**

13 of 15 documents drafted — 2 remaining

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

14 — Existing Project Gap Analysis

Next

15 — Implementation Planning

**Next:&#x20;**`14_EXISTING_PROJECT_GAP_ANALYSIS.md`

This document is particularly important because we already have an existing Clipflow application. We need to identify:

- What we have already developed.
- What is actually working.
- What is partially implemented.
- What is static or missing backend logic.
- What needs to be modified.
- What needs to be developed from scratch.
- Which existing components can be reused.
- Which security issues must be resolved first.

For an accurate gap analysis, we should obtain a fresh repository audit from Antigravity rather than assume the existing implementation matches our new architecture.