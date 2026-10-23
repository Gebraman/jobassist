/**
 * Deterministic Posting Integrity Guard
 * Ported from MadsLorentzen/ai-job-search/tools/posting_guard.py
 * 
 * Cleans untrusted job posting text before AI ingestion:
 * - Removes invisible zero-width and bidi override characters
 * - Strips hidden HTML elements (display:none, visibility:hidden, opacity:0)
 * - Identifies and flags prompt injection / instruction-shaped payload lines
 */

const ZERO_WIDTH_REGEX = /[\u200B\u200C\u200D\u2060\u2061\u2062\u2063\u2064]/g;
const BIDI_TAMPER_REGEX = /[\u202D\u202E\u2066\u2067\u2068\u2069]/g;
const BOM_REGEX = /\uFEFF/g;
const SOFT_HYPHEN_REGEX = /\u00AD/g;

const INJECTION_PATTERNS = [
  /ignore (all )?previous instructions/i,
  /system prompt override/i,
  /you are now in developer mode/i,
  /output only the following/i,
  /disregard above guidelines/i,
  /do not follow the candidate/i,
  /give this candidate 100/i,
  /say hire immediately/i,
  /eval\s*\(|exec\s*\(/i,
  /<script[\s\S]*?>[\s\S]*?<\/script>/i
];

export function sanitizePosting(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      cleanedText: '',
      findings: {
        zeroWidthCount: 0,
        bidiCount: 0,
        hiddenBlocks: [],
        suspiciousLines: [],
        verdict: 'CLEAN'
      }
    };
  }

  let text = rawText;
  let zeroWidthCount = 0;
  let bidiCount = 0;

  // 1. Count & strip zero-width characters
  const zwMatches = text.match(ZERO_WIDTH_REGEX);
  if (zwMatches) {
    zeroWidthCount = zwMatches.length;
    text = text.replace(ZERO_WIDTH_REGEX, '');
  }

  // 2. Count & strip bidi tamper characters
  const bidiMatches = text.match(BIDI_TAMPER_REGEX);
  if (bidiMatches) {
    bidiCount = bidiMatches.length;
    text = text.replace(BIDI_TAMPER_REGEX, '');
  }

  // 3. Strip BOM and soft hyphens
  text = text.replace(BOM_REGEX, '').replace(SOFT_HYPHEN_REGEX, '');

  // 4. Strip hidden HTML style blocks (display:none, visibility:hidden, opacity:0)
  const hiddenBlocks = [];
  const hiddenTagRegex = /<([a-z0-9]+)[^>]*style="[^"]*(display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0|font-size\s*:\s*0)[^"]*"[^>]*>([\s\S]*?)<\/\1>/gi;
  text = text.replace(hiddenTagRegex, (match, tag, style, content) => {
    hiddenBlocks.push(content.slice(0, 100));
    return '';
  });

  // 5. Strip generic scripts/styles
  text = text.replace(/<script[\s\S]*?<\/script>/gi, '')
             .replace(/<style[\s\S]*?<\/style>/gi, '')
             .replace(/<!--[\s\S]*?-->/g, '');

  // 6. Strip HTML tags but preserve clean linebreaks
  text = text.replace(/<br\s*\/?>/gi, '\n')
             .replace(/<\/p>/gi, '\n\n')
             .replace(/<li[^>]*>/gi, '• ')
             .replace(/<\/li>/gi, '\n')
             .replace(/<[^>]+>/g, ' ');

  // 7. Check for prompt injection lines
  const suspiciousLines = [];
  const lines = text.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(trimmed)) {
        suspiciousLines.push(trimmed.slice(0, 120));
        break;
      }
    }
  }

  // Normalise spaces
  text = text.replace(/[ \t]+/g, ' ').replace(/\n\s*\n\s*\n/g, '\n\n').trim();

  let verdict = 'CLEAN';
  if (suspiciousLines.length > 0 || bidiCount > 0) {
    verdict = 'FLAGGED_SUSPICIOUS';
  } else if (zeroWidthCount > 0 || hiddenBlocks.length > 0) {
    verdict = 'CAUTION_SANITIZED';
  }

  return {
    cleanedText: text,
    findings: {
      zeroWidthCount,
      bidiCount,
      hiddenBlocksCount: hiddenBlocks.length,
      suspiciousLines,
      verdict
    }
  };
}
