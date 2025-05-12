import { useEffect, useState } from "react";
import { Application } from "@pixi/react";
import { AppCanvas } from "./components/Canvas/AppCanvas";
import { AudioControls } from "./components/AudioEngine/AudioControls";
import {
  AudioProvider,
  useAudioEngine,
} from "./components/AudioEngine/AudioContext";
import { usePlayheadClock } from "./components/AudioEngine/usePlayheadClock";
import { LyricsView } from "./components/LyricsView/LyricsView";
import { calculateCanvasSize } from "./utils/calculateCanvasSize";

const CONTROL_BAR_HEIGHT = 80;

function AppWithAudio() {
  const [canvasSize, setCanvasSize] = useState(
    calculateCanvasSize(CONTROL_BAR_HEIGHT)
  );

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize(calculateCanvasSize());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { audioRef } = useAudioEngine();
  const playheadTime = usePlayheadClock(audioRef); // ✅ synced

  const tapestryWidth = canvasSize.width * 0.66;
  const lyricsWidth = canvasSize.width * 0.34;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Tapestry + Lyrics row */}
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ width: tapestryWidth, padding: 5 }}>
          <Application
            width={tapestryWidth - 10}
            height={canvasSize.height}
            options={{
              backgroundColor: 0xffffff,
              antialias: true,
              resolution: window.devicePixelRatio || 1,
            }}
          >
            <AppCanvas
              width={tapestryWidth - 10}
              height={canvasSize.height}
              playheadTime={playheadTime}
              audioRef={audioRef}
            />
          </Application>
        </div>
        <div style={{ width: lyricsWidth }}>
          <LyricsView playheadTime={playheadTime} height={canvasSize.height} />
        </div>
      </div>

      <AudioControls />
    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <AppWithAudio />
    </AudioProvider>
  );
}
