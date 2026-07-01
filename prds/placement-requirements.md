# Requirements: Placement Test (Frontend)

Derived from [placement.md](./placement.md). Scoped to the Learnup-UI app. Scoring
and content authoring live on the backend; this document covers the client flow that
consumes the Placement APIs and renders the test.

## 1. Scope

- Fetch a fixed placement test, present it one question at a time, submit the learner's
  answers, and display the resulting CEFR level.
- No client-side scoring. The backend owns the placement rule (highest band with ≥3/4
  correct, all lower bands passed, default A1). The client only collects and submits
  `{ questionId, selectedOptionId }` pairs and renders `placedLevel`.
- UI chrome text is Persian (RTL); question `prompt` and `options` are English (LTR).

## 2. API Contract

Uses `PlacementService` (`src/api/Learnup/services/PlacementService.ts`):

| Call | Endpoint | Returns |
| --- | --- | --- |
| `getPlacementTest()` | `GET /Mobile/Placement` | `PlacementTestResponse` |
| `submitPlacementTest(body)` | `POST /Mobile/Placement/submit` | `any` |
| `getPlacementResult()` | `GET /Mobile/Placement/result` | `PlacementResultResponse` |

Relevant shapes:

- `PlacementTestResponse`: `{ id, title, description, instructions, questions[] }`
- `PlacementQuestionResponse`: `{ id, number, level, skill: PlacementSkill, prompt, options[] }`
- `PlacementOptionResponse`: `{ id, text }`
- `PlacementSkill`: enum `GRAMMAR = 1`, `VOCABULARY = 2`
- `SubmitPlacementRequest`: `{ answers: PlacementAnswerDto[] }`
- `PlacementAnswerDto`: `{ questionId, selectedOptionId }`
- `PlacementResultResponse`: `{ placedLevel, correctByBand: Record<string, number>, startingCourseId: number | null, answers: PlacementAnswerReviewResponse[] }`
- `PlacementAnswerReviewResponse`: `{ questionId, selectedOptionId: number | null, isCorrect }`

## 3. Routing

Add under the `RequireAuth` group in [src/App.tsx](../src/App.tsx):

- `/placement` → `PlacementPage` (instructions → test → result, single page owning flow state).

Feature folder: `src/features/placement/` (mirroring existing features), containing
`PlacementPage.tsx`, `components/`, and any `hooks/`.

## 4. Screens & States

The page is a small state machine: `intro → in-progress → submitting → result`.

### 4.1 Loading / Error
- While `getPlacementTest()` is pending, render `<AppLoader />`.
- On error, render `<ErrorPage onAction={refetch} />`.
- Follow the `useLesson`/react-query pattern already used in `LessonGrammarTestsPage`.

### 4.2 Intro
- Show `title`, `description`, and `instructions` from `PlacementTestResponse`.
- A single primary "شروع آزمون" (Start) button transitions to `in-progress`.
- If a prior result already exists (see §7), the intro may instead route to `result`.

### 4.3 In-progress (one question at a time)
- Reuse the Swiper pattern from `LessonGrammarTestsPage`: `slidesPerView={1}`,
  `allowTouchMove={false}`, advance programmatically.
- Each slide renders one `PlacementQuestionResponse`:
  - English `prompt` rendered LTR.
  - 4 single-select options (`options[].text`), keyed by `options[].id`.
  - Selecting an option records the answer in local state and auto-advances after a
    short delay (match the ~500ms pattern in the grammar test), except on the last item.
- No correctness feedback is shown during the test (unlike lesson tests — the backend
  scores; the client must not reveal answers).
- Progress indicator: `LinearProgress` + "سوال {n} از {total}" counter, RTL footer,
  consistent with the grammar test page. Use `question.number` for display ordering.
- "بعدی" (Next) button enabled only once the current question is answered; disabled on
  the last slide. On the last answered question show a "پایان / ثبت" (Submit) action.

### 4.4 Submitting
- On submit, build `SubmitPlacementRequest` from collected answers and call
  `submitPlacementTest`. Show a pending state (disabled button / loader).
- On success, fetch/refresh the result and transition to `result`.
- On failure, surface a toast (`src/shared/toast`) and keep answers so the user can retry.

### 4.5 Result
- Fetch via `getPlacementResult()` (or use submit response if it returns the result).
- Prominently display `placedLevel` (e.g. "سطح شما: B1").
- Optionally show a per-band breakdown from `correctByBand`.
- Primary CTA depends on `startingCourseId`:
  - If non-null → "شروع یادگیری" navigating to `/courses/{startingCourseId}`.
  - If null → fall back to the courses list (`/`), no dead-end.

## 5. Answer Collection

- Maintain `Record<questionId, selectedOptionId>` in local component state.
- The test is complete when every `question.id` has a recorded `selectedOptionId`.
- Build `answers` as `Object.entries(...)` → `PlacementAnswerDto[]` on submit.
- Per PRD "no going back required": back-navigation is optional; if not implemented, a
  question, once answered, stays answered and the flow only moves forward.

## 6. Validation & Edge Cases

- **Empty/short test:** if `questions.length === 0`, render an error/empty state rather
  than an empty Swiper.
- **Unanswered on submit:** guard so submit only fires when all questions are answered
  (the auto-advance flow guarantees this by the last slide).
- **Duplicate submit:** disable the submit action while the mutation is pending.
- **Option/question ids:** always submit backend `id`s, never array indices or `number`.
- **Skill enum:** `PlacementSkill` is numeric (`1`/`2`); if a skill badge is shown, map
  to Persian labels ("گرامر" / "واژگان"). It does not affect scoring or submission.

## 7. Retake / Existing Result

- On entering `/placement`, decide intro-vs-result based on whether a result exists.
  `getPlacementResult()` returning a valid `placedLevel` ⇒ show result directly with a
  "شرکت مجدد" (Retake) option; otherwise show intro. (Confirm with backend whether a
  404/empty is returned when the learner has not taken the test — handle both.)
- Retake resets local answer state and returns to `intro`/`in-progress`.

## 8. UX & Styling

- RTL layout for all Persian chrome; question content in LTR.
- Reuse shared components: `DefaultHeader`, `AppLoader`, `ErrorPage`, `FancyButton`/
  `ActionButton`, toast host — for visual consistency with existing test flows.
- Header: `<DefaultHeader header='آزمون تعیین سطح' />`.

## 9. Acceptance Criteria

- Visiting `/placement` (authenticated) loads the test, shows instructions, and starts on
  demand.
- Questions appear one at a time, single-select, English prompt LTR, Persian chrome RTL,
  with a working progress indicator; no correctness feedback is shown mid-test.
- All questions must be answered before submission is possible; submit is idempotent
  (no double-post) and sends backend `questionId`/`selectedOptionId` values.
- On success the result screen shows `placedLevel` and routes the learner to
  `startingCourseId` when present (or a sensible fallback when null).
- Loading and error states use `AppLoader` and `ErrorPage`; network failures on submit are
  recoverable (toast + retry, answers preserved).
- A learner with an existing result sees it on entry and can retake.

## 10. Out of Scope (v1)

- Client-side scoring or CEFR computation.
- Adaptive/branching question selection, back-navigation requirements.
- Listening/reading item types, writing/speaking assessment.
- Persisting partial progress across sessions (unless backend supports resume).
