# **09 — API Design**

**Project:** Clipflow Creator Studio\
**Document:** `09_API_DESIGN.md`\
**Architecture:** REST API using Next.js App Router\
**Database:** MongoDB Atlas + Mongoose\
**Validation:** Zod\
**Authentication:** JWT with secure HttpOnly cookies and revocable sessions.

## **1. Objective**

Design a centralized, secure and consistent API architecture that connects Clipflow's frontend, database, background workers, AI providers and external platforms.

The API architecture must support:

- Authentication and authorization.
- Multiple brand workspaces.
- Campaign and trend discovery.
- AI-powered content generation.
- Video editing and media processing.
- Background job management.
- Social media publishing.
- Analytics and earnings.
- Cost management.
- External API integrations.

Existing working APIs should be reused and extended wherever possible.

## **2. What is an API?**

An API allows different parts of an application to communicate with each other.

For example, when a user creates a UGC project:

MongoDBNext.js APIReact FrontendUserMongoDBNext.js APIReact FrontendUser#chatgpt-mermaid-\_r_4nd\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_4nd\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_4nd\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_4nd\_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_4nd\_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4nd\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_4nd\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_4nd\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_4nd\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_4nd\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_4nd\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_4nd\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4nd\_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4nd\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_4nd\_ p{margin:0;}#chatgpt-mermaid-\_r_4nd\_ .actor{stroke:rgb(31, 78, 148);fill:rgb(19, 33, 54);stroke-width:1;}#chatgpt-mermaid-\_r_4nd\_ rect.actor.outer-path[data-look="neo"]{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4nd\_ rect.note[data-look="neo"]{stroke:rgb(58, 132, 63);fill:rgb(48, 48, 48);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4nd\_ text.actor>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4nd\_ .actor-line{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4nd\_ .innerArc{stroke-width:1.5;stroke-dasharray:none;}#chatgpt-mermaid-\_r_4nd\_ .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4nd\_ .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4nd\_ [id$="-arrowhead"] path{fill:rgb(159, 159, 159);stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4nd\_ .sequenceNumber{fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_4nd\_ [id$="-sequencenumber"]{fill:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4nd\_ [id$="-crosshead"] path{fill:rgb(159, 159, 159);stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4nd\_ .messageText{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4nd\_ .labelBox{stroke:rgba(255, 255, 255, 0.15);fill:rgb(14, 14, 14);filter:none;}#chatgpt-mermaid-\_r_4nd\_ .labelText,#chatgpt-mermaid-\_r_4nd\_ .labelText>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4nd\_ .loopText,#chatgpt-mermaid-\_r_4nd\_ .loopText>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4nd\_ .sectionTitle,#chatgpt-mermaid-\_r_4nd\_ .sectionTitle>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4nd\_ .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:rgba(255, 255, 255, 0.15);fill:rgba(255, 255, 255, 0.15);}#chatgpt-mermaid-\_r_4nd\_ .note{stroke:rgb(58, 132, 63);fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_4nd\_ .noteText,#chatgpt-mermaid-\_r_4nd\_ .noteText>tspan{fill:rgb(237, 237, 237);stroke:none;font-weight:normal;}#chatgpt-mermaid-\_r_4nd\_ .activation0{fill:rgb(48, 48, 48);stroke:hsl(0, 0%, 8.8235294118%);}#chatgpt-mermaid-\_r_4nd\_ .activation1{fill:rgb(48, 48, 48);stroke:hsl(0, 0%, 8.8235294118%);}#chatgpt-mermaid-\_r_4nd\_ .activation2{fill:rgb(48, 48, 48);stroke:hsl(0, 0%, 8.8235294118%);}#chatgpt-mermaid-\_r_4nd\_ .actorPopupMenu{position:absolute;}#chatgpt-mermaid-\_r_4nd\_ .actorPopupMenuPanel{position:absolute;fill:rgb(19, 33, 54);box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#chatgpt-mermaid-\_r_4nd\_ .actor-man circle,#chatgpt-mermaid-\_r_4nd\_ line{fill:rgb(19, 33, 54);stroke-width:2px;}#chatgpt-mermaid-\_r_4nd\_ g rect.rect{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_4nd\_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_4nd\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_4nd\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_4nd\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_4nd\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4nd\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_4nd\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_4nd\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_4nd\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4nd\_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-\_r_4nd\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_4nd\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4nd\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_4nd\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_4nd\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4nd\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_4nd\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4nd\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}Create UGC ProjectPOST /api/projectsAuthenticate and validateSave projectReturn saved project201 CreatedDisplay project

The frontend does not directly communicate with MongoDB. The backend API manages that communication securely.

## **3. API technology stack**

| Technology             | Responsibility                    |
| ---------------------- | --------------------------------- |
| Next.js Route Handlers | API endpoints                     |
| TypeScript             | Request and response types        |
| Zod                    | Request validation                |
| Mongoose               | Database operations               |
| JWT                    | Authentication                    |
| HttpOnly cookies       | Secure session transport          |
| Node.js workers        | Long-running operations           |
| Fetch API              | HTTP communication                |
| Postman                | Manual API testing                |
| Vitest                 | Automated API and service testing |
| Playwright             | End-to-end testing                |

## **4. API architecture**

\#chatgpt-mermaid-\_r_4ne\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_4ne\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_4ne\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_4ne\_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_4ne\_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4ne\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_4ne\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_4ne\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_4ne\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_4ne\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_4ne\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_4ne\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4ne\_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4ne\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_4ne\_ p{margin:0;}#chatgpt-mermaid-\_r_4ne\_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4ne\_ .cluster-label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4ne\_ .cluster-label span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4ne\_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-\_r_4ne\_ .label text,#chatgpt-mermaid-\_r_4ne\_ span{fill:rgb(237, 237, 237);color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4ne\_ .node rect,#chatgpt-mermaid-\_r_4ne\_ .node circle,#chatgpt-mermaid-\_r_4ne\_ .node ellipse,#chatgpt-mermaid-\_r_4ne\_ .node polygon,#chatgpt-mermaid-\_r_4ne\_ .node path{fill:rgb(19, 33, 54);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-\_r_4ne\_ .rough-node .label text,#chatgpt-mermaid-\_r_4ne\_ .node .label text,#chatgpt-mermaid-\_r_4ne\_ .image-shape .label,#chatgpt-mermaid-\_r_4ne\_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-\_r_4ne\_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-\_r_4ne\_ .rough-node .label,#chatgpt-mermaid-\_r_4ne\_ .node .label,#chatgpt-mermaid-\_r_4ne\_ .image-shape .label,#chatgpt-mermaid-\_r_4ne\_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-\_r_4ne\_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-\_r_4ne\_ .root .anchor path{fill:rgb(175, 175, 175)!important;stroke-width:0;stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4ne\_ .arrowheadPath{fill:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4ne\_ .edgePath .path{stroke:rgb(175, 175, 175);stroke-width:1px;}#chatgpt-mermaid-\_r_4ne\_ .flowchart-link{stroke:rgb(175, 175, 175);fill:none;}#chatgpt-mermaid-\_r_4ne\_ .edgeLabel{background-color:rgb(14, 14, 14);text-align:center;}#chatgpt-mermaid-\_r_4ne\_ .edgeLabel p{background-color:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_4ne\_ .edgeLabel rect{opacity:0.5;background-color:rgb(14, 14, 14);fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_4ne\_ .labelBkg{background-color:rgba(14, 14, 14, 0.5);}#chatgpt-mermaid-\_r_4ne\_ .cluster rect{fill:rgb(48, 48, 48);stroke:rgba(255, 255, 255, 0.15);stroke-width:1px;}#chatgpt-mermaid-\_r_4ne\_ .cluster text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4ne\_ .cluster span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4ne\_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(48, 48, 48);border:1px solid rgba(255, 255, 255, 0.15);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-\_r_4ne\_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4ne\_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-\_r_4ne\_ .icon-shape,#chatgpt-mermaid-\_r_4ne\_ .image-shape{background-color:rgb(14, 14, 14);text-align:center;}#chatgpt-mermaid-\_r_4ne\_ .icon-shape p,#chatgpt-mermaid-\_r_4ne\_ .image-shape p{background-color:rgb(14, 14, 14);padding:2px;}#chatgpt-mermaid-\_r_4ne\_ .icon-shape .label rect,#chatgpt-mermaid-\_r_4ne\_ .image-shape .label rect{opacity:0.5;background-color:rgb(14, 14, 14);fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_4ne\_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-\_r_4ne\_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-\_r_4ne\_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_4ne\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_4ne\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_4ne\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_4ne\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4ne\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_4ne\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_4ne\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_4ne\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4ne\_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-\_r_4ne\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_4ne\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4ne\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_4ne\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_4ne\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4ne\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_4ne\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4ne\_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(232, 232, 232);}#chatgpt-mermaid-\_r_4ne\_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(232, 232, 232);}#chatgpt-mermaid-\_r_4ne\_ .node tspan[font-weight="normal"],#chatgpt-mermaid-\_r_4ne\_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-\_r_4ne\_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(19, 19, 19);stroke:rgb(47, 47, 47);stroke-width:1px;}#chatgpt-mermaid-\_r_4ne\_ .node rect,#chatgpt-mermaid-\_r_4ne\_ .node circle,#chatgpt-mermaid-\_r_4ne\_ .node ellipse,#chatgpt-mermaid-\_r_4ne\_ .node polygon,#chatgpt-mermaid-\_r_4ne\_ .node path{fill:rgb(24, 24, 24);stroke:rgba(255, 255, 255, 0.1);stroke-width:1px;}#chatgpt-mermaid-\_r_4ne\_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-\_r_4ne\_ .mermaid-decision .label-container{fill:rgb(19, 19, 19);stroke:rgb(47, 47, 47);stroke-dasharray:2,2;}#chatgpt-mermaid-\_r_4ne\_ .edgePaths .flowchart-link{stroke:rgb(175, 175, 175);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-\_r_4ne\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4ne\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}React FrontendNext.js API RouteAuthenticationAuthorizationZod ValidationService LayerRepository LayerMongoDBAI OrchestratorBackground Job QueueStorage ServiceExternal API AdaptersNode.js WorkersStandard API Response

### **Architecture responsibilities**

| Layer            | Responsibility                 |
| ---------------- | ------------------------------ |
| Route handler    | Receive HTTP requests          |
| Authentication   | Identify the current user      |
| Authorization    | Verify access permissions      |
| Validation       | Validate request data          |
| Service          | Execute business logic         |
| Repository       | Perform database operations    |
| Provider adapter | Communicate with external APIs |
| Job manager      | Queue long-running operations  |
| Response handler | Return standardized responses  |

## **5. HTTP methods**

| Method | Purpose                             | Example                        |
| ------ | ----------------------------------- | ------------------------------ |
| GET    | Retrieve information                | Get all projects               |
| POST   | Create resources or execute actions | Create a project               |
| PATCH  | Update selected fields              | Update project title           |
| PUT    | Replace a complete resource         | Replace timeline configuration |
| DELETE | Remove a resource                   | Delete a draft project         |

GET requests must not perform state-changing operations.

## **6. Standard API response format**

### **Successful response**

```
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "project_001",
    "title": "Fashion UGC Video",
    "status": "DRAFT"
  }
}
```

### **Error response**

```
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid project duration",
    "details": [
      {
        "field": "duration",
        "message": "Duration must be greater than zero"
      }
    ]
  },
  "requestId": "req_001"
}
```

### **Paginated response**

```
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true
  }
}
```

### **Background job response**

```
{
  "success": true,
  "message": "Video rendering job queued",
  "data": {
    "jobId": "job_001",
    "status": "QUEUED",
    "statusUrl": "/api/jobs/job_001"
  }
}
```

Long-running operations should return HTTP `202 Accepted` after successfully creating a job.

## **7. HTTP status codes**

| Code | Meaning                | Usage                                      |
| ---- | ---------------------- | ------------------------------------------ |
| 200  | OK                     | Successful retrieval or update             |
| 201  | Created                | Resource created                           |
| 202  | Accepted               | Background job accepted                    |
| 204  | No Content             | Successful operation without response body |
| 400  | Bad Request            | Invalid request                            |
| 401  | Unauthorized           | User not authenticated                     |
| 403  | Forbidden              | Insufficient permissions                   |
| 404  | Not Found              | Resource unavailable                       |
| 409  | Conflict               | Duplicate or conflicting operation         |
| 413  | Payload Too Large      | File exceeds allowed size                  |
| 415  | Unsupported Media Type | Invalid file format                        |
| 422  | Unprocessable Content  | Business validation failure                |
| 429  | Too Many Requests      | Rate limit exceeded                        |
| 500  | Internal Server Error  | Unexpected server error                    |
| 502  | Bad Gateway            | External provider failure                  |
| 503  | Service Unavailable    | Temporary service unavailability           |

## **8. Complete API endpoint design**

The following endpoints represent the proposed target architecture. They are not all currently implemented.

### **8.1 Authentication APIs**

| Method | Endpoint                    | Purpose                  |
| ------ | --------------------------- | ------------------------ |
| POST   | `/api/auth/register`        | Register user            |
| POST   | `/api/auth/login`           | Authenticate user        |
| POST   | `/api/auth/logout`          | End current session      |
| GET    | `/api/auth/session`         | Retrieve current session |
| POST   | `/api/auth/forgot-password` | Request password reset   |
| POST   | `/api/auth/verify-otp`      | Verify reset OTP         |
| POST   | `/api/auth/reset-password`  | Reset password           |
| GET    | `/api/auth/sessions`        | Retrieve active sessions |
| DELETE | `/api/auth/sessions/[id]`   | Revoke session           |

**Security:** Password hashing, OTP expiration, attempt limits, secure cookies and session revocation.

### **8.2 User and settings APIs**

| Method | Endpoint                     | Purpose               |
| ------ | ---------------------------- | --------------------- |
| GET    | `/api/users/me`              | Retrieve user profile |
| PATCH  | `/api/users/me`              | Update profile        |
| POST   | `/api/users/change-password` | Change password       |
| GET    | `/api/settings`              | Retrieve preferences  |
| PATCH  | `/api/settings`              | Update preferences    |

### **8.3 Workspace APIs**

| Method | Endpoint                        | Purpose                    |
| ------ | ------------------------------- | -------------------------- |
| GET    | `/api/workspaces`               | List brand workspaces      |
| POST   | `/api/workspaces`               | Create workspace           |
| GET    | `/api/workspaces/[id]`          | Retrieve workspace         |
| PATCH  | `/api/workspaces/[id]`          | Update workspace           |
| DELETE | `/api/workspaces/[id]`          | Archive workspace          |
| GET    | `/api/workspaces/[id]/overview` | Retrieve workspace summary |

Every workspace-specific API must verify workspace ownership.

### **8.4 Dashboard APIs**

| Method | Endpoint                         | Purpose                     |
| ------ | -------------------------------- | --------------------------- |
| GET    | `/api/dashboard`                 | Retrieve dashboard overview |
| GET    | `/api/dashboard/recommendations` | Retrieve AI recommendations |
| GET    | `/api/dashboard/activity`        | Retrieve recent activity    |
| GET    | `/api/dashboard/stats`           | Retrieve summary statistics |

Dashboard responses should aggregate actual application data rather than static values.

### **8.5 Campaign discovery APIs**

| Method | Endpoint                       | Purpose                           |
| ------ | ------------------------------ | --------------------------------- |
| GET    | `/api/campaigns`               | List available campaigns          |
| GET    | `/api/campaigns/[id]`          | Retrieve campaign details         |
| POST   | `/api/campaigns`               | Create authorized manual campaign |
| PATCH  | `/api/campaigns/[id]`          | Update authorized campaign        |
| POST   | `/api/campaigns/sync`          | Queue campaign synchronization    |
| POST   | `/api/campaigns/import`        | Import campaign information       |
| GET    | `/api/campaigns/sources`       | Retrieve source availability      |
| GET    | `/api/campaigns/saved`         | Retrieve saved campaigns          |
| POST   | `/api/campaigns/[id]/save`     | Save campaign                     |
| DELETE | `/api/campaigns/[id]/save`     | Remove saved campaign             |
| PATCH  | `/api/campaigns/[id]/tracking` | Update personal tracking status   |

Supported filters:

- Source.
- Category.
- Platform.
- Payout range.
- Campaign status.
- Deadline.
- Search keyword.
- Sorting and pagination.

Public campaign records and user-specific tracking records must remain separate.

### **8.6 Trend research APIs**

| Method | Endpoint                    | Purpose                           |
| ------ | --------------------------- | --------------------------------- |
| GET    | `/api/trends`               | Retrieve available trends         |
| GET    | `/api/trends/[id]`          | Retrieve trend details            |
| POST   | `/api/trends/sync`          | Queue trend synchronization       |
| POST   | `/api/trends/analyze`       | Analyze selected trends           |
| POST   | `/api/research/competitors` | Analyze supported competitor data |
| POST   | `/api/research/keywords`    | Generate keyword research         |
| POST   | `/api/research/references`  | Analyze supplied references       |

External platform data access must respect API permissions and availability.

### **8.7 Project APIs**

| Method | Endpoint                       | Purpose                  |
| ------ | ------------------------------ | ------------------------ |
| GET    | `/api/projects`                | Retrieve user's projects |
| POST   | `/api/projects`                | Create project           |
| GET    | `/api/projects/[id]`           | Retrieve project details |
| PATCH  | `/api/projects/[id]`           | Update project           |
| DELETE | `/api/projects/[id]`           | Archive project          |
| POST   | `/api/projects/[id]/duplicate` | Duplicate project        |
| GET    | `/api/projects/[id]/assets`    | Retrieve project assets  |
| GET    | `/api/projects/[id]/jobs`      | Retrieve project jobs    |
| GET    | `/api/projects/[id]/exports`   | Retrieve project exports |

Supported project types:

`CLIPPING`, `UGC`, `AI_VIDEO`, `REFERENCE_VIDEO`, `VIDEO_EDITING`.

Existing project task and draft functionality must also be preserved during API migration.

### **8.8 AI intelligence APIs**

| Method | Endpoint                   | Purpose                        |
| ------ | -------------------------- | ------------------------------ |
| POST   | `/api/ai/recommendations`  | Generate recommendations       |
| POST   | `/api/ai/scripts`          | Generate scripts               |
| POST   | `/api/ai/hooks`            | Generate content hooks         |
| POST   | `/api/ai/storyboards`      | Generate storyboard            |
| POST   | `/api/ai/prompts`          | Generate creative prompts      |
| POST   | `/api/ai/captions`         | Generate captions              |
| POST   | `/api/ai/seo`              | Generate SEO information       |
| POST   | `/api/ai/analyze`          | Analyze supported content      |
| POST   | `/api/ai/estimate-cost`    | Estimate generation expense    |
| GET    | `/api/ai/providers`        | Retrieve provider capabilities |
| GET    | `/api/ai/generations`      | Retrieve generation history    |
| GET    | `/api/ai/generations/[id]` | Retrieve generation details    |

All AI requests must pass through the centralized AI Orchestrator.

### **8.9 Clipping Studio APIs**

| Method | Endpoint                            | Purpose                   |
| ------ | ----------------------------------- | ------------------------- |
| POST   | `/api/clipping/import`              | Import authorized video   |
| POST   | `/api/clipping/analyze`             | Analyze viral moments     |
| POST   | `/api/clipping/transcribe`          | Queue transcription       |
| POST   | `/api/clipping/generate`            | Queue clip generation     |
| GET    | `/api/clipping/projects/[id]/clips` | Retrieve generated clips  |
| PATCH  | `/api/clipping/clips/[id]`          | Update clip configuration |
| POST   | `/api/clipping/clips/[id]/render`   | Render individual clip    |
| POST   | `/api/clipping/bulk-render`         | Queue multiple clips      |
| DELETE | `/api/clipping/clips/[id]`          | Remove clip               |

Clipping endpoints should use shared media, AI and job services instead of implementing duplicate processing logic.

### **8.10 UGC Studio APIs**

| Method | Endpoint                       | Purpose                                 |
| ------ | ------------------------------ | --------------------------------------- |
| POST   | `/api/ugc/analyze-product`     | Analyze product references              |
| POST   | `/api/ugc/generate-concept`    | Generate advertisement concept          |
| POST   | `/api/ugc/generate-character`  | Generate AI character                   |
| POST   | `/api/ugc/generate-images`     | Generate product and lifestyle images   |
| POST   | `/api/ugc/generate-scene`      | Generate individual video scene         |
| POST   | `/api/ugc/try-on`              | Generate virtual try-on where supported |
| POST   | `/api/ugc/generate-variations` | Generate advertisement variations       |

Unsupported generation capabilities must return an appropriate error or offer a manual workflow.

### **8.11 AI Video Studio APIs**

| Method | Endpoint                        | Purpose                      |
| ------ | ------------------------------- | ---------------------------- |
| POST   | `/api/video/text-to-video`      | Generate video from text     |
| POST   | `/api/video/image-to-video`     | Generate video from image    |
| POST   | `/api/video/generate-scene`     | Generate individual scene    |
| POST   | `/api/video/generate-animation` | Generate supported animation |
| POST   | `/api/video/regenerate`         | Regenerate selected output   |

### **8.12 Reference Studio APIs**

| Method | Endpoint                              | Purpose                         |
| ------ | ------------------------------------- | ------------------------------- |
| POST   | `/api/references/import`              | Import reference media          |
| POST   | `/api/references/analyze`             | Analyze reference video         |
| GET    | `/api/references/[id]/analysis`       | Retrieve analysis               |
| POST   | `/api/references/generate-plan`       | Generate original creative plan |
| POST   | `/api/references/generate-storyboard` | Generate storyboard             |

### **8.13 Storyboard APIs**

| Method | Endpoint                          | Purpose               |
| ------ | --------------------------------- | --------------------- |
| GET    | `/api/projects/[id]/storyboards`  | Retrieve storyboards  |
| POST   | `/api/projects/[id]/storyboards`  | Create storyboard     |
| GET    | `/api/storyboards/[id]`           | Retrieve storyboard   |
| PATCH  | `/api/storyboards/[id]`           | Update storyboard     |
| POST   | `/api/storyboards/[id]/approve`   | Approve storyboard    |
| POST   | `/api/storyboards/[id]/duplicate` | Create new version    |
| DELETE | `/api/storyboards/[id]`           | Remove eligible draft |

### **8.14 Scene APIs**

| Method | Endpoint                        | Purpose                           |
| ------ | ------------------------------- | --------------------------------- |
| GET    | `/api/storyboards/[id]/scenes`  | Retrieve scenes                   |
| POST   | `/api/storyboards/[id]/scenes`  | Add scene                         |
| PATCH  | `/api/scenes/[id]`              | Update scene                      |
| DELETE | `/api/scenes/[id]`              | Remove scene                      |
| POST   | `/api/scenes/[id]/duplicate`    | Duplicate scene                   |
| POST   | `/api/scenes/[id]/generate`     | Queue generation                  |
| POST   | `/api/scenes/[id]/regenerate`   | Regenerate scene                  |
| POST   | `/api/scenes/[id]/import`       | Import externally generated scene |
| POST   | `/api/scenes/[id]/approve`      | Approve scene                     |
| PATCH  | `/api/storyboards/[id]/reorder` | Reorder scenes                    |

Scene timing must be validated against the storyboard's total duration.

### **8.15 Video editor APIs**

| Method | Endpoint                               | Purpose                     |
| ------ | -------------------------------------- | --------------------------- |
| GET    | `/api/projects/[id]/timeline`          | Retrieve active timeline    |
| PUT    | `/api/projects/[id]/timeline`          | Save timeline configuration |
| GET    | `/api/projects/[id]/timeline/versions` | Retrieve saved versions     |
| POST   | `/api/projects/[id]/timeline/restore`  | Restore timeline version    |
| POST   | `/api/editor/preview`                  | Generate preview            |
| POST   | `/api/editor/render`                   | Queue final rendering       |
| POST   | `/api/editor/proxy`                    | Generate lightweight proxy  |

Trimming, splitting, drag-and-drop and undo/redo should primarily operate in frontend state. The API persists the resulting timeline instead of making a server request for every small editing action.

### **8.16 Audio and subtitle APIs**

| Method | Endpoint                    | Purpose                     |
| ------ | --------------------------- | --------------------------- |
| POST   | `/api/audio/extract`        | Extract audio               |
| POST   | `/api/audio/voiceover`      | Generate narration          |
| POST   | `/api/audio/enhance`        | Enhance audio               |
| POST   | `/api/audio/mix`            | Mix audio tracks            |
| POST   | `/api/audio/lip-sync`       | Generate supported lip-sync |
| POST   | `/api/transcripts/generate` | Queue transcription         |
| GET    | `/api/transcripts/[id]`     | Retrieve transcript         |
| PATCH  | `/api/transcripts/[id]`     | Correct transcript          |
| POST   | `/api/subtitles/generate`   | Generate subtitles          |
| POST   | `/api/subtitles/export`     | Export SRT or VTT           |

### **8.17 Motion graphics APIs**

| Method | Endpoint                | Purpose                    |
| ------ | ----------------------- | -------------------------- |
| GET    | `/api/motion/templates` | Retrieve motion templates  |
| POST   | `/api/motion/preview`   | Generate animation preview |
| POST   | `/api/motion/render`    | Render motion graphics     |
| POST   | `/api/motion/templates` | Save custom template       |

### **8.18 Asset management APIs**

| Method | Endpoint                     | Purpose                          |
| ------ | ---------------------------- | -------------------------------- |
| GET    | `/api/assets`                | Retrieve media library           |
| POST   | `/api/assets/upload`         | Upload media                     |
| POST   | `/api/assets/import`         | Import authorized external media |
| GET    | `/api/assets/[id]`           | Retrieve asset metadata          |
| PATCH  | `/api/assets/[id]`           | Update asset information         |
| DELETE | `/api/assets/[id]`           | Delete eligible asset            |
| GET    | `/api/assets/[id]/content`   | Stream authorized media          |
| GET    | `/api/assets/[id]/download`  | Download media                   |
| POST   | `/api/assets/[id]/thumbnail` | Generate thumbnail               |

Large uploads should use streaming or an appropriate chunked upload mechanism.

### **8.19 Template APIs**

| Method | Endpoint                        | Purpose                   |
| ------ | ------------------------------- | ------------------------- |
| GET    | `/api/templates`                | Retrieve templates        |
| POST   | `/api/templates`                | Create template           |
| GET    | `/api/templates/[id]`           | Retrieve template         |
| PATCH  | `/api/templates/[id]`           | Update template           |
| DELETE | `/api/templates/[id]`           | Remove template           |
| POST   | `/api/templates/[id]/apply`     | Apply template to project |
| POST   | `/api/templates/[id]/duplicate` | Duplicate template        |

### **8.20 Background job APIs**

| Method | Endpoint                 | Purpose                           |
| ------ | ------------------------ | --------------------------------- |
| GET    | `/api/jobs`              | Retrieve user's jobs              |
| POST   | `/api/jobs`              | Create allowed background job     |
| GET    | `/api/jobs/[id]`         | Retrieve job status               |
| POST   | `/api/jobs/[id]/approve` | Approve job execution             |
| POST   | `/api/jobs/[id]/cancel`  | Cancel eligible job               |
| POST   | `/api/jobs/[id]/retry`   | Retry failed job                  |
| GET    | `/api/jobs/[id]/logs`    | Retrieve sanitized logs           |
| GET    | `/api/jobs/stats`        | Retrieve queue statistics         |
| GET    | `/api/jobs/health`       | Retrieve authorized worker status |

### **8.21 Export APIs**

| Method | Endpoint                     | Purpose                          |
| ------ | ---------------------------- | -------------------------------- |
| POST   | `/api/exports`               | Queue video export               |
| GET    | `/api/exports`               | Retrieve exports                 |
| GET    | `/api/exports/[id]`          | Retrieve export details          |
| POST   | `/api/exports/[id]/approve`  | Approve completed export         |
| GET    | `/api/exports/[id]/download` | Download video                   |
| GET    | `/api/exports/[id]/package`  | Download complete export package |
| DELETE | `/api/exports/[id]`          | Remove eligible export           |

### **8.22 Social account APIs**

| Method | Endpoint                         | Purpose                     |
| ------ | -------------------------------- | --------------------------- |
| GET    | `/api/social/accounts`           | Retrieve connected accounts |
| GET    | `/api/social/accounts/[id]`      | Retrieve account details    |
| GET    | `/api/social/youtube/connect`    | Start Google OAuth          |
| GET    | `/api/social/youtube/callback`   | Complete Google OAuth       |
| GET    | `/api/social/instagram/connect`  | Start Instagram OAuth       |
| GET    | `/api/social/instagram/callback` | Complete Instagram OAuth    |
| POST   | `/api/social/accounts/[id]/sync` | Synchronize account         |
| DELETE | `/api/social/accounts/[id]`      | Disconnect account          |

OAuth tokens must never be returned to the frontend.

### **8.23 Publishing APIs**

| Method | Endpoint                       | Purpose                     |
| ------ | ------------------------------ | --------------------------- |
| GET    | `/api/publishing`              | Retrieve publishing records |
| POST   | `/api/publishing`              | Create publishing draft     |
| GET    | `/api/publishing/[id]`         | Retrieve publishing details |
| PATCH  | `/api/publishing/[id]`         | Update draft or schedule    |
| POST   | `/api/publishing/[id]/approve` | Approve publication         |
| POST   | `/api/publishing/[id]/publish` | Queue immediate publishing  |
| POST   | `/api/publishing/[id]/cancel`  | Cancel eligible publication |
| POST   | `/api/publishing/[id]/retry`   | Retry eligible publication  |
| GET    | `/api/publishing/calendar`     | Retrieve content calendar   |

Publishing approval must be invalidated if the approved video, caption, destination account or other material publishing settings change.

### **8.24 Analytics APIs**

| Method | Endpoint                         | Purpose                          |
| ------ | -------------------------------- | -------------------------------- |
| GET    | `/api/analytics/overview`        | Retrieve overall performance     |
| GET    | `/api/analytics/accounts/[id]`   | Retrieve account analytics       |
| GET    | `/api/analytics/posts/[id]`      | Retrieve post analytics          |
| GET    | `/api/analytics/growth`          | Retrieve growth history          |
| GET    | `/api/analytics/top-content`     | Retrieve best-performing content |
| POST   | `/api/analytics/sync`            | Queue synchronization            |
| POST   | `/api/analytics/recommendations` | Generate improvement suggestions |

### **8.25 Affiliate APIs**

| Method | Endpoint                       | Purpose                             |
| ------ | ------------------------------ | ----------------------------------- |
| GET    | `/api/affiliate/products`      | Retrieve affiliate products         |
| GET    | `/api/affiliate/products/[id]` | Retrieve product details            |
| POST   | `/api/affiliate/sync`          | Synchronize affiliate opportunities |
| POST   | `/api/affiliate/links`         | Create supported tracking link      |
| GET    | `/api/affiliate/links`         | Retrieve user's tracking links      |
| GET    | `/api/affiliate/commissions`   | Retrieve commission information     |

Affiliate integration depends on Cuelinks approval and supported API capabilities.

### **8.26 Campaign submission APIs**

| Method | Endpoint                     | Purpose                           |
| ------ | ---------------------------- | --------------------------------- |
| GET    | `/api/submissions`           | Retrieve submissions              |
| POST   | `/api/submissions`           | Create submission                 |
| GET    | `/api/submissions/[id]`      | Retrieve submission details       |
| PATCH  | `/api/submissions/[id]`      | Update permitted fields           |
| POST   | `/api/submissions/[id]/sync` | Verify external submission status |
| DELETE | `/api/submissions/[id]`      | Remove eligible draft             |

Users must not be able to approve their own external campaign earnings through ordinary submission APIs.

### **8.27 Finance and cost management APIs**

| Method | Endpoint                    | Purpose                       |
| ------ | --------------------------- | ----------------------------- |
| GET    | `/api/finance/overview`     | Retrieve financial summary    |
| GET    | `/api/finance/transactions` | Retrieve transactions         |
| POST   | `/api/finance/transactions` | Record manual financial entry |
| GET    | `/api/finance/earnings`     | Retrieve earnings             |
| GET    | `/api/finance/expenses`     | Retrieve expenses             |
| GET    | `/api/finance/profit`       | Retrieve profit calculations  |
| GET    | `/api/costs/usage`          | Retrieve AI usage             |
| GET    | `/api/costs/providers`      | Retrieve provider expenses    |
| GET    | `/api/costs/budgets`        | Retrieve budgets              |
| POST   | `/api/costs/budgets`        | Create budget                 |
| PATCH  | `/api/costs/budgets/[id]`   | Update budget                 |

Financial calculations must distinguish estimated, approved, received and manually recorded earnings.

### **8.28 Notification APIs**

| Method | Endpoint                          | Purpose                   |
| ------ | --------------------------------- | ------------------------- |
| GET    | `/api/notifications`              | Retrieve notifications    |
| GET    | `/api/notifications/unread-count` | Retrieve unread count     |
| PATCH  | `/api/notifications/[id]/read`    | Mark notification as read |
| POST   | `/api/notifications/read-all`     | Mark all as read          |
| DELETE | `/api/notifications/[id]`         | Remove notification       |

### **8.29 Integration and system APIs**

| Method | Endpoint                            | Purpose                          |
| ------ | ----------------------------------- | -------------------------------- |
| GET    | `/api/integrations`                 | Retrieve integration status      |
| GET    | `/api/integrations/[provider]`      | Retrieve provider capabilities   |
| POST   | `/api/integrations/[provider]/test` | Test authorized connection       |
| PATCH  | `/api/integrations/[provider]`      | Update non-secret configuration  |
| GET    | `/api/sync/history`                 | Retrieve synchronization history |
| GET    | `/api/system/health`                | Retrieve basic system health     |
| GET    | `/api/system/storage`               | Retrieve storage availability    |
| GET    | `/api/system/workers`               | Retrieve worker availability     |

Detailed system information must be restricted to authorized users.

## **9. Detailed API request and response examples**

### **9.1 Create UGC project**

**Endpoint:** `POST /api/projects`

**Request:**

```
{
  "workspaceId": "workspace_001",
  "title": "Navy Blue Corset Advertisement",
  "projectType": "UGC",
  "duration": 30,
  "aspectRatio": "9:16",
  "language": "English",
  "targetPlatforms": [
    "INSTAGRAM",
    "YOUTUBE"
  ]
}
```

**Response — 201 Created:**

```
{
  "success": true,
  "data": {
    "id": "project_001",
    "title": "Navy Blue Corset Advertisement",
    "projectType": "UGC",
    "status": "DRAFT",
    "duration": 30
  }
}
```

The backend determines the user ID from the authenticated session.

### **9.2 Generate storyboard**

**Endpoint:** `POST /api/ai/storyboards`

**Request:**

```
{
  "projectId": "project_001",
  "duration": 30,
  "style": "Premium fashion UGC",
  "language": "English",
  "productAssetIds": [
    "asset_001"
  ],
  "requirements": {
    "voiceover": true,
    "captions": true,
    "cta": true
  }
}
```

**Response — 202 Accepted:**

```
{
  "success": true,
  "data": {
    "jobId": "job_002",
    "status": "AWAITING_APPROVAL",
    "taskType": "AI_STORYBOARD_GENERATION"
  }
}
```

### **9.3 Generate individual video scene**

**Endpoint:** `POST /api/scenes/[id]/generate`

**Request:**

```
{
  "providerPreference": "VEO",
  "duration": 5,
  "aspectRatio": "9:16",
  "referenceAssetIds": [
    "asset_001",
    "asset_002"
  ]
}
```

The backend checks provider availability, validates reference assets, estimates costs and determines whether automated generation is supported.

**Possible response for manual generation:**

```
{
  "success": true,
  "data": {
    "jobId": "job_003",
    "status": "AWAITING_IMPORT",
    "integrationMode": "MANUAL",
    "provider": "GOOGLE_FLOW",
    "prompt": "Generate a five-second product close-up using the supplied reference."
  }
}
```

### **9.4 Render final video**

**Endpoint:** `POST /api/exports`

**Request:**

```
{
  "projectId": "project_001",
  "timelineId": "timeline_001",
  "timelineVersion": 3,
  "settings": {
    "format": "MP4",
    "width": 1080,
    "height": 1920,
    "frameRate": 30,
    "videoCodec": "H264",
    "audioCodec": "AAC"
  }
}
```

**Response — 202 Accepted:**

```
{
  "success": true,
  "data": {
    "exportId": "export_001",
    "jobId": "job_004",
    "status": "QUEUED"
  }
}
```

### **9.5 Retrieve job progress**

**Endpoint:** `GET /api/jobs/job_004`

**Response:**

```
{
  "success": true,
  "data": {
    "id": "job_004",
    "type": "VIDEO_RENDER",
    "status": "PROCESSING",
    "progress": 65,
    "currentStage": "Rendering video",
    "attempts": 1,
    "output": null
  }
}
```

Progress values above are illustrative. Actual progress must come from the worker.

### **9.6 Schedule publishing**

**Endpoint:** `POST /api/publishing`

**Request:**

```
{
  "exportId": "export_001",
  "socialAccountId": "account_001",
  "platform": "INSTAGRAM",
  "caption": "Your next favourite outfit.",
  "hashtags": [
    "fashion",
    "style",
    "outfitideas"
  ],
  "scheduledAt": "2026-12-01T13:30:00Z"
}
```

The publishing record remains unapproved until the user explicitly approves the final content and destination account.

## **10. Authentication and authorization flow**

DatabaseAPIFrontendDatabaseAPIFrontend#chatgpt-mermaid-\_r_4pl\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_4pl\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_4pl\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_4pl\_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_4pl\_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4pl\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_4pl\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_4pl\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_4pl\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_4pl\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_4pl\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_4pl\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4pl\_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4pl\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_4pl\_ p{margin:0;}#chatgpt-mermaid-\_r_4pl\_ .actor{stroke:rgb(31, 78, 148);fill:rgb(19, 33, 54);stroke-width:1;}#chatgpt-mermaid-\_r_4pl\_ rect.actor.outer-path[data-look="neo"]{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4pl\_ rect.note[data-look="neo"]{stroke:rgb(58, 132, 63);fill:rgb(48, 48, 48);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4pl\_ text.actor>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4pl\_ .actor-line{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4pl\_ .innerArc{stroke-width:1.5;stroke-dasharray:none;}#chatgpt-mermaid-\_r_4pl\_ .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4pl\_ .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4pl\_ [id$="-arrowhead"] path{fill:rgb(159, 159, 159);stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4pl\_ .sequenceNumber{fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_4pl\_ [id$="-sequencenumber"]{fill:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4pl\_ [id$="-crosshead"] path{fill:rgb(159, 159, 159);stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4pl\_ .messageText{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4pl\_ .labelBox{stroke:rgba(255, 255, 255, 0.15);fill:rgb(14, 14, 14);filter:none;}#chatgpt-mermaid-\_r_4pl\_ .labelText,#chatgpt-mermaid-\_r_4pl\_ .labelText>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4pl\_ .loopText,#chatgpt-mermaid-\_r_4pl\_ .loopText>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4pl\_ .sectionTitle,#chatgpt-mermaid-\_r_4pl\_ .sectionTitle>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4pl\_ .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:rgba(255, 255, 255, 0.15);fill:rgba(255, 255, 255, 0.15);}#chatgpt-mermaid-\_r_4pl\_ .note{stroke:rgb(58, 132, 63);fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_4pl\_ .noteText,#chatgpt-mermaid-\_r_4pl\_ .noteText>tspan{fill:rgb(237, 237, 237);stroke:none;font-weight:normal;}#chatgpt-mermaid-\_r_4pl\_ .activation0{fill:rgb(48, 48, 48);stroke:hsl(0, 0%, 8.8235294118%);}#chatgpt-mermaid-\_r_4pl\_ .activation1{fill:rgb(48, 48, 48);stroke:hsl(0, 0%, 8.8235294118%);}#chatgpt-mermaid-\_r_4pl\_ .activation2{fill:rgb(48, 48, 48);stroke:hsl(0, 0%, 8.8235294118%);}#chatgpt-mermaid-\_r_4pl\_ .actorPopupMenu{position:absolute;}#chatgpt-mermaid-\_r_4pl\_ .actorPopupMenuPanel{position:absolute;fill:rgb(19, 33, 54);box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#chatgpt-mermaid-\_r_4pl\_ .actor-man circle,#chatgpt-mermaid-\_r_4pl\_ line{fill:rgb(19, 33, 54);stroke-width:2px;}#chatgpt-mermaid-\_r_4pl\_ g rect.rect{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_4pl\_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_4pl\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_4pl\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_4pl\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_4pl\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4pl\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_4pl\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_4pl\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_4pl\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4pl\_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-\_r_4pl\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_4pl\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4pl\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_4pl\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_4pl\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4pl\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_4pl\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4pl\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}Login with email and passwordRetrieve userUser and password hashVerify passwordCreate revocable sessionSet secure HttpOnly cookieRequest protected resourceVerify JWT and sessionQuery authorized resourceReturn resourceAuthorized response

### **Authentication rules**

- Passwords must be hashed.
- JWT secrets must be configured securely.
- No hardcoded fallback JWT secret.
- Cookies must use appropriate HttpOnly, Secure and SameSite settings.
- Sessions must support expiration and revocation.
- Password reset OTPs must be hashed, short-lived and rate-limited.
- State-changing cookie-authenticated requests must include CSRF protection.
- Every protected resource must enforce ownership checks.

## **11. Request validation**

All incoming API data must be validated using Zod.

Example project validation:

```
import { z } from "zod";

export const createProjectSchema = z.object({
  workspaceId: z.string().min(1),

  title: z.string()
    .min(3)
    .max(150),

  projectType: z.enum([
    "CLIPPING",
    "UGC",
    "AI_VIDEO",
    "REFERENCE_VIDEO",
    "VIDEO_EDITING"
  ]),

  duration: z.number().positive(),

  aspectRatio: z.enum([
    "9:16",
    "16:9",
    "1:1"
  ]),

  language: z.string().min(1).max(50)
}).strict();
```

This is an illustrative schema. Production validation must additionally verify ObjectIds, workspace ownership, duration limits and supported project configurations.

## **12. Search, filtering and pagination**

Standard query parameters:

```
GET /api/projects
    ?workspaceId=workspace_001
    &type=UGC
    &status=DRAFT
    &search=fashion
    &page=1
    &limit=20
    &sort=updatedAt
    &order=desc
```

| Parameter     | Purpose                     |
| ------------- | --------------------------- |
| `workspaceId` | Filter authorized workspace |
| `search`      | Search resources            |
| `type`        | Filter resource type        |
| `status`      | Filter resource status      |
| `page`        | Current page                |
| `limit`       | Records per page            |
| `sort`        | Allowed sorting field       |
| `order`       | Ascending or descending     |

Proposed default page size: 20 records.

Proposed maximum page size: 100 records.

Search inputs must be escaped or processed through safe search mechanisms. Arbitrary MongoDB operators must not be accepted from client requests.

## **13. File upload and streaming architecture**

\#chatgpt-mermaid-\_r_4pv\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_4pv\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_4pv\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_4pv\_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_4pv\_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4pv\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_4pv\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_4pv\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_4pv\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_4pv\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_4pv\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_4pv\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4pv\_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4pv\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_4pv\_ p{margin:0;}#chatgpt-mermaid-\_r_4pv\_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4pv\_ .cluster-label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4pv\_ .cluster-label span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4pv\_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-\_r_4pv\_ .label text,#chatgpt-mermaid-\_r_4pv\_ span{fill:rgb(237, 237, 237);color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4pv\_ .node rect,#chatgpt-mermaid-\_r_4pv\_ .node circle,#chatgpt-mermaid-\_r_4pv\_ .node ellipse,#chatgpt-mermaid-\_r_4pv\_ .node polygon,#chatgpt-mermaid-\_r_4pv\_ .node path{fill:rgb(19, 33, 54);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-\_r_4pv\_ .rough-node .label text,#chatgpt-mermaid-\_r_4pv\_ .node .label text,#chatgpt-mermaid-\_r_4pv\_ .image-shape .label,#chatgpt-mermaid-\_r_4pv\_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-\_r_4pv\_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-\_r_4pv\_ .rough-node .label,#chatgpt-mermaid-\_r_4pv\_ .node .label,#chatgpt-mermaid-\_r_4pv\_ .image-shape .label,#chatgpt-mermaid-\_r_4pv\_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-\_r_4pv\_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-\_r_4pv\_ .root .anchor path{fill:rgb(175, 175, 175)!important;stroke-width:0;stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4pv\_ .arrowheadPath{fill:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4pv\_ .edgePath .path{stroke:rgb(175, 175, 175);stroke-width:1px;}#chatgpt-mermaid-\_r_4pv\_ .flowchart-link{stroke:rgb(175, 175, 175);fill:none;}#chatgpt-mermaid-\_r_4pv\_ .edgeLabel{background-color:rgb(14, 14, 14);text-align:center;}#chatgpt-mermaid-\_r_4pv\_ .edgeLabel p{background-color:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_4pv\_ .edgeLabel rect{opacity:0.5;background-color:rgb(14, 14, 14);fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_4pv\_ .labelBkg{background-color:rgba(14, 14, 14, 0.5);}#chatgpt-mermaid-\_r_4pv\_ .cluster rect{fill:rgb(48, 48, 48);stroke:rgba(255, 255, 255, 0.15);stroke-width:1px;}#chatgpt-mermaid-\_r_4pv\_ .cluster text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4pv\_ .cluster span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4pv\_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(48, 48, 48);border:1px solid rgba(255, 255, 255, 0.15);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-\_r_4pv\_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4pv\_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-\_r_4pv\_ .icon-shape,#chatgpt-mermaid-\_r_4pv\_ .image-shape{background-color:rgb(14, 14, 14);text-align:center;}#chatgpt-mermaid-\_r_4pv\_ .icon-shape p,#chatgpt-mermaid-\_r_4pv\_ .image-shape p{background-color:rgb(14, 14, 14);padding:2px;}#chatgpt-mermaid-\_r_4pv\_ .icon-shape .label rect,#chatgpt-mermaid-\_r_4pv\_ .image-shape .label rect{opacity:0.5;background-color:rgb(14, 14, 14);fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_4pv\_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-\_r_4pv\_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-\_r_4pv\_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_4pv\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_4pv\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_4pv\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_4pv\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4pv\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_4pv\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_4pv\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_4pv\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4pv\_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-\_r_4pv\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_4pv\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4pv\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_4pv\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_4pv\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4pv\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_4pv\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4pv\_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(232, 232, 232);}#chatgpt-mermaid-\_r_4pv\_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(232, 232, 232);}#chatgpt-mermaid-\_r_4pv\_ .node tspan[font-weight="normal"],#chatgpt-mermaid-\_r_4pv\_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-\_r_4pv\_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(19, 19, 19);stroke:rgb(47, 47, 47);stroke-width:1px;}#chatgpt-mermaid-\_r_4pv\_ .node rect,#chatgpt-mermaid-\_r_4pv\_ .node circle,#chatgpt-mermaid-\_r_4pv\_ .node ellipse,#chatgpt-mermaid-\_r_4pv\_ .node polygon,#chatgpt-mermaid-\_r_4pv\_ .node path{fill:rgb(24, 24, 24);stroke:rgba(255, 255, 255, 0.1);stroke-width:1px;}#chatgpt-mermaid-\_r_4pv\_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-\_r_4pv\_ .mermaid-decision .label-container{fill:rgb(19, 19, 19);stroke:rgb(47, 47, 47);stroke-dasharray:2,2;}#chatgpt-mermaid-\_r_4pv\_ .edgePaths .flowchart-link{stroke:rgb(175, 175, 175);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-\_r_4pv\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4pv\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}User selects mediaAuthenticated upload requestValidate file and storage limitsWrite temporary fileInspect media using FFprobeValid media?Move to permanent storageSave asset metadata inMongoDBReturn asset IDRemove temporary fileReturn validation errorYesNo

### **Upload requirements**

- Validate actual file type.
- Restrict maximum file size.
- Check available disk space.
- Generate safe storage filenames.
- Prevent directory traversal.
- Preserve original filenames as metadata.
- Support HTTP Range requests for video playback.
- Verify ownership before streaming or downloading.
- Clean incomplete uploads.

Large media files must not be encoded into Base64 and stored in MongoDB.

## **14. External API integration architecture**

| Provider              | Purpose                                | Integration mode           |
| --------------------- | -------------------------------------- | -------------------------- |
| OpenAI                | Scripts, reasoning and recommendations | Server-side API            |
| Gemini                | Multimodal analysis                    | Server-side API            |
| Google Flow           | AI video creation                      | Manual initially           |
| Veo                   | Video generation                       | API if authorized          |
| Adobe Firefly         | Creative generation                    | Manual or authorized API   |
| Whisper               | Transcription                          | Local worker               |
| ElevenLabs            | Voice generation                       | Optional API               |
| fal.ai                | Backup generation                      | Optional API               |
| Klap                  | Backup clipping                        | Optional API               |
| YouTube Data API      | Discovery and publishing               | API + OAuth                |
| YouTube Analytics API | Performance metrics                    | OAuth                      |
| Meta Graph API        | Instagram management                   | OAuth                      |
| Whop                  | Campaign discovery                     | Subject to access          |
| Cuelinks              | Affiliate opportunities                | Subject to approval        |
| Pexels                | Stock media                            | API                        |
| Pixabay               | Licensed stock assets                  | Supported access or manual |

### **External provider rules**

External API calls should pass through dedicated provider adapters.

The frontend must never receive private API keys or directly call paid AI providers using Clipflow's server credentials.

Provider adapters must handle authentication, timeouts, response validation, rate limits, cost tracking and provider-specific errors.

## **15. OAuth integration architecture**

OAuth allows Clipflow to connect social media accounts without collecting the user's social media password.

MongoDBSocial PlatformClipflowUserMongoDBSocial PlatformClipflowUser#chatgpt-mermaid-\_r_4q0\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_4q0\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_4q0\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_4q0\_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_4q0\_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4q0\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_4q0\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_4q0\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_4q0\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_4q0\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_4q0\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_4q0\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4q0\_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4q0\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_4q0\_ p{margin:0;}#chatgpt-mermaid-\_r_4q0\_ .actor{stroke:rgb(31, 78, 148);fill:rgb(19, 33, 54);stroke-width:1;}#chatgpt-mermaid-\_r_4q0\_ rect.actor.outer-path[data-look="neo"]{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4q0\_ rect.note[data-look="neo"]{stroke:rgb(58, 132, 63);fill:rgb(48, 48, 48);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4q0\_ text.actor>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4q0\_ .actor-line{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4q0\_ .innerArc{stroke-width:1.5;stroke-dasharray:none;}#chatgpt-mermaid-\_r_4q0\_ .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4q0\_ .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4q0\_ [id$="-arrowhead"] path{fill:rgb(159, 159, 159);stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4q0\_ .sequenceNumber{fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_4q0\_ [id$="-sequencenumber"]{fill:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4q0\_ [id$="-crosshead"] path{fill:rgb(159, 159, 159);stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4q0\_ .messageText{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4q0\_ .labelBox{stroke:rgba(255, 255, 255, 0.15);fill:rgb(14, 14, 14);filter:none;}#chatgpt-mermaid-\_r_4q0\_ .labelText,#chatgpt-mermaid-\_r_4q0\_ .labelText>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4q0\_ .loopText,#chatgpt-mermaid-\_r_4q0\_ .loopText>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4q0\_ .sectionTitle,#chatgpt-mermaid-\_r_4q0\_ .sectionTitle>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4q0\_ .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:rgba(255, 255, 255, 0.15);fill:rgba(255, 255, 255, 0.15);}#chatgpt-mermaid-\_r_4q0\_ .note{stroke:rgb(58, 132, 63);fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_4q0\_ .noteText,#chatgpt-mermaid-\_r_4q0\_ .noteText>tspan{fill:rgb(237, 237, 237);stroke:none;font-weight:normal;}#chatgpt-mermaid-\_r_4q0\_ .activation0{fill:rgb(48, 48, 48);stroke:hsl(0, 0%, 8.8235294118%);}#chatgpt-mermaid-\_r_4q0\_ .activation1{fill:rgb(48, 48, 48);stroke:hsl(0, 0%, 8.8235294118%);}#chatgpt-mermaid-\_r_4q0\_ .activation2{fill:rgb(48, 48, 48);stroke:hsl(0, 0%, 8.8235294118%);}#chatgpt-mermaid-\_r_4q0\_ .actorPopupMenu{position:absolute;}#chatgpt-mermaid-\_r_4q0\_ .actorPopupMenuPanel{position:absolute;fill:rgb(19, 33, 54);box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#chatgpt-mermaid-\_r_4q0\_ .actor-man circle,#chatgpt-mermaid-\_r_4q0\_ line{fill:rgb(19, 33, 54);stroke-width:2px;}#chatgpt-mermaid-\_r_4q0\_ g rect.rect{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_4q0\_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_4q0\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_4q0\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_4q0\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_4q0\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4q0\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_4q0\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_4q0\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_4q0\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4q0\_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-\_r_4q0\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_4q0\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4q0\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_4q0\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_4q0\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4q0\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_4q0\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4q0\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}Connect social accountAuthorization requestRequest permissionsApprove permissionsAuthorization codeVerify OAuth stateExchange code for tokenAccess tokenStore encrypted credentialsAccount connected

OAuth requirements include state validation, PKCE where supported or required, approved redirect URLs, minimum necessary permissions, token expiration handling and account disconnection.

YouTube and Instagram publishing must remain disabled until the required permissions are verified.

## **16. Background processing integration**

Normal API requests should remain short.

| Operation                 | Execution method |
| ------------------------- | ---------------- |
| Retrieve projects         | Synchronous      |
| Update project title      | Synchronous      |
| Save timeline             | Synchronous      |
| Retrieve campaign details | Synchronous      |
| Generate AI video         | Background job   |
| Transcribe long video     | Background job   |
| Render video              | Background job   |
| Generate 20 clips         | Background job   |
| Synchronize campaigns     | Background job   |
| Publish scheduled content | Background job   |

### **Example: Bulk clipping**

Media StorageWorkerMongoDB QueueAPIFrontendMedia StorageWorkerMongoDB QueueAPIFrontend#chatgpt-mermaid-\_r_4q1\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_4q1\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_4q1\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_4q1\_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_4q1\_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_4q1\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_4q1\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_4q1\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_4q1\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_4q1\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_4q1\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_4q1\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4q1\_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4q1\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_4q1\_ p{margin:0;}#chatgpt-mermaid-\_r_4q1\_ .actor{stroke:rgb(31, 78, 148);fill:rgb(19, 33, 54);stroke-width:1;}#chatgpt-mermaid-\_r_4q1\_ rect.actor.outer-path[data-look="neo"]{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4q1\_ rect.note[data-look="neo"]{stroke:rgb(58, 132, 63);fill:rgb(48, 48, 48);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4q1\_ text.actor>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4q1\_ .actor-line{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_4q1\_ .innerArc{stroke-width:1.5;stroke-dasharray:none;}#chatgpt-mermaid-\_r_4q1\_ .messageLine0{stroke-width:1.5;stroke-dasharray:none;stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4q1\_ .messageLine1{stroke-width:1.5;stroke-dasharray:2,2;stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4q1\_ [id$="-arrowhead"] path{fill:rgb(159, 159, 159);stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4q1\_ .sequenceNumber{fill:rgb(14, 14, 14);}#chatgpt-mermaid-\_r_4q1\_ [id$="-sequencenumber"]{fill:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4q1\_ [id$="-crosshead"] path{fill:rgb(159, 159, 159);stroke:rgb(159, 159, 159);}#chatgpt-mermaid-\_r_4q1\_ .messageText{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4q1\_ .labelBox{stroke:rgba(255, 255, 255, 0.15);fill:rgb(14, 14, 14);filter:none;}#chatgpt-mermaid-\_r_4q1\_ .labelText,#chatgpt-mermaid-\_r_4q1\_ .labelText>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4q1\_ .loopText,#chatgpt-mermaid-\_r_4q1\_ .loopText>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4q1\_ .sectionTitle,#chatgpt-mermaid-\_r_4q1\_ .sectionTitle>tspan{fill:rgb(237, 237, 237);stroke:none;}#chatgpt-mermaid-\_r_4q1\_ .loopLine{stroke-width:2px;stroke-dasharray:2,2;stroke:rgba(255, 255, 255, 0.15);fill:rgba(255, 255, 255, 0.15);}#chatgpt-mermaid-\_r_4q1\_ .note{stroke:rgb(58, 132, 63);fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_4q1\_ .noteText,#chatgpt-mermaid-\_r_4q1\_ .noteText>tspan{fill:rgb(237, 237, 237);stroke:none;font-weight:normal;}#chatgpt-mermaid-\_r_4q1\_ .activation0{fill:rgb(48, 48, 48);stroke:hsl(0, 0%, 8.8235294118%);}#chatgpt-mermaid-\_r_4q1\_ .activation1{fill:rgb(48, 48, 48);stroke:hsl(0, 0%, 8.8235294118%);}#chatgpt-mermaid-\_r_4q1\_ .activation2{fill:rgb(48, 48, 48);stroke:hsl(0, 0%, 8.8235294118%);}#chatgpt-mermaid-\_r_4q1\_ .actorPopupMenu{position:absolute;}#chatgpt-mermaid-\_r_4q1\_ .actorPopupMenuPanel{position:absolute;fill:rgb(19, 33, 54);box-shadow:0px 8px 16px 0px rgba(0,0,0,0.2);filter:drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));}#chatgpt-mermaid-\_r_4q1\_ .actor-man circle,#chatgpt-mermaid-\_r_4q1\_ line{fill:rgb(19, 33, 54);stroke-width:2px;}#chatgpt-mermaid-\_r_4q1\_ g rect.rect{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_4q1\_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_4q1\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_4q1\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_4q1\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_4q1\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4q1\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_4q1\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_4q1\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_4q1\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4q1\_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-\_r_4q1\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_4q1\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4q1\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_4q1\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_4q1\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4q1\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_4q1\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_4q1\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}Request 20 clipsCreate parent job202 Accepted and job IDAtomically claim jobTranscribe and analyzeSave generated clipsUpdate progressRetrieve job statusRead statusReturn progressMark completed

The API must not keep a request open while a video is rendering.

## **17. API rate limiting**

Proposed initial rate limits:

| API category                | Starting limit                   |
| --------------------------- | -------------------------------- |
| Login                       | 5 failed attempts per 15 minutes |
| Password reset              | 3 requests per hour              |
| OTP verification            | 5 attempts per challenge         |
| Standard authenticated APIs | 120 requests per minute          |
| AI generation               | 10 requests per minute           |
| Media uploads               | 10 requests per minute           |
| Synchronization             | 5 requests per minute            |
| Publishing                  | 5 requests per minute            |

These limits are proposed defaults. They must be adjusted according to actual usage and external provider quotas.

Paid generation additionally requires budget checks. Rate limiting alone cannot prevent overspending.

Rate-limit counters must be shared and persistent where necessary, rather than relying only on temporary process memory.

## **18. API caching strategy**

| Data                     | Proposed caching |
| ------------------------ | ---------------- |
| Campaign listings        | 5–15 minutes     |
| Trend information        | 15–60 minutes    |
| Public template listings | 30 minutes       |
| Provider capabilities    | 5 minutes        |
| Analytics summaries      | 5 minutes        |
| Active job progress      | No stale cache   |
| Authentication sessions  | No shared cache  |
| Financial transactions   | Fresh data       |
| Budget availability      | Fresh data       |
| Publishing status        | Fresh data       |

User-specific responses must never be shared across unauthorized users or workspaces.

Caching should be introduced only where it provides measurable benefits.

## **19. Idempotency and duplicate prevention**

Sensitive operations must support duplicate-prevention mechanisms.

Examples:

- Paid AI generation.
- Video export creation.
- Campaign submission.
- Budget reservation.
- Social media publishing.
- Affiliate commission synchronization.

A request may include:

```
Idempotency-Key: unique-operation-id
```

The backend must associate the key with the authenticated user, operation and request content.

If the same request is submitted again, the API should return the existing operation rather than create another charge or publication.

Reusing the same key with different request content should return `409 Conflict`.

## **20. API error handling**

| Error code               | Meaning                                |
| ------------------------ | -------------------------------------- |
| `AUTH_REQUIRED`          | Authentication required                |
| `ACCESS_DENIED`          | Unauthorized resource access           |
| `VALIDATION_ERROR`       | Invalid request                        |
| `RESOURCE_NOT_FOUND`     | Resource unavailable                   |
| `DUPLICATE_REQUEST`      | Operation already exists               |
| `PROVIDER_UNAVAILABLE`   | External provider unavailable          |
| `INVALID_API_KEY`        | Provider credentials invalid           |
| `INSUFFICIENT_CREDITS`   | Provider credits unavailable           |
| `BUDGET_EXCEEDED`        | Spending limit exceeded                |
| `APPROVAL_REQUIRED`      | User approval required                 |
| `UNSUPPORTED_CAPABILITY` | Provider cannot perform requested task |
| `STORAGE_FULL`           | Insufficient storage                   |
| `MEDIA_INVALID`          | Invalid media                          |
| `JOB_FAILED`             | Background processing failed           |
| `RATE_LIMIT_EXCEEDED`    | Request limit exceeded                 |
| `VERSION_CONFLICT`       | Resource changed since last retrieval  |
| `INTERNAL_ERROR`         | Unexpected backend error               |

Error responses must not expose internal stack traces, credentials, database connection strings or sensitive file paths.

## **21. API security requirements**

| Risk                    | Protection                                |
| ----------------------- | ----------------------------------------- |
| Unauthorized access     | Authentication and ownership checks       |
| IDOR                    | User-scoped and workspace-scoped queries  |
| SQL/NoSQL injection     | Validated query parameters                |
| CSRF                    | Origin and CSRF validation                |
| XSS                     | Safe output rendering                     |
| SSRF                    | Restricted remote URL validation          |
| Brute-force attacks     | Rate limiting                             |
| Credential exposure     | Server-side secret management             |
| Malicious uploads       | File validation and resource limits       |
| Command injection       | Safe subprocess arguments                 |
| Duplicate spending      | Idempotency and atomic budget reservation |
| Unauthorized publishing | Explicit approval                         |
| Webhook spoofing        | Signature verification                    |
| Data leakage            | Sanitized responses and logs              |

These controls must be implemented from the beginning.

Detailed security architecture will be defined in `11_SECURITY_ARCHITECTURE.md`.

## **22. Proposed API folder structure**

```
src/
├── app/
│   └── api/
│       ├── auth/
│       ├── users/
│       ├── settings/
│       ├── workspaces/
│       ├── dashboard/
│       ├── campaigns/
│       ├── trends/
│       ├── research/
│       ├── projects/
│       ├── ai/
│       ├── clipping/
│       ├── ugc/
│       ├── video/
│       ├── references/
│       ├── storyboards/
│       ├── scenes/
│       ├── editor/
│       ├── audio/
│       ├── transcripts/
│       ├── subtitles/
│       ├── motion/
│       ├── assets/
│       ├── templates/
│       ├── jobs/
│       ├── exports/
│       ├── social/
│       ├── publishing/
│       ├── analytics/
│       ├── affiliate/
│       ├── submissions/
│       ├── finance/
│       ├── costs/
│       ├── notifications/
│       ├── integrations/
│       ├── sync/
│       └── system/
│
├── modules/
│   ├── projects/
│   ├── campaigns/
│   ├── assets/
│   ├── jobs/
│   └── ...
│
└── lib/
    ├── api/
    │   ├── response.ts
    │   ├── errors.ts
    │   ├── pagination.ts
    │   ├── rate-limit.ts
    │   └── request-context.ts
    ├── auth/
    ├── ai/
    ├── db/
    ├── storage/
    └── integrations/
```

This is a proposed target structure. Existing folders and working route handlers should not be replaced unnecessarily.

## **23. API versioning strategy**

Initially, Clipflow will continue using the existing API convention:

```
/api/projects
/api/campaigns
/api/assets
```

Introducing `/api/v1/` immediately would create unnecessary migration work for the existing frontend.

Versioned APIs can be introduced later if Clipflow becomes a public platform or supports external clients.

Breaking changes must be documented and coordinated with frontend updates.

## **24. API logging and monitoring**

Every important API operation should record appropriate operational information.

| Field         | Purpose                         |
| ------------- | ------------------------------- |
| Request ID    | Trace individual request        |
| HTTP method   | Identify operation              |
| Endpoint      | Identify API route              |
| User ID       | Authorized request context      |
| Workspace ID  | Workspace context               |
| Status code   | Request result                  |
| Response time | Performance monitoring          |
| Error code    | Failure classification          |
| Provider      | External integration involved   |
| Job ID        | Background processing reference |
| Timestamp     | Request history                 |

Passwords, session tokens, API keys, reset OTPs and sensitive request bodies must not be logged.

## **25. API testing requirements**

| Test                        | Expected result             |
| --------------------------- | --------------------------- |
| Valid login                 | Authentication successful   |
| Invalid login               | Request rejected            |
| Expired session             | 401 response                |
| Unauthorized project access | Access denied               |
| Cross-workspace request     | Access denied               |
| Invalid project data        | Validation error            |
| Campaign import             | No duplicate campaign       |
| Media upload                | Valid asset created         |
| Invalid media upload        | File rejected               |
| AI generation               | Correct job created         |
| Insufficient budget         | Generation blocked          |
| Duplicate AI request        | No duplicate charge         |
| Job cancellation            | Eligible job cancelled      |
| Timeline save               | Correct version persisted   |
| Concurrent timeline update  | Version conflict detected   |
| Publishing without approval | Request rejected            |
| Duplicate publishing        | Existing operation returned |
| Provider failure            | Controlled error response   |
| Rate limit exceeded         | 429 response                |
| Database failure            | Safe error response         |

Testing should include manual Postman testing, automated service tests, API integration tests and browser end-to-end tests.

## **26. Existing API reuse and migration**

Clipflow previously reported approximately 24 existing API routes.

Before implementing the proposed endpoints:

1. Inspect all existing API route handlers.
2. Identify working endpoints.
3. Compare existing request and response formats.
4. Identify missing authentication and ownership checks.
5. Preserve working frontend integrations.
6. Extend existing endpoints where appropriate.
7. Identify redundant routes.
8. Resolve security issues.
9. Implement missing endpoints according to priority.
10. Test compatibility before removing old routes.

The exact existing API inventory will be verified during `14_EXISTING_PROJECT_GAP_ANALYSIS.md`.

## **27. API implementation priority**

| Phase   | API modules                                                   |
| ------- | ------------------------------------------------------------- |
| Phase 1 | Authentication, workspaces, projects, assets, jobs            |
| Phase 2 | Clipping, transcription, AI intelligence, basic exports       |
| Phase 3 | UGC, storyboards, scenes, AI video, reference analysis        |
| Phase 4 | Timeline editor, audio, subtitles, motion graphics, templates |
| Phase 5 | Campaigns, trends, affiliate, social accounts, publishing     |
| Phase 6 | Analytics, finance, cost management, monitoring               |

Existing working campaign, submission and social synchronization APIs should remain available throughout development.

Security, cost protection and ownership validation must accompany each phase rather than being postponed.

## **28. Final decision**

| Requirement           | Selected approach                  |
| --------------------- | ---------------------------------- |
| API architecture      | REST                               |
| Backend framework     | Next.js App Router                 |
| Programming language  | TypeScript                         |
| Authentication        | JWT + revocable sessions           |
| Session transport     | HttpOnly cookies                   |
| Validation            | Zod                                |
| Database access       | Mongoose                           |
| Response format       | Standard JSON                      |
| Background processing | MongoDB queue + Node.js workers    |
| File transfer         | Streaming uploads and downloads    |
| Progress tracking     | API polling                        |
| External integrations | Provider adapters                  |
| Social authentication | OAuth                              |
| Financial protection  | Budget reservation and idempotency |
| API testing           | Postman, Vitest, Playwright        |
| API versioning        | Existing `/api/` convention        |
| Deployment            | Local-first hybrid                 |

**Pending validation:** Existing API contracts, external provider permissions, upload limits, rate limits, OAuth configuration and MongoDB connectivity.

The endpoint inventory, rate limits, caching durations and folder structure are proposed technical decisions. We will consolidate overlapping endpoints and verify existing functionality during gap analysis. No source code or API implementation has been modified.

**Save in:** `Documentation/09_API_DESIGN.md`

**Documentation progress**

## **9 / 15 documents**

60%

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

Next

11 — Security Architecture

12 — Cost Management

13 — Deployment Architecture

14 — Existing Project Gap Analysis

15 — Implementation Planning

**Next:** `10_STORAGE_ARCHITECTURE.md` — how Clipflow will store large videos, images, audio, AI-generated assets, temporary files and final exports without unnecessarily increasing MongoDB storage or cloud expenses.