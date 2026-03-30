# Code Review

Description: Review code or a diff for correctness, regression risk, missing validation, and operability gaps.

Use when:
- The user asks for a review of code, a diff, or a proposed change.
- You need a structured pass over risk before merge or handoff.

Read as needed:
- `../../project/discovery.md`
- `../../standards/coding.md`
- `../../standards/testing.md`
- `../../standards/observability.md`

## Instructions

1. Prioritize findings over summary.
2. Look first for behavioral regressions, broken assumptions, contract or data issues, missing tests, observability blind spots, and stale shared project memory.
3. Make findings concrete: state the issue, why it matters, and where it appears.
4. Treat a missing or stale `.agents/project/discovery.md` update as a finding when a significant change should have refreshed future-agent context.
5. Separate confirmed issues from open questions or assumptions.
6. If no material findings are present, say so briefly and note any remaining test or observability risk.
