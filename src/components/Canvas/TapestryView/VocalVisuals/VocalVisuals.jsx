// File: src/components/Canvas/TapestryView/VocalVisuals/VocalVisuals.jsx

import React from "react";
import transcriptionData from "../../../../assets/93Til/lyric-transcription.json";
import { computeLayout } from "../computeTapestryLayout";
import { computeSyllableCircles } from "./computeSyllableCircles";
import { computeWordRectangles } from "./computeWordRectangles";
import { paddingFactor } from "../../../../constants/canvasPadding";
import { useSyllableSelection } from "../../../LyricsView/hooks/SyllableSelectionContext";
import { useParams } from "../../../ChannelStrips/ParamsContext";

export function VocalVisuals({ width, height, showSyllables = true }) {
  const { secondsPerRow, rowHeight, totalWidth } = computeLayout({
    transcriptionData,
    width,
    height,
  });
  const { showVocals, showWordRects, inactiveSyllableColor } = useParams();
  const { selectedIds, matchedIds, vowelColors } = useSyllableSelection();

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

  const syllables =
    showSyllables && showVocals
      ? computeSyllableCircles({
          lines: transcriptionData.lines,
          timeToX,
          rowHeight,
          secondsPerRow,
          vowelColors,
        })
      : [];

  const draw = (g) => {
    g.clear();
    if (showWordRects) {
      words.forEach((word) =>
        g
          .setStrokeStyle({ width: 1, color: 0x000000, alpha: 1 })
          .moveTo(word.x, word.y)
          .lineTo(word.x, word.y + word.height * 0.01)
          .moveTo(word.x, word.y)
          .lineTo(word.x + word.width, word.y)
          .moveTo(word.x + word.width, word.y)
          .lineTo(word.x + word.width, word.y + word.height * 0.99)
          .stroke()
      );
    }
    if (showSyllables && showVocals) {
      syllables.forEach((syl) => {
        const isSel = selectedIds.includes(syl.id);
        const isMatch = matchedIds.has(syl.id);
        const inactiveColorHex = parseInt(
          inactiveSyllableColor.replace("#", "0x"),
          16
        );
        const fill = isSel || isMatch ? syl.color : inactiveColorHex;

        g.fill(fill).circle(syl.x, syl.y, syl.radius);
      });
    }
  };

  return <pixiGraphics draw={draw} />;
}
