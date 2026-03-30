# Task Tracking

Description: Maintain an optional per-task note with explicit ownership, scope, and handoff state.

Use when:
- The task needs a persistent note across turns, agents, or handoffs.
- The task needs explicit ownership or file-scope tracking before edits begin.
- The user explicitly asks for plan tracking or a task note.

Do not use when:
- A chat response or short internal plan is enough.
- The task is short-lived and does not need repo-tracked state.

## Instructions

1. When a persistent note is useful, create `.agents/project/tasks/` on demand and create or update exactly one task note at `.agents/project/tasks/<YYYYMMDD>-<short-slug>.md` for that task.
2. Claim ownership before editing by setting `Owner`, `Scope`, and `Files in Scope`. One task note has one owner at a time.
3. Do not create a second note for the same task. For handoff, update the existing note's `Owner` and `Handoff` sections instead.
4. Keep the note concise, current, and action-oriented. Rewrite stale items instead of appending history.
5. Keep transient task state in the task note. Durable project memory, repo-wide workflows, and future-agent context belong in `.agents/project/discovery.md` instead.
6. Use only this schema:

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

7. If the task does not need persistent repo-tracked state, skip the file rather than creating ceremony.
