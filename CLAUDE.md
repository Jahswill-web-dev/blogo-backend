# HackrPost Backend

An AI-powered platform that helps saas founders create content for their niche to attract their target users, it create content and scheudles them on X

## Tech Stack

- **Runtime:** Node.js with TypeScript (strict mode, `ts-node-dev` for dev)
- **Framework:** Express.js v5
- **Database:** MongoDB via Mongoose v8
- **Auth:** Google OAuth 2.0 (Passport.js) + JWT (httpOnly cookie or `Authorization: Bearer`)
- **AI/LLM:** Google Gemini 2.5-flash and OpenAI GPT-4o-mini via LangChain (`@langchain/google-genai`, `@langchain/openai`)
- **Validation:** Zod v4
- **Job Scheduling:** Agenda v5
- **API Docs:** Swagger (swagger-autogen + swagger-ui-express)

## Project Structure

```
src/
├── index.ts                  # Express app entry point, DB connection, route mounting
├── auth/                     # Passport OAuth strategy configs (Google)
├── middleware/               # JWT auth middleware
├── models/                   # Mongoose schemas (User, UserProfile, Categories, Subtopics, SubtopicPosts, etc.)
├── routes/
│   ├── auth/                 # Google and X/Twitter OAuth routes
│   ├── content/              # Content generation routes (categories, subtopics, posts, bulk)
│   ├── user/                 # User profile CRUD routes
│   ├── socials/              # Scheduled post management routes
│   └── not-in-use/           # Deprecated/WIP routes (not registered)
├── services/
│   ├── domain/               # Core business logic (category gen, post gen, bulk gen, SaaS profile)
│   ├── prompts/              # Prompt-building helpers
│   ├── langchainGemini.ts    # Gemini LLM client
│   ├── langchainOpenAI.ts    # OpenAI LLM client
│   ├── agenda.ts             # Job scheduler setup
│   ├── socialPublisher.ts    # Social media publishing
│   └── linkedinTokenService.ts # LinkedIn token refresh logic
├── pipelines/                # Multi-step LLM workflows (categories, educational post, saas profile)
├── repositories/             # MongoDB data-access layer (categories, subtopics, posts, saasProfile)
├── schemas/                  # Zod schemas for LLM output validation
├── lib/
│   ├── promptLoader.ts       # Loads .txt prompt files with in-memory caching
│   ├── promptFactory.ts      # Builds LangChain PromptTemplate objects
│   ├── parsers.ts            # Zod-based output parsers + format instructions
│   └── retry.ts              # Retry wrapper with JSON cleaning for LLM calls
├── prompts/                  # Prompt templates as .txt files, organized by feature
├── constants/                # Shared constants (category types, model posts)
├── types/                    # TypeScript type definitions and Express augmentations
└── utils/                    # Small utilities (random item selection)
```

## Running the Project

```bash
npm install

# Development (auto-reloads, regenerates Swagger docs on start)
npm run dev

# Regenerate Swagger docs only
npm run swagger-autogen

# Test prompts manually
npm run test-prompt
```

Server runs on `http://localhost:4000`. Swagger UI at `http://localhost:4000/docs`.

## Environment Variables

No `.env.example` exists — create a `.env` file with the following:

```
PORT=4000
MONGO_URI=                    # MongoDB connection string
JWT_SECRET=                   # Secret for signing JWTs (7-day expiry)
SESSION_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GOOGLE_API_KEY=               # For Gemini
OPENAI_API_KEY=

LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_REDIRECT_URI=

X_CLIENT_ID=
X_CLIENT_SECRET=
X_REDIRECT_URI=

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_REDIRECT_URI=
FACEBOOK_CONFIGURATION_ID=

TOKEN_ENCRYPTION_KEY=
RANDOM_STATE=
FRONTEND_URL=
```

## Coding Conventions

- **Naming:** camelCase functions/variables, PascalCase interfaces/models (`I` prefix for interfaces e.g. `IUser`), camelCase filenames with `.service.ts` / `.routes.ts` / `.repository.ts` suffixes
- **Async:** async/await throughout; errors propagated via try-catch returning `{ error }` or `{ success: false, message }` with appropriate HTTP status codes
- **Layering:** Routes → Services → Pipelines → Repositories; pipelines encapsulate all LLM interaction
- **Prompt templates:** Stored as `.txt` files under `src/prompts/`, loaded via `promptLoader.ts` (cached in memory), turned into LangChain `PromptTemplate` via `promptFactory.ts`
- **LLM output validation:** Zod schemas in `src/schemas/`, parsed with helpers from `src/lib/parsers.ts`; unreliable JSON outputs retried via `src/lib/retry.ts`
- **Auth guard:** Wrap protected routes with the `jwtAuth` middleware from `src/middleware/jwtAuth.ts`
- **Imports:** ES module `import`/`export` syntax; environment variables via `process.env` (no config abstraction layer)

## Session discipline
- At the start of every session, read PROGRESS.md and PHASES.md to understand 
  current state before doing anything
- At the end of every session, append an entry to PROGRESS.md with:
  - Date
  - What was completed
  - Any decisions made and why
  - What to work on next
- If a phase in PHASES.md is completed, mark it as done
- Never start writing code without first checking what phase we are in