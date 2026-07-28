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
- `../../standards/coding.md`

## Instructions

1. Read current project discovery context before planning when it exists.
2. Create or update the task note via `task-tracking` before substantial planning whenever the task is non-trivial.
3. Break the work into concrete steps with clear outcomes.
4. Surface the main assumptions, dependencies, and likely failure points early.
5. Give an honest assessment of the approach: state your real recommendation, surface reservations, risks, and any disagreement with the requested direction plainly, and do not hide uncertainty or alternatives you think matter. When intent, scope, priorities, or trade-offs are unclear, ask the user as many clarifying questions as you need rather than a fixed number, and when unsure prefer asking too many over too few instead of guessing.
6. Put validation in the plan, not just implementation steps.
7. If the planned work will materially change architecture, commands, shared interfaces, workflows, major directories, or important repo gotchas, include an update to `.agents/project/discovery.md` in the plan.
8. If the user asks "what aren't we considering?" or asks for missing considerations, switch to the `what-arent-we-considering` skill and use its checklist format.
9. Re-plan immediately when assumptions fail, scope changes, progress stalls, or new information invalidates the current plan.
10. Stop when the plan is decision-ready. Execution should then continue under the task's other matching skills and the root invariants.
