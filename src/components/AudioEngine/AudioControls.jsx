// src/components/AudioEngine/AudioControls.jsx
import { useAudioEngine } from "./AudioContext";
import { PlayPauseButton } from "./UIElements/PlayPauseButton";
import { StopButton } from "./UIElements/StopButton";
import { ScrubSlider } from "./UIElements/ScrubSlider";
import { MuteButton } from "./UIElements/MuteButton";
import { useEffect } from "react";

export function AudioControls({ onTimeUpdate }) {
  const audio = useAudioEngine();

  // Notify parent (e.g., AppCanvas) when time updates
  useEffect(() => {
    onTimeUpdate?.(audio.currentTime);
  }, [audio.currentTime, onTimeUpdate]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "8px",
      }}
    >
      <PlayPauseButton isPlaying={audio.isPlaying} onClick={audio.togglePlay} />
      <StopButton onClick={audio.stop} />
      <ScrubSlider
        value={audio.currentTime}
        max={audio.duration}
        onChange={audio.seek}
      />
      <MuteButton isMuted={audio.isMuted} onClick={audio.toggleMute} />
    </div>
  );
}
