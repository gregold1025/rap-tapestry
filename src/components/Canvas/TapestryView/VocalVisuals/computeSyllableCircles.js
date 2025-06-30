// src/components/Canvas/TapestryView/VocalVisuals/computeSyllableCircles.js

// import vowelColors from "../../../../constants/vowelColors";
import { extractVowels } from "../../../../utils/extractVowels";

export function computeSyllableCircles({
  lines,
  timeToX,
  secondsPerRow,
  rowHeight,
  vowelColors,
}) {
  const syllables = [];

  lines.forEach((line, lineIdx) => {
    if (!line.words) return;

    line.words.forEach((word, wordIdx) => {
      if (word.start == null || word.end == null) return;

      const syllableCount = word.nSyllables || 1;
      const wordDuration = word.end - word.start;
      const vowels = extractVowels(word.phones?.[0]);
      const centroids = word.centroid ?? [];
      const centroidSpacing = centroids.length / syllableCount;

      for (let i = 0; i < syllableCount; i++) {
        const syllableTime = word.start + (wordDuration * i) / syllableCount;
        const vowel = vowels[i] ?? "AH";
        const colorHex = vowelColors[vowel] ?? "#ffffff";
        const color = parseInt(colorHex.replace("#", "0x"));

        const centroidIndex = Math.floor(i * centroidSpacing);
        const centroid = centroids[centroidIndex] ?? 0.5;
        const verticalOffset = (centroid * 0.5 - 0.5) * rowHeight;

        const x = timeToX(syllableTime);
        const y =
          rowHeight * Math.floor(syllableTime / secondsPerRow) +
          rowHeight * 0.5 +
          verticalOffset;

        const id = `${lineIdx}-${wordIdx}-${i}`;

        syllables.push({
          id,
          x,
          y,
          radius: 6,
          color,
          vowel,
        });
      }
    });
  });

  return syllables;
}
