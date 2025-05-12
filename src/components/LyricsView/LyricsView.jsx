// src/components/LyricsView/LyricsView.jsx
import transcriptionData from "../../assets/93Til/lyric-transcription.json";
import { WordLine } from "./WordLine";
import { useHoverInfo } from "./hooks/useHoverInfo";
import { HoverDisplay } from "./HoverDisplay";

const nLines = 8;

export function LyricsView({ playheadTime, height }) {
  const { hoverData, setWordHover, setSyllableHover, clearHover } =
    useHoverInfo();
  const lines = transcriptionData.lines ?? [];

  let lastValidLineIndex = 0;

  const currentLineIndex = lines.findIndex((line, idx) => {
    const start = line.words?.[0]?.start ?? Infinity;
    const nextStart = lines[idx + 1]?.words?.[0]?.start ?? Infinity;
    return playheadTime >= start && playheadTime < nextStart;
  });

  if (currentLineIndex !== -1) {
    lastValidLineIndex = currentLineIndex;
  }

  const visibleLines = lines.slice(
    lastValidLineIndex,
    lastValidLineIndex + nLines
  );

  return (
    <div
      className="lyrics-container"
      style={{
        height,
        overflow: "hidden",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundColor: "white",
      }}
    >
      {visibleLines.map((line, idx) => (
        <WordLine
          key={idx}
          line={line}
          lineIdx={lastValidLineIndex + idx}
          playheadTime={playheadTime}
          isCurrent={idx === 0}
          hoverData={hoverData}
          onWordHover={setWordHover}
          onSyllableHover={setSyllableHover}
          onHoverEnd={clearHover}
        />
      ))}
      <HoverDisplay hoverData={hoverData} />
    </div>
  );
}
