# Bug Investigation

Description: Diagnose a failure and drive toward a root-cause fix.

Use when:
- A bug, flaky behavior, or unexplained failure needs investigation.
- The user asks why something is broken or how to debug it.

Read as needed:
- `../../project/discovery.md`
- `../../standards/observability.md`
- `../../standards/testing.md`

## Instructions

1. Reproduce the failure or sharpen it into a precise symptom with conditions and expected behavior.
2. Use existing logs, traces, tests, recent changes, and local evidence to narrow the search quickly.
3. Form a small number of hypotheses and test them with evidence.
4. If the relevant path is not observable enough to decide between hypotheses, add or recommend telemetry before guessing.
5. Fix the root cause when feasible. If you ship a mitigation, say what remains.
6. If the investigation uncovers durable failure modes, debugging entrypoints, commands, or repo gotchas future agents should know, update `.agents/project/discovery.md`.
7. Validate the fix with a focused regression test or an equivalent before and after proof.
