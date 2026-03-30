# Code Planning

Description: Turn a non-trivial request into a concrete execution plan before implementation.

Use when:
- The task spans multiple meaningful steps.
- There are unknown dependencies, sequencing concerns, or staged validation.
- The next safe implementation step is not already obvious.
- A shared plan would reduce rework or make handoff easier.

Do not use when:
- The change is trivial and the next safe step is obvious.

Read first:
- `../../project/discovery.md` when it exists

## Instructions

1. Read current project discovery context before planning when it exists.
2. Create or update the task note via `task-tracking` before substantial planning whenever the task is non-trivial.
3. Break the work into concrete steps with clear outcomes.
4. Surface the main assumptions, dependencies, and likely failure points early.
5. Put validation in the plan, not just implementation steps.
6. If the planned work will materially change architecture, commands, shared interfaces, workflows, major directories, or important repo gotchas, include an update to `.agents/project/discovery.md` in the plan.
7. If the user asks "what aren't we considering?" or asks for missing considerations, switch to the `what-arent-we-considering` skill and use its checklist format.
8. Re-plan immediately when assumptions fail, scope changes, progress stalls, or new information invalidates the current plan.
9. Stop when the plan is decision-ready. Execution should then continue under the task's other matching skills and the root invariants.
