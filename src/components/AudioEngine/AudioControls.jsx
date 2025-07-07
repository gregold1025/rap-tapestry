// File: src/components/AudioEngine/AudioControls.jsx

import React, { useState, useEffect } from "react";
import { useAudioEngine } from "./AudioContext";
import { PlayPauseButton } from "./UIElements/PlayPauseButton";
import { StopButton } from "./UIElements/StopButton";
import { ScrubSlider } from "./UIElements/ScrubSlider";

export function AudioControls({ onTimeUpdate }) {
  const {
    audioRefs,
    isPlaying,
    duration,
    playAll,
    pauseAll,
    stopAll,
    seekAll,
  } = useAudioEngine();

  // local state so slider re-renders with current time
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let rafId;
    const update = () => {
      const t = audioRefs.current.vocals.currentTime;
      setCurrentTime(t);
      onTimeUpdate?.(t);
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [audioRefs, onTimeUpdate]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px",
      }}
    >
      <PlayPauseButton
        isPlaying={isPlaying}
        onClick={() => (isPlaying ? pauseAll() : playAll())}
      />
      <StopButton onClick={stopAll} />

      {/* make slider twice as long */}
      <ScrubSlider
        value={currentTime}
        max={duration}
        onChange={seekAll}
        style={{ flex: 1, margin: "0 8px" }}
      />
    </div>
  );
}
