import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOOK = fileURLToPath(new URL('./post-write.mjs', import.meta.url));
const WARNING = 'Project detail is being written into';

let root;
let home;
let app;

before(() => {
  root = mkdtempSync(join(tmpdir(), 'claudemd-guard-'));
  home = join(root, 'home');
  app = join(root, 'src', 'app');
  mkdirSync(join(home, '.claude', '.agents', 'project'), { recursive: true });
  mkdirSync(join(home, '.claude', 'toolbox', '.git'), { recursive: true });
  mkdirSync(join(app, '.git'), { recursive: true });
  mkdirSync(join(app, '.claude', 'worktrees', 'feature'), { recursive: true });
  writeFileSync(join(app, '.claude', 'worktrees', 'feature', '.git'), 'gitdir: ../../../.git/worktrees/feature\n');
});

after(() => rmSync(root, { recursive: true, force: true }));

function runHook(filePath) {
  const r = spawnSync(process.execPath, [HOOK], {
    input: JSON.stringify({
      hook_event_name: 'PostToolUse',
      tool_name: 'Write',
      tool_input: { file_path: filePath, content: '# App\n\n## Commands\n\n- npm test\n' },
    }),
    encoding: 'utf8',
    env: { ...process.env, HOME: home, USERPROFILE: home },
  });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout;
}

test('warns for a repo-root CLAUDE.md outside any .claude directory', () => {
  assert.match(runHook(join(app, 'CLAUDE.md')), new RegExp(WARNING));
});

test('warns for a repo cloned under ~/.claude', () => {
  assert.match(runHook(join(home, '.claude', 'toolbox', 'CLAUDE.md')), new RegExp(WARNING));
});

test('warns for a Claude Code worktree under <repo>/.claude/worktrees', () => {
  assert.match(runHook(join(app, '.claude', 'worktrees', 'feature', 'CLAUDE.md')), new RegExp(WARNING));
});

test('stays silent for the global memory ~/.claude/CLAUDE.md even though ~/.claude holds .agents/', () => {
  assert.equal(runHook(join(home, '.claude', 'CLAUDE.md')), '');
});

test('stays silent for the global memory written with other slashes and case', () => {
  const variant = join(home, '.claude', 'claude.md').toLowerCase().replace(/\\/g, '/');
  assert.equal(runHook(variant), '');
});
