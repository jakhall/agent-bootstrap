import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import { emitContext, parseSections, posix } from './lib.mjs';

const REL = join('.agents', 'project', 'discovery.md');

function findDiscovery(start) {
  let dir = start;
  for (;;) {
    const candidate = join(dir, REL);
    if (existsSync(candidate)) return candidate;
    const up = dirname(dir);
    if (up === dir || dir === parse(dir).root) return null;
    dir = up;
  }
}

/**
 * Durable sections go in verbatim and uncapped — a large discovery.md is never truncated.
 * Only `Notable Changes` is withheld: it is history rather than orientation, and it is the
 * section that historically grew unbounded.
 */
function buildInjection(text) {
  const lines = text.split('\n');
  const sections = parseSections(text);
  if (!sections.length) return { body: text, withheld: 0 };

  const out = lines.slice(0, sections[0].start);
  let withheld = 0;

  for (const s of sections) {
    if (s.title === 'Notable Changes') {
      withheld = s.end - s.start;
      out.push(
        `## ${s.title}`,
        '',
        `_${withheld} lines of recent-change history withheld from this injection. Read the file directly if you need it._`,
        ''
      );
      continue;
    }
    out.push(...lines.slice(s.start, s.end + 1));
  }

  return { body: out.join('\n').replace(/\n{3,}/g, '\n\n').trim(), withheld };
}

/**
 * Cheap drift check run on every session start: a wrapper is stale when it is missing
 * or older than its source SKILL.md. sync.ps1 -Check does the exact content comparison,
 * but starting PowerShell here cost seconds per session.
 */
function syncDriftWarning() {
  const skillsSrc = fileURLToPath(new URL('../skills/', import.meta.url));
  const skillsDst = join(homedir(), '.claude', 'skills');
  if (!existsSync(skillsSrc) || !existsSync(skillsDst)) return null;
  for (const entry of readdirSync(skillsSrc, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const src = join(skillsSrc, entry.name, 'SKILL.md');
    if (!existsSync(src)) continue;
    const dst = join(skillsDst, `ab-${entry.name}`, 'SKILL.md');
    if (!existsSync(dst) || statSync(dst).mtimeMs < statSync(src).mtimeMs) {
      return 'The `ab-*` skill wrappers are out of sync with the agent-bootstrap clone. Run: powershell -NoProfile -File "$HOME\\.claude\\agent-bootstrap-sync.ps1"';
    }
  }
  return null;
}

function main() {
  const parts = [];

  const found = findDiscovery(process.cwd());
  if (found) {
    const { body, withheld } = buildInjection(readFileSync(found, 'utf8'));
    const lines = body.split('\n').length;
    parts.push(
      `Project memory from ${posix(found)} (${lines} lines injected${withheld ? `, ${withheld} lines of Notable Changes withheld` : ''}).`,
      'This is the shared project memory for this repo. Treat it as current truth to refresh, not as unquestioned fact.',
      '',
      body
    );
  }

  const drift = syncDriftWarning();
  if (drift) {
    if (parts.length) parts.push('');
    parts.push(drift);
  }

  emitContext('SessionStart', parts.join('\n'));
}

try {
  main();
} catch {
  // Startup must not fail because project memory could not be read.
}
