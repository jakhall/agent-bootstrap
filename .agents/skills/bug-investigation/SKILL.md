---
name: bug-investigation
description: "Diagnose a failure through a gated loop (red feedback loop, minimise, ranked hypotheses, instrument, fix with a regression test) and drive it to a root-cause fix. Use when: A bug, flaky behavior, performance regression, or unexplained failure needs investigation.; The user asks why something is broken or how to debug it, or reports something throwing, failing, or slow."
---

# Bug Investigation

A gated loop for bugs. Each phase ends on its **Done when** criterion; skip a phase only when you state why.

Read as needed:
- `../../project/discovery.md`
- `../../standards/observability.md`
- `../../standards/testing.md`

## Redact

Show commands, output, and captured artifacts with every secret replaced by `<REDACTED>`. Keep credentials in environment variables so the loop never prints them, and quote only the lines of an artifact that carry the signal. If the redacted output is not enough to diagnose, say so and ask the user.

## 1. Build a red loop

This phase is the skill. With one command that goes **red** on *this* bug, every later phase is mechanical; without one, reading code is guessing. Spend most of the effort here.

Ways to build one, roughly in order:
1. A failing test at the seam that reaches the bug: unit, integration, or end-to-end.
2. An HTTP script against a running dev server.
3. A CLI run with a fixture input, diffed against a known-good output.
4. A headless-browser script asserting on DOM, console, or network.
5. A replayed capture: a saved request, payload, queue message, or log fed through the code path in isolation.
6. A throwaway harness: the smallest slice of the system that runs the bug path with one call.
7. A property or fuzz loop for "sometimes wrong" bugs.
8. A bisection harness (`git bisect run`) when the bug appeared between two known states.
9. A differential run: the same input through the old and new version, or two configs, with outputs diffed.
10. Last resort: a human-in-the-loop step where the user runs one precise command and pastes the output back.

Then make the loop **tight**: faster (narrow the scope, skip unrelated setup), sharper (assert the exact symptom, not "didn't crash"), deterministic (pin time, seed randomness, isolate filesystem and network). For flaky bugs, raise the reproduction rate (loop the trigger, parallelise, add stress) until it is debuggable.

Give the loop three outcomes, not two: **red** (the bug shows), **green** (the bug is absent), and **invalid** (a precondition is missing or the harness itself broke). Run a positive control, a known-good input that must come back green, before trusting any red; a harness that can only fail proves nothing.

When a loop genuinely cannot be built, stop and say so: list what you tried, then ask for access to an environment that reproduces it, a redacted captured artifact (logs, HAR, dump), or permission for temporary instrumentation. Hypothesising starts only once a loop exists.

**Done when** you can show one command, already run at least once with its redacted output, that is:
- [ ] red-capable: it drives the real bug path and asserts the user's exact symptom
- [ ] controlled: a known-good input comes back green, and a broken setup reports invalid rather than red
- [ ] deterministic, or reproduces at a pinned, high rate
- [ ] fast: seconds, not minutes
- [ ] runnable unattended by the agent

## 2. Reproduce and minimise

Run the loop and confirm it shows the failure the **user** described, not a nearby one, across repeated runs. Capture the exact symptom (error, wrong value, timing) so later phases can verify the fix against it. Check the behaviour against its stated intent (code comment, commit message, docs, spec) and say whether it is a bug or intended.

Map the reach: which other inputs, paths, callers, or environments hit the same cause. The report usually names one case; the fix has to cover all of them.

Then shrink the scenario: cut inputs, callers, config, data, and steps one at a time, re-running the loop after each cut. A cut that makes the loop invalid removed a precondition, not the bug; restore it.

**Done when** every remaining element is load-bearing (removing any one turns the loop green, not invalid) and the reach is listed.

## 3. Hypothesise

Write 3 to 5 ranked hypotheses before testing any of them. Each states a falsifiable prediction: "If X is the cause, changing Y makes the bug disappear (or changing Z makes it worse)." Sharpen or drop any hypothesis that cannot predict.

Before testing a fix in shared code, grep every caller of the function you would touch. The reported path is often one of several broken callers, and the root-cause fix is usually one change in the shared function.

Show the ranked list to the user before testing; they often re-rank instantly from domain knowledge. If they are away, proceed with your own ranking.

**Done when** the list is ranked, each item carries its prediction, and the user has seen it (or, when they are away, it is recorded in your report for them).

## 4. Instrument

Each probe tests one prediction from phase 3, changing one variable at a time. Prefer a debugger or REPL; otherwise add targeted logs at the boundaries that separate hypotheses. Tag every temporary log with a unique prefix such as `[DEBUG-a4f2]` so cleanup is a single grep. When the code is live shared tooling (hooks, shared config, anything other sessions or users run right now), instrument a copy and drive the loop against the copy. When current signals cannot separate the hypotheses, add or recommend durable telemetry per `observability.md` instead of guessing.

For performance regressions, measure a baseline first (timer, profiler, query plan), then bisect; logs rarely answer timing questions.

**Done when** one hypothesis is confirmed by its probe and the others are ruled out or deprioritised with evidence.

## 5. Fix with a regression test

Write the regression test before the fix, at a **correct seam**: one that exercises the real bug pattern as it happens at the call site. A seam too shallow to reproduce it (a single-caller test for a multi-caller bug) gives false confidence. When no correct seam exists, record that as a finding: the architecture is preventing this bug from being locked down. When the repo has no test framework, keep the phase 1 loop as the regression check (a script beside the code it guards).

With a correct seam:
1. Turn the minimised repro into a failing test there and watch it fail. If you forced the red by mutating code or a fixture, diff against a pristine copy to prove the mutation landed.
2. Fix the root cause, in the shared function when several callers route through it. If you ship a mitigation instead, say what remains.
3. Watch the test pass, then re-run the phase 1 loop against the original, un-minimised scenario.

**Done when** the regression test and the original loop both pass.

## 6. Clean up and record

- [ ] The original repro no longer reproduces
- [ ] The regression test passes, or the missing seam is recorded
- [ ] Every `[DEBUG-…]` line is gone (grep the prefix) and throwaway harnesses are deleted or parked in a clearly marked debug location
- [ ] The confirmed hypothesis is stated in the commit or PR message
- [ ] Durable failure modes, debugging entrypoints, commands, or repo gotchas are added to `.agents/project/discovery.md`

---
Adapted from mattpocock/skills `diagnosing-bugs` (MIT, `49dd158`) and dietrichgebert/ponytail (MIT, `01cbf81`). See `.agents/NOTICE.md`.
