# Testing Standards

Use this file as lightweight validation guidance across projects.

- Use meaningful validation that checks intended behavior, not just code execution.
- For pure refactors, include focused proof that touched behavior still works.
- For bugs, validate the underlying fix rather than a superficial workaround.
- For contract or interface changes, validate affected callers and any intended compatibility behavior.
- Prefer focused checks that match the actual risk of the change.
- Go broader when the change crosses boundaries, integrations, or shared infrastructure.
- For cross-boundary changes, prefer broader integration-level checks when that is where the real risk lives.
- Do not treat work as complete until the relevant validation passes.
- If relevant validation cannot be run, say what remains unverified and why.
