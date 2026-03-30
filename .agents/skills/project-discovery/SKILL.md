# Project Discovery

Description: Explore a project, maintain durable shared project memory, and return a short factual summary before planning or editing.

Use when:
- The project is unfamiliar.
- Running autonomously for the first time in a project.
- `.agents/project/discovery.md` is missing, stale, or incomplete for the current task.
- Build, test, lint, entrypoint, or local-rule discovery is still uncertain.

Do not use when:
- The current `discovery.md` is already sufficient and confirmed for the current task.

## Instructions

1. Read `.agents/project/discovery.md` first when it exists. Treat it as shared memory to refresh, not unquestioned truth.
2. If `Overview` is missing and a root `README` exists, summarize the project from that README first. If no root `README` exists, derive the overview from manifests, docs, code, and repo structure. When both exist, prefer README for intent and repo exploration for confirmation or correction.
3. Inspect the most relevant manifests, config files, CI definitions, docs, scoped `AGENTS.md` files, and likely entrypoints needed to confirm current project truth.
4. Create `.agents/project/` on demand when it does not exist, then create or refresh `.agents/project/discovery.md` as the primary output using exactly these headings:
   - `Overview`
   - `Stack`
   - `Commands`
   - `Key Paths and Entrypoints`
   - `Local Rules`
   - `Known Risks or Gotchas`
   - `Notable Changes`
5. Keep the document factual, durable, and current. Under `Commands`, include the fastest useful validation command for tight feedback and the broader validation command expected before handoff when those are discoverable. If a command is not discoverable, say so instead of guessing.
6. Use `Notable Changes` only for short recent project-level changes future agents should know. Fold older durable facts back into the snapshot instead of turning the file into an append-only log.
7. Refresh `discovery.md` whenever it is missing, stale, incomplete, or the current exploration finds significant changes to architecture, commands, shared interfaces, workflows, major directories, observability or testing conventions, or important repo-specific gotchas.
8. After refreshing the document, return a concise summary derived from the updated `discovery.md`.
