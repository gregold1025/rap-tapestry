// src/components/Canvas/TapestryView/VocalVisuals/computeWordRectangles.js

export function computeWordRectangles({
  lines,
  timeToX,
  secondsPerRow,
  rowHeight,
}) {
  const words = [];

  lines.forEach((line) => {
    if (!line.words) return;

    line.words.forEach((word) => {
      if (word.start == null || word.end == null) return;

      const wordY = rowHeight * Math.floor(word.start / secondsPerRow);

      words.push({
        x: timeToX(word.start),
        y: wordY + rowHeight * 0,
        width: timeToX(word.end) - timeToX(word.start),
        height: rowHeight * 0.1,
      });
    });
  });

  return words;
}
