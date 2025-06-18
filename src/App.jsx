// File: src/App.jsx

import React, { useEffect, useState } from "react";
import { Application } from "@pixi/react";

// VISUAL CANVAS COMPONENTS
import { AppCanvas } from "./components/Canvas/AppCanvas";

// CHANNEL STRIPS
import { ChannelStripsPanel } from "./components/ChannelStrips/ChannelStripsPanel";

// AUDIO ENGINE
import { AudioControls } from "./components/AudioEngine/AudioControls";
import {
  AudioProvider,
  useAudioEngine,
} from "./components/AudioEngine/AudioContext";

// LYRICS VIEW
import { LyricsView } from "./components/LyricsView/LyricsView";
import { SyllableSelectionProvider } from "./components/LyricsView/hooks/SyllableSelectionContext";

// PARAMS CONTEXT (for future mutability)
import { ParamsProvider } from "./components/ChannelStrips/ParamsContext";

// UTILS
import { calculateCanvasSize } from "./utils/calculateCanvasSize";

const FOOTER_HEIGHT = 80;

export default function App() {
  return (
    <AudioProvider>
      <ParamsProvider>
        <AppWithAudio />
      </ParamsProvider>
    </AudioProvider>
  );
}

function AppWithAudio() {
  // 1) local params lifted for edit overlays
  const [vocalsParams, setVocalsParams] = useState({
    wildcardSkips: 1,
    minMatchLen: 2,
    vowelColors: {},
  });

  // 2) mosaic size minus footer
  const [canvasSize, setCanvasSize] = useState(
    calculateCanvasSize(FOOTER_HEIGHT)
  );
  useEffect(() => {
    const onResize = () => setCanvasSize(calculateCanvasSize(FOOTER_HEIGHT));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 3) audio refs & playhead polling
  const { audioRefs } = useAudioEngine();
  const [playheadTime, setPlayheadTime] = useState(0);
  useEffect(() => {
    let raf;
    const tick = () => {
      setPlayheadTime(audioRefs.current.vocals.currentTime);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [audioRefs]);

  // 4) layout fractions
  const { width, height } = canvasSize;
  const tapestryWidth = width * 0.6;
  const rightWidth = width * 0.4;

  // 5) save callback from ChannelStripsPanel
  const handleSaveVocalsParams = ({ wildcard, minMatch, colors }) => {
    setVocalsParams({
      wildcardSkips: wildcard,
      minMatchLen: minMatch,
      vowelColors: colors,
    });
  };

  // 6) render
  return (
    <SyllableSelectionProvider
      wildcardSkips={vocalsParams.wildcardSkips}
      minMatchLen={vocalsParams.minMatchLen}
      vowelColors={vocalsParams.vowelColors}
    >
      <div
        style={{ display: "flex", flexDirection: "column", height: "100vh" }}
      >
        {/* ── MOSAIC GRID ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", flex: 1 }}>
          {/* LEFT: tapestry */}
          <div style={{ width: tapestryWidth, padding: 5 }}>
            <Application
              width={tapestryWidth - 10}
              height={height}
              options={{ backgroundColor: 0xffffff, antialias: true }}
            >
              <AppCanvas
                width={tapestryWidth - 10}
                height={height}
                playheadTime={playheadTime}
                audioRefs={audioRefs}
              />
            </Application>
          </div>

          {/* RIGHT: lyrics + channels */}
          <div
            style={{
              width: rightWidth,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ flex: 1, overflow: "auto" }}>
              <LyricsView playheadTime={playheadTime} height={height * 0.5} />
            </div>
            <div style={{ flex: 1, overflow: "auto" }}>
              <ChannelStripsPanel onSaveVocalsParams={handleSaveVocalsParams} />
            </div>
          </div>
        </div>

        {/* ── FOOTER: global controls ─────────────────────────────────── */}
        <div style={{ height: FOOTER_HEIGHT }}>
          <AudioControls playheadTime={playheadTime} />
        </div>
      </div>
    </SyllableSelectionProvider>
  );
}
