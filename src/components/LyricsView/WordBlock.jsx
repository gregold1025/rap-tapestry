// src/components/LyricsView/WordBlock.jsx
import { extractVowels } from "../../utils/extractVowels";
import vowelColors from "../../constants/vowelColors";

export function WordBlock({
  word,
  playheadTime,
  hoverData,
  onWordHover,
  onSyllableHover,
  onHoverEnd,
}) {
  const vowels = extractVowels(word.phones);
  const nSyllables = word.nSyllables ?? 1;
  const isCurrent = playheadTime >= word.start && playheadTime < word.end;

  const isHovered = hoverData?.type === "word" && hoverData.text === word.text;

  return (
    <div className="word-wrapper">
      <div className="syllable-row">
        {Array.from({ length: nSyllables }).map((_, i) => {
          const vowel = vowels[i] ?? "AH";
          const color = vowelColors[vowel] ?? "#ccc";

          return (
            <div
              key={i}
              className="lyrics-syllable-circle"
              style={{ backgroundColor: color }}
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
          fontWeight: isCurrent ? "bold" : "normal",
          fontSize: 30,
          backgroundColor: isHovered ? "yellow" : "transparent",
        }}
      >
        {word.text}
      </span>
    </div>
  );
}
