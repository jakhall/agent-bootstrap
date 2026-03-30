# Test Strategy

Description: Choose the smallest effective validation plan for a change.

Use when:
- The user asks what to test or how to validate a change.
- The correct validation approach is unclear.
- A risky or cross-cutting change needs a deliberate test plan.

Read first:
- `../../standards/testing.md`

## Instructions

1. Map the change to its main risks and choose checks that exercise those risks directly.
2. Prefer the narrowest test level that can prove the behavior; go broader only when integrations or boundaries are the actual risk.
3. For bug fixes, include the regression path. For feature work, include the main success path and the most important edge conditions.
4. Keep the plan minimal but complete enough to catch likely failure modes.
5. State what will remain unverified after the proposed checks.
