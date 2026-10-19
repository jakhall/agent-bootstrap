---
name: test-strategy
description: "Choose the smallest effective validation plan for a change, with test seams agreed up front, and run test-first work as a red-green loop. Use when: The user asks what to test or how to validate a change.; The correct validation approach is unclear.; A risky or cross-cutting change needs a deliberate test plan.; The user wants test-first, TDD, red-green-refactor, or integration tests."
---

# Test Strategy

Read first:
- `../../standards/testing.md`
- the repo's own testing docs (for example `agent_docs/testing.md`, `CONTRIBUTING.md`, the test project READMEs), which override this skill where they differ

## Plan the validation

1. Map the change, and the issue or spec it came from, to its main risks. Choose checks that exercise those risks directly.
2. Pick the **seams**: the public interfaces where a test observes behaviour without reaching inside (an endpoint, a handler, a domain method, a CLI command). Prefer seams that already exist, and the highest one that still reaches the risk; keep the number of integration boundaries small. A pure function driven by a rule table is a legitimate seam of its own. Give each proposed seam one line on what it catches and what it misses.
3. Confirm the seams with the user before writing tests; a test at an unconfirmed seam is speculative effort. When the user is away, proceed with the proposed seams marked provisional and list them for confirmation.
4. For bug fixes, include a regression test at a seam that reproduces the real bug pattern, and see it fail on the unfixed code. For feature work, include the main success path and the most important edge conditions.
5. Go broader than the narrowest level only when integrations or boundaries are the actual risk.
6. One-off data scripts (clean-ups, backfills) sit outside the seams: dry-run them on a copy, compare before and after counts, and check parity with the code whose rules they mirror.
7. State what will remain unverified after the proposed checks.

**Done when** every main risk maps to a seam (agreed, or provisional while the user is away) or is listed as unverified.

## Build test-first

Use this loop when the user wants test-first work or the behaviour is concrete enough to specify before coding.

- Work in **vertical slices**: one test, then the minimum code that passes it, then the next test. Each test is a tracer bullet that responds to what the last cycle taught you.
- **Red before green**: watch the new test fail for the expected reason before writing the code that passes it.
- One seam, one test, one minimal implementation per cycle; code only what the current test demands.
- Refactoring belongs to review, after the loop.
- Run the single test file each cycle, build or typecheck regularly, and the full suite once at the end.

## What a good test is

- It verifies behaviour through the public interface and survives an internal refactor. Its name reads like a capability ("user can check out with a valid cart").
- Its expected values come from an independent source of truth: a literal, a worked example, the spec.
- It runs real code for everything the team owns. Mocks sit only at system boundaries: external APIs, time, randomness, and sometimes the database or filesystem (prefer the repo's real test database or container when it has one).

Patterns to flag, in your own tests and in review:
- **Implementation-coupled**: mocks internal collaborators, tests private methods, asserts call counts or order, or verifies through a side channel (querying the database instead of using the interface). Tell: it breaks on a refactor that kept behaviour. Exception: when what gets stored is itself the behaviour (privacy, retention, migrations, data written for other systems), asserting on the stored data is testing the interface.
- **Tautological**: recomputes the expected value the way the code does, so it passes by construction (`assert add(a, b) == a + b`).
- **Horizontal slicing**: all tests first, then all code. It tests imagined shape rather than real behaviour and locks in test structure before the design is understood.

---
Adapted from mattpocock/skills `tdd` (MIT, `49dd158`). See `.agents/NOTICE.md`.
