---
name: domain-modeling
description: "Build and sharpen a project's domain language while working: challenge fuzzy or conflicting terms, stress-test them with scenarios, record resolved terms in the glossary, and offer decision records for hard-to-reverse choices. Use when: A term is vague, overloaded, or used differently from the code or the glossary.; The user is discussing what domain concepts mean or how they relate.; A hard-to-reverse, surprising decision with a real trade-off has just been made.; Writing or editing the project glossary or a decision record."
---

# Domain Modeling

The active discipline for a project's shared language. Reading the glossary for vocabulary is a habit any skill has; this skill is for changing the model.

## Where it lives

- **Glossary:** `.agents/project/glossary.md`. **Decision records:** `.agents/project/adr/NNNN-<slug>.md`. Create each lazily, when the first term or decision is settled.
- When you create the glossary, add a one-line pointer to it under Local Rules in `.agents/project/discovery.md`, so every session reads it.
- A repo that already commits its own glossary or decision folder (`GLOSSARY.md`, `docs/adr/`, `docs/decisions/`) keeps that as the source of truth: read it, and propose additions for the user to commit there rather than writing them locally.
- One glossary per repo. Split by subsystem only when the same word genuinely means different things in two parts of the code.

## During the work

1. **Challenge against the glossary.** When a term conflicts with a definition, say so at once: "the glossary defines *owner* as the app that installed a folder; you seem to mean the device's user. Which is it?"
2. **Sharpen fuzzy words.** Propose one canonical term for a vague or overloaded word, and say which meanings it splits.
3. **Stress-test with scenarios.** Invent concrete cases that probe the edges between concepts and make the user be precise.
4. **Cross-check the code.** When the user states how something works, check that the code agrees, and surface any contradiction.
5. **Update the glossary inline** the moment a term is resolved; batching loses them.

**Done when** every term resolved in the conversation is in the glossary, and every qualifying decision has been offered as a record.

## Glossary format

```md
# <Context name>

<One or two sentences: what this context is and why it exists.>

## Language

**<Term>**:
<One or two sentences: what it is, not what it does.>
_Avoid_: <synonyms not to use>
```

- Be opinionated: pick one word and list the others under _Avoid_.
- Only this project's own concepts; general programming terms stay out.
- No implementation detail: the glossary is not a spec, a plan, or a scratch pad.
- Group terms under subheadings once natural clusters appear.

## Decision records

Offer a record only when all three hold: the decision is **hard to reverse**, **surprising without context**, and the result of a **real trade-off**. Otherwise skip it.

Name it `NNNN-<slug>.md`, numbered after the highest existing record:

```md
# <Short title of the decision>

<One to three sentences: the context, what was decided, and why.>
```

Add `Status`, `Considered options`, or `Consequences` only when they add real value. Explicit "no"s and rejected alternatives are worth recording when someone would otherwise suggest them again.

---
Adapted from mattpocock/skills `domain-modeling`, `GLOSSARY-FORMAT.md`, and `ADR-FORMAT.md` (MIT, `49dd158`). See `.agents/NOTICE.md`.
