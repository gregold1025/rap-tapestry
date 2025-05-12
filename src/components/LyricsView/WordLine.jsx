// src/components/LyricsView/WordLine.jsx
import { WordBlock } from "./WordBlock";

export function WordLine({
  line,
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
        {line.words?.map((word, idx) => (
          <WordBlock
            key={idx}
            word={word}
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
