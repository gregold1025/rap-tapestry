// File: src/components/Canvas/TapestryView/VocalVisuals/VocalVisuals.jsx

import React, { useRef, useState, useCallback } from "react";
import transcriptionData from "../../../../assets/93Til/lyric-transcription.json";
import { computeLayout } from "../computeTapestryLayout";
import { computeSyllableCircles } from "./computeSyllableCircles";
import { computeWordRectangles } from "./computeWordRectangles";
import { computeRhymingLines } from "./computeRhymingLines";
import * as PIXI from "pixi.js";

import { paddingFactor } from "../../../../constants/canvasPadding";
import { useSyllableSelection } from "../../../LyricsView/hooks/SyllableSelectionContext";
import { useParams } from "../../../ChannelStrips/ParamsContext";

export function VocalVisuals({ width, height, showSyllables = true }) {
  const [hovered, setHovered] = useState(null);
  const canvasRef = useRef();

  const { secondsPerRow, rowHeight, totalWidth } = computeLayout({
    transcriptionData,
    width,
    height,
  });

  const {
    showVocals,
    showWordRects,
    inactiveSyllableColor,
    evaluateEndRhymes,
  } = useParams();

  const { selectedIds, matchedIds, vowelColors, rhymingLines } =
    useSyllableSelection();

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

  const handlePointerMove = useCallback(
    (e) => {
      console.log("pointer move", e.data.global);
      const { x, y } = e.data.global;

      const hoveredSyllable = syllables.find((s) => {
        const dx = x - s.x;
        const dy = y - s.y;
        return dx * dx + dy * dy <= s.radius * s.radius;
      });

      setHovered(hoveredSyllable || null);
    },
    [syllables]
  );

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

    if (evaluateEndRhymes && showVocals) {
      rhymingLines.forEach(({ start, end }) => {
        const x1 = timeToX(start);
        const x2 = timeToX(end);
        const y = Math.floor(start / secondsPerRow) * rowHeight + rowHeight / 2;
        g.setStrokeStyle({ width: 10, color: 0x1100ff, alpha: 0.4 })
          .moveTo(x1, y)
          .lineTo(x2, y)
          .stroke();
      });
    }
  };

  return (
    <>
      <pixiGraphics
        draw={draw}
        ref={canvasRef}
        eventMode="static"
        hitArea={new PIXI.Rectangle(0, 0, width, height)}
        pointermove={handlePointerMove}
      />

      {hovered && (
        <div
          style={{
            position: "absolute",
            left: hovered.x + 10,
            top: hovered.y + 10,
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            padding: "6px 10px",
            fontSize: "0.75rem",
            borderRadius: "4px",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          <div>
            <strong>Word:</strong> {hovered.wordText}
          </div>
          <div>
            <strong>Vowel:</strong> {hovered.vowel}
          </div>
          <div>
            <strong>Line:</strong> {hovered.lineIndex}
          </div>
          <div>
            <strong>Syllable:</strong> #{hovered.syllableIndex}
          </div>
          <div>
            <strong>Time:</strong> {hovered.startTime.toFixed(2)}s
          </div>
        </div>
      )}
    </>
  );
}
