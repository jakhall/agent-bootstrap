import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
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
 * Resolved relative to this file so the check follows the clone rather than assuming
 * where it was installed. PowerShell-only, so it does not run on macOS or Linux.
 */
function syncDriftWarning() {
  if (process.platform !== 'win32') return null;
  const script = fileURLToPath(new URL('../tools/sync.ps1', import.meta.url));
  if (!existsSync(script)) return null;
  try {
    execFileSync('powershell', ['-NoProfile', '-File', script, '-Check'], {
      stdio: 'pipe',
      timeout: 8000,
    });
    return null;
  } catch (err) {
    if (err?.status === 1) {
      return 'The `ab-*` skill wrappers are out of sync with the agent-bootstrap clone. Run: powershell -NoProfile -File "$HOME\\.claude\\agent-bootstrap-sync.ps1"';
    }
    return null;
  }
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
