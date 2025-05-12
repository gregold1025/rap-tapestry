// src/components/LyricsView/hooks/SyllableSelectionContext.js
import { createContext, useContext, useState, useMemo } from "react";
import transcriptionData from "../../../assets/93Til/lyric-transcription.json";
import { extractVowels } from "../../../utils/extractVowels";
import {
  MAX_WILDCARD_SKIPS,
  MINIMUM_MATCH_LENGTH,
} from "../../../constants/matching";

const SyllableSelectionContext = createContext();

export function SyllableSelectionProvider({ children }) {
  const [clicks, setClicks] = useState([]);

  function handleSyllableClick(id, vowel) {
    setClicks((prev) => {
      const updated = [...prev, { id, vowel }];
      return updated.slice(-2); // Only keep last 2
    });
  }

  // Compute selection info
  const selectedIds = useMemo(() => clicks.map((c) => c.id), [clicks]);
  const selectedVowels = useMemo(() => {
    if (clicks.length < 2) return [];

    const flatSyllables = [];

    transcriptionData.lines.forEach((line, lineIdx) => {
      line.words?.forEach((word, wordIdx) => {
        const vowels = extractVowels(word.phones);
        vowels.forEach((vowel, sylIdx) => {
          flatSyllables.push({
            id: `${lineIdx}-${wordIdx}-${sylIdx}`,
            vowel,
          });
        });
      });
    });

    const startIndex = flatSyllables.findIndex((s) => s.id === clicks[0].id);
    const endIndex = flatSyllables.findIndex((s) => s.id === clicks[1].id);

    if (startIndex === -1 || endIndex === -1) return [];

    const [from, to] =
      startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];

    return flatSyllables.slice(from, to + 1).map((s) => s.vowel);
  }, [clicks]);

  const matchedIds = useMemo(() => {
    if (selectedVowels.length < 2) return new Set();

    const flatSyllables = [];

    transcriptionData.lines.forEach((line, lineIdx) => {
      line.words?.forEach((word, wordIdx) => {
        const vowels = extractVowels(word.phones?.[0]);
        vowels.forEach((vowel, sylIdx) => {
          flatSyllables.push({
            id: `${lineIdx}-${wordIdx}-${sylIdx}`,
            vowel,
          });
        });
      });
    });

    // Generate subsequences of length >= 2
    const subsets = [];
    for (let start = 0; start < selectedVowels.length; start++) {
      for (
        let end = start + MINIMUM_MATCH_LENGTH;
        end <= selectedVowels.length;
        end++
      ) {
        subsets.push(selectedVowels.slice(start, end));
      }
    }

    const matches = new Set();

    for (const pattern of subsets) {
      for (let i = 0; i < flatSyllables.length; i++) {
        let patternIdx = 0;
        let wildcardCount = 0;
        const matchIds = [];

        for (
          let j = i;
          j < flatSyllables.length && patternIdx < pattern.length;
          j++
        ) {
          const current = flatSyllables[j];
          if (current.vowel === pattern[patternIdx]) {
            matchIds.push(current.id);
            patternIdx++;
          } else {
            wildcardCount++;
            if (wildcardCount > MAX_WILDCARD_SKIPS) break;
          }
        }

        if (patternIdx === pattern.length) {
          matchIds.forEach((id) => matches.add(id));
        }
      }
    }

    return matches;
  }, [selectedVowels]);

  return (
    <SyllableSelectionContext.Provider
      value={{
        selectedIds,
        selectedVowels,
        matchedIds,
        handleSyllableClick,
      }}
    >
      {children}
    </SyllableSelectionContext.Provider>
  );
}

export function useSyllableSelection() {
  return useContext(SyllableSelectionContext);
}
