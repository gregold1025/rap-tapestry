import { createContext, useContext, useState, useMemo } from "react";
import transcriptionData from "../../../assets/93Til/lyric-transcription.json";
import { extractVowels } from "../../../utils/extractVowels";
import { useParams } from "../../ChannelStrips/ParamsContext";

// HELPERS
function matchSyllablePatterns(selectedVowels, wildcardSkips, minMatchLen) {
  if (selectedVowels.length < minMatchLen) return new Set();
  const flat = [];
  transcriptionData.lines.forEach((line, li) =>
    line.words?.forEach((w, wi) => {
      extractVowels(w.phones).forEach((v, si) =>
        flat.push({ id: `${li}-${wi}-${si}`, vowel: v })
      );
    })
  );

  const subsets = [];
  for (let s = 0; s < selectedVowels.length; s++) {
    for (let e = s + minMatchLen; e <= selectedVowels.length; e++) {
      subsets.push(selectedVowels.slice(s, e));
    }
  }

  const matches = new Set();
  subsets.forEach((pattern) => {
    for (let i = 0; i < flat.length; i++) {
      let pi = 0,
        wc = 0,
        ids = [];
      for (let j = i; j < flat.length && pi < pattern.length; j++) {
        if (flat[j].vowel === pattern[pi]) {
          ids.push(flat[j].id);
          pi++;
        } else {
          wc++;
          if (wc > wildcardSkips) break;
        }
      }
      if (pi === pattern.length) ids.forEach((id) => matches.add(id));
    }
  });

  return matches;
}

export function evaluateEndRhymesFromLine(selectedId) {
  if (!selectedId) return [];

  const [targetLineIndex] = selectedId.split("-").map(Number);
  const targetLine = transcriptionData.lines[targetLineIndex];
  if (!targetLine || !targetLine.words?.length) return [];

  // --- Get all final vowels from the selected line ---
  const targetFinalVowels = getLastWordFinalVowels(targetLine);

  if (targetFinalVowels.length === 0) return [];

  const rhymingLines = [];

  transcriptionData.lines.forEach((line, li) => {
    if (!line.words?.length || li === targetLineIndex) return;

    const finalVowels = getLastWordFinalVowels(line);

    const hasMatch = finalVowels.some((v) => targetFinalVowels.includes(v));
    if (hasMatch) {
      rhymingLines.push({
        lineIndex: li,
        start: line.start,
        end: line.end,
      });
    }
  });

  return rhymingLines;
}

// --- Helper: extract final vowel(s) from last word's phones entries ---
function getLastWordFinalVowels(line) {
  const finalWord = line.words[line.words.length - 1];
  if (!finalWord?.phones) return [];

  const phonesList = Array.isArray(finalWord.phones)
    ? finalWord.phones
    : [finalWord.phones];

  const finalVowels = [];

  for (const phones of phonesList) {
    const vowels = extractVowels(phones);
    if (vowels.length > 0) {
      finalVowels.push(vowels[vowels.length - 1]); // last syllable vowel
    }
  }

  return finalVowels;
}

// CONTEXT
const SyllableSelectionContext = createContext();

export function SyllableSelectionProvider({ children }) {
  const [clicks, setClicks] = useState([]);
  const { wildcardSkips, minMatchLen, vowelColors, evaluateEndRhymes } =
    useParams();

  const handleSyllableClick = (id, vowel) =>
    setClicks((prev) => [...prev, { id, vowel }].slice(-2));

  const selectedIds = useMemo(() => clicks.map((c) => c.id), [clicks]);

  const selectedVowels = useMemo(() => {
    if (clicks.length < 2) return [];
    const flat = [];
    transcriptionData.lines.forEach((line, li) =>
      line.words?.forEach((w, wi) => {
        extractVowels(w.phones).forEach((v, si) =>
          flat.push({ id: `${li}-${wi}-${si}`, vowel: v })
        );
      })
    );
    const start = flat.findIndex((s) => s.id === clicks[0].id);
    const end = flat.findIndex((s) => s.id === clicks[1].id);
    if (start < 0 || end < 0) return [];
    const [a, b] = start < end ? [start, end] : [end, start];
    return flat.slice(a, b + 1).map((s) => s.vowel);
  }, [clicks]);

  const matchedIds = useMemo(
    () => matchSyllablePatterns(selectedVowels, wildcardSkips, minMatchLen),
    [selectedVowels, wildcardSkips, minMatchLen]
  );

  const rhymingLines = useMemo(() => {
    if (!evaluateEndRhymes || clicks.length === 0) return [];
    return evaluateEndRhymesFromLine(clicks[0].id);
  }, [evaluateEndRhymes, clicks]);

  return (
    <SyllableSelectionContext.Provider
      value={{
        selectedIds,
        selectedVowels,
        matchedIds,
        rhymingLines,
        handleSyllableClick,
        vowelColors,
      }}
    >
      {children}
    </SyllableSelectionContext.Provider>
  );
}

export function useSyllableSelection() {
  return useContext(SyllableSelectionContext);
}
