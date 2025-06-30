import React, { useEffect, useState } from "react";
import { parseMidiFile } from "../../../../utils/midiToVisualEvents.js";
import { computeLayout } from "../computeTapestryLayout";
import { computeBassRectangles } from "./computeBassRectangles";
import { paddingFactor } from "../../../../constants/canvasPadding";
import { useParams } from "../../../ChannelStrips/ParamsContext";

export function BassVisuals({ width, height }) {
  const [noteRects, setNoteRects] = useState([]);
  const [meta, setMeta] = useState({ ticksPerBeat: 480 });

  const { showBass, bassParams } = useParams();

  useEffect(() => {
    async function loadMidi() {
      const filePath = new URL(
        "../../../../assets/93Til/midi/93Til_Bass_Logic.mid",
        import.meta.url
      ).pathname;
      const { notes, ticksPerBeat } = await parseMidiFile(filePath);
      setNoteRects(notes);
      setMeta({ ticksPerBeat });
    }
    loadMidi();
  }, []);

  const adaptedTranscriptionData = {
    lines: [
      {
        words: noteRects.map((note) => ({
          start: note.startSeconds,
          end: note.startSeconds + note.durationSeconds,
        })),
      },
    ],
  };

  const { secondsPerRow, rowHeight, totalWidth } = computeLayout({
    transcriptionData: adaptedTranscriptionData,
    width,
    height,
  });

  const timeToX = (t) =>
    (t % secondsPerRow) * ((totalWidth * paddingFactor) / secondsPerRow);

  const rectangles = computeBassRectangles({
    notes: noteRects.map((n) => ({ ...n, ticksPerBeat: meta.ticksPerBeat })),
    timeToX,
    rowHeight,
    secondsPerRow,
  });

  const draw = (g) => {
    g.clear();
    if (!showBass) return;

    const { rectHeight, fillColor, opacity } = bassParams;
    const colorHex = parseInt(fillColor.replace("#", "0x"), 16);

    rectangles.forEach((rect) => {
      g.fill(colorHex, opacity)
        .rect(rect.x, rect.y, rect.width, rectHeight)
        .fill();
    });
  };

  return <pixiGraphics draw={draw} />;
}
