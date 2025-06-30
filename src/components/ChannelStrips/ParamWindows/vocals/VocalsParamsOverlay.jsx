import React, { useState, useEffect } from "react";
import { useParams } from "../../ParamsContext";
import {
  MAX_WILDCARD_SKIPS,
  MINIMUM_MATCH_LENGTH,
} from "../../../../constants/matching";
import vowelColors from "../../../../constants/vowelColors";
import "./VocalsParamsOverlay.css";

export function VocalsParamsOverlay({ onClose }) {
  const {
    wildcardSkips,
    setWildcardSkips,
    minMatchLen,
    setMinMatchLen,
    vowelColors: contextVowelColors,
    setVowelColors,
  } = useParams();

  // Local state initialized from context
  const [wildcard, setWildcard] = useState(wildcardSkips);
  const [minMatch, setMinMatch] = useState(minMatchLen);
  const [colors, setColors] = useState(
    Object.keys(contextVowelColors).length > 0
      ? contextVowelColors
      : vowelColors
  );

  useEffect(() => {
    setWildcard(wildcardSkips);
  }, [wildcardSkips]);

  useEffect(() => {
    setMinMatch(minMatchLen);
  }, [minMatchLen]);

  useEffect(() => {
    setColors(contextVowelColors);
  }, [contextVowelColors]);

  const handleWildcardChange = (e) => {
    const val = Number(e.target.value);
    setWildcard(val);
    setWildcardSkips(val);
  };

  const handleMinMatchChange = (e) => {
    const val = Number(e.target.value);
    setMinMatch(val);
    setMinMatchLen(val);
  };

  const handleColorChange = (vowel, e) => {
    const newColors = { ...colors, [vowel]: e.target.value };
    setColors(newColors);
    setVowelColors(newColors);
  };

  return (
    <div className="vocals-params-overlay">
      <div className="vocals-params-window">
        <header>
          <h2>Vocal Stem Parameters</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </header>

        <section className="number-controls">
          <label>
            Max Wildcard Skips:
            <input
              type="number"
              min={0}
              max={3}
              value={wildcard}
              onChange={handleWildcardChange}
            />
          </label>
          <label>
            Min Match Length:
            <input
              type="number"
              min={0}
              max={3}
              value={minMatch}
              onChange={handleMinMatchChange}
            />
          </label>
        </section>

        <section className="color-palette">
          <h3>Vowel Colors</h3>
          <div className="palette-grid">
            {Object.entries(colors).map(([vowel, color]) => (
              <label key={vowel}>
                {vowel}
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(vowel, e)}
                />
              </label>
            ))}
          </div>
        </section>

        <footer>
          <button onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
}
