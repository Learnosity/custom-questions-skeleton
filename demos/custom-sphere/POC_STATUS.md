# Sphere Engine × Learnosity Custom Question — POC Status

_Last updated: after fixing the review-summary/validation-UI pending-state edge case._

## What this POC does

A Learnosity Custom Question that embeds a Sphere Engine **Problems Widget**
for coding assessments. The widget renders the code editor and Run/Submit UI;
Learnosity's Questions API records the response; a server-side scorer looks
up the verdict from Sphere Engine's Problems API and reports a score back to
Learnosity.

## Architecture (current)

```
Learnosity Questions API
 └─ question.js (browser)
     - embeds Sphere Engine widget via their JS SDK
     - listens to widget events (afterSendSubmission, checkStatus)
     - saves { apiId, source, language, lastKnownStatus } as the Learnosity response
     - renders lrn_correct / lrn_incorrect on Check Answer, using lastKnownStatus
 └─ scorer.js (server-side, run by Learnosity)
     - takes the saved response's apiId
     - calls our backend proxy to fetch the Sphere Engine verdict
     - returns score / isValid / maxScore to Learnosity

Backend proxy (separate from the skeleton repo)
 - GET /sphere/submissions/:id → proxies to Sphere Engine Problems API
 - Holds the Sphere Engine API access_token (server-side only)
```

Sphere Engine account:
- customer id: `45d18eb8`

Test Problems & Widgets (widgetHash values for use in the question JSON /
Question Editor's "Sphere Engine Problem ID (Widget Hash)" field):

| Problem | Widget unique hash (`widgetHash`) | Notes |
|---|---|---|
| Hello World | `vMRKT3ygdE` | "Hello, World!" to stdout, 1 test case, "Ignoring extra white spaces" judge |
| SQL | `0VAfRT0VhG` | For testing a second language/problem type beyond JS |

## Key design decisions & why

| Decision | Rationale |
|---|---|
| Sphere Engine **Problems** module, not Compilers | Test cases + judging live in Sphere Engine; scorer.js just maps their result instead of writing a judge |
| Sphere Engine **Widget**, not a hand-built editor | Widget owns editor UI + Run/Submit; question.js only needs to embed it and capture the resulting `apiId` — far less code |
| Backend proxy required | Sphere Engine API `access_token` must never reach the browser or a Learnosity-hosted file (scorer.js is "accessible externally" per Learnosity docs — not a secrets-safe location) |
| API token **hardcoded** in `sphere-proxy.js` | Explicit POC shortcut, accepted risk — must move to env var / secrets store, and be rotated, before this goes beyond a POC |
| Widget's `data-user-id` defaults to `response_id` | Prevents the widget's own session persistence (separate from Learnosity's response) from bleeding code across different Learnosity attempts |
| `response_id`-based `data-user-id` scoping | Confirmed against Learnosity's own session lifecycle docs: resume reuses the same `session_id` (hence same `response_id`), so this correctly gives both per-learner isolation and resume continuity with no extra code |
| `customerId` in Question JSON, set via `question_type_templates.defaults` per tenant — not authored per question | Fixed per Sphere Engine account (i.e. per Learnosity customer), so it must vary between deployments if multiple customers use this integration, while staying invisible to individual authors |

## Bugs found & fixed so far

1. **`customerId`/`widgetHash` nested under a `"question"` key in the JSON** —
   wrong. `init.question` in `question.js` IS the whole top-level Question
   JSON object, not a sub-object. Fixed: these now sit at the top level of
   the question JSON, alongside `type`/`js`/`css`.
2. **Widget session persisted across page refreshes regardless of Learnosity
   response** — caused by `data-user-id` (or the cookie fallback) scoping to
   a stable learner id instead of the response. Fixed: defaults to
   `this.init.response_id` unless a real cross-device use case is wanted.
3. **`showValidationUI()` could mark a still-grading submission as
   "incorrect"** — fixed by treating non-terminal Sphere Engine statuses
   (`waiting`, `compiling`, `executing`, `received`) as neutral rather than
   incorrect.
3b. **Resume incorrectly auto-showed validation UI.** Briefly added an
   explicit `showValidationUI()` call for `resume` state (mirroring the
   `review`-state fix), but confirmed via testing this is wrong — only
   `review` should auto-display feedback. Resume should restore the
   response/editor content silently; feedback only reappears if the learner
   presses Check Answer again. Reverted.
4. **Homebrew broke on macOS 26** (unrelated to the integration itself, local
   dev environment issue) — resolved via clean reinstall.
5. **PHP not found locally** — macOS no longer bundles PHP; installed via
   `brew install php`.
6. **`this.init.response_id` was always `undefined`** — `response_id` is
   part of the Question JSON (`init.question.response_id`, i.e.
   `this.meta.response_id`), not a direct property of `init`. This silently
   broke the `data-user-id` fix in bug #2 above: `userId` was always
   falsy, so `data-user-id` was never actually set, and the widget kept
   falling back to cookie-based sessions despite unique `response_id`s
   existing. Fixed by reading from `this.meta.response_id` everywhere.

## Known compromises / active shortcuts

- **Proxy skipped entirely for now.** `scorer.js` currently trusts
  `response.lastKnownStatus` (client-reported) instead of independently
  verifying against Sphere Engine's Problems API via the backend proxy.
  This is NOT secure — a student could tamper with the saved response
  client-side to fake a correct score. Fine for proving the integration
  works end-to-end; **must be reverted to the proxy-based server-side
  verification before this is used for anything actually graded.**
  (Proxy-based version still available: `backend-proxy-example/sphere-proxy.js`
  + `sphere-proxy-server/`.)

## Open items / unverified assumptions — check before calling this POC "done"

- [x] ~~Async `Scorer` methods unverified~~ — moot for now: the simplified
      synchronous scorer (see "Known compromises" above) doesn't call out to
      Sphere Engine at all, so there's nothing async to verify. Re-open this
      once the proxy-based scorer is reinstated.
- [ ] **`PENDING_STATUSES` string list is a guess**, not confirmed against
      Sphere Engine's actual `data.status.description` values seen live —
      verify during a real test run and adjust if the exact wording differs.
- [ ] **API token still hardcoded** in `sphere-proxy.js` — fine for POC in a
      private repo, but flag clearly to whoever picks this up next; rotate
      the token before wider use.
- [ ] **`scorer.js`'s `PROXY_BASE_URL` is still a placeholder** — needs to
      point at wherever the proxy actually gets deployed.
- [ ] **Widget security/signing not implemented** — `data-signature` support
      exists in `question.js` (reads from `custom_widget_options`) but no
      signing flow has been built or tested. Relevant before any non-POC use,
      per Sphere Engine's widget security docs.
- [ ] **`maxScore` propagation into `Scorer`** — confirm the local skeleton
      actually passes the full question JSON (with `validation.maxScore`)
      into the `Scorer` constructor's `question` argument as assumed.
- [ ] **Review-state UI** just dumps submitted source in a `<pre>` block —
      fine for a POC, likely wants real styling/parity with other question
      types before a colleague evaluates it.
- [ ] **Only "Hello World" tested end-to-end.** Worth testing a problem with
      multiple test cases and a partial-credit score to confirm the
      score-normalization logic in `scorer.js` behaves as expected.

- [ ] **No "attempted" state before Run/Submit.** Sphere Engine's widget SDK
      doesn't expose a live editor-change event or a way to read current
      source on demand — only submission-lifecycle events. So the Learnosity
      response only appears after the learner actually presses Run/Submit in
      the widget, not as soon as they start typing. Added to
      `SPHERE_ENGINE_VENDOR_QUESTIONS.md` to ask Sphere Engine directly;
      otherwise this may just be the correct model to accept (see chat).

- [ ] **Autoscoring runs on every autosave, not just final submit** (per
      Learnosity's session lifecycle docs), and `Scorer` is freshly
      constructed each time — so if/when the proxy-based scorer (with a
      real network call to Sphere Engine) is reinstated, it will re-fetch
      on every autosave rather than caching across calls. Read Learnosity's
      "Asynchronous Scoring - Best Practices" article before rebuilding
      that version, and consider whether the result needs caching somewhere
      outside the `Scorer` instance (e.g. keyed by `apiId` in the proxy
      itself) to avoid redundant Sphere Engine API calls.

- [ ] **Authoring defaults via `question_type_templates` unverified.**
      `valid_response`/`instant_feedback` are set via the tile's `defaults`
      rather than `editor_schema` (so authors can't see/edit fixed technical
      fields) — this follows Learnosity's own documented pattern, but hasn't
      been tested end-to-end yet. Create one question from the
      "Sphere Coding Question" tile and confirm both fields actually appear
      in the resulting Question JSON.

- [x] ~~`response_id` may not be a safe long-term session scope~~ —
      corrected: Learnosity's `response_id` is `{session_id}_{response_uniquid}`,
      genuinely unique per learner/session/question, so scoping the widget's
      `data-user-id` by it is correct (and gives resume continuity for free,
      assuming resume reuses the same response_id — worth a quick confirm
      but expected given the naming scheme).

## Files (current, in `sphere-custom-question/`)

- `src/question/index.js` — front-end Question class
- `src/scorer/index.js` — server-side Scorer class
- `src/_question.scss` — styles (uses shared `$prefix`)
- `example-question.json` — reference for `assessment.php`'s question JSON
- `backend-proxy-example/sphere-proxy.js` — reference proxy (`GET /sphere/submissions/:id`)
- `hello-world-problem/` — the test Problem's description, test case, and reference solutions in 4 languages
- `authoring/init_options.json` — single JSON with `question_type_templates` + `custom_question_types` (schema inline), matching the skeleton's own init_options format
- `authoring/authoring_custom_layout.html` — Question Editor HTML layout referenced by `init_options.json`

## Next steps (suggested order)

1. Run `yarn debug-server-scorer` to settle the async-Scorer-methods question.
2. Deploy the proxy somewhere real (even a quick serverless function) and
   point `scorer.js` at it.
3. Full end-to-end test: submit in the widget → confirm Learnosity scores it
   correctly via `getScores()`.
4. Test a non-trivial problem (multiple test cases, partial credit) to
   validate scoring math.
5. Write up the authoring layout (`authoring_custom_layout.html`) if this
   needs to be author-configurable rather than hardcoded per question.
6. Decide on token storage before sharing beyond this POC.
