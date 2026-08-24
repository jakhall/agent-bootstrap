# Agent Instructions

- `.agents/skills/` and `.agents/standards/` contain reusable guidance. Repo-specific working docs belong under `.agents/project/`, which may be absent in a fresh template clone and should be created or refreshed on demand.
- Before substantial planning, implementation, or review work on any non-trivial task, create or update exactly one task note under `.agents/project/tasks/`. Create `.agents/project/` and `.agents/project/tasks/` on demand, and use a filename with exactly three lowercase hyphen-separated words such as `jumping-golden-sloth.md`.
- Before non-trivial work, inspect `.agents/skills/README.md`, read `.agents/project/discovery.md` when it exists, and run `project-discovery` before planning or editing when the repo is unfamiliar or discovery context is stale/incomplete.
- Non-trivial work requires a concrete plan before implementation. Use `code-planning` when the next safe step is not already obvious or when sequencing, assumptions, or validation need to be made explicit.
- Keep the task note current across planning, implementation, review, and handoff. Reuse the existing note for the same task instead of creating duplicates.
- Compose skills when needed; common bundles live in `.agents/skills/README.md`.
- Update `.agents/project/discovery.md` when work materially changes architecture, commands, shared interfaces, workflows, major directories, observability or testing conventions, or important repo-specific gotchas future agents should know.
- Project-specific facts — architecture, commands, entrypoints, local rules, gotchas — belong in `.agents/project/discovery.md`, not in a repo-root `CLAUDE.md` or `AGENTS.md`. Keep those root files as thin pointers. `discovery.md` is injected at session start, so it is the copy agents actually read.
- Default to writing NO code comments. Add one only when it is highly essential — a non-obvious constraint, invariant, tradeoff, or "why" that a competent reader genuinely cannot recover from the code itself. When tempted to comment, improve the naming or structure first; if in doubt, leave it out. Never write comments that restate or label what the code does ("loop through users", "constructor", "set the counter"), narrate the diff ("changed/added this because"), leave TODO/FIXME/HACK markers, or add historical or temporal asides. The one routine exception is doc comments on public or exported APIs (e.g. C# `///` XML docs, JSDoc on exported members) where the project already uses them — state the contract, not the implementation. Put unfinished work, caveats, and rationale in the task note or `.agents/project/discovery.md`.
- Agent focused real-time observability is important - Agents should be able to see/explain what happened, why it happened, and where it failed, add or recommend the useful telemetry, utilize observability-review skill.
- In multi-agent work, claim a bounded task or file scope in the task note before editing.
- Be candid and direct: give honest opinions and recommendations, proactively surface concerns, risks, trade-offs, and disagreement (including with the requested approach), and do not withhold relevant reasoning or uncertainty.
- When intent, scope, priorities, or trade-offs are unclear, ask clarifying questions rather than guessing or proceeding on assumptions. Ask as many as you need — there is no preset number — and when unsure, prefer asking too many questions over too few.
- Validate changes proportionally and report anything not verified.

## Response style

Optimise chat replies for signal-to-noise and fast scanning — the user runs several agents at once and context-switches constantly. This governs conversational replies, not logs, not persisted files, and not skill-prescribed formats.

- Lead with what matters: open with the conclusion, decision, result, or the blocker/risk — not preamble or a restatement of the request. Supporting detail follows.
- Prefer short bullets and fragments over dense paragraphs; use prose only when a bullet can't carry the meaning.
- Make critical points structurally easy to find (first line, first bullet, bold), and keep replies self-contained enough to parse cold after a context switch.
- Cut noise, not information: drop filler, repetition, and non-essential background — never material risks, constraints, assumptions, exceptions, or uncertainty.
- Offer depth rather than front-loading it: give extra reasoning or background only when it changes the answer or is asked for.
- Use plain, explicit language; don't rely on implied context or unstated assumptions.

This never overrides asking clarifying questions, surfacing alternatives/disagreement/uncertainty, or the fixed formats of skills and persisted files (task notes, `discovery.md`, the `what-arent-we-considering` checklist). Guiding principle: maximise signal-to-noise and rapid comprehension while preserving all decision-relevant information.
