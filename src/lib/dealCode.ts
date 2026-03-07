const DEAL_CODE_PREFIX = "DL-";
const DEAL_CODE_REGEX = /^DL-(\d{5,})$/;

/**
 * Returns the numeric suffix from a deal code, or null if invalid.
 */
function parseDealCodeSuffix(code: string): number | null {
  const match = code.match(DEAL_CODE_REGEX);
  if (!match) return null;
  return parseInt(match[1], 10);
}

/**
 * MVP-friendly deal code generator.
 * Uses the current max numeric suffix known for this user and increments it.
 */
export function nextDealCodeFromMax(maxExisting?: string | null): string {
  if (!maxExisting) {
    return `${DEAL_CODE_PREFIX}00001`;
  }

  const num = parseDealCodeSuffix(maxExisting);
  if (num === null) {
    const now = Date.now().toString().slice(-5);
    return `${DEAL_CODE_PREFIX}${now}`;
  }

  const nextNum = num + 1;
  const padded = nextNum.toString().padStart(5, "0");
  return `${DEAL_CODE_PREFIX}${padded}`;
}

/**
 * Given an array of existing deal codes (e.g. from DB), returns the next unique code.
 * Uses the maximum numeric suffix so ordering is correct (DL-00010 > DL-00009).
 */
export function nextDealCodeFromExisting(existingCodes: string[]): string {
  if (existingCodes.length === 0) {
    return `${DEAL_CODE_PREFIX}00001`;
  }

  let maxNum = 0;
  for (const code of existingCodes) {
    const n = parseDealCodeSuffix(code);
    if (n !== null && n > maxNum) maxNum = n;
  }

  const nextNum = maxNum + 1;
  const padded = nextNum.toString().padStart(5, "0");
  return `${DEAL_CODE_PREFIX}${padded}`;
}

