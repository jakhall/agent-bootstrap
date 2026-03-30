# Coding Standards

Use this file as lightweight coding guidance across projects.

- Match local conventions in the code you touch before introducing new patterns.
- Prefer small, local changes over broad rewrites unless the task clearly requires structural change.
- Prefer root-cause fixes over one-off workarounds or patches that only hide symptoms.
- Do not hand-edit generated artifacts without also updating the real source of truth that produces them.
- When changing a contract or interface, update nearby callers, tests, and docs in the same pass.
- Keep code understandable to the next agent or engineer; add comments only where constraints, invariants, or tradeoffs are not obvious from the code itself.
- If a subsystem needs stricter rules, define them near that subsystem instead of expanding this file into a general style guide.
