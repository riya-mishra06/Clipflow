# **07 — Background Job Architecture**

**Project:** Clipflow Creator Studio\
**Document:** `07_BACKGROUND_JOB_ARCHITECTURE.md`\
**Architecture:** MongoDB-backed job queue with separate Node.js background workers.

## **1. Objective**

Clipflow will perform several time-consuming operations, including video generation, transcription, rendering, bulk clipping and social media synchronization.

These operations must run in the background without freezing the user interface or blocking normal API requests.

The background job system must support:

- Asynchronous processing.
- Job queues and priorities.
- Real-time progress tracking.
- Automatic and manual retries.
- Scheduled operations.
- Job cancellation.
- Failure recovery.
- Resource management.
- Cost tracking.

## **2. Why do we need background jobs?**

Suppose a user requests 20 clips from a one-hour video.

The system needs to download or import the authorized video, extract audio, generate transcripts, identify viral moments, create clips, add subtitles and render individual videos.

These operations may take several minutes or longer. Instead of keeping an API request open throughout processing, Clipflow creates a background job and immediately returns its ID.

The user can continue working on other projects while the background worker processes the request.

## **3. Technology selection**

| Technology        | Responsibility                   | Additional software cost |
| ----------------- | -------------------------------- | ------------------------ |
| Node.js           | Background worker execution      | Free                     |
| MongoDB           | Job queue and persistent status  | Free tier available      |
| Mongoose          | Job database operations          | Free                     |
| Next.js API       | Job creation and management      | Free                     |
| FFmpeg            | Media processing                 | Free                     |
| Whisper           | Local transcription              | Free                     |
| Remotion          | Video rendering                  | License dependent        |
| Node.js scheduler | Scheduled job creation           | Free                     |
| Redis + BullMQ    | Future advanced queue management | Not required initially   |

We will initially avoid introducing Redis because MongoDB is already part of our architecture and our initial workload is intended for personal use.

## **4. Background job system architecture**

\#chatgpt-mermaid-\_r_2o4\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_2o4\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_2o4\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_2o4\_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_2o4\_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o4\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_2o4\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_2o4\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_2o4\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_2o4\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_2o4\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_2o4\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2o4\_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2o4\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_2o4\_ p{margin:0;}#chatgpt-mermaid-\_r_2o4\_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o4\_ .cluster-label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o4\_ .cluster-label span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o4\_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-\_r_2o4\_ .label text,#chatgpt-mermaid-\_r_2o4\_ span{fill:rgb(237, 237, 237);color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o4\_ .node rect,#chatgpt-mermaid-\_r_2o4\_ .node circle,#chatgpt-mermaid-\_r_2o4\_ .node ellipse,#chatgpt-mermaid-\_r_2o4\_ .node polygon,#chatgpt-mermaid-\_r_2o4\_ .node path{fill:rgb(19, 33, 54);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-\_r_2o4\_ .rough-node .label text,#chatgpt-mermaid-\_r_2o4\_ .node .label text,#chatgpt-mermaid-\_r_2o4\_ .image-shape .label,#chatgpt-mermaid-\_r_2o4\_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-\_r_2o4\_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-\_r_2o4\_ .rough-node .label,#chatgpt-mermaid-\_r_2o4\_ .node .label,#chatgpt-mermaid-\_r_2o4\_ .image-shape .label,#chatgpt-mermaid-\_r_2o4\_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-\_r_2o4\_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-\_r_2o4\_ .root .anchor path{fill:rgb(175, 175, 175)!important;stroke-width:0;stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2o4\_ .arrowheadPath{fill:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2o4\_ .edgePath .path{stroke:rgb(175, 175, 175);stroke-width:1px;}#chatgpt-mermaid-\_r_2o4\_ .flowchart-link{stroke:rgb(175, 175, 175);fill:none;}#chatgpt-mermaid-\_r_2o4\_ .edgeLabel{background-color:rgb(14, 14, 14);text-align:center;}#chatgpt-mermaid-\_r_2o4\_ .edgeLabel p{background-color:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_2o4\_ .edgeLabel rect{opacity:0.5;background-color:rgb(14, 14, 14);fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_2o4\_ .labelBkg{background-color:rgba(14, 14, 14, 0.5);}#chatgpt-mermaid-\_r_2o4\_ .cluster rect{fill:rgb(48, 48, 48);stroke:rgba(255, 255, 255, 0.15);stroke-width:1px;}#chatgpt-mermaid-\_r_2o4\_ .cluster text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o4\_ .cluster span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o4\_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(48, 48, 48);border:1px solid rgba(255, 255, 255, 0.15);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-\_r_2o4\_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o4\_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-\_r_2o4\_ .icon-shape,#chatgpt-mermaid-\_r_2o4\_ .image-shape{background-color:rgb(14, 14, 14);text-align:center;}#chatgpt-mermaid-\_r_2o4\_ .icon-shape p,#chatgpt-mermaid-\_r_2o4\_ .image-shape p{background-color:rgb(14, 14, 14);padding:2px;}#chatgpt-mermaid-\_r_2o4\_ .icon-shape .label rect,#chatgpt-mermaid-\_r_2o4\_ .image-shape .label rect{opacity:0.5;background-color:rgb(14, 14, 14);fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_2o4\_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-\_r_2o4\_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-\_r_2o4\_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_2o4\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_2o4\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_2o4\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_2o4\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2o4\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_2o4\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_2o4\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_2o4\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2o4\_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-\_r_2o4\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_2o4\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2o4\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_2o4\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_2o4\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2o4\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_2o4\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2o4\_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(232, 232, 232);}#chatgpt-mermaid-\_r_2o4\_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(232, 232, 232);}#chatgpt-mermaid-\_r_2o4\_ .node tspan[font-weight="normal"],#chatgpt-mermaid-\_r_2o4\_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-\_r_2o4\_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(19, 19, 19);stroke:rgb(47, 47, 47);stroke-width:1px;}#chatgpt-mermaid-\_r_2o4\_ .node rect,#chatgpt-mermaid-\_r_2o4\_ .node circle,#chatgpt-mermaid-\_r_2o4\_ .node ellipse,#chatgpt-mermaid-\_r_2o4\_ .node polygon,#chatgpt-mermaid-\_r_2o4\_ .node path{fill:rgb(24, 24, 24);stroke:rgba(255, 255, 255, 0.1);stroke-width:1px;}#chatgpt-mermaid-\_r_2o4\_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-\_r_2o4\_ .mermaid-decision .label-container{fill:rgb(19, 19, 19);stroke:rgb(47, 47, 47);stroke-dasharray:2,2;}#chatgpt-mermaid-\_r_2o4\_ .edgePaths .flowchart-link{stroke:rgb(175, 175, 175);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-\_r_2o4\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2o4\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}Clipflow User InterfaceNext.js APIAuthentication and ValidationJob ManagerMongoDB Job QueueSchedulerNode.js WorkerAI GenerationFFmpeg ProcessingWhisper TranscriptionRemotion RenderingExternal API SynchronizationResult and Status UpdatesMedia StorageJob Status API

## **5. Core architecture components**

| Component            | Responsibility                            |
| -------------------- | ----------------------------------------- |
| Job Manager          | Creates and manages jobs                  |
| Job Queue            | Stores pending and active jobs            |
| Worker Manager       | Controls worker execution                 |
| Job Processor        | Executes specific job types               |
| Scheduler            | Creates scheduled jobs                    |
| Retry Manager        | Handles eligible failed jobs              |
| Progress Tracker     | Records actual processing progress        |
| Recovery Manager     | Recovers interrupted jobs                 |
| Cost Manager         | Validates and records generation expenses |
| Notification Manager | Notifies users about job outcomes         |

These are logical components, not separate servers.

## **6. Supported background job types**

### **6.1 Media processing jobs**

| Job type               | Responsibility                   |
| ---------------------- | -------------------------------- |
| `MEDIA_IMPORT`         | Import authorized media          |
| `MEDIA_ANALYSIS`       | Extract media metadata           |
| `AUDIO_EXTRACTION`     | Extract audio from videos        |
| `TRANSCRIPTION`        | Generate transcripts             |
| `FRAME_EXTRACTION`     | Extract video frames             |
| `CLIP_EXTRACTION`      | Create individual clips          |
| `SMART_CROP`           | Convert and track aspect ratios  |
| `SUBTITLE_GENERATION`  | Generate subtitle files          |
| `PROXY_GENERATION`     | Create lightweight editing files |
| `THUMBNAIL_GENERATION` | Generate thumbnails              |
| `VIDEO_RENDER`         | Render final videos              |
| `AUDIO_PROCESSING`     | Mix and enhance audio            |

### **6.2 AI generation jobs**

| Job type                   | Responsibility                 |
| -------------------------- | ------------------------------ |
| `AI_CONTENT_ANALYSIS`      | Analyze media and content      |
| `AI_SCRIPT_GENERATION`     | Generate scripts               |
| `AI_STORYBOARD_GENERATION` | Generate scene plans           |
| `AI_IMAGE_GENERATION`      | Generate images and characters |
| `AI_VIDEO_GENERATION`      | Generate video scenes          |
| `AI_VOICEOVER_GENERATION`  | Generate narration             |
| `AI_REFERENCE_ANALYSIS`    | Analyze reference videos       |
| `AI_RECOMMENDATION`        | Generate recommendations       |
| `AI_SEO_GENERATION`        | Generate captions and keywords |

### **6.3 Discovery and synchronization jobs**

| Job type         | Responsibility                       |
| ---------------- | ------------------------------------ |
| `CAMPAIGN_SYNC`  | Synchronize campaign opportunities   |
| `TREND_SYNC`     | Update available trend information   |
| `AFFILIATE_SYNC` | Synchronize affiliate opportunities  |
| `YOUTUBE_SYNC`   | Update YouTube account information   |
| `INSTAGRAM_SYNC` | Update Instagram account information |
| `ANALYTICS_SYNC` | Synchronize performance metrics      |

### **6.4 Publishing and maintenance jobs**

| Job type                | Responsibility                 |
| ----------------------- | ------------------------------ |
| `SCHEDULED_PUBLISH`     | Publish approved content       |
| `PUBLISH_STATUS_CHECK`  | Verify publishing results      |
| `TEMP_FILE_CLEANUP`     | Remove expired temporary files |
| `JOB_RECOVERY`          | Recover interrupted jobs       |
| `STORAGE_CHECK`         | Check available storage        |
| `PROVIDER_HEALTH_CHECK` | Check AI provider availability |
| `NOTIFICATION_SEND`     | Deliver system notifications   |

## **7. Job lifecycle**

\#chatgpt-mermaid-\_r_2o5\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_2o5\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_2o5\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_2o5\_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_2o5\_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o5\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_2o5\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_2o5\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_2o5\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_2o5\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_2o5\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_2o5\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2o5\_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2o5\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_2o5\_ p{margin:0;}#chatgpt-mermaid-\_r_2o5\_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o5\_ .cluster-label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o5\_ .cluster-label span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o5\_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-\_r_2o5\_ .label text,#chatgpt-mermaid-\_r_2o5\_ span{fill:rgb(237, 237, 237);color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o5\_ .node rect,#chatgpt-mermaid-\_r_2o5\_ .node circle,#chatgpt-mermaid-\_r_2o5\_ .node ellipse,#chatgpt-mermaid-\_r_2o5\_ .node polygon,#chatgpt-mermaid-\_r_2o5\_ .node path{fill:rgb(19, 33, 54);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-\_r_2o5\_ .rough-node .label text,#chatgpt-mermaid-\_r_2o5\_ .node .label text,#chatgpt-mermaid-\_r_2o5\_ .image-shape .label,#chatgpt-mermaid-\_r_2o5\_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-\_r_2o5\_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-\_r_2o5\_ .rough-node .label,#chatgpt-mermaid-\_r_2o5\_ .node .label,#chatgpt-mermaid-\_r_2o5\_ .image-shape .label,#chatgpt-mermaid-\_r_2o5\_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-\_r_2o5\_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-\_r_2o5\_ .root .anchor path{fill:rgb(175, 175, 175)!important;stroke-width:0;stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2o5\_ .arrowheadPath{fill:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2o5\_ .edgePath .path{stroke:rgb(175, 175, 175);stroke-width:1px;}#chatgpt-mermaid-\_r_2o5\_ .flowchart-link{stroke:rgb(175, 175, 175);fill:none;}#chatgpt-mermaid-\_r_2o5\_ .edgeLabel{background-color:rgb(14, 14, 14);text-align:center;}#chatgpt-mermaid-\_r_2o5\_ .edgeLabel p{background-color:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_2o5\_ .edgeLabel rect{opacity:0.5;background-color:rgb(14, 14, 14);fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_2o5\_ .labelBkg{background-color:rgba(14, 14, 14, 0.5);}#chatgpt-mermaid-\_r_2o5\_ .cluster rect{fill:rgb(48, 48, 48);stroke:rgba(255, 255, 255, 0.15);stroke-width:1px;}#chatgpt-mermaid-\_r_2o5\_ .cluster text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o5\_ .cluster span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o5\_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(48, 48, 48);border:1px solid rgba(255, 255, 255, 0.15);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-\_r_2o5\_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o5\_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-\_r_2o5\_ .icon-shape,#chatgpt-mermaid-\_r_2o5\_ .image-shape{background-color:rgb(14, 14, 14);text-align:center;}#chatgpt-mermaid-\_r_2o5\_ .icon-shape p,#chatgpt-mermaid-\_r_2o5\_ .image-shape p{background-color:rgb(14, 14, 14);padding:2px;}#chatgpt-mermaid-\_r_2o5\_ .icon-shape .label rect,#chatgpt-mermaid-\_r_2o5\_ .image-shape .label rect{opacity:0.5;background-color:rgb(14, 14, 14);fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_2o5\_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-\_r_2o5\_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-\_r_2o5\_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_2o5\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_2o5\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_2o5\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_2o5\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2o5\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_2o5\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_2o5\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_2o5\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2o5\_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-\_r_2o5\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_2o5\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2o5\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_2o5\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_2o5\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2o5\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_2o5\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2o5\_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(232, 232, 232);}#chatgpt-mermaid-\_r_2o5\_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(232, 232, 232);}#chatgpt-mermaid-\_r_2o5\_ .node tspan[font-weight="normal"],#chatgpt-mermaid-\_r_2o5\_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-\_r_2o5\_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(19, 19, 19);stroke:rgb(47, 47, 47);stroke-width:1px;}#chatgpt-mermaid-\_r_2o5\_ .node rect,#chatgpt-mermaid-\_r_2o5\_ .node circle,#chatgpt-mermaid-\_r_2o5\_ .node ellipse,#chatgpt-mermaid-\_r_2o5\_ .node polygon,#chatgpt-mermaid-\_r_2o5\_ .node path{fill:rgb(24, 24, 24);stroke:rgba(255, 255, 255, 0.1);stroke-width:1px;}#chatgpt-mermaid-\_r_2o5\_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-\_r_2o5\_ .mermaid-decision .label-container{fill:rgb(19, 19, 19);stroke:rgb(47, 47, 47);stroke-dasharray:2,2;}#chatgpt-mermaid-\_r_2o5\_ .edgePaths .flowchart-link{stroke:rgb(175, 175, 175);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-\_r_2o5\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2o5\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}Job CreatedApproval required?Awaiting ApprovalQueuedCancelledProcessingProcessing resultCompletedAwaiting ImportRetry ScheduledFailedCancellingYesNoApprovedRejectedSuccessManual asset requiredAsset importedTemporary failurePermanent failureCancellation requestedEligible manual retry

### **Job statuses**

| Status              | Meaning                              |
| ------------------- | ------------------------------------ |
| `DRAFT`             | Job configuration is incomplete      |
| `AWAITING_APPROVAL` | Waiting for user approval            |
| `SCHEDULED`         | Waiting for scheduled execution time |
| `QUEUED`            | Waiting for an available worker      |
| `PROCESSING`        | Worker is executing the job          |
| `AWAITING_IMPORT`   | External asset must be imported      |
| `RETRY_SCHEDULED`   | Waiting for the next retry           |
| `CANCELLING`        | Cancellation requested               |
| `COMPLETED`         | Job successfully completed           |
| `FAILED`            | Job failed                           |
| `CANCELLED`         | Job cancelled                        |

## **8. Job priority system**

Not every background operation has the same importance.

| Priority   | Examples                               |
| ---------- | -------------------------------------- |
| Critical   | Approved scheduled publishing          |
| High       | User-requested preview and export      |
| Normal     | AI generation and video clipping       |
| Low        | Campaign and analytics synchronization |
| Background | Temporary file cleanup and maintenance |

Workers should process eligible jobs according to priority and creation time.

Low-priority jobs must not remain permanently unprocessed.

## **9. Job dependency management**

Some jobs cannot start until other jobs are completed.

For example, video clipping requires a transcript before AI can identify suitable timestamps.

\#chatgpt-mermaid-\_r_2o6\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_2o6\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_2o6\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_2o6\_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_2o6\_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o6\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_2o6\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_2o6\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_2o6\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_2o6\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_2o6\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_2o6\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2o6\_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2o6\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_2o6\_ p{margin:0;}#chatgpt-mermaid-\_r_2o6\_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o6\_ .cluster-label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o6\_ .cluster-label span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o6\_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-\_r_2o6\_ .label text,#chatgpt-mermaid-\_r_2o6\_ span{fill:rgb(237, 237, 237);color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o6\_ .node rect,#chatgpt-mermaid-\_r_2o6\_ .node circle,#chatgpt-mermaid-\_r_2o6\_ .node ellipse,#chatgpt-mermaid-\_r_2o6\_ .node polygon,#chatgpt-mermaid-\_r_2o6\_ .node path{fill:rgb(19, 33, 54);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-\_r_2o6\_ .rough-node .label text,#chatgpt-mermaid-\_r_2o6\_ .node .label text,#chatgpt-mermaid-\_r_2o6\_ .image-shape .label,#chatgpt-mermaid-\_r_2o6\_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-\_r_2o6\_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-\_r_2o6\_ .rough-node .label,#chatgpt-mermaid-\_r_2o6\_ .node .label,#chatgpt-mermaid-\_r_2o6\_ .image-shape .label,#chatgpt-mermaid-\_r_2o6\_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-\_r_2o6\_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-\_r_2o6\_ .root .anchor path{fill:rgb(175, 175, 175)!important;stroke-width:0;stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2o6\_ .arrowheadPath{fill:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2o6\_ .edgePath .path{stroke:rgb(175, 175, 175);stroke-width:1px;}#chatgpt-mermaid-\_r_2o6\_ .flowchart-link{stroke:rgb(175, 175, 175);fill:none;}#chatgpt-mermaid-\_r_2o6\_ .edgeLabel{background-color:rgb(14, 14, 14);text-align:center;}#chatgpt-mermaid-\_r_2o6\_ .edgeLabel p{background-color:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_2o6\_ .edgeLabel rect{opacity:0.5;background-color:rgb(14, 14, 14);fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_2o6\_ .labelBkg{background-color:rgba(14, 14, 14, 0.5);}#chatgpt-mermaid-\_r_2o6\_ .cluster rect{fill:rgb(48, 48, 48);stroke:rgba(255, 255, 255, 0.15);stroke-width:1px;}#chatgpt-mermaid-\_r_2o6\_ .cluster text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o6\_ .cluster span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o6\_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(48, 48, 48);border:1px solid rgba(255, 255, 255, 0.15);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-\_r_2o6\_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2o6\_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-\_r_2o6\_ .icon-shape,#chatgpt-mermaid-\_r_2o6\_ .image-shape{background-color:rgb(14, 14, 14);text-align:center;}#chatgpt-mermaid-\_r_2o6\_ .icon-shape p,#chatgpt-mermaid-\_r_2o6\_ .image-shape p{background-color:rgb(14, 14, 14);padding:2px;}#chatgpt-mermaid-\_r_2o6\_ .icon-shape .label rect,#chatgpt-mermaid-\_r_2o6\_ .image-shape .label rect{opacity:0.5;background-color:rgb(14, 14, 14);fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_2o6\_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-\_r_2o6\_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-\_r_2o6\_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_2o6\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_2o6\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_2o6\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_2o6\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2o6\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_2o6\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_2o6\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_2o6\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2o6\_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-\_r_2o6\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_2o6\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2o6\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_2o6\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_2o6\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2o6\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_2o6\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2o6\_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(232, 232, 232);}#chatgpt-mermaid-\_r_2o6\_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(232, 232, 232);}#chatgpt-mermaid-\_r_2o6\_ .node tspan[font-weight="normal"],#chatgpt-mermaid-\_r_2o6\_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-\_r_2o6\_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(19, 19, 19);stroke:rgb(47, 47, 47);stroke-width:1px;}#chatgpt-mermaid-\_r_2o6\_ .node rect,#chatgpt-mermaid-\_r_2o6\_ .node circle,#chatgpt-mermaid-\_r_2o6\_ .node ellipse,#chatgpt-mermaid-\_r_2o6\_ .node polygon,#chatgpt-mermaid-\_r_2o6\_ .node path{fill:rgb(24, 24, 24);stroke:rgba(255, 255, 255, 0.1);stroke-width:1px;}#chatgpt-mermaid-\_r_2o6\_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-\_r_2o6\_ .mermaid-decision .label-container{fill:rgb(19, 19, 19);stroke:rgb(47, 47, 47);stroke-dasharray:2,2;}#chatgpt-mermaid-\_r_2o6\_ .edgePaths .flowchart-link{stroke:rgb(175, 175, 175);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-\_r_2o6\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2o6\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}Parent: Clipping ProjectImport VideoExtract AudioWhisper TranscriptionAI Viral Moment AnalysisGenerate Clip 1Generate Clip 2Generate Clip 3Render Clip 1Render Clip 2Render Clip 3Project Result

### **Dependency rules**

- A dependent job starts only after its required jobs succeed.
- Failed dependencies must prevent invalid downstream processing.
- Completed jobs should not be repeated unnecessarily.
- Individual failed clips can be retried independently.
- Parent jobs must track child job completion.
- Partial success must be clearly reported.

For example, if 18 out of 20 clips are successfully rendered, the system should preserve those 18 clips and allow the remaining two to be retried.

## **10. Job database structure**

The following is a proposed job document. The final database schema will be defined in `08_DATABASE_DESIGN.md`.

```
{
  "jobId": "job_001",
  "userId": "user_001",
  "workspaceId": "workspace_001",
  "projectId": "project_001",
  "parentJobId": null,
  "type": "VIDEO_RENDER",
  "status": "QUEUED",
  "priority": "HIGH",
  "progress": 0,
  "currentStage": "Waiting for worker",
  "dependencies": [],
  "input": {
    "timelineId": "timeline_001",
    "resolution": "1080x1920",
    "format": "mp4"
  },
  "output": null,
  "attempts": 0,
  "maxAttempts": 3,
  "workerId": null,
  "leaseExpiresAt": null,
  "lastHeartbeatAt": null,
  "idempotencyKey": "render_project_001_v1",
  "estimatedCost": 0,
  "actualCost": null,
  "currency": "INR",
  "approvalStatus": "NOT_REQUIRED",
  "scheduledAt": null,
  "nextRunAt": null,
  "error": null,
  "createdAt": "2026-11-26T10:00:00Z",
  "updatedAt": "2026-11-26T10:00:00Z",
  "startedAt": null,
  "completedAt": null
}
```

All identifiers and timestamps above are illustrative.

### **Important job fields**

| Field             | Purpose                            |
| ----------------- | ---------------------------------- |
| `jobId`           | Unique job identifier              |
| `workspaceId`     | Brand workspace ownership          |
| `projectId`       | Associated project                 |
| `parentJobId`     | Connects child jobs to parent jobs |
| `dependencies`    | Required previous jobs             |
| `progress`        | Actual processing percentage       |
| `attempts`        | Number of execution attempts       |
| `workerId`        | Assigned worker                    |
| `leaseExpiresAt`  | Worker ownership expiration        |
| `lastHeartbeatAt` | Last worker activity               |
| `idempotencyKey`  | Prevents duplicate job creation    |
| `estimatedCost`   | Expected processing expense        |
| `actualCost`      | Confirmed processing expense       |
| `nextRunAt`       | Earliest eligible execution time   |
| `error`           | Failure information                |

## **11. Worker architecture**

Workers will run as separate Node.js processes from the main Next.js application.

| Worker               | Responsibility                   |
| -------------------- | -------------------------------- |
| Media Worker         | FFmpeg and media transformations |
| Transcription Worker | Local Whisper processing         |
| AI Worker            | AI provider requests             |
| Render Worker        | FFmpeg and Remotion rendering    |
| Sync Worker          | Campaigns, trends and analytics  |
| Publishing Worker    | Approved social media publishing |
| Maintenance Worker   | Cleanup and recovery             |

Initially, these can be implemented as logical processors inside a single worker application rather than seven independently running processes.

This reduces resource usage and development complexity.

## **12. Job concurrency management**

Concurrency means how many jobs can run simultaneously.

Because Clipflow will initially run on a local laptop, heavy jobs must have controlled concurrency.

| Job category              | Proposed initial concurrency |
| ------------------------- | ---------------------------- |
| Video rendering           | 1                            |
| Whisper transcription     | 1                            |
| FFmpeg media processing   | 1                            |
| AI API requests           | 2                            |
| Campaign synchronization  | 1                            |
| Analytics synchronization | 1                            |
| Publishing                | 1                            |

Rendering, transcription and other heavy local processing should initially share a combined concurrency limit of one.

These are starting configurations, not permanent limits. Actual values will be adjusted after hardware benchmarking.

## **13. Job progress tracking**

The user should be able to monitor all background operations from a centralized Job Manager.

## **Processing Queue**

Illustrative UI

GTA — Viral Clip Generation

Processing

Rendering clip 12 of 2060%

Skincare UGC Advertisement

Processing

Generating storyboard35%

Fashion Product Reel

Queued

Waiting for render worker0%

YouTube Analytics Sync

Completed

Synchronization completed100%

AI Character Generation

Awaiting import

Waiting for Google Flow import0%

### **Progress update methods**

| Method                   | Decision                         |
| ------------------------ | -------------------------------- |
| API polling              | Initial implementation           |
| Server-Sent Events (SSE) | Future improvement               |
| WebSockets               | Optional advanced implementation |

Initially, the frontend can request job status every few seconds while a job is active.

Progress must come from actual completed stages, FFmpeg output, processed clip counts or provider-reported status. If accurate percentages are unavailable, display an indeterminate processing state instead of fake progress.

## **14. Retry and failure management**

| Error type                     | Retry policy                           |
| ------------------------------ | -------------------------------------- |
| Temporary network failure      | Automatic retry                        |
| API rate limit                 | Retry after permitted waiting period   |
| Temporary provider failure     | Limited automatic retry                |
| Invalid API key                | No automatic retry                     |
| Insufficient credits           | Wait for user action                   |
| Corrupted media                | Request replacement                    |
| Insufficient storage           | Wait for cleanup or user action        |
| Rendering failure              | Retry if recoverable                   |
| Invalid user input             | Request correction                     |
| Unknown paid generation result | Verify provider status before retrying |

### **Proposed retry intervals**

| Retry        | Waiting period |
| ------------ | -------------- |
| First retry  | 30 seconds     |
| Second retry | 2 minutes      |
| Third retry  | 5 minutes      |

Provider-specific retry instructions should take priority.

Paid generation and publishing operations require additional duplicate-prevention checks before retries.

## **15. Duplicate job prevention**

Duplicate jobs can waste resources, generate unnecessary charges or publish the same content multiple times.

Clipflow must use:

- Unique job identifiers.
- Idempotency keys.
- Atomic MongoDB job claiming.
- Worker ownership leases.
- Existing output verification.
- Provider request identifiers where supported.
- Publishing history verification.

A worker must atomically claim a queued job before executing it so two workers cannot normally claim the same job simultaneously.

However, a queue cannot guarantee exactly-once execution across external services. Paid generation and publishing must therefore include reconciliation and duplicate-prevention mechanisms.

## **16. Worker heartbeat and recovery**

A heartbeat is a periodic update that indicates a worker is still active.

Proposed configuration:

| Configuration           | Initial value |
| ----------------------- | ------------- |
| Heartbeat interval      | 15 seconds    |
| Worker lease duration   | 90 seconds    |
| Recovery check interval | 60 seconds    |

If the worker stops updating its heartbeat, the recovery system checks whether the job's lease has expired.

Recoverable local jobs can be returned to the queue. External generation and publishing jobs must first verify whether the provider already completed the operation.

This helps recover from application crashes, unexpected shutdowns and laptop restarts.

## **17. Job cancellation**

Users should be able to cancel eligible jobs.

| Job condition          | Cancellation behavior                                |
| ---------------------- | ---------------------------------------------------- |
| Queued                 | Cancel immediately                                   |
| Scheduled              | Remove from execution schedule                       |
| FFmpeg processing      | Stop the processing subprocess safely                |
| Whisper processing     | Stop the transcription subprocess safely             |
| Video rendering        | Stop rendering and clean partial output              |
| External AI generation | Request cancellation if supported                    |
| Completed              | Cannot cancel; output can be managed separately      |
| Publishing in progress | Verify platform status before reporting cancellation |

Cancellation does not guarantee a refund for AI requests that have already been submitted.

Original assets and successfully completed outputs must remain protected.

## **18. Scheduled job architecture**

Clipflow will support automatic recurring tasks.

| Scheduled task            | Proposed frequency          |
| ------------------------- | --------------------------- |
| Campaign discovery        | Daily                       |
| Trend research            | Daily                       |
| Affiliate synchronization | Daily                       |
| YouTube analytics         | Every 6 hours               |
| Instagram analytics       | Every 6 hours               |
| Publishing                | User-selected date and time |
| Temporary file cleanup    | Daily                       |
| Worker recovery           | Every minute                |
| Storage monitoring        | Hourly                      |

Scheduling frequency must respect API quotas and permissions.

All scheduled timestamps should be stored in UTC and displayed using the user's configured timezone, initially `Asia/Kolkata`.

### **Local-first limitation**

Scheduled jobs cannot execute while the laptop is switched off or the worker is not running.

After restarting, Clipflow can identify missed jobs and execute eligible ones. Missed publishing jobs should follow a user-configured policy, such as requesting approval or rescheduling, rather than automatically publishing outdated content.

Reliable 24/7 scheduling will require an always-running environment in the future.

## **19. Manual AI generation jobs**

Google Flow and Adobe Firefly may initially require manual generation and asset import.

The background job system must support this workflow without continuously occupying a worker.

\#chatgpt-mermaid-\_r_2qe\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_2qe\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_2qe\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_2qe\_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_2qe\_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2qe\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_2qe\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_2qe\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_2qe\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_2qe\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_2qe\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_2qe\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2qe\_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2qe\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_2qe\_ p{margin:0;}#chatgpt-mermaid-\_r_2qe\_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2qe\_ .cluster-label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2qe\_ .cluster-label span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2qe\_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-\_r_2qe\_ .label text,#chatgpt-mermaid-\_r_2qe\_ span{fill:rgb(237, 237, 237);color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2qe\_ .node rect,#chatgpt-mermaid-\_r_2qe\_ .node circle,#chatgpt-mermaid-\_r_2qe\_ .node ellipse,#chatgpt-mermaid-\_r_2qe\_ .node polygon,#chatgpt-mermaid-\_r_2qe\_ .node path{fill:rgb(19, 33, 54);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-\_r_2qe\_ .rough-node .label text,#chatgpt-mermaid-\_r_2qe\_ .node .label text,#chatgpt-mermaid-\_r_2qe\_ .image-shape .label,#chatgpt-mermaid-\_r_2qe\_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-\_r_2qe\_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-\_r_2qe\_ .rough-node .label,#chatgpt-mermaid-\_r_2qe\_ .node .label,#chatgpt-mermaid-\_r_2qe\_ .image-shape .label,#chatgpt-mermaid-\_r_2qe\_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-\_r_2qe\_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-\_r_2qe\_ .root .anchor path{fill:rgb(175, 175, 175)!important;stroke-width:0;stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2qe\_ .arrowheadPath{fill:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2qe\_ .edgePath .path{stroke:rgb(175, 175, 175);stroke-width:1px;}#chatgpt-mermaid-\_r_2qe\_ .flowchart-link{stroke:rgb(175, 175, 175);fill:none;}#chatgpt-mermaid-\_r_2qe\_ .edgeLabel{background-color:rgb(14, 14, 14);text-align:center;}#chatgpt-mermaid-\_r_2qe\_ .edgeLabel p{background-color:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_2qe\_ .edgeLabel rect{opacity:0.5;background-color:rgb(14, 14, 14);fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_2qe\_ .labelBkg{background-color:rgba(14, 14, 14, 0.5);}#chatgpt-mermaid-\_r_2qe\_ .cluster rect{fill:rgb(48, 48, 48);stroke:rgba(255, 255, 255, 0.15);stroke-width:1px;}#chatgpt-mermaid-\_r_2qe\_ .cluster text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2qe\_ .cluster span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2qe\_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(48, 48, 48);border:1px solid rgba(255, 255, 255, 0.15);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-\_r_2qe\_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_2qe\_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-\_r_2qe\_ .icon-shape,#chatgpt-mermaid-\_r_2qe\_ .image-shape{background-color:rgb(14, 14, 14);text-align:center;}#chatgpt-mermaid-\_r_2qe\_ .icon-shape p,#chatgpt-mermaid-\_r_2qe\_ .image-shape p{background-color:rgb(14, 14, 14);padding:2px;}#chatgpt-mermaid-\_r_2qe\_ .icon-shape .label rect,#chatgpt-mermaid-\_r_2qe\_ .image-shape .label rect{opacity:0.5;background-color:rgb(14, 14, 14);fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_2qe\_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-\_r_2qe\_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-\_r_2qe\_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_2qe\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_2qe\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_2qe\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_2qe\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2qe\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_2qe\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_2qe\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_2qe\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2qe\_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-\_r_2qe\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_2qe\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2qe\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_2qe\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_2qe\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2qe\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_2qe\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_2qe\_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(232, 232, 232);}#chatgpt-mermaid-\_r_2qe\_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(232, 232, 232);}#chatgpt-mermaid-\_r_2qe\_ .node tspan[font-weight="normal"],#chatgpt-mermaid-\_r_2qe\_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-\_r_2qe\_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(19, 19, 19);stroke:rgb(47, 47, 47);stroke-width:1px;}#chatgpt-mermaid-\_r_2qe\_ .node rect,#chatgpt-mermaid-\_r_2qe\_ .node circle,#chatgpt-mermaid-\_r_2qe\_ .node ellipse,#chatgpt-mermaid-\_r_2qe\_ .node polygon,#chatgpt-mermaid-\_r_2qe\_ .node path{fill:rgb(24, 24, 24);stroke:rgba(255, 255, 255, 0.1);stroke-width:1px;}#chatgpt-mermaid-\_r_2qe\_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-\_r_2qe\_ .mermaid-decision .label-container{fill:rgb(19, 19, 19);stroke:rgb(47, 47, 47);stroke-dasharray:2,2;}#chatgpt-mermaid-\_r_2qe\_ .edgePaths .flowchart-link{stroke:rgb(175, 175, 175);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-\_r_2qe\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_2qe\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}Generate Scene PromptPrepare Reference AssetsAwaiting ImportUser Generates VideoExternallyUser Imports Generated VideoValidate Imported AssetResume Dependent JobsVideo Composition

An `AWAITING_IMPORT` job releases its worker slot and resumes only after the required asset is successfully imported.

## **20. Cost management integration**

Before executing a paid AI job, Clipflow must check:

- Estimated generation cost.
- Remaining daily and monthly budget.
- Provider availability.
- User approval.
- Existing generation attempts.
- Duplicate request risk.
- Required credits.

The system should reserve the estimated budget before execution and reconcile it against the actual charge afterward.

Detailed financial rules will be defined in `12_COST_MANAGEMENT.md`.

## **21. Notifications**

| Event                          | Notification                       |
| ------------------------------ | ---------------------------------- |
| Video completed                | Video is ready for review          |
| Bulk clipping completed        | Successful and failed clip counts  |
| AI approval required           | Review estimated generation cost   |
| Manual generation required     | Import generated scene             |
| Job failed                     | Failure reason and recovery action |
| Scheduled publishing completed | Publishing confirmation            |
| Publishing failed              | Review platform error              |
| Budget exceeded                | Additional generation blocked      |
| Storage insufficient           | Free up storage                    |
| Worker unavailable             | Background processing interrupted  |

Initially, notifications will be available inside the Clipflow application.

Email and external notifications can be added later if required.

## **22. Proposed folder structure**

```
src/
├── app/
│   └── api/
│       └── jobs/
├── modules/
│   └── jobs/
│       ├── job.service.ts
│       ├── job.repository.ts
│       ├── job.validation.ts
│       └── job.types.ts
├── models/
│   └── Job.ts
└── workers/
    ├── index.ts
    ├── worker-manager.ts
    ├── queue-manager.ts
    ├── scheduler.ts
    ├── retry-manager.ts
    ├── recovery-manager.ts
    ├── progress-tracker.ts
    └── processors/
        ├── media.processor.ts
        ├── transcription.processor.ts
        ├── ai.processor.ts
        ├── render.processor.ts
        ├── sync.processor.ts
        ├── publishing.processor.ts
        └── maintenance.processor.ts
```

This structure must be reconciled with the existing Clipflow codebase before implementation.

## **23. Proposed API endpoints**

| Method | Endpoint                 | Purpose                           |
| ------ | ------------------------ | --------------------------------- |
| GET    | `/api/jobs`              | List user's jobs                  |
| GET    | `/api/jobs/[id]`         | Retrieve job details              |
| POST   | `/api/jobs`              | Create an authorized job          |
| POST   | `/api/jobs/[id]/approve` | Approve eligible job              |
| POST   | `/api/jobs/[id]/cancel`  | Request cancellation              |
| POST   | `/api/jobs/[id]/retry`   | Retry eligible job                |
| GET    | `/api/jobs/[id]/logs`    | Retrieve processing logs          |
| GET    | `/api/jobs/stats`        | Retrieve queue statistics         |
| GET    | `/api/jobs/health`       | Retrieve authorized worker status |

Final API contracts will be defined in `09_API_DESIGN.md`.

The job creation endpoint must validate allowed job types and inputs. Users must not be able to submit arbitrary executable commands.

## **24. Security requirements**

- Authenticate all protected job endpoints.
- Verify user, workspace and project ownership.
- Validate job inputs using Zod.
- Prevent arbitrary command execution.
- Protect API credentials.
- Validate remote media URLs.
- Prevent duplicate paid operations.
- Restrict worker permissions.
- Limit resource consumption.
- Sanitize error messages and logs.
- Require publishing approval.
- Prevent unauthorized job cancellation or modification.
- Never expose another user's job data.

## **25. Testing requirements**

| Test                 | Expected result                     |
| -------------------- | ----------------------------------- |
| Job creation         | Valid job enters queue              |
| Invalid job creation | Request rejected                    |
| Worker execution     | Job processed successfully          |
| Concurrent claiming  | No simultaneous duplicate claim     |
| Dependency handling  | Correct execution order             |
| Progress tracking    | Actual progress displayed           |
| Retry handling       | Recoverable job retried             |
| Cancellation         | Eligible job safely stopped         |
| Worker crash         | Job recovered appropriately         |
| Laptop restart       | Eligible interrupted jobs recovered |
| Budget validation    | Unauthorized spending blocked       |
| Duplicate publishing | Duplicate submission prevented      |
| Workspace isolation  | Unauthorized access rejected        |
| Partial bulk failure | Successful outputs preserved        |

## **26. Implementation priority**

| Phase          | Features                                                          |
| -------------- | ----------------------------------------------------------------- |
| Phase 1        | Job schema, MongoDB queue, worker, basic progress and FFmpeg jobs |
| Phase 2        | Whisper jobs, dependencies, retries and cancellation              |
| Phase 3        | AI generation, manual import workflow and cost approval           |
| Phase 4        | Bulk processing, scheduling, publishing and notifications         |
| Phase 5        | Advanced recovery, monitoring and performance optimization        |
| Future scaling | Redis, BullMQ and dedicated cloud workers                         |

## **27. Final decision**

Clipflow will initially use a **MongoDB-backed persistent job queue with a separate Node.js worker application**.

| Responsibility    | Selected approach              |
| ----------------- | ------------------------------ |
| Job storage       | MongoDB                        |
| Queue management  | Custom MongoDB-backed queue    |
| Job execution     | Node.js workers                |
| Job claiming      | Atomic database operations     |
| Worker recovery   | Heartbeats and expiring leases |
| Progress tracking | API polling                    |
| Scheduling        | Node.js scheduler              |
| Media processing  | FFmpeg                         |
| Transcription     | Local Whisper                  |
| Rendering         | FFmpeg and Remotion            |
| Paid generation   | Approval and budget validation |
| Deployment        | Local-first                    |
| Future scaling    | Redis + BullMQ                 |

**Pending validation:** Laptop processing capacity, MongoDB connectivity, worker concurrency, external provider cancellation support and API rate limits.

The retry intervals, heartbeat timings, scheduling frequencies and concurrency limits are proposed starting configurations. They have not been tested or implemented yet.

**Save in:** `Documentation/07_BACKGROUND_JOB_ARCHITECTURE.md`

**Next:** `08_DATABASE_DESIGN.md` — complete MongoDB database architecture, collections, schemas, relationships, indexes, existing database reuse and data management rules.