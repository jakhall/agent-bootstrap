# Coding Standards

Use this file as lightweight coding guidance across projects.

- Match local conventions in the code you touch before introducing new patterns.
- Prefer small, local changes over broad rewrites unless the task clearly requires structural change.
- Prefer root-cause fixes over one-off workarounds or patches that only hide symptoms.
- Do not hand-edit generated artifacts without also updating the real source of truth that produces them.
- When changing a contract or interface, update nearby callers, tests, and docs in the same pass.
- Keep code understandable through naming and structure first, not comments. Default to writing none: add a comment only when it is highly essential — a non-obvious constraint, invariant, tradeoff, or "why" a competent reader cannot recover from the code itself. Never restate what the code does, label obvious blocks (`// constructor`, `// loop through users`, `// set the counter`), or explain standard language and library behavior.
- Never leave development notes in comments. Diff narration, change rationale, TODO or FIXME markers, temporal asides, and commented-out code belong in the task note, or in the `Known Risks or Gotchas` section of `.agents/project/discovery.md` when the caveat is durable.
- Delete redundant or stale comments inside the lines you are already changing, but do not make opportunistic comment-cleanup sweeps outside your diff.
- The one routine exception is doc comments on public or exported interfaces (e.g. C# `///` XML docs, JSDoc on exported members) where the project's conventions already use them — state the contract, not the implementation. This is not licence to comment elsewhere.
- If a subsystem needs stricter rules, define them near that subsystem instead of expanding this file into a general style guide.
