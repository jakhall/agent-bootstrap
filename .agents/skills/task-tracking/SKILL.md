---
name: task-tracking
description: "Maintain the required per-task note for non-trivial work with explicit ownership, scope, and handoff state. Use when: The task is non-trivial and involves substantial planning, implementation, review, debugging, or coordination across turns or agents.; The task needs a persistent note across turns, agents, or handoffs.; The task needs explicit ownership or file-scope tracking before edits begin.; The user explicitly asks for plan tracking or a task note."
---

# Task Tracking

Do not use when:
- A chat response or short internal plan is enough.
- The task is truly trivial, short-lived, and does not need persistent repo-tracked state.

## Instructions

1. For every non-trivial task, create `.agents/project/tasks/` on demand and create or update exactly one task note at `.agents/project/tasks/<word1>-<word2>-<word3>.md`.
2. Use exactly three lowercase ASCII words separated by single hyphens for new filenames, for example `jumping-golden-sloth.md`.
3. If the task already has a task note, keep using that note as the source of truth even if its filename predates the three-word-slug convention.
4. Do not create a second note for the same task. If a preferred three-word slug is already taken by a different task, choose a different three-word slug instead of appending dates or counters.
5. Claim ownership before substantial planning, implementation, or review work by setting `Owner`, `Scope`, and `Files in Scope`. One task note has one owner at a time.
6. Keep the note concise, current, and action-oriented. Rewrite stale items instead of appending history.
7. Keep transient task state in the task note. Durable project memory, repo-wide workflows, and future-agent context belong in `.agents/project/discovery.md` instead. Use `Notes` for current caveats and development notes that would otherwise have been written as code comments.
8. Use only this schema:

```md
# Title

## Owner

## Status

## Scope

## Files in Scope

## Checklist

## Blockers

## Notes

## Validation

## Handoff
```

9. Only truly trivial tasks may skip the file. Non-trivial tasks should not proceed without one.
10. When work moves to a fresh session, card, subagent, colleague, another repo, or another agent, first pick the move: **continue** when the next phase needs this conversation verbatim and there is room; **/clear** when nothing here matters next; a **subagent** for a tightly scoped task that can run unattended; **/compact** otherwise; a **handoff** only when the work travels. For a handoff, fill the note's `Handoff` section (or, with no task note, a brief in the OS temp directory) so a reader with no context can continue:
    - Goal, state (branch, commits, PRs and issues by link), and decisions with a one-line why, provisional ones marked.
    - References by path or URL; point at specs, plans, ADRs, and diffs instead of copying them.
    - Must-do steps naming every skill the next session must run, as actions it cannot miss: `load the ab-<name> skill`, or for a toolbox skill `Read <toolbox plugin folder>/skills/tb-<name>/SKILL.md and follow it on <target>`.
    - For one well-defined change, an agent brief: current and desired behaviour (edge cases included), key interfaces (types, signatures, contracts; no file paths or line numbers), independently checkable acceptance criteria, and out of scope.
    - Secrets and personal data replaced with `<REDACTED>`.
    When you start the next session or subagent yourself, put the must-do steps in its first prompt, and confirm it ran them.

---
Handoff step adapted from mattpocock/skills `handoff`, `ask-matt/PHASE-BOUNDARIES.md`, and `triage/AGENT-BRIEF.md` (MIT, `49dd158`). See `.agents/NOTICE.md`.
