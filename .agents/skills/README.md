# Skills Catalog

Read `.agents/project/discovery.md` before substantive work when it exists, then use the smallest matching set of skills for the task. Task tracking, planning, and observability are mandatory baselines from `.agents/AGENTS.md`; the skills below provide the deeper workflow when those concerns need explicit handling.

- `project-discovery`: trigger on unfamiliar repos, autonomous first-pass runs, or stale/incomplete discovery context; create `.agents/project/` on demand, inspect README, manifests, config, CI, docs, and scoped instructions, refresh `.agents/project/discovery.md`, then return a short summary from the updated project memory.
- `code-planning`: the default planning workflow for non-trivial work when the plan is not already concrete; use it to make sequencing, assumptions, and validation explicit before execution.
- `contracts-and-migrations`: trigger when a change affects compatibility boundaries such as APIs, schemas, config, env vars, CLI behavior, event shapes, or file formats.
- `task-tracking`: trigger for every non-trivial task. Create `.agents/project/tasks/` on demand, record task state there, and keep exactly one task note per task.
- `what-arent-we-considering`: trigger on the exact user phrase "what aren't we considering?" or equivalent gap-analysis requests; this skill is human-triggered and intentionally waits for user selection.
- `bug-investigation`: trigger for bugs, flaky behavior, unexplained failures, or root-cause debugging.
- `code-review`: trigger when reviewing code, a diff, or a proposed change for regressions, missing validation, or operability issues.
- `observability-review`: a deeper observability pass for unclear, stateful, asynchronous, or cross-boundary flows. Baseline observability still applies even when this skill is not loaded. Create or update `.agents/project/observability.md` when repo-specific usage guidance is needed.
- `test-strategy`: trigger when deciding what to test, how to validate a risky change, or which test layer should carry the proof.

## Common Bundles

- Feature work: `task-tracking` + `code-planning` + `test-strategy`, plus `observability-review` when the flow is stateful or cross-boundary.
- Bug fix: `task-tracking` + `bug-investigation` + `test-strategy`, plus `observability-review` when current signals are weak.
- Code review: `task-tracking` + `code-review`, plus `observability-review` when diagnosability or operability matters.
- Unfamiliar repo: `task-tracking` + `project-discovery` first, then the task-specific set.
- Contract or migration change: `task-tracking` + `code-planning` + `contracts-and-migrations` + `test-strategy`, plus `observability-review` when rollout or compatibility visibility matters.
