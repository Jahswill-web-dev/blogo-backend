# HackrPost Backend

An AI-powered platform that helps content creators generate niche-targeted educational posts for X (Twitter) and schedule them for publishing.

## Tech Stack

- **Runtime:** Node.js with TypeScript (strict mode, `ts-node-dev` for dev)
- **Framework:** Express.js v5
- **Database:** MongoDB via Mongoose v8
- **Auth:** Google OAuth 2.0 (Passport.js) + JWT (httpOnly cookie or `Authorization: Bearer`); X/Twitter OAuth 2.0 (PKCE)
- **AI/LLM:** OpenAI GPT-5.1 (structured outputs via LangChain) + fine-tuned model `ft:gpt-4.1-2025-04-14:hackrpost:hacker-post-v2:DKWIZmzy` (educational post generation)
- **Validation:** Zod v4
- **API Docs:** Swagger (swagger-autogen + swagger-ui-express)

## Project Structure

```
src/
├── index.ts                  # Express app entry point, DB connection, route mounting
├── auth/                     # Passport Google OAuth strategy config
├── middleware/               # JWT auth middleware
├── models/                   # Mongoose schemas
│   ├── User.ts               # Auth user (Google + X tokens)
│   ├── UserProfile.ts        # Niche, audience, focus area, product details
│   ├── SaasAIProfile.ts      # AI-generated creator profile
│   ├── Categories.ts         # Pain / general / question categories
│   ├── Subtopics.ts          # Content pillars with subtopics (angle + goal)
│   └── SubtopicPosts.ts      # Generated educational posts
├── routes/
│   ├── auth/                 # Google OAuth + X/Twitter OAuth + tweet posting
│   ├── content/              # Content generation routes
│   └── user/                 # User profile CRUD
├── services/
│   ├── domain/               # Core business logic (orchestration layer)
│   ├── langchainOpenAI.ts    # OpenAI LLM clients (lcOpenAI + lcFineTuned)
│   ├── socialPublisher.ts    # Publish to X / LinkedIn
│   ├── xTokenService.ts      # X token refresh logic
│   ├── linkedinTokenService.ts # LinkedIn token refresh logic
│   └── tokendecrypt.ts       # AES-256-CBC token encryption/decryption
├── pipelines/                # LLM workflow functions (each does one LLM call or chain)
│   ├── categoriesPipeline.ts # Pain, general, question categories + subtopics
│   ├── educationalPost.ts    # Single-step educational post (fine-tuned model)
│   └── generateSaasProfile.ts # AI creator profile generation
├── repositories/             # MongoDB data-access layer
│   ├── category.repository.ts
│   ├── saasProfile.repository.ts
│   └── subtopicPosts.repository.ts
├── schemas/                  # Zod schemas for LLM output validation
│   ├── SaasProfile.schema.ts
│   ├── painCategories.schema.ts
│   ├── questionsTypes.schema.ts
│   └── subtopic.schema.ts
├── lib/
│   ├── promptLoader.ts       # Loads .txt prompt files with in-memory caching
│   ├── promptFactory.ts      # Builds LangChain PromptTemplate objects
│   ├── parsers.ts            # Zod-based output parsers + format instructions
│   └── retry.ts              # Retry wrapper with JSON cleaning for LLM calls
└── prompts/                  # Prompt templates as .txt files
    ├── categories/           # painCategories.txt, categories.txt, subtopics.txt
    ├── educational-post/     # education.txt (fine-tuned model prompt)
    ├── questions-post/       # questionTypes.txt
    └── saasProfile/          # base.txt
```

## Running the Project

```bash
npm install

# Development (auto-reloads)
npm run dev

# Regenerate Swagger docs
npm run swagger-autogen
```

Server runs on `http://localhost:4000`.
Swagger UI at `http://localhost:4000/docs`.
Test UI at `http://localhost:4000/test-ui`.

## Environment Variables

Create a `.env` file:

```
PORT=4000
MONGO_URI=                    # MongoDB connection string
JWT_SECRET=                   # Secret for signing JWTs (7-day expiry)
SESSION_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

OPENAI_API_KEY=               # Used for gpt-5.1 and the fine-tuned model

X_CLIENT_ID=
X_CLIENT_SECRET=
X_REDIRECT_URI=

TOKEN_ENCRYPTION_KEY=         # AES-256 key for encrypting OAuth tokens
RANDOM_STATE=
FRONTEND_URL=
```

## Coding Conventions

- **Naming:** camelCase functions/variables, PascalCase interfaces/models (`I` prefix for interfaces e.g. `IUser`), camelCase filenames with `.service.ts` / `.routes.ts` / `.repository.ts` suffixes
- **Async:** async/await throughout; errors propagated via try-catch returning `{ error }` or `{ success: false, message }` with appropriate HTTP status codes
- **Layering:** Routes → Services → Pipelines → Repositories; pipelines encapsulate all LLM interaction
- **Two LLM clients:** `lcOpenAI` (gpt-5.1, temp 1, structured JSON outputs) and `lcFineTuned` (fine-tuned model, temp 1, raw text output) — both exported from `src/services/langchainOpenAI.ts`
- **Prompt templates:** Stored as `.txt` files under `src/prompts/`, loaded via `promptLoader.ts` (cached in memory), turned into LangChain `PromptTemplate` via `promptFactory.ts`. Fine-tuned model prompt does NOT append JSON format instructions.
- **LLM output validation:** Zod schemas in `src/schemas/`, parsed with helpers from `src/lib/parsers.ts`; unreliable JSON outputs retried via `src/lib/retry.ts`. Fine-tuned model returns raw text — no Zod parsing needed.
- **Auth guard:** Wrap protected routes with the `jwtAuth` middleware from `src/middleware/jwtAuth.ts`
- **Imports:** ES module `import`/`export` syntax; environment variables via `process.env` (no config abstraction layer)

## Session discipline
- At the start of every session, read PROGRESS.md and PHASES.md to understand current state before doing anything
- At the end of every session, append an entry to PROGRESS.md with:
  - Date
  - What was completed
  - Any decisions made and why
  - What to work on next
- If a phase in PHASES.md is completed, mark it as done
- Never start writing code without first checking what phase we are in
