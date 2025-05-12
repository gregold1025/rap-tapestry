import { TapestryView } from "./TapestryView/TapestryView";
import { LyricsView } from "./LyricsView/LyricsView";
import { useAudioEngine } from "../AudioEngine/AudioContext";
import { usePlayheadClock } from "../AudioEngine/usePlayheadClock";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";

extend({ Container, Graphics, Text });

export function AppCanvas({ width, height }) {
  const { audioRef } = useAudioEngine(); // ✅ shared audioRef
  const playheadTime = usePlayheadClock(audioRef); // ✅ synced currentTime

  const tapestryWidth = width * 0.66;
  const lyricsWidth = width * 0.34;

  return (
    <pixiContainer>
      <TapestryView width={tapestryWidth} height={height} time={playheadTime} />
      <LyricsView
        x={tapestryWidth}
        width={lyricsWidth}
        height={height}
        time={playheadTime}
      />
    </pixiContainer>
  );
}
