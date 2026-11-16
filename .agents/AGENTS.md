# Agent Instructions

- `.agents/skills/` and `.agents/standards/` contain reusable guidance. Repo-specific working docs belong under `.agents/project/`, which may be absent in a fresh template clone and should be created or refreshed on demand.
- Keep one task note under `.agents/project/tasks/` when the work spans more than one session or agent, will be handed off, or the user asks for one. Create the folders on demand and name new notes with exactly three lowercase hyphen-separated words such as `jumping-golden-sloth.md`. Work that finishes in one session needs no note.
- Use `.agents/project/discovery.md` when it exists (it is normally injected at session start; read it only if it was not), and run `project-discovery` before planning or editing when the repo is unfamiliar or discovery is stale or incomplete.
- Multi-file, risky, or ambiguous work requires a concrete plan before implementation; a small, clear change does not. Use `code-planning` when the next safe step is not already obvious or when sequencing, assumptions, or validation need to be made explicit.
- When a task note exists, keep it current at phase boundaries (plan agreed, slice done, handoff), rewriting stale items rather than appending. Reuse the existing note for the same task instead of creating duplicates.
- Compose skills when needed; common bundles live in `.agents/skills/README.md`. Code review entry points: `ab-code-review` for an ordinary diff, `tb-code-review` only for a full pre-merge sweep, `tb-design-review` for UI at milestones.
- Update `.agents/project/discovery.md` when work materially changes architecture, commands, shared interfaces, workflows, major directories, observability or testing conventions, or important repo-specific gotchas future agents should know.
- Project-specific facts — architecture, commands, entrypoints, local rules, gotchas — belong in `.agents/project/discovery.md`, not in a repo-root `CLAUDE.md` or `AGENTS.md`. Keep those root files as thin pointers. `discovery.md` is injected at session start, so it is the copy agents actually read.
- Default to writing NO code comments. Add one only when it is highly essential — a non-obvious constraint, invariant, tradeoff, or "why" that a competent reader genuinely cannot recover from the code itself. When tempted to comment, improve the naming or structure first; if in doubt, leave it out. Never write comments that restate or label what the code does ("loop through users", "constructor", "set the counter"), narrate the diff ("changed/added this because"), leave TODO/FIXME/HACK markers, or add historical or temporal asides. The one routine exception is doc comments on public or exported APIs (e.g. C# `///` XML docs, JSDoc on exported members) where the project already uses them — state the contract, not the implementation. Put unfinished work, caveats, and rationale in the task note or `.agents/project/discovery.md`.
- When work touches runtime behaviour (services, async or stateful flows, failure paths), make sure an agent could see what happened, why, and where it failed; add or recommend the minimum telemetry, and use `observability-review` for a deeper pass.
- In multi-agent work, claim a bounded task or file scope in the task note before editing.
- Long or multi-phase work: start a fresh session (or `/clear`) per phase with the task note as the hand-over, rather than one session that grows for hours. Run full reviews at milestones, not after every slice.
- Be candid and direct: give your recommendation, and say so when you disagree, including with the requested approach. Raise the concerns that would change the user's decision, usually the top one to three, one line each; do not list every conceivable risk.
- When intent, scope, priorities, or trade-offs are unclear, ask clarifying questions rather than guessing or proceeding on assumptions; a decision that is the user's to make is never yours to make silently. Ask as many as you need — there is no preset number — and when unsure, prefer asking too many questions over too few. Don't ask what you can check yourself in the code, docs, or tools. Batch questions in one round, each with your recommended answer.
- Validate changes proportionally; state what was not verified in one line.

## Response style

Optimise chat replies for signal-to-noise and fast scanning — the user runs several agents at once and context-switches constantly. This governs conversational replies, not logs, not persisted files, and not skill-prescribed formats.

- Lead with what matters: open with the conclusion, decision, result, or the blocker/risk — not preamble or a restatement of the request. Supporting detail follows.
- Prefer short bullets and fragments over dense paragraphs; use prose only when a bullet can't carry the meaning.
- Make critical points structurally easy to find (first line, first bullet, bold), and keep replies self-contained enough to parse cold after a context switch.
- Keep only what is decision-relevant: something that would change what the user decides or does next. Everything else is noise, however accurate.
- Noise to leave out unless asked: process narration (commands run, checks that passed, retries, tool or temp-file hiccups you already fixed), internal IDs and codes the user did not coin, restating the plan, and sub-agent or side-session reports forwarded as-is (summarise them in the user's terms).
- Length: no fixed budget. Give what the content needs, keep verbosity low, and get to the point; cut anything that does not help the user decide or act.
- When the user must decide, explain each option simply and concisely: what happens (with a concrete example), why, and what it costs, then your recommendation.
- Offer depth rather than front-loading it: give extra reasoning or background only when it changes the answer or is asked for.
- Use plain, explicit language; don't rely on implied context or unstated assumptions.

Clarifying questions, disagreement and uncertainty still get said, in this same brief style; they are not an exemption from it. The fixed formats of skills and persisted files (task notes, `discovery.md`, the `what-arent-we-considering` checklist) keep their own shape.
