import React, { useState } from "react";
import {
  MAX_WILDCARD_SKIPS,
  MINIMUM_MATCH_LENGTH,
} from "../../../../constants/matching";
import vowelColors from "../../../../constants/vowelColors";
import "./VocalsParamsOverlay.css";

export function VocalsParamsOverlay({
  initialWildcard = MAX_WILDCARD_SKIPS,
  initialMinMatch = MINIMUM_MATCH_LENGTH,
  initialColors = vowelColors,
  onSave,
  onClose,
}) {
  const [wildcard, setWildcard] = useState(initialWildcard);
  const [minMatch, setMinMatch] = useState(initialMinMatch);
  const [colors, setColors] = useState(
    Object.keys(initialColors).length > 0 ? initialColors : vowelColors
  );

  const handleColorChange = (vowel, ev) => {
    setColors((c) => ({ ...c, [vowel]: ev.target.value }));
  };

  const handleSave = () => {
    onSave({ wildcard, minMatch, colors });
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
              onChange={(e) => setWildcard(Number(e.target.value))}
            />
          </label>
          <label>
            Min Match Length:
            <input
              type="number"
              min={0}
              max={3}
              value={minMatch}
              onChange={(e) => setMinMatch(Number(e.target.value))}
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
          <button onClick={handleSave}>Save</button>
        </footer>
      </div>
    </div>
  );
}
