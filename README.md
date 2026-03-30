# Agent Bootstrap

`agent-bootstrap` is a lightweight starter for adding a reusable `.agents` workflow to any codebase.

It is not an application scaffold. There is no runtime, package manager, build pipeline, or test command to inherit from this repo. The template is intentionally Markdown-only so you can drop it into an existing project and adapt the guidance to that project's actual stack and workflows.

## What This Template Contains

The template separates durable agent guidance into a few layers:

- `AGENTS.md`: a small root entrypoint that points compatible coding agents toward the real instruction set.
- `.agents/AGENTS.md`: the operating rules for how agents should approach non-trivial work in a repo using this template.
- `.agents/skills/`: reusable workflows for common tasks like planning, project discovery, debugging, review, migrations, and test strategy.
- `.agents/standards/`: lightweight cross-project guidance for coding, testing, and observability decisions.

What you will not see in the template by default is `.agents/project/`. That folder is intentional project memory, not boilerplate. It should appear later inside the adopted repo only when an agent has enough local context to create something useful there.

## Why The Structure Looks Like This

This template is opinionated about a few things:

- Agent instructions should be easy to discover. The root `AGENTS.md` stays tiny so tools that look for that file can find the handoff immediately.
- Reusable guidance should stay reusable. Skills and standards live under `.agents/` so they can be copied between repos without carrying repo-specific noise with them.
- Project memory should be earned, not pre-filled. Repo-specific docs like discovery notes, observability instructions, and task handoff files belong under `.agents/project/`, but only after the target repo has been explored.
- Planning, observability, and proportional validation are default expectations. The template nudges agents to plan before non-trivial work, avoid guessing when visibility is weak, and report what was or was not verified.

That gives you a template that is structured enough to guide agents, but still lightweight enough to fit almost any codebase.

## Key Paths

Use these as the main entrypoints when you adopt or extend the template:

- `README.md`: human-facing explanation of what the template is and how to use it.
- `AGENTS.md`: compatibility shim that points agents to `.agents/AGENTS.md`.
- `.agents/AGENTS.md`: repo-local workflow rules for planning, discovery, observability, validation, and safe collaboration.
- `.agents/skills/README.md`: catalog of available skills plus common bundles.
- `.agents/skills/project-discovery/SKILL.md`: the workflow that creates or refreshes `.agents/project/discovery.md` inside a real project.
- `.agents/standards/`: baseline standards that can stay generic across repos.

## How Agents Are Expected To Work

In a repo using this template, the default workflow is:

1. Read `AGENTS.md`, then follow `.agents/AGENTS.md`.
2. Before non-trivial work, inspect `.agents/skills/README.md`.
3. Read `.agents/project/discovery.md` when it already exists.
4. Run the `project-discovery` workflow when the repo is unfamiliar or the shared project context is stale or incomplete.
5. Use `code-planning` before non-trivial implementation when the next safe step is not already obvious.
6. Compose task-specific skills as needed for debugging, review, migrations, observability, task tracking, or test strategy.
7. Refresh repo-specific memory when architecture, commands, interfaces, workflows, or important gotchas materially change.
8. Validate changes proportionally and report what remains unverified.

The template is meant to guide good behavior, not replace judgment. If a repo needs stricter rules, add them near the relevant subsystem or refine `.agents/AGENTS.md`.

## The Lifecycle Of `.agents/project/`

`.agents/project/` is deliberately omitted from the bootstrap itself.

When you copy this template into a real codebase, agents should create that folder lazily as useful repo-specific artifacts become available, for example:

- `.agents/project/discovery.md` for durable project orientation, key commands, major paths, local rules, and known gotchas.
- `.agents/project/observability.md` when debug or tracing usage needs repo-specific explanation.
- `.agents/project/tasks/<date>-<slug>.md` when a task needs persistent ownership, scope, or handoff state across turns or agents.

This keeps the template clean while still giving adopted repos a place to accumulate factual project memory over time.

## How To Adopt It

1. Copy `AGENTS.md` and the `.agents/` directory into the root of an existing project.
2. Read `.agents/AGENTS.md` and adjust any repo-level expectations that should be different for that codebase.
3. Keep reusable workflows in `.agents/skills/` and generic guidance in `.agents/standards/`.
4. Do not pre-create `.agents/project/` just to mirror the template. Let agents create it when they can populate it with real repo-specific information.
5. On the first substantial task in the adopted repo, have the agent run the project-discovery workflow and create `.agents/project/discovery.md`.
6. As the repo evolves, update project memory only when there is durable information worth carrying forward.
