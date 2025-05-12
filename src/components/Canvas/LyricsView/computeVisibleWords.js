import { useRef } from "react";
import transcriptionData from "../../../assets/93Til/lyric-transcription.json";

const lines = transcriptionData.lines ?? [];

export function useComputeVisibleWords(time, nLines) {
  const lastValidLineIndex = useRef(0);

  const currentIndex = lines.findIndex((line) => {
    const start = line.words?.[0]?.start;
    const end = line.words?.at(-1)?.end;
    return start != null && end != null && time >= start && time < end;
  });

  if (currentIndex !== -1) {
    lastValidLineIndex.current = currentIndex;
  }

  return lines.slice(
    lastValidLineIndex.current,
    lastValidLineIndex.current + nLines
  );
}
