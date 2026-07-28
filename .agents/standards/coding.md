# Coding Standards

Use this file as lightweight coding guidance across projects.

- Match local conventions in the code you touch before introducing new patterns.
- Prefer small, local changes over broad rewrites unless the task clearly requires structural change.
- Prefer root-cause fixes over one-off workarounds or patches that only hide symptoms.
- Do not hand-edit generated artifacts without also updating the real source of truth that produces them.
- When changing a contract or interface, update nearby callers, tests, and docs in the same pass.
- Keep code understandable to the next agent or engineer through naming and structure first. Reserve comments for non-obvious or critical logic: constraints, invariants, tradeoffs, and intent the code cannot convey. Do not restate what the code does, label obvious blocks, or explain standard language and library behavior.
- Never leave development notes in comments. Diff narration, change rationale, TODO or FIXME markers, temporal asides, and commented-out code belong in the task note, or in the `Known Risks or Gotchas` section of `.agents/project/discovery.md` when the caveat is durable.
- Delete redundant or stale comments inside the lines you are already changing, but do not make opportunistic comment-cleanup sweeps outside your diff.
- Reserved does not mean none: keep doc comments on public interfaces where the project's conventions already use them, and state contract rather than implementation.
- If a subsystem needs stricter rules, define them near that subsystem instead of expanding this file into a general style guide.
