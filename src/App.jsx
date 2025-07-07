// File: src/App.jsx

import React, { useEffect, useState } from "react";
import { Application } from "@pixi/react";
import "./index.css";

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
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        {/* LEFT: tapestry */}
        <div
          style={{
            flex: "0 0 60%",
            padding: 5,
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
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
            flex: "0 0 40%",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* LyricsView: top 30% */}
          <div
            style={{
              flex: "0 0 30%",
              minHeight: "120px",
              overflow: "auto",
            }}
          >
            <LyricsView playheadTime={playheadTime} />
          </div>

          {/* AudioControls: fixed footer */}
          <div
            style={{
              flex: `0 0 ${FOOTER_HEIGHT}px`,
              overflow: "hidden",
            }}
          >
            <AudioControls playheadTime={playheadTime} />
          </div>

          {/* ChannelStripsPanel: fill remaining */}
          <div
            style={{
              flex: "1 1 0%",
              overflow: "auto",
            }}
          >
            <ChannelStripsPanel onSaveVocalsParams={handleSaveVocalsParams} />
          </div>
        </div>
      </div>
    </SyllableSelectionProvider>
  );
}
