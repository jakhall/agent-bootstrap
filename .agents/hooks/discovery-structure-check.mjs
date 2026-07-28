import { readFileSync } from 'node:fs';
import { parseSections, posix } from './lib.mjs';

const ALLOWED = [
  'Overview',
  'Stack',
  'Commands',
  'Key Paths and Entrypoints',
  'Local Rules',
  'Known Risks or Gotchas',
  'Notable Changes',
];

const MAX_ENTRIES = 5;
const MAX_ENTRY_LINES = 3;

function sizeOf(section) {
  return section.body.filter((l) => l.trim()).length;
}

/** Top-level `- ` bullets only; nested bullets belong to the entry above them. */
function entriesOf(section) {
  const entries = [];
  section.body.forEach((line) => {
    if (/^- \S/.test(line)) {
      entries.push([line]);
    } else if (entries.length && line.trim()) {
      entries[entries.length - 1].push(line);
    }
  });
  return entries;
}

export function check(input) {
  const filePath = input?.tool_input?.file_path;
  if (!filePath) return null;
  if (!posix(filePath).endsWith('.agents/project/discovery.md')) return null;

  let text;
  try {
    text = readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }

  const sections = parseSections(text);
  if (!sections.length) return null;

  const findings = [];

  const offSchema = sections.filter((s) => !ALLOWED.includes(s.title));
  if (offSchema.length) {
    findings.push(
      `Sections outside the seven allowed headings: ${offSchema.map((s) => `"${s.title}"`).join(', ')}. ` +
        'Fold their durable content into the right heading and delete the section.'
    );
  }

  const notable = sections.find((s) => s.title === 'Notable Changes');
  if (notable) {
    const entries = entriesOf(notable);

    if (entries.length > MAX_ENTRIES) {
      findings.push(
        `Notable Changes has ${entries.length} entries; the limit is ${MAX_ENTRIES}. ` +
          `Delete the oldest ${entries.length - MAX_ENTRIES}, keeping a durable fact only by folding it into the section it belongs to.`
      );
    }

    const long = entries.filter((e) => e.length > MAX_ENTRY_LINES);
    if (long.length) {
      findings.push(
        `${long.length} Notable Changes ${long.length === 1 ? 'entry is' : 'entries are'} longer than ${MAX_ENTRY_LINES} lines ` +
          `(longest: ${Math.max(...long.map((e) => e.length))} lines). Compress to the fact a future agent needs; detail belongs in git history.`
      );
    }

    const durable = sections.filter((s) => s.title !== 'Notable Changes');
    const largest = durable.reduce((a, s) => (sizeOf(s) > sizeOf(a) ? s : a), durable[0]);
    if (largest && sizeOf(notable) > sizeOf(largest)) {
      findings.push(
        `Notable Changes (${sizeOf(notable)} lines) is now larger than every durable section ` +
          `(largest is "${largest.title}" at ${sizeOf(largest)}). History must stay the smallest part of this file.`
      );
    }
  }

  if (!findings.length) return null;

  return [
    `discovery.md structure (agent-bootstrap) — ${posix(filePath)}:`,
    '',
    ...findings.map((f) => `  - ${f}`),
    '',
    'This is a composition check, not a size limit. There is no cap on the durable sections —',
    'record as much project detail as the project needs. Trim the history instead.',
  ].join('\n');
}
