# Agent Instructions

- `.agents/skills/` and `.agents/standards/` contain reusable guidance. Repo-specific working docs belong under `.agents/project/`, which may be absent in a fresh template clone and should be created or refreshed on demand.
- Before substantial planning, implementation, or review work on any non-trivial task, create or update exactly one task note under `.agents/project/tasks/`. Create `.agents/project/` and `.agents/project/tasks/` on demand, and use a filename with exactly three lowercase hyphen-separated words such as `jumping-golden-sloth.md`.
- Before non-trivial work, inspect `.agents/skills/README.md`, read `.agents/project/discovery.md` when it exists, and run `project-discovery` before planning or editing when the repo is unfamiliar or discovery context is stale/incomplete.
- Non-trivial work requires a concrete plan before implementation. Use `code-planning` when the next safe step is not already obvious or when sequencing, assumptions, or validation need to be made explicit.
- Keep the task note current across planning, implementation, review, and handoff. Reuse the existing note for the same task instead of creating duplicates.
- Compose skills when needed; common bundles live in `.agents/skills/README.md`.
- Update `.agents/project/discovery.md` when work materially changes architecture, commands, shared interfaces, workflows, major directories, observability or testing conventions, or important repo-specific gotchas future agents should know.
- Reserve code comments for non-obvious or critical logic: constraints, invariants, tradeoffs, and intent a reader cannot infer from the code itself. Never restate what the code already says, narrate the diff, or leave development notes — no "changed/added this because", no TODO or FIXME markers, no historical or temporal asides. Put unfinished work, caveats, and rationale in the task note or `.agents/project/discovery.md`.
- Agent focused real-time observability is important - Agents should be able to see/explain what happened, why it happened, and where it failed, add or recommend the useful telemetry, utilize observability-review skill.
- In multi-agent work, claim a bounded task or file scope in the task note before editing.
- Be candid and direct: give honest opinions and recommendations, proactively surface concerns, risks, trade-offs, and disagreement (including with the requested approach), and do not withhold relevant reasoning or uncertainty.
- When intent, scope, priorities, or trade-offs are unclear, ask clarifying questions rather than guessing or proceeding on assumptions. Ask as many as you need — there is no preset number — and when unsure, prefer asking too many questions over too few.
- Validate changes proportionally and report anything not verified.
