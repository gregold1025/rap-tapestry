// File: src/components/Canvas/TapestryView/VocalVisuals/computeRhymingLines.js

import transcriptionData from "../../../../assets/93Til/lyric-transcription.json";
import { extractVowels } from "../../../../utils/extractVowels";
import { useParams } from "../../../ChannelStrips/ParamsContext";

export function computeRhymingLines({ matchedIds }) {
  const lineMap = new Map();
  transcriptionData.lines.forEach((line, li) => {
    line.words?.forEach((w, wi) => {
      extractVowels(w.phones).forEach((_, si) => {
        const id = `${li}-${wi}-${si}`;
        lineMap.set(id, li);
      });
    });
  });

  const matchedLines = new Set();
  matchedIds.forEach((id) => {
    if (lineMap.has(id)) matchedLines.add(lineMap.get(id));
  });

  return [...matchedLines].map((li) => {
    const line = transcriptionData.lines[li];
    return {
      start: line.start,
      end: line.end,
      lineIndex: li,
    };
  });
}
