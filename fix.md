# SOMA — System Audit & Fix Implementation Plan
**Status:** Pre-Beta Audit (Post-Extraction)
**Protocol:** Opus-Reasoning Framework v1.0

---

## 1. Executive Summary: The "Ghost App" Audit
The current codebase is a high-fidelity **UI Shell** with no **Functional Engine**. While the design and routing are excellent, the core value proposition (AI generation and curriculum-aligned exports) is currently mocked or missing. 

To hit the $100k target in 90 days, we must shift from "building infrastructure" to "deploying a vertical slice" that works end-to-end.

---

## 2. [CRITICAL] Security & Architecture Fixes

### [CRITICAL][SECURITY] — Client-Side API Key Exposure Risk
*   **Location:** `package.json`, `@google/genai` dependency.
*   **Issue:** The app is configured to handle AI generation on the frontend.
*   **Impact:** Any user can extract your `GEMINI_API_KEY` from the browser source, leading to potentially thousands of dollars in billable usage or API exhaustion.
*   **Fix:** Move all Gemini logic to **Vercel Serverless Functions** in a new `/api` directory. Use the frontend only for UI and streaming state.

### [HIGH][RELIABILITY] — "Mock" Data Persistence
*   **Location:** `hooks/useDocuments.ts`, `hooks/useAuth.ts`.
*   **Issue:** The app currently uses `localStorage`. 
*   **Impact:** Data is stored only on the user's current device/browser. Teachers will lose their work if they clear cache or switch from phone to laptop.
*   **Fix:** Wire `useDocuments` and `useAuth` to the **Supabase Client**. Implement Row-Level Security (RLS) as defined in `SOMA_ARCHITECTURE.md`.

---

## 3. The "Engine" Development (Vertical Slice)

### [HIGH][LOGIC] — Missing "Brain" (Prompt Engineering)
*   **Status:** Not implemented.
*   **Task:** Create a Master System Prompt for "Soma AI" that encodes:
    *   Uganda National Curriculum Development Centre (NCDC) standards.
    *   UNEB command words (State, Explain, Describe, etc.).
    *   Ugandan classroom constraints (low-resource environments).
*   **Fix:** Build `lib/prompts.ts` to store these grounded instructions.

### [MEDIUM][PERFORMANCE] — Simulated Streaming
*   **Location:** `pages/generate/GeneratePage.tsx`.
*   **Issue:** The `handleGenerate` function uses a `setTimeout` loop with mock text.
*   **Fix:** Implement real **Server-Sent Events (SSE)** or readable stream consumption from the Vercel `/api` routes.

---

## 4. Feature Implementation Gaps

### [HIGH][MAINTAINABILITY] — Export Placeholder Logic
*   **Location:** `lib/pdf.ts`, `lib/word.ts`.
*   **Issue:** Files are empty or contain 2-line placeholders.
*   **Fix:** 
    *   **PDF:** Implement `jsPDF` with a reusable `renderUgandaHeader()` function.
    *   **Word:** Use `html-docx-js` to allow teachers to download editable `.docx` files.

### [LOW][UX] — Curriculum Data Completeness
*   **Location:** `lib/curriculum.ts`.
*   **Issue:** Only 15 districts and basic subject lists.
*   **Fix:** Populate full 146-district list and map subjects to specific levels (O-Level vs A-Level) to prevent user error.

---

## 5. Phase-Gated "Tracer Bullet" Plan

### Phase 1: The Secure Engine (Days 1-2)
*   [ ] Initialize `/api/generate/lesson.ts`.
*   [ ] Securely store `GEMINI_API_KEY` in Vercel Env Vars.
*   [ ] Implement the **Master Lesson Plan Prompt**.
*   [ ] Connect `LessonPage.tsx` to the real AI.
*   **Success:** A teacher can generate a *real* S3 Biology plan.

### Phase 2: Persistence & Auth (Days 3-4)
*   [ ] Replace `localStorage` with `Supabase` calls in `useDocuments`.
*   [ ] Connect `Auth.tsx` to `supabase.auth.signInWithPassword`.
*   [ ] Verify RLS: User A cannot see User B's lesson plans.
*   **Success:** Documents survive a browser refresh and device switch.

### Phase 3: The Full Suite (Days 5-7)
*   [ ] Roll out Questions, Schemes, and Exam generators.
*   [ ] Implement `lib/pdf.ts` with UNEB-style headers.
*   [ ] Implement `.docx` download for all documents.
*   **Success:** The product is "Feature Complete" for Beta testing.

---

## 6. Confidence Scoring & Risks
*   **Confidence in Stack (5/5):** Vercel + Supabase + Gemini is the fastest route to $100k.
*   **Risk (High):** API Rate Limits. Gemini 2.0 Flash free tier is generous (1,500/day) but will hit a wall at scale.
*   **Mitigation:** Implement **Upstash Redis** for caching common generations or move to a paid tier after the first 100 users.
