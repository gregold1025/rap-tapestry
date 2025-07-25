// File: src/components/LyricsView/WordBlock.jsx

import React from "react";
import { extractVowels } from "../../utils/extractVowels";
import { useSyllableSelection } from "./hooks/SyllableSelectionContext";

export function WordBlock({
  word,
  lineIdx,
  wordIdx,
  playheadTime,
  hoverData,
  onWordHover,
  onSyllableHover,
  onHoverEnd,
}) {
  const vowels = extractVowels(word.phones?.[0]);
  const nSyllables = word.nSyllables ?? 1;
  const isCurrent = playheadTime >= word.start && playheadTime < word.end;
  const { selectedIds, matchedIds, handleSyllableClick, vowelColors } =
    useSyllableSelection();

  const isHovered = hoverData?.type === "word" && hoverData.text === word.text;

  return (
    <div className="word-wrapper">
      <div className="syllable-row">
        {Array.from({ length: nSyllables }).map((_, i) => {
          const id = `${lineIdx}-${wordIdx}-${i}`;
          const vowel = vowels[i] ?? "AH";
          const color = vowelColors[vowel] ?? "#cccccc";

          const isSelected = selectedIds.includes(id);
          const isMatch = matchedIds.has(id);

          return (
            <div
              key={i}
              className="lyrics-syllable-circle"
              style={{
                backgroundColor: isSelected || isMatch ? color : "#cccccc",
                border: isSelected ? "2px solid red" : "none",
                cursor: "pointer",
              }}
              onClick={() => handleSyllableClick(id, vowel)}
              onMouseEnter={() =>
                onSyllableHover?.({
                  vowel,
                  syllableIndex: i,
                  totalSyllables: nSyllables,
                  phones: word.phones?.join(" ") || "",
                })
              }
              onMouseLeave={onHoverEnd}
            />
          );
        })}
      </div>
      <span
        className="word"
        onMouseEnter={() => onWordHover?.(word)}
        onMouseLeave={onHoverEnd}
        style={{
          fontSize: 30,
          backgroundColor: isHovered ? "yellow" : "transparent",
        }}
      >
        {word.text}
      </span>
    </div>
  );
}
