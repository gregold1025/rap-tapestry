import { useEffect, useState } from "react";
import { Application } from "@pixi/react";
import { AppCanvas } from "./components/Canvas/AppCanvas";
import { AudioControls } from "./components/AudioEngine/AudioControls";
import { AudioProvider } from "./components/AudioEngine/AudioContext"; // ✅ NEW

const ASPECT_RATIO_WIDTH = 16;
const ASPECT_RATIO_HEIGHT = 10;
const CONTROL_BAR_HEIGHT = 80; // Reserve height for controls

function calculateCanvasSize() {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight - CONTROL_BAR_HEIGHT;

  const aspectRatio = ASPECT_RATIO_WIDTH / ASPECT_RATIO_HEIGHT;

  let width = windowWidth;
  let height = windowWidth / aspectRatio;

  if (height > windowHeight) {
    // Height is limiting
    height = windowHeight;
    width = windowHeight * aspectRatio;
  }

  return { width, height };
}

export default function App() {
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize());

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize(calculateCanvasSize());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AudioProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Application
          width={canvasSize.width}
          height={canvasSize.height}
          options={{
            backgroundColor: 0xffffff,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
          }}
        >
          <AppCanvas width={canvasSize.width} height={canvasSize.height} />
        </Application>
        <AudioControls /> {/* ✅ remains same */}
      </div>
    </AudioProvider>
  );
}
