import { readFileSync } from 'node:fs';

export function readHookInput() {
  try {
    return JSON.parse(readFileSync(0, 'utf8') || '{}');
  } catch {
    return {};
  }
}

export function emitContext(hookEventName, text) {
  if (!text) return;
  process.stdout.write(
    JSON.stringify({ hookSpecificOutput: { hookEventName, additionalContext: text } })
  );
}

export function posix(p) {
  return String(p || '').replace(/\\/g, '/');
}

/**
 * Write carries the whole file; Edit carries only the replacement text. Returning
 * just the addition is what keeps these checks off pre-existing content.
 */
export function addedText(toolInput = {}) {
  if (typeof toolInput.content === 'string') return toolInput.content;
  if (typeof toolInput.new_string === 'string') return toolInput.new_string;
  if (Array.isArray(toolInput.edits)) {
    return toolInput.edits.map((e) => e?.new_string ?? '').join('\n');
  }
  return '';
}

/**
 * Absolute line number of `needle` within the file, so findings point at somewhere
 * the reader can actually navigate to. Falls back to 0 for relative numbering.
 */
export function lineOffsetOf(filePath, needle) {
  if (!filePath || !needle) return 0;
  try {
    const idx = readFileSync(filePath, 'utf8').indexOf(needle);
    if (idx < 0) return 0;
    return readFileSync(filePath, 'utf8').slice(0, idx).split('\n').length - 1;
  } catch {
    return 0;
  }
}

/**
 * Split markdown into `## ` sections. Fence tracking is required: discovery.md
 * files embed shell snippets whose `#` comments would otherwise read as headings.
 */
export function parseSections(text) {
  const lines = text.split('\n');
  const sections = [];
  let current = null;
  let fenced = false;

  lines.forEach((line, i) => {
    if (/^\s*```/.test(line)) fenced = !fenced;
    const heading = !fenced && line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      if (current) current.end = i - 1;
      current = { title: heading[1], start: i, end: lines.length - 1, body: [] };
      sections.push(current);
      return;
    }
    if (current) current.body.push(line);
  });

  return sections;
}
