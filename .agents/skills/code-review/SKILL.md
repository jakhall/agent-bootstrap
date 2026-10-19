---
name: code-review
description: "Review code or a diff for correctness, regression risk, delivery against its originating issue or spec, documented repo standards, missing validation, and operability gaps. Use when: The user asks for a review of code, a diff, or a proposed change.; You need a structured pass over risk before merge or handoff."
---

# Code Review

Read as needed:
- `../../project/discovery.md`
- `../../standards/coding.md`
- `../../standards/testing.md`
- `../../standards/observability.md`

## Instructions

1. Pin what is under review: the diff against a fixed point (branch, commit, merge-base) or the files the user named. Confirm the ref resolves and the diff is non-empty before reviewing.
2. Find the originating spec: issue references in commit messages or the PR body, the task note, `.agents/project/specs/`, or a path the user gave. When none exists, say so and skip the spec checks.
3. Find the repo's documented standards: `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`, `CODING_STANDARDS.md`, agent or lint docs, and the local rules in `.agents/project/discovery.md`. Leave whatever tooling already enforces to the tooling.
4. Prioritize findings over summary.
5. Look first for behavioral regressions, broken assumptions, contract or data issues, missing tests, observability blind spots, and stale shared project memory. Then check:
   - the spec: requirements missing, partial, or implemented wrong, and behaviour nobody asked for, quoting the spec line;
   - the standards: each breach, citing the file and the rule.
6. Make findings concrete: the issue, why it matters, where it appears, and the input or situation that produces the wrong result. A finding without a concrete case is an open question, not a finding. Re-read the lines to confirm the caller exists, the value can really be empty, or the code really is unused.
7. Treat a missing or stale `.agents/project/discovery.md` update as a finding when a significant change should have refreshed future-agent context.
8. Treat redundant, over-explanatory, or narrative comments as a finding, and flag development notes left in code that belong in the task note or `.agents/project/discovery.md`.
9. Separate confirmed issues from open questions or assumptions.
10. If no material findings are present, say so briefly and note any remaining test or observability risk.

---
Spec and standards checks adapted from mattpocock/skills `code-review` (MIT, `49dd158`). See `.agents/NOTICE.md`.
