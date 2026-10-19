---
name: writing-for-agents
description: "Write and edit documents agents read so they behave predictably: skills, AGENTS.md/CLAUDE.md, standards, and docs reached by a pointer. Use when: Creating or editing a skill (SKILL.md), a slash command, or a router.; Editing AGENTS.md, CLAUDE.md, a standards file, or discovery.md.; Reviewing agent-facing text for weak triggers, sprawl, or no-ops."
---

# Writing for Agents

Agent-facing documents succeed when the agent takes the same *process* every run. The levers below apply to skills, `AGENTS.md`/`CLAUDE.md`, standards files, and any doc an agent reaches through a pointer.

## Context pointers

A **context pointer** names out-of-context material and the condition for reaching it: a skill description, a line in `AGENTS.md` naming a doc, a "Read first" list. The pointer's wording, not its target, decides when and how reliably the agent reaches the material. A must-have target behind a weakly worded pointer is a variance bug: sharpen the wording first, and inline the material only if sharpening fails.

- Front-load the leading word: the start of the pointer does the triggering.
- One trigger per branch: synonyms for the same case are one branch written twice.
- Cut identity the body already carries.

## The two loads

- **Context load**: always-loaded text (an `AGENTS.md` line, a skill description) costs tokens and attention every turn, whether or not it fires.
- **Cognitive load**: what the human must remember exists and when to reach for it. Spend it where human judgement matters.

Material behind a pointer escapes context load at the price of the pointer's own line.

## Information hierarchy

A document holds **steps** (ordered actions) and **reference** (rules and definitions consulted on demand). Place each piece on a ladder:

1. In-file step.
2. In-file reference.
3. Disclosed reference: a separate file behind a pointer, loaded only when the pointer fires.

Inline what every branch needs and disclose what only some branches reach (**progressive disclosure**). Keep a concept's definition, rules, and caveats under one heading (**co-location**). The failure mode is **sprawl**, a document too long even when every line is live; cure it by disclosing reference and splitting by branch.

## Steps end on completion criteria

End every step on a **Done when** the agent can check.

- **Clarity**: a vague bound ("understanding reached") invites premature completion. Sharpen the bound first; only if it stays fuzzy and you see the agent rush, move the later steps behind a real context boundary (a subagent or a handoff).
- **Demand**: "every caller accounted for" drives more legwork than "produce a list". The strongest criteria are checkable and exhaustive.
- **Away path**: a criterion that needs the user ("the user has seen it") also says what to do when they are away ("or recorded for them").

## Leading words

A **leading word** is a compact concept the model already knows (*tight* loop, *tracer bullet*, *red*, *fog of war*) that anchors a region of behaviour in one token. Repeat the word, never the sentence. Hunt for triads and restated ideas that collapse into one word, and prefer an existing word to a coined one: a coined word recruits no priors and must be paid for in definition.

## State the positive target

A prohibition pulls the banned behaviour into context. State what to do ("write a one-line comment that explains why"), and keep a "never" only for a hard guardrail you cannot phrase positively, paired with the positive target.

## Pruning

- **Single source of truth**: each meaning lives in one place; everything else points at it.
- **The environment is a source of truth**: `--help` output, config files, scripts, and the directory layout already say what they say. Cache only what a lookup cannot find: the unwritten convention, the reason behind a choice, the gotcha.
- **Relevance**: lines that never bear on the task, or that describe behaviour that has changed, settle into sediment. Delete them.
- **No-ops**: a sentence the model already obeys by default changes nothing; delete the whole sentence. When a word is too weak to beat the default (*be thorough*), use a stronger one (*relentless*).

## Skills: invocation and mechanics

- **Model-invoked** (the default): the description stays loaded, is written for the model, and lists the trigger branches (`Use when: …; …`). Choose it only when the agent or another skill must reach the skill unprompted.
- **User-invoked**: `disable-model-invocation: true` in the harness frontmatter (agent-bootstrap sources write `manual-only: true`; the sync script sets the wrapper flag). Zero context load, and the description becomes a one-line human summary. Other skills cannot load it through the Skill tool: read its file by path, or tell the user to run it.
- Write operative dependencies explicitly: "call the Skill tool with "grilling"" for a model-invoked skill, one skill per call.
- Split off a new model-invoked skill only when it has its own trigger word or another skill must reach it; otherwise extend an existing skill.
- When user-invoked skills multiply past what anyone remembers, add one **router** that names them and when to reach for each.
- After editing, run the skill set's own checks (a sync script's drift check, a plugin validator) and bump versions where the set is versioned.
- Credit adapted upstream text: the pinned commit in the NOTICE file and a provenance line at the end of the skill.

---
Adapted from mattpocock/skills `writing-for-agents` and `SKILL-MECHANICS.md` (MIT, `49dd158`). See `.agents/NOTICE.md`.
