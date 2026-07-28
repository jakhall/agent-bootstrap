import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { addedText, posix } from './lib.mjs';

const PROJECT_DETAIL = /^#{1,3}\s+.*\b(commands?|stack|architecture|quick start|getting started|setup|build|test(ing)?|entrypoints?|structure|layout|deploy(ment)?|dependencies)\b/im;

export function check(input) {
  const filePath = input?.tool_input?.file_path;
  if (!filePath) return null;

  const p = posix(filePath);
  if (!/\/CLAUDE\.md$/i.test(p)) return null;

  // The user's own global memory legitimately holds rules; only repo files are in scope.
  if (/\/\.claude\//.test(p)) return null;

  const dir = dirname(filePath);
  const isRepoRoot = existsSync(join(dir, '.git')) || existsSync(join(dir, '.agents'));
  if (!isRepoRoot) return null;

  const added = addedText(input.tool_input);
  const meaningful = added.split('\n').filter((l) => l.trim()).length;
  if (!PROJECT_DETAIL.test(added) && meaningful <= 10) return null;

  return [
    `Project detail is being written into ${p}.`,
    '',
    'In this workflow project-specific facts — architecture, commands, entrypoints, local rules,',
    'gotchas — belong in `.agents/project/discovery.md`, which is injected into every session at',
    'startup. A repo-root CLAUDE.md should stay a thin pointer.',
    '',
    'Move the project detail into discovery.md under the matching heading. Leave content genuinely',
    'aimed at other tools, or at this repo root specifically, where it is.',
  ].join('\n');
}
