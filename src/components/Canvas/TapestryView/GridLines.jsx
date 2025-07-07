import { computeLayout } from "./computeTapestryLayout";
import transcriptionData from "../../../assets/93Til/lyric-transcription.json";
import { paddingFactor } from "../../../constants/canvasPadding";

export function GridLines({ width, height }) {
  // Compute layout locally
  const {
    barsPerRow,
    beatsPerBar = 4,
    secondsPerRow,
    totalWidth,
  } = computeLayout({
    transcriptionData,
    width,
    height,
  });

  const draw = (g) => {
    g.clear();

    // use same paddingFactor mapping as Playhead for consistency
    const drawingWidth = totalWidth * paddingFactor;
    const totalBeats = barsPerRow * beatsPerBar;
    const beatSpacing = drawingWidth / totalBeats;

    for (let i = 0; i <= totalBeats; i++) {
      const x = i * beatSpacing;
      if (x > drawingWidth) break;

      if (i % beatsPerBar === 0) {
        g.setStrokeStyle({ width: 3, color: 0x00af00, alpha: 0.8 });
      } else {
        g.setStrokeStyle({ width: 1, color: 0x00fa00, alpha: 0.4 });
      }
      g.moveTo(x, 0);
      g.lineTo(x, height);
      g.stroke();
    }
  };

  return <pixiGraphics draw={draw} />;
}
