// computeLayout.js

export function computeLayout({
  transcriptionData,
  width,
  height,
  barsPerRow = 8,
  estimated_bpm = 103,
}) {
  // 1. Find max end time
  let maxEndTime = 0;

  transcriptionData.lines.forEach((line) => {
    if (!line.words) return;
    line.words.forEach((word) => {
      if (word.end > maxEndTime) {
        maxEndTime = word.end;
      }
    });
  });

  // 2. Time layout
  const secondsPerBar = (60 / estimated_bpm) * 4;
  const secondsPerRow = secondsPerBar * barsPerRow;

  // 3. Row layout
  const numberOfRows = Math.ceil(maxEndTime / secondsPerRow);
  const rowHeight = height / numberOfRows;
  const totalWidth = width;

  return {
    barsPerRow,
    estimated_bpm,
    secondsPerBar,
    secondsPerRow,
    numberOfRows,
    rowHeight,
    totalWidth,
    maxEndTime,
  };
}
