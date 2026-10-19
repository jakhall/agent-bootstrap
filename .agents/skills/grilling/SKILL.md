---
name: grilling
description: "Interview the user in rounds until a plan, decision, or idea has no open branches, asking overarching decisions first, each with a plain explanation and a recommended answer. Use when: The user wants a plan stress-tested, asks to be grilled, or asks for questions.; Planning depends on choices only the user can make.; Another skill needs a structured interview."
---

# Grilling

Interview the user until you share an understanding of the plan. Map it as a **design tree**: every decision branches into the decisions that hang off it. Work the tree in **rounds**.

## Instructions

1. **Facts are your job; decisions are the user's.** Look up anything the environment can answer (code, config, logs, docs, history) instead of asking. Send slow lookups to a subagent and keep asking the rest meanwhile: only the questions downstream of a running lookup wait for it.
2. **Overarching decisions first**: what the work promises, who owns it, the strategy, scale, policies, and how success is measured, before detailed design choices. When an overarching answer changes, mark earlier detailed answers as provisional.
3. **Ask the whole frontier each round**: every open decision whose prerequisites are settled. A question that depends on another question still open in the same round belongs to a later round.
4. **Explain every question plainly**:
   - what is being decided, in everyday words;
   - a concrete example (a real path, row, timeline, or past incident);
   - the mechanism behind it in one sentence;
   - the options and what each costs;
   - your recommendation, worded so that "yes" accepts it.
5. **Pick the format by the round's shape**:
   - Up to 4 questions with clear options: give the plain-text explanation first, then ask through the harness's question tool (AskUserQuestion in Claude Code) with short plain labels, the recommended option first and marked, and a one-line consequence or cost in each option's description.
   - Open-ended questions, or more than 4: a numbered text round, one block per question:

     ```
     ❓ **Q1 - <title>**: <question, example, options and costs>

     ➡️ <recommended answer>
     ```
6. **Recompute after each round**: settled answers push the frontier outward and unblock dependent questions. Record each decision in the task note as it lands.

**Done when** the frontier is empty (every branch visited, nothing silently assumed) and the user confirms the shared understanding. A settled plan is not permission to implement: summarise the decisions and ask what to do next unless the user already asked for implementation.

---
Adapted from mattpocock/skills `grilling` (MIT, `49dd158`). See `.agents/NOTICE.md`.
