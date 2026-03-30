# Observability Standards

Use this file as reusable guidance for observability work across projects.

- Treat observability as a baseline requirement for substantive implementation, debugging, and review work.
- Signals should let a future agent explain what happened, why it happened, and where it failed.
- If current signals cannot answer those questions, add or recommend the minimum useful telemetry before guessing.
- Make key inputs, outputs, decisions, and failures observable.
- Use structured, concise, searchable logs or traces with high signal and low noise.
- Make errors explicit and traceable; avoid silent failures.
- Add instrumentation for unclear, stateful, or otherwise hard-to-diagnose behavior.
- Include correlation IDs or equivalent context when flows cross multiple steps.
- When log, trace, or debug usage is non-obvious, create or update `.agents/project/observability.md`.
- Create `.agents/project/observability.md` only when there is actual repo-specific guidance to capture; do not pre-create blank placeholders.
- Keep `.agents/project/observability.md` factual and repo-specific. It should explain how to use the actual debug signals available in this project.
- Prefer these sections in `.agents/project/observability.md`:
  - `Signals`
  - `Access`
  - `Correlation`
  - `Common Debug Flows`
  - `Known Gaps`
