import { addedText, lineOffsetOf, posix } from './lib.mjs';

const SLASH = new Set([
  'js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'cs', 'java', 'go', 'rs', 'kt', 'swift',
  'c', 'h', 'cpp', 'hpp', 'cc', 'php', 'scala', 'dart', 'groovy', 'css', 'scss', 'less',
]);
const HASH = new Set(['py', 'sh', 'bash', 'zsh', 'rb', 'ps1', 'psm1', 'pl', 'r', 'tf']);
const DASH = new Set(['sql', 'lua', 'hs', 'elm']);

const MARKERS = /\b(TODO|FIXME|XXX|HACK)\b/i;

const NARRATION = [
  /\b(added|changed|updated|removed|replaced|renamed)\s+(this|these|it|for|to|from|because|so)\b/i,
  /\bwas\s+(previously|originally|called|named)\b/i,
  /\b(previously|originally)\s+(this|it|we|the)\b/i,
  /\btemporary\b|\bfor now\b|\buntil we\b|\brevisit\b/i,
  /^note\s*:/i,
  /\bfor the new\b|\bpart of the\b.*\b(change|refactor|migration)\b/i,
  /\b(no longer|not needed anymore|leftover)\b/i,
];

const LOOKS_LIKE_CODE = [
  /;\s*$/,
  /^(if|else|for|while|switch|case|return|throw|function|def|class|import|export|const|let|var|public|private|protected|async|await|try|catch|foreach|end)\b/,
  /^[\w.$]+\([^)]*\)\s*;?\s*$/,
  /^[\w.$[\]'"]+\s*[-+*/]?=\s*.+$/,
  /^[{}[\]()]+\s*$/,
];

function commentBody(line, ext) {
  const t = line.trim();
  if (SLASH.has(ext)) {
    if (t.startsWith('//')) return t.slice(2).trim();
    if (t.startsWith('/*')) return t.replace(/^\/\*+/, '').replace(/\*+\/$/, '').trim();
    if (t.startsWith('*') && !t.startsWith('*/')) return t.slice(1).trim();
  }
  if (HASH.has(ext) && t.startsWith('#')) return t.replace(/^#+/, '').trim();
  if (DASH.has(ext) && t.startsWith('--')) return t.slice(2).trim();
  if (t.startsWith('<!--')) return t.replace(/^<!--/, '').replace(/-->$/, '').trim();
  return null;
}

export function check(input) {
  const filePath = input?.tool_input?.file_path;
  if (!filePath) return null;

  const p = posix(filePath);
  if (/\/\.agents\/|\/node_modules\/|\/\.git\//.test(p)) return null;

  const ext = (p.split('.').pop() || '').toLowerCase();
  if (!SLASH.has(ext) && !HASH.has(ext) && !DASH.has(ext)) return null;

  const added = addedText(input.tool_input);
  if (!added.trim()) return null;

  const base = lineOffsetOf(filePath, added);
  const findings = [];

  added.split('\n').forEach((line, i) => {
    const body = commentBody(line, ext);
    if (body === null || body === '') return;
    const at = `${p}:${base + i + 1}`;

    if (MARKERS.test(body)) {
      findings.push(`${at} — development marker: ${line.trim()}`);
      return;
    }
    if (LOOKS_LIKE_CODE.some((re) => re.test(body))) {
      findings.push(`${at} — commented-out code: ${line.trim()}`);
      return;
    }
    if (NARRATION.some((re) => re.test(body))) {
      findings.push(`${at} — narrates the change rather than the code: ${line.trim()}`);
    }
  });

  if (!findings.length) return null;

  return [
    'Comment discipline (agent-bootstrap): the lines just written include comments that this workflow does not allow.',
    '',
    ...findings.map((f) => `  - ${f}`),
    '',
    'Remove them now. Comments are reserved for non-obvious or critical logic — constraints,',
    'invariants, tradeoffs, and intent a reader cannot infer from the code. Unfinished work,',
    'caveats and rationale belong in the task note under `.agents/project/tasks/`, or in',
    '`.agents/project/discovery.md` when the caveat is durable.',
  ].join('\n');
}
