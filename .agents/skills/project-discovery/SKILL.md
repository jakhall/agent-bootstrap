---
name: project-discovery
description: "Explore a project, maintain durable shared project memory, and return a short factual summary before planning or editing. Use when: The project is unfamiliar.; Running autonomously for the first time in a project.; `.agents/project/discovery.md` is missing, stale, or incomplete for the current task.; Build, test, lint, entrypoint, or local-rule discovery is still uncertain."
---

# Project Discovery

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

   Use these seven headings and no others. If the file has grown a section that is not one of them, fold its durable content into the right heading and delete the section.
5. Keep the document factual, durable, and current. Under `Commands`, include the fastest useful validation command for tight feedback and the broader validation command expected before handoff when those are discoverable. If a command is not discoverable, say so instead of guessing.
6. `Notable Changes` holds at most 5 entries, newest first, each at most 3 lines, and must remain the smallest section in this file. When adding a sixth, delete the oldest — keep a durable fact from it only by folding that fact into the section it belongs to. There is no limit on the durable sections: record as much project detail as the project actually needs.
7. When project-specific detail lives in a repo-root `CLAUDE.md` or `AGENTS.md`, fold it into `discovery.md` and reduce the root file to a pointer. Leave genuinely root-level content, such as instructions aimed at tools other than this workflow, where it is.
8. Refresh `discovery.md` whenever it is missing, stale, incomplete, or the current exploration finds significant changes to architecture, commands, shared interfaces, workflows, major directories, observability or testing conventions, or important repo-specific gotchas.
9. After refreshing the document, return a concise summary derived from the updated `discovery.md`.
