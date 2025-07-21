const VOWELS = new Set([
  "AA",
  "AE",
  "AH",
  "AO",
  "AW",
  "AY",
  "EH",
  "ER",
  "EY",
  "IH",
  "IY",
  "OW",
  "OY",
  "UH",
  "UW",
]);

export function extractVowels(phoneData) {
  if (!phoneData) return [];

  // Always handle as array of string variants
  const variants = Array.isArray(phoneData) ? phoneData : [phoneData];

  const vowels = [];

  for (const variant of variants) {
    const variantVowels = String(variant)
      .split(" ")
      .map((p) => p.replace(/[0-9]/g, ""))
      .filter((p) => VOWELS.has(p));

    // Push each vowel individually (flatten)
    vowels.push(...variantVowels);
  }

  return vowels;
}
