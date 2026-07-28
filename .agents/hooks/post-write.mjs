import { check as claudeMd } from './claudemd-guard.mjs';
import { check as comments } from './comment-check.mjs';
import { check as discovery } from './discovery-structure-check.mjs';
import { emitContext, readHookInput } from './lib.mjs';

/**
 * Single entry point for the Write|Edit checks. They are mutually exclusive by path,
 * so dispatching here costs one process per edit instead of one per check.
 */
try {
  const input = readHookInput();
  const messages = [comments, discovery, claudeMd]
    .map((fn) => {
      try {
        return fn(input);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  emitContext('PostToolUse', messages.join('\n\n'));
} catch {
  // A failing check must never block the edit that triggered it.
}
