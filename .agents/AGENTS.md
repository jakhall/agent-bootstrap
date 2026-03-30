# Agent Instructions

- `.agents/skills/` and `.agents/standards/` contain reusable guidance. Repo-specific working docs belong under `.agents/project/`, which may be absent in a fresh template clone and should be created or refreshed on demand.
- Before substantial planning, implementation, or review work on any non-trivial task, create or update exactly one task note under `.agents/project/tasks/`. Create `.agents/project/` and `.agents/project/tasks/` on demand, and use a filename with exactly three lowercase hyphen-separated words such as `jumping-golden-sloth.md`.
- Before non-trivial work, inspect `.agents/skills/README.md`, read `.agents/project/discovery.md` when it exists, and run `project-discovery` before planning or editing when the repo is unfamiliar or discovery context is stale/incomplete.
- Non-trivial work requires a concrete plan before implementation. Use `code-planning` when the next safe step is not already obvious or when sequencing, assumptions, or validation need to be made explicit.
- Keep the task note current across planning, implementation, review, and handoff. Reuse the existing note for the same task instead of creating duplicates.
- Compose skills when needed; common bundles live in `.agents/skills/README.md`.
- Consult standards docs as needed when deciding what project-local docs to create or update.
- Update `.agents/project/discovery.md` when work materially changes architecture, commands, shared interfaces, workflows, major directories, observability or testing conventions, or important repo-specific gotchas future agents should know.
- Observability is required during implementation, debugging, and review. If current signals cannot explain what happened, why it happened, and where it failed, add or recommend the minimum useful telemetry before guessing.
- In multi-agent work, claim a bounded task or file scope in the task note before editing.
- Do not overwrite unexpected changes outside your claimed scope; narrow scope, hand off, or stop for human input.
- If assumptions fail, progress stalls, or validation fails, re-plan before continuing.
- Validate changes proportionally and report anything not verified.
