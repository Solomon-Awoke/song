# Ethiopian Orthodox Spiritual Songs Collection App

## TL;DR

> **Quick Summary**: Build a responsive Next.js web app where Ethiopian Orthodox Christians can browse, search, and read spiritual songs in Amharic/Ge'ez and English, with multi-contributor admin management.
>
> **Deliverables**:
> - Public song browsing by 9 categories with responsive mobile-friendly design
> - Dual-language song detail pages with auto-scroll/hands-free mode
> - Full-text search (Amharic + English via Fuse.js)
> - User accounts with favorites/bookmarks and playlists
> - Song sharing via URLs with SEO meta tags
> - PDF export of individual songs
> - Admin dashboard with song CRUD, user management, bulk PDF import, and moderation queue
>
> **Estimated Effort**: **Large** (many modules)
> **Parallel Execution**: YES — 4 waves of 4-6 parallel tasks
> **Critical Path**: Wave 1 → Wave 2 → Wave 3 → Wave 4 → F1-F4

---

## Context

### Original Request
User wants to build a spiritual songs collection app for the Ethiopian Orthodox Tewahedo Church. Fellow Orthodox Christians should be able to easily navigate, search, and read hymns.

### Interview Summary
**Key Decisions**:
- **Platform**: Responsive web app (browser, phone, tablet, desktop)
- **Tech Stack**: Next.js (App Router) + Tailwind CSS + MongoDB + Mongoose
- **Languages**: Amharic + Ge'ez (primary content) + English (UI+translations)
- **Auth**: Open browsing + optional accounts (Email/password + Google OAuth)
- **Content Management**: Multi-contributor with roles + full admin dashboard
- **Features**: Search, Favorites, Playlists, Share, Auto-scroll, PDF Export
- **Testing**: TDD (tests first)
- **Hosting**: Vercel
- **Design**: Ethiopian traditional aesthetic (dark, gold tones, sacred feel)
- **Audio**: Future phase (NOT in scope now)

**Research Findings**:
- **Metis**: MongoDB `$text` does NOT support Ethiopic script — using client-side Fuse.js instead (adequate for <1000 songs)
- **Metis**: Must bundle Noto Sans Ethiopic via next/font for consistent rendering
- **Metis**: Client-side PDF generation to avoid Vercel serverless timeout issues
- **Metis**: Admin dashboard is a scope trap — must be explicitly bounded
- **User confirmed**: Has a PDF with continuous Amharic/Ge'ez songs (no English) — import tool needed

### Metis Review
**Identified Gaps** (addressed):
- **Amharic Search**: Resolved with Fuse.js client-side search strategy
- **Data Model**: Single MongoDB document with both Amharic + English fields
- **Admin Scope**: Bounded to specific features list (no analytics, no user management CRUD beyond roles)
- **PDF Strategy**: Client-side generation only
- **Font Strategy**: Noto Sans Ethiopic bundled via next/font
- **Content Sourcing**: PDF import tool designed to parse continuous text

---

## Work Objectives

### Core Objective
Build a responsive web app for browsing, searching, and organizing Ethiopian Orthodox Tewahedo spiritual songs in Amharic/Ge'ez and English, with multi-contributor content management.

### Concrete Deliverables
- Public-facing song catalog with 9 category filters
- Song detail page with dual-language display and auto-scroll
- Full-text search across all songs
- User accounts (register/login) with favorites and playlists
- Song sharing via social links + SEO metadata
- Client-side PDF export per song
- Admin: Song CRUD, user role management, PDF bulk import, moderation queue
- Responsive design (phone + tablet + desktop) with Ethiopian traditional aesthetic

### Definition of Done
- [ ] All public pages load < 2s on Vercel
- [ ] User can browse, search, and read any song without account
- [ ] Logged-in user can favorite songs and create playlists
- [ ] Admin can add/edit/delete songs and manage contributors
- [ ] Admin can bulk import songs from a PDF
- [ ] All QA scenarios pass with evidence
- [ ] F1-F4 review agents all approve

### Must Have
- Dual-language support (Amharic/Ge'ez + English) with proper font rendering
- Responsive layout working on phone, tablet, desktop
- Full-text search (Amharic + English)
- User favorites and playlists
- PDF export (client-side)
- Auto-scroll/hands-free mode during services
- Admin dashboard for song management
- Bulk PDF import tool
- TDD — tests written before implementation

### Must NOT Have (Guardrails)
- NO audio recording uploads or playback (future phase)
- NO mobile native app (future phase)
- NO social features (comments, ratings, user profiles)
- NO AI/ML features (semantic search, recommendations)
- NO server-side PDF generation (client-side only)
- NO PWA/offline support
- NO languages beyond Amharic/Ge'ez + English
- NO user analytics or dashboard metrics
- NO public user profiles
- NO song submissions from unauthenticated users

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (fresh project)
- **Automated tests**: **TDD** (tests written BEFORE implementation)
- **Framework**: bun test + Testing Library (React Testing Library)
- **TDD Workflow**: Each implementation task follows RED (failing test) → GREEN (minimal impl) → REFACTOR

### QA Policy
Every task MUST include agent-executed QA scenarios (see TODO template below).
Evidence saved to `.omo/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright — Navigate, interact, assert DOM, screenshot
- **API/Backend**: Use curl — Send requests, assert status + response fields
- **Library/Module**: Use bun test — Import, call functions, compare output
- **PDF Verification**: Verify file is generated and non-empty

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — project foundation):
├── Task 1: Scaffold Next.js project + config [quick]
├── Task 2: MongoDB models + connection utility [quick]
├── Task 3: Design system + base components + fonts [visual-engineering]
└── Task 4: i18n setup + UI locale files [writing]

Wave 2 (After Wave 1 — core backend + auth):
├── Task 5: Auth system (NextAuth v5 + roles + login/register) [unspecified-high]
├── Task 6: Category API + Song API (CRUD routes) [deep]
├── Task 7: Fuse.js search utility + data preloader [unspecified-high]
└── Task 8: Auth middleware + protected route guards [quick]

Wave 3 (After Wave 2 — public frontend):
├── Task 9: Public song listing + category browsing [visual-engineering]
├── Task 10: Song detail page + dual-language display + auto-scroll [visual-engineering]
├── Task 11: Favorites/Bookmarks + Playlists API+UI [unspecified-high]
├── Task 12: Search UI integration [visual-engineering]
└── Task 13: Share functionality + SEO meta tags [visual-engineering]

Wave 4 (After Wave 3 — admin + polish):
├── Task 14: Admin dashboard — Song CRUD + Category mgmt [unspecified-high]
├── Task 15: Admin — User management + roles [unspecified-high]
├── Task 16: Admin — PDF import tool + moderation queue [unspecified-high]
├── Task 17: PDF export (client-side) + Vercel deployment config [quick]
└── Task 18: End-to-end integration QA + final testing [deep]

Wave FINAL (After ALL tasks — 4 parallel reviews):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)
   → Present results → Get explicit user okay

Critical Path: Task 1 → Tasks 5-8 → Tasks 9-13 → Tasks 14-18 → F1-F4 → user okay
Max Concurrent: 4 (Waves 1 & 2)
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1 | — | 2, 3, 4 |
| 2 | 1 | 5, 6, 7 |
| 3 | 1 | 5, 9, 10, 14, 17 |
| 4 | 1 | 5, 10, 13, 17 |
| 5 | 2, 3, 4 | 11, 15, 18 |
| 6 | 2 | 9, 10, 14, 16, 18 |
| 7 | 2 | 12, 18 |
| 8 | 2, 5 | 11, 15, 18 |
| 9 | 3, 6 | 18 |
| 10 | 3, 6 | 13, 18 |
| 11 | 5, 8 | 18 |
| 12 | 7 | 18 |
| 13 | 4, 10 | 18 |
| 14 | 3, 6 | 18 |
| 15 | 5, 8 | 18 |
| 16 | 6 | 18 |
| 17 | 3, 4 | 18 |
| 18 | 5-17 | F1-F4 |
| F1-F4 | 18 | user okay |

### Agent Dispatch Summary

- **Wave 1**: 1→quick, 2→quick, 3→visual-engineering, 4→writing
- **Wave 2**: 5→unspecified-high, 6→deep, 7→unspecified-high, 8→quick
- **Wave 3**: 9→visual-engineering, 10→visual-engineering, 11→unspecified-high, 12→visual-engineering, 13→visual-engineering
- **Wave 4**: 14→unspecified-high, 15→unspecified-high, 16→unspecified-high, 17→quick, 18→deep
- **FINAL**: F1→oracle, F2→unspecified-high, F3→unspecified-high, F4→deep

---

## TODOs

- [ ] 1. **Scaffold Next.js Project + Configuration**

  **What to do**:
  - Create Next.js App Router project with TypeScript and Tailwind CSS
  - Set up folder structure: `src/app/(public)/`, `src/app/(admin)/`, `src/app/api/`, `src/lib/`, `src/models/`, `src/components/`, `src/i18n/`
  - Configure ESLint, Prettier, environment variables (`MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`)
  - Set up `package.json` with dependencies: `mongoose`, `next-auth@beta`, `fuse.js`, `next-intl`, `react-icons`, `jspdf`, `html2canvas`
  - Create `.env.example` with all required vars
  - Configure `tailwind.config.ts` with Ethiopian aesthetic design tokens placeholder
  - Create `src/lib/db.ts` with connection caching pattern for Vercel serverless

  **Must NOT do**:
  - No premature abstraction layers
  - No additional dependencies beyond the task list
  - No custom server configuration

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard project initialization with well-documented setup patterns
  - **Skills**: None needed — straightforward scaffolding
  - **Skills Evaluated but Omitted**: None

  **Parallelization**:
  - **Can Run In Parallel**: NO (foundation for all subsequent tasks)
  - **Blocks**: Tasks 2, 3, 4
  - **Blocked By**: None (start immediately)

  **References**:
  - Official Next.js App Router docs: `https://nextjs.org/docs`
  - Mongoose connection caching pattern: `src/lib/db.ts` (standard Vercel pattern — cache connection in global)

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] `bun run dev` starts successfully without errors
  - [ ] `bun run build` passes with zero errors
  - [ ] `.env.example` exists with all required variables documented

  **QA Scenarios**:

  ```
  Scenario: Project builds successfully
    Tool: Bash
    Preconditions: All dependencies installed via `bun install`
    Steps:
      1. Run `bun run build`
      2. Check exit code is 0
      3. Check output contains "✓ Compiled successfully" or similar success indicator
    Expected Result: Build completes with zero errors and zero warnings
    Evidence: .omo/evidence/task-1-build-success.txt

  Scenario: Dev server starts
    Tool: Bash
    Preconditions: Build passed
    Steps:
      1. Run `bun run dev &` (background)
      2. Wait 10 seconds
      3. Run `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`
    Expected Result: HTTP 200 from localhost:3000
    Evidence: .omo/evidence/task-1-dev-server.txt
  ```

  **Evidence to Capture**:
  - [ ] Build output log
  - [ ] Dev server startup confirmation
  - [ ] `.env.example` file exists

  **Commit**: YES
  - Message: `feat(init): scaffold Next.js project with Tailwind and dependencies`
  - Files: All initial files
  - Pre-commit: `bun run build`

---

- [ ] 2. **MongoDB Models + Connection Utility**

  **What to do**:
  - Create `src/models/Song.ts` — Mongoose schema with fields:
    - `titleAm` (String, required) — Amharic title
    - `titleEn` (String, optional) — English title
    - `lyricsAm` (String, required) — Amharic/Ge'ez lyrics
    - `lyricsEn` (String, optional) — English translation
    - `category` (ObjectId ref to Category) — song category
    - `slug` (String, unique) — URL-friendly identifier
    - `tags` ([String]) — search keywords
    - `author` (String, optional) — composer/traditional attribution
    - `biblicalRefs` ([String]) — related Bible verses
    - `createdBy` (ObjectId ref to User) — who added it
    - `isApproved` (Boolean, default: false) — moderation flag
    - `timestamps` (Mongoose built-in)
    - Text index on `titleAm`, `lyricsAm`, `titleEn`, `lyricsEn` for search
  - Create `src/models/Category.ts` — schema with `nameAm`, `nameEn`, `slug`, `order`, `icon`
  - Create `src/models/User.ts` — schema with `name`, `email`, `image`, `role` (enum: viewer/contributor/editor/admin), `emailVerified`, `favorites` [ObjectId refs to Song], `playlists` [embedded or ref]
  - Create `src/models/Playlist.ts` — schema with `name`, `description`, `owner` (ref User), `songs` [ObjectId refs to Song], `isPublic`, `timestamps`
  - Create `src/lib/db.ts` — connection caching singleton (`global.mongo`)
  - Create `src/lib/db-init.ts` — seed script that creates default 9 categories

  **Must NOT do**:
  - No Mongoose plugins unless VSC shows they're needed
  - No virtuals or complex getters/setters
  - No pre-save hooks beyond password hashing (handled by Auth.js)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard Mongoose schema definitions — well-documented, deterministic
  - **Skills**: None needed — straightforward data modeling
  - **Skills Evaluated but Omitted**: None

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 3, 4)
  - **Blocks**: Tasks 5, 6, 7, 8
  - **Blocked By**: Task 1 (project scaffolding needed)

  **References**:
  - Mongoose docs: `https://mongoosejs.com/docs/guide.html`
  - NextAuth MongoDB adapter schema: `https://authjs.dev/reference/adapter/mongodb`

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: `Song.create()` with valid data returns saved document
  - [ ] Test: `Song.find()` with category filter returns correct subset
  - [ ] Test: `Song.slug` is unique (duplicate slug throws error)
  - [ ] Test: `db.connect()` returns active connection
  - [ ] Test: `db.disconnect()` closes cleanly
  - [ ] bun test passes ALL 5+ model tests

  **QA Scenarios**:

  ```
  Scenario: Create and retrieve a song via Mongoose
    Tool: Bash (bun test)
    Preconditions: MongoDB running (use mongodb-memory-server for tests)
    Steps:
      1. Create test that constructs a Song document
      2. Save to test DB
      3. Query by slug
    Expected Result: Document created, retrieved, fields match input
    Evidence: .omo/evidence/task-2-model-song.txt

  Scenario: Category seeding produces 9 default categories
    Tool: Bash (bun test)
    Preconditions: db-init.ts executed
    Steps:
      1. Run seed script
      2. Count Category documents
      3. List their nameAm fields
    Expected Result: Exactly 9 categories exist with correct Amharic names
    Evidence: .omo/evidence/task-2-seed-categories.txt

  Scenario: Connection pooling handles parallel calls
    Tool: Bash (bun test)
    Preconditions: db.ts imported
    Steps:
      1. Call db.connect() 10 times in parallel Promise.all
      2. Check all resolve to same connection object
    Expected Result: No connection errors, single connection reused
    Evidence: .omo/evidence/task-2-connection-pool.txt
  ```

  **Evidence to Capture**:
  - [ ] Test output showing model tests pass
  - [ ] Seed script output showing 9 categories
  - [ ] Connection test output

  **Commit**: YES (groups with Task 3, 4)
  - Message: `feat(db): add Mongoose models for Song, Category, User, Playlist`
  - Files: `src/models/*.ts`, `src/lib/db.ts`, `src/lib/db-init.ts`
  - Pre-commit: `bun test src/models/`

---

- [ ] 3. **Design System + Base Components + Fonts**

  **What to do**:
  - Configure `tailwind.config.ts` with Ethiopian aesthetic theme:
    - Dark background shades (`#1a1a2e`, `#16213e`, `#0f3460`)
    - Gold accent colors (`#d4a536`, `#c9952e`, `#f0d080`)
    - Warm cream/ivory for text (`#f5f0e8`)
    - Ethiopian cross / Orthodox iconography-inspired decorative elements (CSS-only)
  - Bundle **Noto Sans Ethiopic** font via `next/font` — `src/lib/fonts.ts`
  - Bundle a secondary serif font for English text (e.g., Lora or Merriweather)
  - Create base components:
    - `src/components/ui/Button.tsx` — variants (primary/gold, secondary/outline, danger)
    - `src/components/ui/Card.tsx` — song card display wrapper
    - `src/components/ui/Modal.tsx` — reusable modal/dialog
    - `src/components/ui/Input.tsx` — form inputs with labels
    - `src/components/ui/LoadingSpinner.tsx` — loading state
    - `src/components/layout/Navbar.tsx` — top navigation (public)
    - `src/components/layout/Footer.tsx` — site footer with attribution
    - `src/components/layout/MobileMenu.tsx` — hamburger menu for phone
  - Create `src/styles/globals.css` with base styles, font-face, and CSS custom properties
  - Ensure all components support dark mode by default (CSS variables approach)

  **Must NOT do**:
  - No heavy CSS frameworks (Tailwind only)
  - No SVG icons beyond react-icons
  - No animation libraries — keep it simple CSS transitions
  - No component library (shadcn, MUI, etc.) — build from scratch for custom aesthetic

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Custom design system with Ethiopian aesthetic, typography, responsive components
  - **Skills**: None needed beyond the category
  - **Skills Evaluated but Omitted**: None

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 2, 4)
  - **Blocks**: Tasks 5, 9, 10, 14, 17
  - **Blocked By**: Task 1 (project scaffolding needed)

  **References**:
  - next/font docs: `https://nextjs.org/docs/app/api-reference/components/font`
  - Noto Sans Ethiopic on Google Fonts: `https://fonts.google.com/noto/specimen/Noto+Sans+Ethiopic`
  - Tailwind CSS custom theme: `https://tailwindcss.com/docs/theme`

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: Button renders with correct variant classes
  - [ ] Test: Navbar renders with correct links for authenticated/guest states (use mock)
  - [ ] Test: Card renders children with proper styling

  **QA Scenarios**:

  ```
  Scenario: Base components render on test page
    Tool: Playwright
    Preconditions: Dev server running, test page created
    Steps:
      1. Navigate to `/test-components`
      2. Verify Button renders with "Click Me" text
      3. Verify Card component visible
      4. Verify Navbar visible with navigation links
      5. Check font rendering — verify Ethiopic text renders (use sample: "መዝሙር")
    Expected Result: All components render correctly with Ethiopian-themed styling and proper fonts
    Evidence: .omo/evidence/task-3-components.png

  Scenario: Responsive mobile navigation
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Set viewport to 375x667 (iPhone SE)
      2. Navigate to test page
      3. Verify hamburger menu icon is visible
      4. Click hamburger menu
      5. Verify mobile nav panel slides in
    Expected Result: Mobile navigation works with smooth animation
    Evidence: .omo/evidence/task-3-mobile-nav.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of all base components rendered
  - [ ] Screenshot of responsive mobile navigation
  - [ ] Font rendering evidence (Amharic text visible)

  **Commit**: YES (groups with 2, 4)
  - Message: `feat(ui): add design system, base components, and Noto Sans Ethiopic font`
  - Files: `tailwind.config.ts`, `src/components/ui/*.tsx`, `src/components/layout/*.tsx`, `src/lib/fonts.ts`, `src/styles/globals.css`
  - Pre-commit: `bun test src/components/`

---

- [ ] 4. **i18n Setup + UI Locale Files**

  **What to do**:
  - Install and configure `next-intl` for UI strings only (NOT for song content)
  - Create `src/i18n/config.ts` — next-intl configuration with `am` (Amharic) and `en` (English) locales
  - Create `messages/am.json` — Amharic UI strings:
    - Navigation: Home, Browse, Search, Login, Register, Favorites, Playlists
    - Search: "Search songs...", "No results found", "Search by title or lyrics"
    - Song: "No English translation available", "Show translations", "Auto-scroll", "Share", "Download PDF"
    - Categories: All 9 category names in Amharic
    - Auth: "Login", "Register", "Email", "Password", "Sign in with Google"
    - User: "My Favorites", "My Playlists", "Settings", "Logout"
    - Error: "Something went wrong", "Song not found", "Please log in"
  - Create `messages/en.json` — English UI strings (same structure)
  - Create `src/i18n/request.ts` — next-intl request handler
  - Add locale switcher component (flag/language toggle in Navbar)
  - Create middleware.ts for locale detection and redirect

  **Must NOT do**:
  - NO route-based locale prefixes (`/en/song/123`, `/am/song/123`) — song pages are not localized this way
  - NO ICU message syntax complexity — keep strings flat and simple
  - NO automatic translation — all strings must be hand-written
  - NO locale detection based on Amharic content — UI locale is user-preference

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Translation and localization work, requires linguistic accuracy
  - **Skills**: None needed
  - **Skills Evaluated but Omitted**: None

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 2, 3)
  - **Blocks**: Tasks 5, 10, 13, 17
  - **Blocked By**: Task 1 (project scaffolding needed)

  **References**:
  - next-intl docs: `https://next-intl-docs.vercel.app/docs/getting-started/app-router`
  - Amharic locale reference for common UI strings

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: `useTranslations('Nav')` returns correct Amharic strings for `am` locale
  - [ ] Test: `useTranslations('Nav')` returns correct English strings for `en` locale
  - [ ] Test: Locale switcher renders and switches locale correctly

  **QA Scenarios**:

  ```
  Scenario: UI renders in Amharic by default
    Tool: Playwright
    Preconditions: Dev server running, locale set to Amharic
    Steps:
      1. Navigate to `/`
      2. Check navigation shows Amharic labels (መግቢያ, ፍለጋ, etc.)
      3. Check footer text is in Amharic
    Expected Result: All UI chrome text displays in Amharic script
    Evidence: .omo/evidence/task-4-locale-am.png

  Scenario: Switcher toggles to English
    Tool: Playwright
    Preconditions: Dev server running, page in Amharic
    Steps:
      1. Click language switcher in Navbar
      2. Select "English"
      3. Verify navigation shows "Home", "Search", etc.
    Expected Result: All UI text switches to English
    Evidence: .omo/evidence/task-4-locale-en.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of page in Amharic
  - [ ] Screenshot of page after switching to English
  - [ ] Missing translation key log (should be zero)

  **Commit**: YES (groups with 2, 3)
  - Message: `feat(i18n): add next-intl with Amharic and English UI strings`
  - Files: `src/i18n/*.ts`, `messages/*.json`, `middleware.ts`
  - Pre-commit: `bun test src/i18n/`

---

- [ ] 5. **Auth System (NextAuth v5 + Roles + Login/Register)**

  **What to do**:
  - Install `next-auth@beta` and `@auth/mongodb-adapter`
  - Configure `src/lib/auth.ts` — Auth.js config with:
    - MongoDB adapter
    - Credentials provider (email + password) with custom verify logic
    - Google OAuth provider (configured via env vars)
    - `jwt()` callback adding `role` to token
    - `session()` callback adding `role` and `id` to session
  - Create `src/app/api/auth/[...nextauth]/route.ts` — catch-all auth route
  - Create `src/app/(auth)/login/page.tsx` — login page with email/password form + Google button
  - Create `src/app/(auth)/register/page.tsx` — register page with name, email, password fields
  - Create `src/lib/auth-helpers.ts` — utility functions:
    - `getCurrentUser()` — get session user
    - `requireAuth()` — redirect if not logged in
    - `requireRole(...roles)` — check user role
    - `isAdmin()` — quick admin check
  - User model (from Task 2) already has role field — ensure it integrates with Auth.js callbacks
  - Add `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` to `.env.example`

  **Must NOT do**:
  - NO passwordless/OTP auth
  - NO additional OAuth providers (Google only)
  - NO custom rate limiting (Vercel handles this)
  - NO email verification flow for MVP

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Auth configuration requires careful integration between NextAuth, MongoDB adapter, and role-based middleware
  - **Skills**: None needed
  - **Skills Evaluated but Omitted**: None

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 6, 7, 8)
  - **Blocks**: Tasks 11, 15
  - **Blocked By**: Tasks 2, 3, 4

  **References**:
  - Auth.js v5 docs: `https://authjs.dev/reference/nextjs`
  - MongoDB adapter: `https://authjs.dev/reference/adapter/mongodb`
  - Roles in Auth.js: `https://authjs.dev/guides/extending-the-session`

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: `POST /api/auth/signup` with valid data creates user and returns session
  - [ ] Test: `POST /api/auth/signup` with duplicate email returns error
  - [ ] Test: `POST /api/auth/login` with correct credentials returns session
  - [ ] Test: `POST /api/auth/login` with wrong password returns 401
  - [ ] Test: Session contains `role` field for authenticated users

  **QA Scenarios**:

  ```
  Scenario: User registration flow
    Tool: Playwright
    Preconditions: Dev server running, not logged in
    Steps:
      1. Navigate to `/register`
      2. Fill in: Name "TestUser", Email "test@example.com", Password "Test123!"
      3. Click "Register" button
      4. Wait for redirect to home page
      5. Verify Navbar shows user name or "My Profile" instead of "Login/Register"
    Expected Result: User is registered and logged in automatically
    Evidence: .omo/evidence/task-5-register.png

  Scenario: Login flow
    Tool: Playwright
    Preconditions: User already registered
    Steps:
      1. Navigate to `/login`
      2. Fill in: Email "test@example.com", Password "Test123!"
      3. Click "Login" button
      4. Verify redirect to home page
      5. Check session cookie exists
    Expected Result: User is logged in, session persists
    Evidence: .omo/evidence/task-5-login.txt

  Scenario: Invalid login rejected
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to `/login`
      2. Fill in: Email "wrong@email.com", Password "WrongPass1"
      3. Click "Login" button
      4. Verify error message appears: "Invalid email or password"
    Expected Result: Error message displayed, no session created
    Evidence: .omo/evidence/task-5-login-error.png
  ```

  **Evidence to Capture**:
  - [ ] Registration success screenshot
  - [ ] Login form filled screenshot
  - [ ] Auth error handling screenshot
  - [ ] Session cookie evidence

  **Commit**: YES
  - Message: `feat(auth): add NextAuth v5 with credentials, Google OAuth, and role-based sessions`
  - Files: `src/lib/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/app/(auth)/**/*`, `src/lib/auth-helpers.ts`
  - Pre-commit: `bun test src/lib/auth.test.ts`

---

- [ ] 6. **Category API + Song API (CRUD Routes)**

  **What to do**:
  - Create `src/app/api/categories/route.ts` — GET (list all), POST (create — admin only)
  - Create `src/app/api/categories/[id]/route.ts` — GET, PUT, DELETE (admin only)
  - Create `src/app/api/songs/route.ts` — GET (list, with filters: category, search, page, limit), POST (create — authenticated users can submit, admin auto-publish)
  - Create `src/app/api/songs/[slug]/route.ts` — GET, PUT, DELETE
  - Create `src/app/api/songs/[slug]/favorite/route.ts` — POST (add/remove favorite)
  - Song GET endpoint supports:
    - `?category=slug` — filter by category
    - `?search=term` — search by title or lyrics (basic regex for now, Fuse.js in UI layer)
    - `?page=1&limit=20` — pagination
    - `?includeUnapproved=true` — admin only, show pending songs
  - Create validation schemas using Zod for all request bodies
  - Create `src/lib/api-helpers.ts` — response formatting, error handling, pagination utility
  - Song slug generation: transliterate Amharic title to Latin characters + kebab case (e.g., "መዝሙር ለእግዚአብሔር" → "mezmur-le-egziabher")

  **Must NOT do**:
  - NO image/file upload endpoints (future audio feature)
  - NO batch operations (bulk is handled separately via import tool)
  - NO soft delete — hard delete is fine for MVP
  - NO GraphQL or tRPC — REST API only

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Multiple interconnected endpoints, Zod validation, pagination, role-based access control
  - **Skills**: None needed
  - **Skills Evaluated but Omitted**: None

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 5, 7, 8)
  - **Blocks**: Tasks 9, 10, 14, 16
  - **Blocked By**: Task 2 (MongoDB models needed)

  **References**:
  - Next.js App Router route handlers: `https://nextjs.org/docs/app/building-your-application/routing/route-handlers`
  - Zod validation: `https://zod.dev/`
  - Amharic-to-Latin slug generator pattern (custom)

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: `GET /api/categories` returns 200 with array of 9 categories
  - [ ] Test: `POST /api/songs` creates a song with valid data
  - [ ] Test: `GET /api/songs?category=misgana` returns filtered results
  - [ ] Test: `GET /api/songs?search=ቤዛ` returns matching results
  - [ ] Test: `POST /api/songs` without auth returns 401
  - [ ] Test: Zod validation rejects malformed request bodies

  **QA Scenarios**:

  ```
  Scenario: List categories via API
    Tool: Bash (curl)
    Preconditions: Dev server running, categories seeded
    Steps:
      1. Run: curl -s http://localhost:3000/api/categories
      2. Parse JSON response
      3. Check array length is 9
      4. Check first category has nameAm field
    Expected Result: 9 categories returned with Amharic and English names
    Evidence: .omo/evidence/task-6-categories.json

  Scenario: Create a song via API (authenticated)
    Tool: Bash (curl)
    Preconditions: Valid session cookie from Task 5
    Steps:
      1. POST JSON to /api/songs with titleAm, lyricsAm, categoryId
      2. Check response status 201
      3. GET the song by returned slug
      4. Verify all fields match
    Expected Result: Song created and retrievable
    Evidence: .omo/evidence/task-6-create-song.json

  Scenario: Unauthenticated creation rejected
    Tool: Bash (curl)
    Preconditions: No auth cookie
    Steps:
      1. POST JSON to /api/songs without auth header
      2. Check response status 401
    Expected Result: 401 Unauthorized with error message
    Evidence: .omo/evidence/task-6-auth-rejection.txt
  ```

  **Evidence to Capture**:
  - [ ] Categories API response JSON
  - [ ] Song creation API response
  - [ ] Auth rejection evidence

  **Commit**: YES
  - Message: `feat(api): add Category and Song CRUD API routes with Zod validation`
  - Files: `src/app/api/categories/**/*.ts`, `src/app/api/songs/**/*.ts`, `src/lib/api-helpers.ts`
  - Pre-commit: `bun test src/app/api/`

---

- [ ] 7. **Fuse.js Search Utility + Data Preloader**

  **What to do**:
  - Install `fuse.js`
  - Create `src/lib/search.ts` — Fuse.js search utility:
    - `buildSongIndex(songs[])` — creates Fuse.js index with weighted keys:
      - `titleAm`: weight 5
      - `titleEn`: weight 5
      - `lyricsAm`: weight 3
      - `lyricsEn`: weight 3
      - `tags`: weight 2
    - `searchSongs(fuse, query)` — performs search with fuzzy matching
    - Configure Fuse.js for Ethiopic script: `threshold: 0.4`, `distance: 100`, `ignoreLocation: true`
  - Create `src/lib/song-preloader.ts` — fetches all approved songs for client-side Fuse index
  - Create `src/app/api/search/route.ts` — optional server-side search endpoint
  - Create `src/hooks/useSearch.ts` — React hook:
    - Debounced input (300ms)
    - Calls preloaded Fuse.js index
    - Returns results with category info
    - Handles empty/loading/error states

  **Must NOT do**:
  - NO MongoDB $text search (doesn't support Ethiopic)
  - NO Elasticsearch or Meilisearch (overkill for <1000 songs)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Custom Fuse.js configuration for Ethiopic script search needs careful tuning
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 5, 6, 8)
  - **Blocks**: Task 12
  - **Blocked By**: Task 2

  **References**:
  - Fuse.js docs: `https://fusejs.io/api/options.html`

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: `searchSongs('ቤዛ', index)` returns matching songs
  - [ ] Test: `searchSongs('Jesus', index)` returns matches
  - [ ] Test: Non-existent query returns empty array
  - [ ] Test: Fuse.js handles partial Amharic fidel input

  **QA Scenarios**:

  ```
  Scenario: Search returns Amharic results
    Tool: Bash (bun test)
    Preconditions: Test songs exist
    Steps:
      1. Create 5 test songs with Amharic titles
      2. Build Fuse index
      3. Search for "መዝ"
      4. Assert results contain matching songs
    Expected Result: Partial Amharic search returns matches
    Evidence: .omo/evidence/task-7-search-amharic.txt

  Scenario: Empty search
    Tool: Bash (bun test)
    Preconditions: Fuse index built
    Steps:
      1. Search for "zzzznonexistent"
      2. Assert empty array, no crash
    Expected Result: Graceful empty result
    Evidence: .omo/evidence/task-7-search-empty.txt
  ```

  **Evidence to Capture**:
  - [ ] Search test outputs

  **Commit**: YES (groups with 5, 8)
  - Message: `feat(search): add Fuse.js search utility with Amharic/Ethiopic support`
  - Files: `src/lib/search.ts`, `src/lib/song-preloader.ts`, `src/hooks/useSearch.ts`, `src/app/api/search/route.ts`
  - Pre-commit: `bun test src/lib/search.test.ts`

---

- [ ] 8. **Auth Middleware + Protected Route Guards**

  **What to do**:
  - Create `src/middleware.ts` — Next.js middleware that:
    - Checks session for admin routes (`/admin/*`) — redirects to login if not admin
    - Checks session for user routes (`/my/*`) — redirects to login if not authenticated
    - Public routes (`/`, `/songs/*`) — always accessible
    - API routes `/api/admin/*` — returns 401 if not admin
  - Create `src/lib/guards.ts` — route guard utilities:
    - `ensureAdmin()`, `ensureAuthenticated()`, `ensureRole(...roles)`
  - Create `src/app/(admin)/layout.tsx` — admin layout that redirects non-admin users
  - Create `src/app/(public)/layout.tsx` — public layout

  **Must NOT do**:
  - NO client-side route protection alone
  - NO redirect loops

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard Next.js middleware pattern
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 6, 7 — after Task 5 completes)
  - **Blocks**: Tasks 11, 15
  - **Blocked By**: Tasks 2, 5

  **References**:
  - Next.js middleware: `https://nextjs.org/docs/app/building-your-application/routing/middleware`
  - NextAuth edge: `https://authjs.dev/guides/edge-compatibility`

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: Guest accessing `/admin` redirects to `/login`
  - [ ] Test: Admin accessing `/admin` renders admin layout
  - [ ] Test: Non-admin accessing `/admin` gets 403
  - [ ] Test: Guest accessing `/my/favorites` redirects to `/login`
  - [ ] Test: Public `/songs/` accessible without auth

  **QA Scenarios**:

  ```
  Scenario: Admin route blocked for guest
    Tool: Playwright
    Preconditions: Not logged in
    Steps:
      1. Navigate to `/admin`
      2. Verify redirect to `/login?callbackUrl=/admin`
    Expected Result: Guest redirected
    Evidence: .omo/evidence/task-8-admin-guest-redirect.png

  Scenario: Public route accessible
    Tool: Playwright
    Preconditions: Not logged in
    Steps:
      1. Navigate to `/songs`
      2. Verify 200, no redirect
    Expected Result: Public content accessible
    Evidence: .omo/evidence/task-8-public-access.png
  ```

  **Evidence to Capture**:
  - [ ] Guest redirect screenshot
  - [ ] Public access screenshot

  **Commit**: YES (groups with 5, 7)
  - Message: `feat(auth): add middleware for role-based route protection`
  - Files: `src/middleware.ts`, `src/lib/guards.ts`, `src/app/(admin)/layout.tsx`, `src/app/(public)/layout.tsx`
  - Pre-commit: `bun test src/lib/guards.test.ts`

---

- [ ] 9. **Public Song Listing + Category Browsing**

  **What to do**:
  - Create `src/app/(public)/page.tsx` — landing page with:
    - Hero section with app title in Amharic (የኢትዮጵያ ኦርቶዶክስ መዝሙራት) and subtitle
    - Category grid showing all 9 categories as cards with icons
    - Recent/popular songs section (most recently added)
    - Ethiopian cross decorative element (CSS-only)
  - Create `src/app/(public)/songs/page.tsx` — full song listing with:
    - Category filter sidebar/dropdown showing 9 categories
    - Song cards with Amharic title, English title (if exists), category badge
    - Pagination (20 songs per page)
    - Sort options (by title, by date added)
    - Empty state: "No songs in this category yet"
    - Loading state: Skeleton cards animation
    - Error state: "Could not load songs. Please try again."
  - Create `src/app/(public)/songs/[slug]/page.tsx` — **Song detail page** (see Task 10)
  - Create `src/components/song/SongCard.tsx` — reusable song card component
  - Create `src/components/song/CategoryCard.tsx` — category card with count
  - All pages use server components where possible, with client islands for interactivity
  - Fetch data using `src/lib/song-preloader.ts` for static generation where possible

  **Must NOT do**:
  - NO infinite scroll (pagination is simpler and more accessible)
  - NO animated category transitions (keep it simple)
  - NO complex server-side rendering for search results (client-side Fuse.js handles this)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Ethiopian-themed UI with responsive category grid, song cards, and decorative elements
  - **Skills**: None needed beyond category

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 10, 11, 12, 13)
  - **Blocks**: Task 18
  - **Blocked By**: Tasks 3, 6

  **References**:
  - Next.js App Router pages: `https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts`
  - Tailwind responsive grid: `https://tailwindcss.com/docs/responsive-design`

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: Landing page renders all 9 category cards
  - [ ] Test: Song listing page shows first 20 songs with pagination
  - [ ] Test: Category filter reduces displayed songs
  - [ ] Test: Empty category shows "No songs" message
  - [ ] Test: Loading state displays skeleton components

  **QA Scenarios**:

  ```
  Scenario: Landing page loads with categories
    Tool: Playwright
    Preconditions: Dev server running, categories + test songs seeded
    Steps:
      1. Navigate to `/`
      2. Verify page title contains Amharic text (የኢትዮጵያ ኦርቶዶክስ መዝሙራት)
      3. Count category cards — should be 9
      4. Click first category card
      5. Verify URL changes to songs filtered by that category
    Expected Result: Landing page shows all categories, clicking navigates correctly
    Evidence: .omo/evidence/task-9-landing.png

  Scenario: Song listing with pagination
    Tool: Playwright
    Preconditions: 25+ test songs exist
    Steps:
      1. Navigate to `/songs`
      2. Verify 20 song cards visible
      3. Click "Next" / page 2 button
      4. Verify remaining 5 songs visible
    Expected Result: Pagination works, songs displayed correctly
    Evidence: .omo/evidence/task-9-pagination.png

  Scenario: Empty category state
    Tool: Playwright
    Preconditions: 0 songs in "Wereb" category
    Steps:
      1. Navigate to `/songs?category=wereb`
      2. Verify "No songs" empty state message visible
    Expected Result: Graceful empty state displayed
    Evidence: .omo/evidence/task-9-empty.png
  ```

  **Evidence to Capture**:
  - [ ] Landing page screenshot with all 9 categories
  - [ ] Song listing with pagination screenshot
  - [ ] Empty state screenshot

  **Commit**: YES
  - Message: `feat(ui): add public song listing, category browsing, and landing page`
  - Files: `src/app/(public)/**/*.tsx`, `src/components/song/*.tsx`
  - Pre-commit: `bun test src/app/(public)/`

---

- [ ] 10. **Song Detail Page + Dual-Language Display + Auto-Scroll**

  **What to do**:
  - Create `src/app/(public)/songs/[slug]/page.tsx` — song detail page:
    - Server component that fetches song by slug
    - If not found: 404 page with "Song not found" in Amharic and English
    - Dynamic metadata for SEO (title, description, Open Graph)
  - **Dual-language display**: Two-column layout on desktop, tab/toggle on mobile:
    - Left column: Amharic/Ge'ez lyrics in large font
    - Right column: English translation (if exists)
    - Mobile: Toggle button to switch between Amharic and English view
    - If no English translation: show "English translation coming soon" placeholder
    - Proper line-height and font-size for Ethiopic script readability
  - **Auto-scroll / Hands-free mode**:
    - Floating button "▶ Auto-scroll" on song page
    - When activated, lyrics scroll at adjustable speed (1x, 0.5x, 2x)
    - Tap/pause to stop auto-scroll
    - Progress indicator showing current position
    - Speed control buttons in a small overlay
  - **Share button**: Opens share dialog with song URL, copies to clipboard
  - **Favorite button**: Heart icon, toggles favorite (requires login, redirects if not)
  - **PDF download button**: Triggers client-side PDF generation (see Task 17)
  - Create `src/components/song/LyricsDisplay.tsx` — reusable lyrics component with auto-scroll
  - Create `src/hooks/useAutoScroll.ts` — custom hook for auto-scroll logic

  **Must NOT do**:
  - NO audio player (future phase)
  - NO YouTube/Vimeo embed
  - NO comments section
  - NO related songs carousel

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Complex UI with dual-language layout, auto-scroll animation, responsive behavior
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 9, 11, 12, 13)
  - **Blocks**: Task 18
  - **Blocked By**: Tasks 3, 6

  **References**:
  - Next.js dynamic metadata: `https://nextjs.org/docs/app/building-your-application/optimizing/metadata`

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: Song page renders with Amharic title in <h1>
  - [ ] Test: Song page shows English translation when available
  - [ ] Test: Song page shows "No translation" placeholder when unavailable
  - [ ] Test: Non-existent slug returns 404
  - [ ] Test: Auto-scroll starts on button click
  - [ ] Test: Auto-scroll speed changes on speed button click

  **QA Scenarios**:

  ```
  Scenario: Song detail renders correctly
    Tool: Playwright
    Preconditions: Test song "ቤዛ የሆንክልን" exists in DB
    Steps:
      1. Navigate to `/songs/beza-yehonkiln`
      2. Verify Amharic title visible and correct
      3. Verify lyrics rendered with proper Ethiopic font
      4. Check English translation column exists (if available) or placeholder
    Expected Result: Song page displays correctly with all elements
    Evidence: .omo/evidence/task-10-song-detail.png

  Scenario: Auto-scroll functionality
    Tool: Playwright
    Preconditions: Song with long lyrics loaded
    Steps:
      1. Navigate to song page
      2. Click "Auto-scroll" button
      3. Wait 3 seconds
      4. Verify scroll position has changed (page scrolled down)
      5. Click "Pause" button
      6. Verify scrolling stops
    Expected Result: Auto-scroll scrolls lyrics, pause stops it
    Evidence: .omo/evidence/task-10-autoscroll.txt

  Scenario: Song not found
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to `/songs/nonexistent-song-slug`
      2. Verify 404 page renders
      3. Verify message appears in Amharic (ዘማሪ አልተገኘም) and English
    Expected Result: 404 page with bilingual message
    Evidence: .omo/evidence/task-10-404.png
  ```

  **Evidence to Capture**:
  - [ ] Song detail page screenshot
  - [ ] Auto-scroll evidence (scroll position before/after)
  - [ ] 404 page screenshot

  **Commit**: YES
  - Message: `feat(ui): add song detail page with dual-language display and auto-scroll`
  - Files: `src/app/(public)/songs/[slug]/page.tsx`, `src/components/song/LyricsDisplay.tsx`, `src/hooks/useAutoScroll.ts`
  - Pre-commit: `bun test src/components/song/`

---

- [ ] 11. **Favorites/Bookmarks + Playlists API + UI**

  **What to do**:
  - Create `src/app/(public)/my/favorites/page.tsx` — user favorites page:
    - Lists all favorited songs as cards
    - Empty state: "No favorites yet. Browse songs and ❤️ to save."
    - Unfavorite button on each card
  - Create `src/app/(public)/my/playlists/page.tsx` — user playlists page:
    - Lists user's playlists with song count
    - "Create Playlist" button → modal with name/description form
    - Clicking playlist shows its songs
  - Create `src/app/(public)/my/playlists/[id]/page.tsx` — individual playlist:
    - Song list with remove button
    - Playlist name and description editable
  - Wire up favorite toggle on song detail page (from Task 10)
  - Wire up "Add to Playlist" button on song detail page (modal showing user's playlists)
  - API endpoints (already created in Task 6 but ensure UI integration):
    - `POST /api/songs/[slug]/favorite`
    - `POST /api/playlists` — create
    - `GET /api/playlists` — list user's
    - `GET /api/playlists/[id]` — get with songs
    - `POST /api/playlists/[id]/songs` — add song
    - `DELETE /api/playlists/[id]/songs/[songId]` — remove song

  **Must NOT do**:
  - NO public playlist sharing (share feature is for individual songs only)
  - NO collaborative playlists
  - NO playlist reordering (drag-and-drop)
  - NO playlist covers/images

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Multiple interconnected pages with auth, CRUD operations, and UI states
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 9, 10, 12, 13)
  - **Blocks**: Task 18
  - **Blocked By**: Tasks 5, 8

  **References**:
  - Next.js client component patterns for auth-based UIs

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: Favorites page shows user's favorited songs
  - [ ] Test: Empty favorites shows "No favorites" message
  - [ ] Test: User can create a playlist
  - [ ] Test: User can add song to playlist
  - [ ] Test: User can remove song from playlist
  - [ ] Test: Unauthenticated user accessing `/my/*` redirects to login

  **QA Scenarios**:

  ```
  Scenario: Add song to favorites
    Tool: Playwright
    Preconditions: Logged in, on a song detail page
    Steps:
      1. Click heart/favorite button
      2. Verify button changes to filled/hearted state
      3. Navigate to `/my/favorites`
      4. Verify song appears in favorites list
    Expected Result: Song added to favorites, visible on favorites page
    Evidence: .omo/evidence/task-11-favorite.png

  Scenario: Create playlist and add song
    Tool: Playwright
    Preconditions: Logged in, on a song detail page
    Steps:
      1. Click "Add to Playlist" button
      2. Click "Create New Playlist"
      3. Enter name "My Test Playlist"
      4. Click "Create"
      5. Verify song added to new playlist
      6. Navigate to `/my/playlists`
      7. Verify "My Test Playlist" exists with 1 song
    Expected Result: Playlist created, song added
    Evidence: .omo/evidence/task-11-playlist.png

  Scenario: Favorites empty state
    Tool: Playwright
    Preconditions: Logged in, no favorites
    Steps:
      1. Navigate to `/my/favorites`
      2. Verify "No favorites yet" message
    Expected Result: Graceful empty state with helpful message
    Evidence: .omo/evidence/task-11-empty-favs.png
  ```

  **Evidence to Capture**:
  - [ ] Favorites page screenshot
  - [ ] Playlist creation screenshot
  - [ ] Empty state screenshot

  **Commit**: YES
  - Message: `feat(ui): add favorites and playlists pages with full CRUD`
  - Files: `src/app/(public)/my/**/*.tsx`
  - Pre-commit: `bun test src/app/(public)/my/`

---

- [ ] 12. **Search UI Integration**

  **What to do**:
  - Add search bar to Navbar component (from Task 3)
  - Create `src/app/(public)/search/page.tsx` — dedicated search page:
    - Large search input with Amharic placeholder text ("መዝሙር ፈልግ...")
    - Real-time results as user types (debounced 300ms)
    - Results displayed as song cards with category badges
    - Highlight matched text in results
    - "No results found" empty state with suggestions
    - Loading spinner while filtering
  - Search sources from Fuse.js index (from Task 7)
  - Create `src/components/search/SearchResult.tsx` — individual result item
  - Wire up keyboard navigation (arrow keys to navigate results, Enter to select)
  - Clicking result navigates to song detail page

  **Must NOT do**:
  - NO search history
  - NO trending searches
  - NO voice search
  - NO search suggestions dropdown from backend

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Search UX with real-time filtering, highlighted results, keyboard navigation
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 9, 10, 11, 13)
  - **Blocks**: Task 18
  - **Blocked By**: Task 7 (Fuse.js utility needed)

  **References**:
  - Fuse.js integration patterns

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: Search input renders on search page
  - [ ] Test: Typing query returns results (after debounce)
  - [ ] Test: Empty query shows all songs or placeholder
  - [ ] Test: No results state shows "No results" message
  - [ ] Test: Clicking result navigates to song detail

  **QA Scenarios**:

  ```
  Scenario: Search by Amharic text
    Tool: Playwright
    Preconditions: Songs with Amharic titles exist
    Steps:
      1. Navigate to `/search`
      2. Type "ቤዛ" in search input
      3. Wait 500ms for debounce
      4. Verify results appear with song cards
      5. Verify matched text is highlighted
    Expected Result: Search returns Amharic matches with highlighting
    Evidence: .omo/evidence/task-12-search-am.png

  Scenario: Search by English text
    Tool: Playwright
    Preconditions: Songs with English translations exist
    Steps:
      1. Navigate to `/search`
      2. Type "Jesus" in search input
      3. Wait 500ms
      4. Verify results include songs with "Jesus" in title or lyrics
    Expected Result: English word search returns matches
    Evidence: .omo/evidence/task-12-search-en.png

  Scenario: No results state
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to `/search`
      2. Type "zzzznonexistent"
      3. Wait 500ms
      4. Verify "No results found" message
      5. Verify suggestions for broader search
    Expected Result: Graceful no-results handling
    Evidence: .omo/evidence/task-12-search-empty.png
  ```

  **Evidence to Capture**:
  - [ ] Amharic search results screenshot
  - [ ] English search results screenshot
  - [ ] Empty results screenshot

  **Commit**: YES
  - Message: `feat(ui): add search page with real-time Fuse.js filtering`
  - Files: `src/app/(public)/search/page.tsx`, `src/components/search/*.tsx`, updated Navbar
  - Pre-commit: `bun test src/app/(public)/search/`

---

- [ ] 13. **Share Functionality + SEO Meta Tags**

  **What to do**:
  - Add Open Graph and Twitter Card metadata to song detail pages (from Task 10):
    - `og:title` — song title in Amharic
    - `og:description` — first 100 chars of lyrics
    - `og:type` — music.song
    - `og:url` — canonical song URL
    - `twitter:card` — summary
  - Create `src/components/song/ShareButton.tsx`:
    - Copies song URL to clipboard
    - Web Share API for mobile devices (navigator.share)
    - Fallback: manual copy with "Copied!" toast notification
    - Share targets: Copy link, Facebook, Twitter (links with pre-filled text)
  - Create `src/components/ui/Toast.tsx` — simple toast/notification component
  - Generate `sitemap.xml` for SEO (all song pages + category pages)
  - Generate `robots.txt`
  - Add JSON-LD structured data for songs (Schema.org MusicRecording)

  **Must NOT do**:
  - NO WhatsApp/Telegram deep links (user can paste URL)
  - NO QR code generation
  - NO share count tracking
  - NO social media login integration

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI components (ShareButton, Toast) and metadata integration
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 9, 10, 11, 12)
  - **Blocks**: Task 18
  - **Blocked By**: Tasks 4, 10

  **References**:
  - Next.js metadata API: `https://nextjs.org/docs/app/building-your-application/optimizing/metadata`
  - Next.js sitemap: `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap`
  - Schema.org MusicRecording: `https://schema.org/MusicRecording`

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: Song page has `og:title` meta tag
  - [ ] Test: Share button copies URL to clipboard
  - [ ] Test: Toast notification appears after copy
  - [ ] Test: sitemap.xml lists all song pages
  - [ ] Test: JSON-LD structured data is valid JSON

  **QA Scenarios**:

  ```
  Scenario: Share button copies URL
    Tool: Playwright
    Preconditions: On a song detail page
    Steps:
      1. Click Share button
      2. Verify "Copied!" toast notification appears
      3. Check clipboard contains song URL (e.g., /songs/beza-yehonkiln)
    Expected Result: Song URL copied to clipboard
    Evidence: .omo/evidence/task-13-share.png

  Scenario: OG meta tags present
    Tool: Bash (curl)
    Preconditions: Dev server running, song exists
    Steps:
      1. Run: curl -s http://localhost:3000/songs/test-song | grep "og:title"
      2. Check og:title contains Amharic text
      3. Check og:description present
    Expected Result: OG meta tags present with correct content
    Evidence: .omo/evidence/task-13-og-tags.txt

  Scenario: Sitemap exists
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. curl -s http://localhost:3000/sitemap.xml
      2. Verify valid XML structure
      3. Check contains song URLs
    Expected Result: Valid sitemap with song entries
    Evidence: .omo/evidence/task-13-sitemap.xml
  ```

  **Evidence to Capture**:
  - [ ] Share button screenshot with toast
  - [ ] OG meta tag output
  - [ ] Sitemap XML file

  **Commit**: YES
  - Message: `feat(seo): add share functionality, OG meta tags, sitemap, and JSON-LD`
  - Files: `src/components/song/ShareButton.tsx`, `src/components/ui/Toast.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`
  - Pre-commit: `bun test src/components/song/`

---

- [ ] 14. **Admin Dashboard — Song CRUD + Category Management**

  **What to do**:
  - Create `src/app/(admin)/admin/layout.tsx` — admin layout with sidebar navigation:
    - Links: Songs, Categories, Users, Import, Moderation
    - Admin header with "Admin Panel" title and logout button
  - Create `src/app/(admin)/admin/page.tsx` — admin dashboard welcome page
  - Create `src/app/(admin)/admin/songs/page.tsx` — song list with:
    - Table view showing: Title (Amharic), Category, Status (approved/pending), Author, Date
    - Search/filter bar
    - "Add New Song" button
    - Edit/Delete actions per row
    - Pagination
  - Create `src/app/(admin)/admin/songs/new/page.tsx` — song creation form:
    - Amharic title (required), English title (optional)
    - Amharic lyrics (required, textarea, large)
    - English lyrics (optional, textarea)
    - Category dropdown (populated from DB)
    - Tags input (comma-separated)
    - Author field
    - Biblical references (repeating field, add/remove)
    - Approve checkbox (auto-approved for admins)
    - Save/Cancel buttons
  - Create `src/app/(admin)/admin/songs/[id]/edit/page.tsx` — song edit form (same as create, pre-filled)
  - Create `src/app/(admin)/admin/categories/page.tsx` — category list + reorder + add/edit
  - Create admin API routes (reuse existing, ensure admin-only middleware)
  - Add confirm dialogs for destructive actions (delete song)

  **Must NOT do**:
  - NO rich text editor (plain textarea for lyrics)
  - NO image upload for songs
  - NO batch operations
  - NO admin user signup — admins are promoted by existing admin only

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Full CRUD UI with forms, tables, validation, and admin-only access
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 15, 16, 17)
  - **Blocks**: Task 18
  - **Blocked By**: Tasks 3, 6

  **References**:
  - Tailwind forms and tables patterns

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: Admin can view song list
  - [ ] Test: Admin can create a new song with required fields
  - [ ] Test: Admin can edit an existing song
  - [ ] Test: Admin can delete a song (with confirmation)
  - [ ] Test: Form validation rejects empty required fields

  **QA Scenarios**:

  ```
  Scenario: Admin creates a new song
    Tool: Playwright
    Preconditions: Logged in as admin, on admin dashboard
    Steps:
      1. Navigate to `/admin/songs/new`
      2. Fill all required fields: Amharic title, Amharic lyrics, category
      3. Click "Save"
      4. Verify redirect to song list
      5. Verify new song appears in list with "(Approved)" status
    Expected Result: Song created and visible in admin list
    Evidence: .omo/evidence/task-14-create-song.png

  Scenario: Admin edits a song
    Tool: Playwright
    Preconditions: Song exists, logged in as admin
    Steps:
      1. Navigate to `/admin/songs`
      2. Click "Edit" on existing song
      3. Change Amharic title
      4. Click "Save"
      5. Verify song list shows updated title
    Expected Result: Song title updated
    Evidence: .omo/evidence/task-14-edit-song.png

  Scenario: Admin deletes a song
    Tool: Playwright
    Preconditions: Song exists, logged in as admin
    Steps:
      1. Navigate to `/admin/songs`
      2. Click "Delete" on existing song
      3. Confirm in dialog
      4. Verify song removed from list
      5. Verify song page returns 404
    Expected Result: Song deleted from system
    Evidence: .omo/evidence/task-14-delete-song.png
  ```

  **Evidence to Capture**:
  - [ ] Song creation screenshot
  - [ ] Song editing screenshot
  - [ ] Delete confirmation dialog screenshot

  **Commit**: YES
  - Message: `feat(admin): add song and category CRUD admin dashboard`
  - Files: `src/app/(admin)/admin/**/*.tsx`
  - Pre-commit: `bun test src/app/(admin)/`

---

- [ ] 15. **Admin — User Management + Roles**

  **What to do**:
  - Create `src/app/(admin)/admin/users/page.tsx` — user list table:
    - Name, Email, Role, Registration date, Song count
    - Filter by role
  - Create user role management:
    - Promote user from `viewer` to `contributor` (can submit songs)
    - Promote user from `contributor` to `editor` (can approve songs)
    - Demote user (can't demote last admin)
  - Add confirmation dialog for role changes
  - Create `src/app/api/admin/users/route.ts` — admin-only user management API:
    - GET list all users
    - PUT update user role

  **Must NOT do**:
  - NO user deletion (accounts persist, songs need owner)
  - NO impersonation
  - NO view user passwords (Auth.js handles this)
  - NO bulk role operations

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Admin user management with role-based permissions, API + UI
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 14, 16, 17)
  - **Blocks**: Task 18
  - **Blocked By**: Tasks 5, 8

  **References**:
  - Auth.js role management patterns

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: Admin can view user list
  - [ ] Test: Admin can promote a user's role
  - [ ] Test: Admin cannot demote the last admin
  - [ ] Test: Non-admin gets 403 on admin API

  **QA Scenarios**:

  ```
  Scenario: Promote user to editor
    Tool: Playwright
    Preconditions: Logged in as admin, user "test@example.com" exists as contributor
    Steps:
      1. Navigate to `/admin/users`
      2. Find user "test@example.com"
      3. Click "Edit Role" → select "Editor"
      4. Confirm change
      5. Verify role updates to "Editor"
    Expected Result: User role changed to editor
    Evidence: .omo/evidence/task-15-role-promote.png

  Scenario: Non-admin blocked from user management
    Tool: Playwright
    Preconditions: Logged in as contributor (non-admin)
    Steps:
      1. Navigate to /admin/users
      2. Verify redirect or 403 message
    Expected Result: Non-admin cannot access user management
    Evidence: .omo/evidence/task-15-access-denied.png
  ```

  **Evidence to Capture**:
  - [ ] User role change screenshot
  - [ ] Access denied screenshot

  **Commit**: YES
  - Message: `feat(admin): add user management with role promotion/demotion`
  - Files: `src/app/(admin)/admin/users/**/*.tsx`, `src/app/api/admin/users/route.ts`
  - Pre-commit: `bun test src/app/api/admin/`

---

- [ ] 16. **Admin — PDF Import Tool + Moderation Queue**

  **What to do**:
  - Create `src/app/(admin)/admin/import/page.tsx` — PDF import page:
    - File upload area (drag-and-drop or click)
    - Supported: `.pdf` files
    - "Select Category" dropdown — assigns category to ALL imported songs
    - "Import" button
    - Progress bar during import
    - Results page showing: total found, successfully imported, errors
  - PDF parsing logic in `src/lib/pdf-importer.ts`:
    - Accept PDF as buffer
    - Extract text using `pdf-parse` library or similar
    - Split text by song title patterns (detect lines that look like titles — ALL CAPS or standalone text)
    - For each chunk: extract title (first line), extract lyrics (rest)
    - Create Song documents in DB (not approved by default)
    - Return import report: `{ total: number, imported: number, errors: string[] }`
  - Create `src/app/(admin)/admin/moderation/page.tsx` — moderation queue:
    - Lists all unapproved songs submitted by contributors
    - "Review" button → opens song in read-only view
    - "Approve" button → sets `isApproved: true`, song becomes public
    - "Reject" button → deletes song submission
    - Badge showing pending count in admin sidebar

  **Must NOT do**:
  - NO bulk approve/reject
  - NO PDF with scanned images (requires OCR — out of scope)
  - NO import from Word/Excel files

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: PDF parsing logic + moderation UI with approval workflow
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 14, 15, 17)
  - **Blocks**: Task 18
  - **Blocked By**: Task 6 (Song API needed)

  **References**:
  - pdf-parse npm package: `https://www.npmjs.com/package/pdf-parse`

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: PDF text extraction returns array of song chunks
  - [ ] Test: Song title detection works on sample text
  - [ ] Test: Import creates Song documents in DB
  - [ ] Test: Imported songs are NOT approved by default
  - [ ] Test: Moderation queue shows unapproved songs
  - [ ] Test: Approving song sets `isApproved: true`

  **QA Scenarios**:

  ```
  Scenario: Import songs from PDF
    Tool: Playwright
    Preconditions: Logged in as admin, sample PDF available
    Steps:
      1. Navigate to `/admin/import`
      2. Upload sample PDF with 3 known songs
      3. Select category "ምስጋና"
      4. Click "Import"
      5. Wait for completion
      6. Verify "3 songs imported successfully" message
    Expected Result: PDF parsed, songs created in DB under correct category
    Evidence: .omo/evidence/task-16-import.png

  Scenario: Moderation queue
    Tool: Playwright
    Preconditions: Contributor submitted a song (unapproved)
    Steps:
      1. Navigate to `/admin/moderation`
      2. Verify pending song visible in queue
      3. Click "Approve" on pending song
      4. Verify song removed from queue
      5. Navigate to public song page
      6. Verify song now visible to public
    Expected Result: Moderation workflow works end-to-end
    Evidence: .omo/evidence/task-16-moderation.png
  ```

  **Evidence to Capture**:
  - [ ] Import screen with progress
  - [ ] Import results (counts)
  - [ ] Moderation queue screenshot

  **Commit**: YES
  - Message: `feat(admin): add PDF import tool and moderation queue`
  - Files: `src/app/(admin)/admin/import/**/*.tsx`, `src/app/(admin)/admin/moderation/**/*.tsx`, `src/lib/pdf-importer.ts`
  - Pre-commit: `bun test src/lib/pdf-importer.test.ts`

---

- [ ] 17. **PDF Export + Vercel Deployment Config**

  **What to do**:
  - Create client-side PDF export utility `src/lib/pdf-export.ts`:
    - Uses `jspdf` + `html2canvas` (or `html2pdf.js` wrapper)
    - Receives song data (title, lyrics in both languages)
    - Generates clean PDF with:
      - Song title in Amharic at top
      - Decorative Ethiopian cross motif (CSS/SVG)
      - Amharic lyrics in proper font (embedded Noto Sans Ethiopic subset)
      - English translation below (if exists)
      - Footer: "የኢትዮጵያ ኦርቶዶክስ ተዋህዶ ቤተክርስቲያን" (Ethiopian Orthodox Tewahedo Church)
  - Wire up PDF download button on song detail page (from Task 10)
  - Create `src/app/api/export/[slug]/route.ts` — server-side export endpoint (optional, generates structured data for client)
  - **Vercel deployment config**:
    - Create `vercel.json` with appropriate config
    - Update `next.config.ts` for Vercel output
    - Add `MONGODB_URI` environment variable documentation
    - Add build settings for MongoDB connection (ensure build doesn't fail without DB)

  **Must NOT do**:
  - NO server-side PDF rendering (cold start issues)
  - NO complex PDF layouts
  - NO multi-song PDF collection export
  - NO email-to-PDF delivery

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard Vercel deployment + straightforward PDF generation utility
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 14, 15, 16)
  - **Blocks**: Task 18
  - **Blocked By**: Tasks 3, 4

  **References**:
  - jsPDF docs: `https://raw.githack.com/MrRio/jsPDF/master/docs/`
  - Vercel Next.js config: `https://vercel.com/docs/frameworks/nextjs`
  - html2pdf.js: `https://ekoopmans.github.io/html2pdf.js/`

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] Test: `generatePdf(songData)` returns a non-empty Blob/Buffer
  - [ ] Test: PDF contains song title in first 100 bytes
  - [ ] Test: Vercel build succeeds with `vercel build`

  **QA Scenarios**:

  ```
  Scenario: Download song as PDF
    Tool: Playwright
    Preconditions: On a song detail page
    Steps:
      1. Click "Download PDF" button
      2. Wait for download to complete
      3. Verify PDF file is downloaded (check download path)
      4. Check PDF is non-empty (> 1KB)
    Expected Result: PDF file generated and downloaded
    Evidence: .omo/evidence/task-17-pdf-download.pdf

  Scenario: Vercel build succeeds
    Tool: Bash
    Preconditions: All code committed, vercel CLI installed
    Steps:
      1. Run `vercel build`
      2. Check exit code 0
      3. Check output for deployment ready indicator
    Expected Result: Build succeeds for Vercel deployment
    Evidence: .omo/evidence/task-17-vercel-build.txt
  ```

  **Evidence to Capture**:
  - [ ] Downloaded PDF file (check exists and non-empty)
  - [ ] Vercel build log

  **Commit**: YES
  - Message: `feat(export): add client-side PDF export and Vercel deployment config`
  - Files: `src/lib/pdf-export.ts`, `src/app/api/export/[slug]/route.ts`, `vercel.json`, `next.config.ts`
  - Pre-commit: `bun test src/lib/pdf-export.test.ts`

---

- [ ] 18. **End-to-End Integration QA + Final Testing**

  **What to do**:
  - Write comprehensive E2E tests covering all critical user flows:
    1. **Guest flow**: Browse categories → View song → Search → No results → Share
    2. **Auth flow**: Register → Login → Logout → Login again (persistent session)
    3. **User flow**: Favorite a song → Create playlist → Add song to playlist → Remove favorite
    4. **Admin flow**: Create category → Create song → Edit song → Moderation → Approve
    5. **Import flow**: Upload PDF → Verify songs created → Check moderation queue
    6. **Export flow**: View song → Download PDF → Verify PDF is valid
    7. **Search flow**: Search by Amharic → Search by English → Empty search → Navigate to result
    8. **Responsive flow**: Test mobile viewport on listing, detail, admin pages
  - Test all error/edge cases:
    - 404 on non-existent song/category
    - 401/403 on protected routes
    - Empty states for favorites, playlists, categories
    - Validation errors on forms (empty required fields)
    - Loading states while data fetches
  - Test Amharic text rendering on actual mobile viewport (playwright emulation)
  - Verify:
    - All QA scenarios from ALL tasks pass
    - Zero console errors in browser
    - All API routes return correct status codes
    - Auth middleware blocks all protected routes
    - Font rendering (Noto Sans Ethiopic) is correct

  **Must NOT do**:
  - NO performance/stress testing
  - NO accessibility audit (future phase)
  - NO security penetration testing

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Comprehensive E2E testing with Playwright covering all user flows
  - **Skills**: None needed

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on all features being implemented)
  - **Blocks**: F1-F4 (final verification)
  - **Blocked By**: Tasks 5-17

  **References**:
  - Playwright docs: `https://playwright.dev/docs/writing-tests`

  **Acceptance Criteria**:

  **If TDD (tests enabled):**
  - [ ] E2E test: Guest flow passes all 5 steps
  - [ ] E2E test: Auth flow passes all 4 steps
  - [ ] E2E test: User flow passes all 5 steps
  - [ ] E2E test: Admin flow passes all 6 steps
  - [ ] E2E test: Search flow passes all 5 steps
  - [ ] All 8 E2E flows pass in headless Playwright run
  - [ ] Zero console errors across all pages

  **QA Scenarios**:

  ```
  Scenario: Full guest journey
    Tool: Playwright
    Preconditions: Seeded DB with test songs
    Steps:
      1. Navigate to `/` — verify categories visible
      2. Click first category — verify filtered songs
      3. Click first song — verify detail page renders
      4. Click Share — verify URL copied
      5. Search for known song — verify results
    Expected Result: Complete guest journey works without errors
    Evidence: .omo/evidence/task-18-guest-journey.txt

  Scenario: Full admin journey
    Tool: Playwright
    Preconditions: Logged in as admin
    Steps:
      1. Create new category — verify in list
      2. Create new song — verify saved
      3. Edit song title — verify updated
      4. Navigate to moderation — approve pending song
      5. Verify song public after approval
    Expected Result: Complete admin workflow works
    Evidence: .omo/evidence/task-18-admin-journey.txt
  ```

  **Evidence to Capture**:
  - [ ] All E2E test results
  - [ ] Console error log (should be empty)
  - [ ] Playwright trace for failed tests

  **Commit**: YES
  - Message: `test(e2e): add comprehensive E2E tests for all user journeys`
  - Files: `e2e/*.spec.ts`, `playwright.config.ts`
  - Pre-commit: `bun run test:e2e`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results and wait for explicit user "okay" before completing.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .omo/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `bun run build` + linter + `bun test`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp). Check Noto Sans Ethiopic font is properly bundled.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Tests [N pass/N fail] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill if UI)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (features working together, not isolation). Test edge cases: empty state, invalid input, Amharic font rendering on mobile viewport. Save to `.omo/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Batch | Message | Scope |
|-------|---------|-------|
| 1 | `feat(init): scaffold Next.js project with Tailwind and dependencies` | Initial scaffold |
| 2 | `feat(db): add Mongoose models for Song, Category, User, Playlist` | models/ + lib/db/ |
| 2 | `feat(ui): add design system, base components, and Noto Sans Ethiopic font` | components/ + styles/ |
| 2 | `feat(i18n): add next-intl with Amharic and English UI strings` | i18n/ + messages/ |
| 3 | `feat(auth): add NextAuth v5 with credentials, Google OAuth, and role-based sessions` | auth/ |
| 3 | `feat(api): add Category and Song CRUD API routes with Zod validation` | api/ |
| 3 | `feat(search): add Fuse.js search utility with Amharic/Ethiopic support` | search/ |
| 3 | `feat(auth): add middleware for role-based route protection` | middleware/ |
| 4 | `feat(ui): add public song listing, category browsing, and landing page` | public pages |
| 4 | `feat(ui): add song detail page with dual-language display and auto-scroll` | song detail |
| 4 | `feat(ui): add favorites and playlists pages with full CRUD` | user features |
| 4 | `feat(ui): add search page with real-time Fuse.js filtering` | search UI |
| 4 | `feat(seo): add share functionality, OG meta tags, sitemap, and JSON-LD` | SEO |
| 5 | `feat(admin): add song and category CRUD admin dashboard` | admin songs |
| 5 | `feat(admin): add user management with role promotion/demotion` | admin users |
| 5 | `feat(admin): add PDF import tool and moderation queue` | admin import |
| 5 | `feat(export): add client-side PDF export and Vercel deployment config` | export/ |
| 6 | `test(e2e): add comprehensive E2E tests for all user journeys` | e2e/ |

---

## Success Criteria

### Verification Commands
```bash
bun run build              # Expected: Build succeeds with zero errors
bun test                   # Expected: All unit/integration tests pass
bun run test:e2e           # Expected: All E2E flows pass
vercel build               # Expected: Build ready for deployment
```

### Final Checklist
- [ ] All "Must Have" features implemented and verified
- [ ] All "Must NOT Have" guardrails respected (no out-of-scope code)
- [ ] All acceptance criteria for all 18 tasks pass
- [ ] All QA scenarios documented and evidence captured in `.omo/evidence/`
- [ ] All F1-F4 agents return APPROVE/GO
- [ ] User explicitly confirms "okay" after final review
- [ ] App deployed to Vercel and accessible at public URL


