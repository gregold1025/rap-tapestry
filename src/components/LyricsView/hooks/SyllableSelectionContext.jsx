// File: src/components/LyricsView/hooks/SyllableSelectionContext.js

import { createContext, useContext, useState, useMemo } from "react";
import transcriptionData from "../../../assets/93Til/lyric-transcription.json";
import { extractVowels } from "../../../utils/extractVowels";
import { useParams } from "../../../contexts/ParamsContext";

const SyllableSelectionContext = createContext();

export function SyllableSelectionProvider({ children }) {
  const [clicks, setClicks] = useState([]);
  const { wildcardSkips, minMatchLen, vowelColors } = useParams(); // grab all matching params and palette

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

  const matchedIds = useMemo(() => {
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
  }, [selectedVowels, wildcardSkips, minMatchLen]);

  return (
    <SyllableSelectionContext.Provider
      value={{
        selectedIds,
        selectedVowels,
        matchedIds,
        handleSyllableClick,
        vowelColors, // directly from ParamsContext
      }}
    >
      {children}
    </SyllableSelectionContext.Provider>
  );
}

export function useSyllableSelection() {
  return useContext(SyllableSelectionContext);
}
