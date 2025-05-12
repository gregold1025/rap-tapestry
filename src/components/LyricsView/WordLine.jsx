// src/components/LyricsView/WordLine.jsx
import { WordBlock } from "./WordBlock";

export function WordLine({
  line,
  lineIdx,
  playheadTime,
  isCurrent,
  hoverData,
  onWordHover,
  onSyllableHover,
  onHoverEnd,
}) {
  return (
    <div
      className="line"
      style={{
        paddingBottom: 6,
        borderBottom: "1px dashed #ccc",
        fontWeight: isCurrent ? "bold" : "normal",
      }}
    >
      <div
        className="words-container"
        style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}
      >
        {line.words?.map((word, wordIdx) => (
          <WordBlock
            key={wordIdx}
            word={word}
            lineIdx={lineIdx}
            wordIdx={wordIdx}
            playheadTime={playheadTime}
            hoverData={hoverData}
            onWordHover={onWordHover}
            onSyllableHover={onSyllableHover}
            onHoverEnd={onHoverEnd}
          />
        ))}
      </div>
    </div>
  );
}
