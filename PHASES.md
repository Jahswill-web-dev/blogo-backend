# Project Phases

## Phase 1 — Complete ✅

Everything below is fully implemented end-to-end: route → service → pipeline → database.

### Auth
- **Google OAuth 2.0 + JWT** — `src/routes/auth/auth.ts`
  - `GET /auth/google`, `GET /auth/google/callback`, `GET /auth/me`, `GET /auth/logout`
  - Passport Google strategy: `src/auth/google.ts`
  - JWT middleware: `src/middleware/jwtAuth.ts`
- **X/Twitter OAuth 2.0 (PKCE)** — `src/routes/auth/xAuth.ts`
  - `GET /auth/x`, `GET /auth/x/callback`, `POST /x/tweet`
  - Token refresh: `src/services/xTokenService.ts`
  - Token encryption: `src/services/tokendecrypt.ts`

### User Profile
- `src/routes/user/userProfile.ts` — `POST /profile`, `GET /profile`
- Fields: `userNiche`, `targetAudience`, `focusArea`, `productName`, `productDescription`, `productAudience`, `productSolution`
- `src/models/UserProfile.ts`

### Content Generation Pipeline
- **AI Creator Profile**
  - `POST /generate-saas-profile`, `GET /saas-profile` — `src/routes/content/saasProfile.routes.ts`
  - Pipeline: `src/pipelines/generateSaasProfile.ts`
  - Model: `src/models/SaasAIProfile.ts`

- **Content Categories** (3 types: pain, general, questions)
  - `POST /generate-categories` — `src/routes/content/categories.routes.ts`
  - Pipeline: `src/pipelines/categoriesPipeline.ts`
  - Prompts: `src/prompts/categories/painCategories.txt`, `categories.txt`, `src/prompts/questions-post/questionTypes.txt`
  - Model: `src/models/Categories.ts`

- **Content Pillars + Subtopics**
  - `POST /generate-subtopics` (legacy) — `src/routes/content/subtopic.routes.ts`
  - `POST /generate-content-strategy` (current) — two-phase pipeline:
    - Phase 1: one LLM call → 5 pillars (name + description), stored immediately via `storePillarsOnly()`
    - Phase 2: one LLM call per pillar → 6 subtopics, stored via `updatePillarSubtopics()`
  - Pipelines: `generatePillarsOnly`, `generateSubtopicsForOnePillar`, `generateContentStrategy` in `src/pipelines/categoriesPipeline.ts`
  - Prompts: `src/prompts/categories/pillars.txt` (Phase 1), `src/prompts/categories/subtopics.txt` (Phase 2)
  - Each subtopic: `{ type, subtopic, angle, goal }` — type is one of: Mistake, Contrarian, Framework, Breakdown, Comparison, Results
  - Model: `src/models/Subtopics.ts`

- **Educational Post Generation** (single-step, fine-tuned model)
  - `POST /generate-subtopic-post` — `src/routes/content/subtopicPost.routes.ts`
  - Body: `{ count: number }` (1–20 posts, generated in parallel)
  - Randomly picks a subtopic from stored pillars, passes `content_pillar`, `subtopic`, `angle`, `goal` to fine-tuned model
  - Pipeline: `src/pipelines/educationalPost.ts` (`generateEducationalPost`)
  - Prompt: `src/prompts/educational-post/education.txt`
  - Model: `ft:gpt-4.1-2025-04-14:hackrpost:hacker-post-v2:DKWIZmzy`
  - Stored in: `src/models/SubtopicPosts.ts`

### Core Infrastructure
- `src/lib/promptLoader.ts` — loads `.txt` prompt files with in-memory cache
- `src/lib/promptFactory.ts` — builds LangChain `PromptTemplate` objects
- `src/lib/parsers.ts` — Zod-based structured output parsers + format instructions
- `src/lib/retry.ts` — `runWithRetry()` wrapper with JSON cleaning (2 retries)
- `src/services/langchainOpenAI.ts` — `lcOpenAI` (gpt-5.1) + `lcFineTuned` (fine-tuned model)
- `src/public/test-ui.html` — developer test UI at `GET /test-ui`

---

## Phase 2 — Up Next

### Retrieve & Browse Generated Posts
- No `GET /posts` endpoint exists yet — users can generate posts but can't list or retrieve them via API
- Needs: `GET /posts` (all posts for user), `GET /posts/:id` (single post)
- Repository functions already exist: `getSubtopicPostsByUser`, `getSubtopicPostById` in `src/repositories/subtopicPosts.repository.ts`

### Scheduled Posting
- X token management is in place (`xTokenService.ts`, `tokendecrypt.ts`)
- `POST /x/tweet` works for immediate posting
- Need: ability to schedule a generated post for later publishing
- No scheduling infrastructure exists currently (Agenda was removed with the old pipeline)

### Additional Post Formats
- Only educational posts are generated currently
- Potential: question-type posts, pain-solution posts, how-to posts (each as a separate prompt + pipeline)

### LinkedIn Publishing
- `socialPublisher.ts` supports LinkedIn but no LinkedIn OAuth flow is mounted
- `linkedinTokenService.ts` exists and is ready
- Need: LinkedIn OAuth routes + LinkedIn post endpoint

---

## Phase 3+ — Future

### Content Calendar
- Schedule multiple posts across days/weeks
- View and manage scheduled queue

### Analytics
- Track which posts were published, when, and to which platform

### Multi-platform Support
- Extend beyond X to LinkedIn (partially scaffolded), threads, etc.
