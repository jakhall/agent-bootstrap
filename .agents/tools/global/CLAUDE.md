# Global Agent Workflow

Every session uses the reusable agent workflow maintained at the global clone `~/.claude/agent-bootstrap`.
Update it only with `powershell -NoProfile -File "$HOME\.claude\agent-bootstrap-sync.ps1"`
(`-Check` reports drift); it also regenerates the `ab-*` wrappers, which a bare `git pull` leaves stale.

## Path resolution (this workflow is installed GLOBALLY, not per-repo)

- `.agents/AGENTS.md`, `.agents/skills/`, `.agents/standards/` → read from the GLOBAL clone above.
- `.agents/project/` and any `../../project/` (discovery.md, observability.md, tasks/*.md)
  → ALWAYS the `.agents/project/` folder at the ROOT of the repo you are currently working in.
  Create it there on demand. NEVER write project memory into the global clone.

## Memory scope

- Save a memory about one repo in that repo's memory folder, `~/.claude/projects/<key>/memory/`
  (key = the repo's full path with every non-alphanumeric character replaced by `-`, e.g.
  `C--Users-me-src-my-app`), and add its line to that folder's `MEMORY.md`, even when the
  session runs elsewhere. Keep `~/.claude` memory for cross-repo preferences and tools.
- Keep a memory file under ~3 KB. Put long designs and history in the repo's task note or
  `discovery.md`, and point to it from the memory.

The `ab-*` skills are generated copies: edit the clone, then run the sync script.

@~/.claude/agent-bootstrap/.agents/AGENTS.md
