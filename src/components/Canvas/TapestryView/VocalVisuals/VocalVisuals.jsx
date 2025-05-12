// File: src/components/Canvas/TapestryView/VocalVisuals/VocalVisuals.jsx

import transcriptionData from "../../../../assets/93Til/lyric-transcription.json";
import { computeLayout } from "../computeTapestryLayout";
import { computeSyllableCircles } from "./computeSyllableCircles";
import { computeWordRectangles } from "./computeWordRectangles";
import paddingFactor from "../../../../constants/canvasPadding";

export function VocalVisuals({
  width,
  height,
  showSyllables = true,
  showWordRects = true,
}) {
  const { secondsPerRow, rowHeight, totalWidth } = computeLayout({
    transcriptionData,
    width,
    height,
  });

  const timeToX = (t) =>
    (t % secondsPerRow) * ((totalWidth * paddingFactor) / secondsPerRow);

  const words = showWordRects
    ? computeWordRectangles({
        lines: transcriptionData.lines,
        timeToX,
        rowHeight,
        secondsPerRow,
      })
    : [];

  const syllables = showSyllables
    ? computeSyllableCircles({
        lines: transcriptionData.lines,
        timeToX,
        rowHeight,
        secondsPerRow,
      })
    : [];

  const draw = (g) => {
    g.clear();

    if (showWordRects) {
      words.forEach((word) => {
        g.setStrokeStyle({ width: 1, color: 0x000000, alpha: 1 });
        g.moveTo(word.x, word.y)
          .lineTo(word.x, word.y + word.height * 0.01)
          .moveTo(word.x, word.y)
          .lineTo(word.x + word.width, word.y)
          .moveTo(word.x + word.width, word.y)
          .lineTo(word.x + word.width, word.y + word.height * 0.99)
          .stroke();
      });
    }

    if (showSyllables) {
      syllables.forEach((syl) => {
        g.fill(syl.color).circle(syl.x, syl.y, syl.radius).fill();
      });
    }
  };

  return <pixiGraphics draw={draw} />;
}
