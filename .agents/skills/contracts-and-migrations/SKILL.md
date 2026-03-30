# Contracts And Migrations

Description: Safely change compatibility boundaries such as APIs, schemas, config, env vars, CLI behavior, event shapes, or file formats.

Use when:
- A change affects a public or shared contract between producers and consumers.
- A change alters schemas, payload shapes, config keys, environment variables, CLI flags, event formats, or file formats.
- A change needs migration, compatibility, rollout, or fallback thinking.

Do not use when:
- The change is a purely internal refactor with no contract, compatibility, or data-shape impact.

Read as needed:
- `../../project/discovery.md`
- `../../standards/coding.md`
- `../../standards/testing.md`
- `../../standards/observability.md`

## Instructions

1. Identify the contract being changed and list the affected producers, consumers, callers, or downstream readers.
2. Classify the compatibility risk clearly: backward compatible, forward compatible, breaking, or unknown pending evidence.
3. Update adjacent callers, tests, and relevant docs in the same pass instead of treating the contract change in isolation.
4. When compatibility cannot be preserved, define the required migration, fallback, or rollout handling before implementation proceeds.
5. Call out any operational visibility needed to confirm the new contract is being exercised correctly in real flows.
6. Update `.agents/project/discovery.md` when the change materially affects shared interfaces, config or env behavior, CLI usage, migration workflow, major directories, or other durable project expectations future agents should know.
7. Validate both the changed contract itself and any intended compatibility or migration path.
8. If the compatibility impact cannot be established from local evidence, surface that as an explicit risk instead of guessing.
