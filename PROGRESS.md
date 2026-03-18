# Progress Log

_Newest entry first. Append new entries at the top using the template below._

---

## Template (copy for each new entry)
<!--
## YYYY-MM-DD
### Completed
-
### Decisions
-
### Next
-
-->

---

## 2026-03-18

### Completed
- **Core content pipeline** is fully built end-to-end:
  - User profile CRUD (`POST /profile`, `GET /profile`)
  - SaaS AI profile generation (`POST /generate-saas-profile`) — LLM-enhanced summary of user's product
  - Content categories generation (`POST /generate-categories`) — 3 parallel LLM calls producing pain, general, and question-type categories
  - Subtopics / content pillars generation (`POST /generate-subtopics`)
  - Subtopic post generation (`POST /generate-subtopic-post`) — 3-step pipeline: skeleton → tone → rewrite, parallelised up to 20 posts
- **Auth** fully working: Google OAuth 2.0 + JWT (cookie + Bearer header), X/Twitter OAuth 2.0 (PKCE) with token refresh, AES token encryption for all stored OAuth credentials
- **Social publishing** working for LinkedIn and X: `publishToSocial()` in `src/services/socialPublisher.ts`; LinkedIn token refresh in `src/services/linkedinTokenService.ts`
- **Post scheduling** infrastructure in place: `POST /schedule-post` + Agenda job `"publish scheduled post"` (`src/services/agenda.ts`)
- **Core lib** stable: `promptLoader`, `promptFactory`, `parsers`, `retry` (`src/lib/`)

### Decisions
- All active pipelines use OpenAI (GPT-4o-mini) via LangChain; Gemini client exists but only used in the unconnected how-to pipeline
- Prompt templates are stored as `.txt` files in `src/prompts/` and loaded with in-memory caching — avoids embedding long prompts in code
- Retry wrapper (`runWithRetry`, 2 retries) wraps all structured LLM output calls to handle malformed JSON

### In Progress
- **Bulk post generation** (`POST /generate-bulk-posts`) — route is mounted but `src/services/domain/bulkGeneration.service.ts` is entirely commented out; no pipeline wired
- **Pain solution posts** — schema (`src/schemas/painSolution.schema.ts`) and prompt (`src/prompts/pain-solution-post/base.txt`) exist; route file is 100% commented; no service or pipeline
- **How-to post pipeline** — complete 6-pass critique/rewrite pipeline in `src/pipelines/howtoPipelines.ts` but not connected to any route
- **Facebook publishing** — User model fields (`facebookPageId`, `facebookPageToken`) and route file (`src/routes/not-in-use/facebookPost.ts`) exist but are not mounted; no Facebook OAuth flow
- **Orphaned stubs**: `src/pipelines/generateSubtopicPost.ts` (empty), `src/constants/modelPosts.ts` (unused), `src/utils/logger.ts` (empty)

### Next
1. Implement bulk post generation service — wire `src/services/domain/bulkGeneration.service.ts` to the existing route and an appropriate pipeline
2. Implement pain solution post pipeline and uncomment/enable the route in `src/index.ts`
3. Connect `howtoPipelines.ts` to a route (or decide if it replaces the current 3-step educational pipeline)
4. Add schedule management endpoints (list scheduled posts, cancel a scheduled post)
