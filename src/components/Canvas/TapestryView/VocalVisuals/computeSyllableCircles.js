// src/components/Canvas/TapestryView/VocalVisuals/computeSyllableCircles.js

import vowelColors from "../../../../constants/vowelColors";

// Vowel set
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

function extractVowels(phoneStr) {
  return String(phoneStr ?? "")
    .split(" ")
    .map((p) => p.replace(/[0-9]/g, ""))
    .filter((p) => VOWELS.has(p));
}

export function computeSyllableCircles({
  lines,
  timeToX,
  secondsPerRow,
  rowHeight,
}) {
  const syllables = [];

  lines.forEach((line) => {
    if (!line.words) return;

    line.words.forEach((word) => {
      if (word.start == null || word.end == null) return;

      const syllableCount = word.nSyllables || 1;
      const wordDuration = word.end - word.start;
      const vowels = extractVowels(word.phones);
      const centroids = word.centroid ?? [];
      const centroidSpacing = centroids.length / syllableCount;

      for (let i = 0; i < syllableCount; i++) {
        const syllableTime = word.start + (wordDuration * i) / syllableCount;
        const vowel = vowels[i] ?? "AH";
        const colorHex = vowelColors[vowel] ?? "#cccccc";
        const color = parseInt(colorHex.replace("#", "0x"));

        const centroidIndex = Math.floor(i * centroidSpacing);
        const centroid = centroids[centroidIndex] ?? 0.5; // Default center
        const verticalOffset = (centroid * 0.5 - 0.5) * rowHeight;

        syllables.push({
          x: timeToX(syllableTime),
          y:
            rowHeight * Math.floor(syllableTime / secondsPerRow) +
            rowHeight * 0.5 +
            3 * verticalOffset,
          radius: 5,
          color,
        });
      }
    });
  });

  return syllables;
}
