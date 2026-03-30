# Task Tracking

Description: Maintain the required per-task note for non-trivial work with explicit ownership, scope, and handoff state.

Use when:
- The task is non-trivial and involves substantial planning, implementation, review, debugging, or coordination across turns or agents.
- The task needs a persistent note across turns, agents, or handoffs.
- The task needs explicit ownership or file-scope tracking before edits begin.
- The user explicitly asks for plan tracking or a task note.

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
7. Keep transient task state in the task note. Durable project memory, repo-wide workflows, and future-agent context belong in `.agents/project/discovery.md` instead.
8. Use only this schema:

```md
# Title

## Owner

## Status

## Scope

## Files in Scope

## Checklist

## Blockers

## Validation

## Handoff
```

9. Only truly trivial tasks may skip the file. Non-trivial tasks should not proceed without one.
