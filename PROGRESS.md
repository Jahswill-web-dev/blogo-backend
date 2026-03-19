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

## 2026-03-19

### Completed
- **UserProfile field rename** — all fields renamed to content-creator-centric names:
  - `audienceStruggles` → `targetAudience`; `saasName` → `productName`; `productPromise` → `productSolution`; old `targetAudience` → `productAudience`
  - Added `focusArea` as a required field
  - Updated model, routes, context builder, SaaS profile service, and `saasProfile/base.txt` prompt template
- **Subtopic schema upgraded** — each subtopic now has `{ subtopic, angle, goal }` instead of a plain string; schema, model, repository, and pipeline all updated
- **Educational post pipeline replaced** — 3-step skeleton→tone→rewrite pipeline removed; replaced with single-step generation using fine-tuned model `ft:gpt-4.1-2025-04-14:hackrpost:hacker-post-v2:DKWIZmzy`
  - New prompt: `src/prompts/educational-post/education.txt`
  - New pipeline function: `generateEducationalPost()` in `src/pipelines/educationalPost.ts`
  - `tone` field made optional in `SubtopicPosts` model
- **Two bugs fixed in POST /generate-subtopics:**
  - DB not saving: `findOneAndUpdate` was using plain `{ pillars }` (replacement doc in Mongoose 8); fixed to `{ $set: { pillars } }`
  - No response in test UI: `res.json(subtopics)` was serialising a LangChain class instance as `{}`; fixed to `res.json({ pillars: subtopics.pillars })`
- **Model updated** — switched from `gpt-4o-mini` to `gpt-5.1` (`lcOpenAI`)
- **Major dead code cleanup** — ~40 files and 5 folders deleted:
  - Removed: `routes/not-in-use/` (8 files), `prompts/pain-solution-post/`, `prompts/problem-awareness-post/`, `prompts/educational-threads/`, `prompts/educational/`
  - Removed: old pipelines (`howtoPipelines.ts`, `generateSubtopicPost.ts`), dead services (`bulkGeneration`, `fetchCategory`, `geminiClient`, `langchainGemini`, `contentGenerator`, `agenda`), dead models (`ContentIdeas`, `ContentPrompt`, `ContentPost`, `ContentSchedule`), dead schemas (`painSolution`, `subtopicPost`), dead repository (`subtopic.repository.ts`), empty constants/types/utils files
  - Cleaned up dead code within: `index.ts`, `parsers.ts`, `promptFactory.ts`, `educationalPost.ts`, `getSaasContext.ts`, `categoriesPipeline.ts`

### Decisions
- Fine-tuned model returns raw text (not JSON) — prompt template does NOT append `FORMAT INSTRUCTIONS` or `Generate JSON now.`; post content extracted directly from `result.content`
- Kept `socialPublisher.ts`, `xTokenService.ts`, `linkedinTokenService.ts`, `tokendecrypt.ts` — still used by active X tweet posting flow
- Scheduled posting (Agenda + scheduledPost route) removed — was tightly coupled to deleted `ContentPost` model; can be rebuilt against `SubtopicPosts` in a future phase

### Next
1. Add `GET /posts` and `GET /posts/:id` endpoints — repository functions already exist in `subtopicPosts.repository.ts`
2. Rebuild scheduled posting against `SubtopicPosts` model
3. Consider adding more post format types (question posts, pain-solution posts) as separate pipelines

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

### Next
1. Implement bulk post generation service — wire `src/services/domain/bulkGeneration.service.ts` to the existing route and an appropriate pipeline
2. Implement pain solution post pipeline and uncomment/enable the route in `src/index.ts`
3. Connect `howtoPipelines.ts` to a route (or decide if it replaces the current 3-step educational pipeline)
4. Add schedule management endpoints (list scheduled posts, cancel a scheduled post)
