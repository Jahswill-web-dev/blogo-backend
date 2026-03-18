# Project Phases

## Phase 1 — Complete

Everything below is fully implemented end-to-end: route → service → pipeline → database.

### Auth
- **Google OAuth 2.0 + JWT**
  - `src/routes/auth/auth.ts` — `/auth/google`, `/auth/google/callback`, `/auth/me`
  - `src/auth/google.ts` — Passport Google strategy
  - `src/middleware/jwtAuth.ts` — JWT verification middleware (cookie + Bearer header)
- **X/Twitter OAuth 2.0 (PKCE)**
  - `src/routes/auth/xAuth.ts` — `/auth/x`, `/auth/x/callback`, `/x/tweet`
  - `src/services/xTokenService.ts` — token refresh logic
- **Token encryption**
  - `src/services/tokendecrypt.ts` — AES encryption/decryption for stored OAuth tokens

### User Profile
- `src/routes/user/userProfile.ts` — `POST /profile`, `GET /profile`
- `src/models/UserProfile.ts` — schema: saasName, productDescription, targetAudience, painPoints

### Content Generation Pipeline
- **SaaS AI Profile generation**
  - `src/routes/content/saasProfile.routes.ts` — `POST /generate-saas-profile`
  - `src/services/domain/saasProfile.service.ts`
  - `src/pipelines/generateSaasProfile.ts`
  - `src/schemas/SaasProfile.schema.ts`
  - `src/repositories/saasProfile.repository.ts`
  - `src/models/SaasAIProfile.ts`

- **Content categories generation** (3 parallel LLM calls: pain, general, questions)
  - `src/routes/content/categories.routes.ts` — `POST /generate-categories`
  - `src/services/domain/generateCategories.service.ts`
  - `src/pipelines/categoriesPipeline.ts`
  - `src/schemas/painCategories.schema.ts`, `src/schemas/questionsTypes.schema.ts`
  - `src/repositories/category.repository.ts`
  - `src/models/Categories.ts`
  - `src/prompts/categories/`

- **Subtopics / content pillars generation**
  - `src/routes/content/subtopic.routes.ts` — `POST /generate-subtopics`
  - `src/services/domain/generateCategories.service.ts` (`generateSubtopicsForUser`)
  - `src/pipelines/categoriesPipeline.ts` (`generateSubtopics`)
  - `src/schemas/subtopic.schema.ts`
  - `src/repositories/subtopic.repository.ts`
  - `src/models/Subtopics.ts`
  - `src/prompts/categories/subtopics.txt`

- **Subtopic post generation** (3-step: skeleton → tone → rewrite, parallelised up to 20 posts)
  - `src/routes/content/subtopicPost.routes.ts` — `POST /generate-subtopic-post`
  - `src/services/domain/multipleSubtopicPosts.service.ts`
  - `src/services/domain/subtopicPosts.service.ts`
  - `src/pipelines/educationalPost.ts` — `generateSubtopicSkeletonPost`, `generateSkeletonTone`, `rewriteSubtopicPost`
  - `src/schemas/subtopicPost.schema.ts`
  - `src/repositories/subtopicPosts.repository.ts`
  - `src/models/SubtopicPosts.ts`
  - `src/prompts/educational-post/`

### Social Publishing
- **LinkedIn OAuth + posting** (token refresh with 60-day refresh token support)
  - `src/routes/not-in-use/linkedinAuth.ts` — `/auth/linkedin`, `/auth/linkedin/callback`
  - `src/routes/not-in-use/linkedinPost.ts` — `/post/linkedin`
  - `src/services/linkedinTokenService.ts` — token validation and refresh
  - `src/services/socialPublisher.ts` — `publishToSocial()` (LinkedIn + X)

- **Post scheduling**
  - `src/routes/socials/scheduledPost.ts` — `POST /schedule-post`
  - `src/services/agenda.ts` — Agenda job: `"publish scheduled post"`
  - `src/models/ContentSchedule.ts`

### Core Infrastructure
- `src/lib/promptLoader.ts` — loads `.txt` prompt files with in-memory cache
- `src/lib/promptFactory.ts` — builds LangChain `PromptTemplate` objects
- `src/lib/parsers.ts` — Zod-based structured output parsers + format instructions
- `src/lib/retry.ts` — `runWithRetry()` wrapper with JSON cleaning (2 retries)
- `src/services/langchainOpenAI.ts` / `src/services/langchainGemini.ts` — LLM clients

---

## Phase 2 — In Progress

### Bulk Post Generation
- Route is mounted: `src/routes/content/generateBulk.routes.ts` — `POST /generate-bulk-posts`
- Service is entirely commented out: `src/services/domain/bulkGeneration.service.ts`
- No active pipeline wired to this route

### Pain Solution Posts
- Route file exists but is 100% commented: `src/routes/content/painSolution.routes.ts`
- Route registration commented out in `src/index.ts`
- No service or pipeline implemented
- Prompt file exists: `src/prompts/pain-solution-post/base.txt`
- Schema exists: `src/schemas/painSolution.schema.ts`

### How-To Post Pipeline
- Full multi-pass pipeline implemented (6 critique/rewrite passes) but not connected to any route
- `src/pipelines/howtoPipelines.ts`
- Uses Gemini (`lcGemini`) unlike all other active pipelines (OpenAI)

### Facebook Publishing
- User model has `facebookPageId` and `facebookPageToken` fields
- Route file exists: `src/routes/not-in-use/facebookPost.ts` — `POST /post/facebook/page`
- Not imported or mounted in `src/index.ts`
- No Facebook OAuth flow implemented

### Orphaned Artifacts
- `src/pipelines/generateSubtopicPost.ts` — empty function stub, unused
- `src/constants/modelPosts.ts` — 5 model post examples defined but imported nowhere
- `src/utils/logger.ts` — empty file, no implementation

---

## Phase 3+ — Upcoming

_Inferred from models, architecture, and partial scaffolding that exists in the codebase._

### Scheduled Posts Management
- Agenda schedules jobs but there are no endpoints to list, cancel, or reschedule them
- `ContentSchedule` model (`src/models/ContentSchedule.ts`) is defined but not surfaced via API

### Content Analytics
- `ContentPost` model (`src/models/ContentPost.ts`) tracks `isPublished` and `publishedAt`
- No API endpoints exist to query publish status, history, or performance

### Content Ideas
- `ContentIdeas` model (`src/models/ContentIdeas.ts`) is defined
- No generation service, route, or pipeline implemented

### Content Prompt Storage
- `ContentPrompt` model (`src/models/ContentPrompt.ts`) is defined
- No route or service to create, list, or reuse stored prompts

### Structured Logging
- `src/utils/logger.ts` is a stub suggesting a logging system is planned
- Currently all logging is ad-hoc `console.log` / `console.error`

### Onboarding / Content Wizard
- Architecture implies a linear flow: Profile → Categories → Subtopics → Posts
- No orchestration endpoint or flow controller exists to guide users through this sequence end-to-end
