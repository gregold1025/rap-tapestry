// src/components/AudioEngine/PlayPauseButton.jsx
export function PlayPauseButton({ isPlaying, onClick }) {
  return <button onClick={onClick}>{isPlaying ? "Pause" : "Play"}</button>;
}
