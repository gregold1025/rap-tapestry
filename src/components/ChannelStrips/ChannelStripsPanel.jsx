// File: src/components/ChannelStrips/ChannelStripsPanel.jsx

import React, { useState } from "react";
import { useAudioEngine } from "../AudioEngine/AudioContext";
import { useParams } from "../../contexts/ParamsContext";
import { ChannelStrip } from "./ChannelStrip";
import { VocalsParamsOverlay } from "./ParamWindows/vocals/VocalsParamsOverlay";
import "./ChannelStrip.css";

export function ChannelStripsPanel({ onEditClick }) {
  const { audioRefs } = useAudioEngine();
  const {
    wildcardSkips,
    minMatchLen,
    vowelColors,
    setWildcardSkips,
    setMinMatchLen,
    setVowelColors,
  } = useParams();

  const [showVisual, setShowVisual] = useState({
    vocals: true,
    bass: true,
    drums: true,
    other: true,
  });

  // which stem’s params window is open
  const [editingStem, setEditingStem] = useState(null);

  const handleMute = (stemKey, isMuted) =>
    (audioRefs.current[stemKey].muted = isMuted);
  const handleVisual = (stemKey, visible) =>
    setShowVisual((v) => ({ ...v, [stemKey]: visible }));
  const handleEdit = (stemKey) => {
    setEditingStem(stemKey);
    onEditClick?.(stemKey);
  };

  const handleCloseOverlay = () => setEditingStem(null);

  const handleSaveParams = ({ wildcard, minMatch, colors }) => {
    setWildcardSkips(wildcard);
    setMinMatchLen(minMatch);
    setVowelColors(colors);
    setEditingStem(null);
  };

  return (
    <div className="channel-strips-panel">
      {["vocals", "bass", "drums", "other"].map((stem) => (
        <ChannelStrip
          key={stem}
          stemKey={stem}
          audio={audioRefs.current[stem]}
          initialVisible={showVisual[stem]}
          onMuteToggle={handleMute}
          onVisualToggle={handleVisual}
          onEditClick={handleEdit}
        />
      ))}

      {editingStem === "vocals" && (
        <VocalsParamsOverlay
          initialWildcard={wildcardSkips}
          initialMinMatch={minMatchLen}
          initialColors={vowelColors}
          onSave={handleSaveParams}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  );
}
