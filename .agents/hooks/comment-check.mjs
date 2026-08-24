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

const CODE_VERBS = new Set(
  ('initialize init instantiate construct create make build set assign get fetch return ' +
    'loop iterate increment decrement add append push insert remove delete clear reset ' +
    'update check call invoke define declare import export print log compute calculate ' +
    'parse convert cast open close read write send receive store save load start stop run ' +
    'execute handle process validate filter map reduce sort enable disable toggle wrap ' +
    'register bind connect disconnect begin end setup teardown cleanup configure render ' +
    'mount unmount find fill apply throw catch').split(/\s+/)
);
const OBVIOUS_LABEL = /^(constructor|properties|property|fields?|variables?|imports?|exports?|constants?|helpers?|helper functions?|getters?( and setters?)?|setters?|main|entry ?point|setup|teardown|cleanup|handlers?|event handlers?|dependencies|types?|interfaces?|enums?|methods?|utils?|utility functions?|the end|begin|end)$/i;
const WHY_SIGNAL = /\bbecause\b|\bso (that|we|it)\b|\bto avoid\b|\botherwise\b|\bworkaround\b|\bwhy\b|\bmust\b|\brequires?\b|\bexpects?\b|\bassumes?\b|\bcareful\b|\bnote that\b|\bhack\b|\bedge case\b|\(|https?:\/\/|#\d+/i;
const LEAD = /^(the|a|an|this|that|these|those|it|its|we|now|then|first|next|finally|here|just|simply)\s+/i;

const DOC_EXEMPT = /copyright|licen[sc]e|spdx-|@ts-|eslint-|prettier-|istanbul|c8 |noqa|type:\s*ignore|pragma/i;

const DENSITY_MIN_COMMENTS = 4;
const DENSITY_MIN_RATIO = 0.5;

function commentBody(line, ext) {
  const t = line.trim();
  if (SLASH.has(ext)) {
    if (t.startsWith('//')) return t.replace(/^\/+/, '').trim();
    if (t.startsWith('/*')) return t.replace(/^\/\*+/, '').replace(/\*+\/$/, '').trim();
    if (t.startsWith('*') && !t.startsWith('*/')) return t.slice(1).trim();
  }
  if (HASH.has(ext) && t.startsWith('#')) return t.replace(/^#+/, '').trim();
  if (DASH.has(ext) && t.startsWith('--')) return t.slice(2).trim();
  if (t.startsWith('<!--')) return t.replace(/^<!--/, '').replace(/-->$/, '').trim();
  return null;
}

/** Marker index that is real code punctuation, not inside a string or a `://`. */
function markerIndex(line, ext) {
  const twoChar = SLASH.has(ext);
  let quote = null;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (quote) {
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      quote = c;
      continue;
    }
    if (twoChar && c === '/' && line[i + 1] === '/' && line[i - 1] !== ':') return i;
    if (!twoChar && HASH.has(ext) && c === '#') return i;
  }
  return -1;
}

function trailingBody(line, ext) {
  if (!SLASH.has(ext) && !HASH.has(ext)) return null;
  const idx = markerIndex(line, ext);
  if (idx <= 0) return null;
  return line.slice(idx + (SLASH.has(ext) ? 2 : 1)).replace(/^\/+/, '').trim();
}

function restates(body) {
  let b = body.replace(/[.!:,;]+$/, '').trim();
  if (!b || WHY_SIGNAL.test(b)) return false;
  b = b.replace(LEAD, '').trim();
  if (!b) return false;
  if (OBVIOUS_LABEL.test(b)) return true;
  const words = b.split(/\s+/);
  if (words.length > 6) return false;
  const first = words[0].toLowerCase().replace(/[^a-z]/g, '');
  return CODE_VERBS.has(first) || (first.endsWith('s') && CODE_VERBS.has(first.slice(0, -1)));
}

function classify(body) {
  if (MARKERS.test(body)) return 'development marker';
  if (LOOKS_LIKE_CODE.some((re) => re.test(body))) return 'commented-out code';
  if (NARRATION.some((re) => re.test(body))) return 'narrates the change rather than the code';
  if (restates(body)) return 'restates or labels what the code already says';
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
  let commentLines = 0;
  let codeLines = 0;
  let inDoc = false;

  added.split('\n').forEach((line, i) => {
    const t = line.trim();
    if (t === '') return;
    if (t.startsWith('#!')) return;

    if (SLASH.has(ext)) {
      if (!inDoc && /^\/\*\*/.test(t)) inDoc = true;
      if (inDoc) {
        if (/\*\//.test(t)) inDoc = false;
        return;
      }
      if (/^\/\/\//.test(t) || t === '*/') return;
    }

    const at = `${p}:${base + i + 1}`;
    const body = commentBody(line, ext);

    if (body !== null) {
      if (DOC_EXEMPT.test(t)) return;
      commentLines += 1;
      if (body === '') return;
      const cat = classify(body);
      if (cat) findings.push(`${at} — ${cat}: ${t}`);
      return;
    }

    codeLines += 1;
    const tail = trailingBody(line, ext);
    if (tail && !DOC_EXEMPT.test(tail)) {
      const cat = classify(tail);
      if (cat) findings.push(`${at} — ${cat} (trailing comment): ${t}`);
    }
  });

  const dense =
    commentLines >= DENSITY_MIN_COMMENTS &&
    (codeLines === 0 || commentLines / codeLines >= DENSITY_MIN_RATIO);

  if (!findings.length && !dense) return null;

  const out = [
    'Comment discipline (agent-bootstrap): the lines just written include comments this workflow does not allow.',
    '',
  ];
  if (dense) {
    out.push(
      `  - ${p} — comment-heavy edit: ${commentLines} comment line(s) against ${codeLines} code line(s). ` +
        'The default is no comments; delete the ones that only describe what the code already shows.',
      ''
    );
  }
  const shown = findings.slice(0, 12);
  if (shown.length) {
    out.push(...shown.map((f) => `  - ${f}`), '');
    if (findings.length > shown.length) out.push(`  …and ${findings.length - shown.length} more.`, '');
  }
  out.push(
    'Default to writing NO comments. Keep one only when it is highly essential — a non-obvious',
    'constraint, invariant, tradeoff, or "why" a competent reader cannot recover from the code itself.',
    'Doc comments on public/exported APIs (C# ///, JSDoc on exported members) are the one routine exception.',
    'Unfinished work, caveats and rationale belong in the task note under `.agents/project/tasks/`,',
    'or in `.agents/project/discovery.md` when the caveat is durable.'
  );
  return out.join('\n');
}
