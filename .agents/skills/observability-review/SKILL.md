# Observability Review

Description: 

- Perform a deeper observability pass to ensure a flow is diagnosable and add or recommend the minimum telemetry needed.
- Key consideration: "Is the system/outcome observable as an AI Agent or only a human?" when applicable, devise a way to improve agent-observability without negatively affecting user experience or system performance.

Use when:
- Debugging unclear behavior.
- Reviewing a change for diagnosability or operability.
- Working in stateful, asynchronous, or cross-boundary code where blind spots are likely.

Read first:
- `../../project/discovery.md` when it exists
- `../../standards/observability.md`
- `../../project/observability.md` when it exists

## Instructions

1. Check whether the current signals can answer what happened, why it happened, and where it failed.
2. Review inputs, outputs, branching decisions, state changes, retries and fallbacks, and failure paths.
3. If diagnosis would require guesswork, add or recommend the smallest useful telemetry before going deeper.
4. Prefer structured, searchable, high-signal events over verbose logging.
5. Report missing observability as a concrete finding during review, or include the instrumentation in the change when implementing or debugging.
6. Use this skill to deepen the mandatory baseline from `../../standards/observability.md`; it is not the only place observability applies.
7. When debug, logging, or tracing usage is non-obvious or changes materially, create or update `.agents/project/observability.md` with factual repo-specific instructions.
8. When observability work materially changes repo-level debug workflow, commands, or durable gotchas future agents should know, refresh `.agents/project/discovery.md` and keep signal-specific details in `.agents/project/observability.md`.
