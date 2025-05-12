import { computeLayout } from "./computeTapestryLayout";
import transcriptionData from "../../../assets/93Til/lyric-transcription.json";
import paddingFactor from "../../../constants/canvasPadding";

export function Playhead({ width, height, time }) {
  // Pull consistent layout settings
  const { secondsPerRow, rowHeight, totalWidth } = computeLayout({
    transcriptionData,
    width,
    height,
  });

  const timeToX = (t) =>
    (t % secondsPerRow) * ((totalWidth * paddingFactor) / secondsPerRow);
  const currentX = timeToX(time);
  const currentRow = Math.floor(time / secondsPerRow);
  const currentY = currentRow * rowHeight;

  const draw = (g) => {
    g.clear();

    g.setStrokeStyle({ width: 2, color: 0xff0000, alpha: 1 });
    g.moveTo(currentX, currentY);
    g.lineTo(currentX, currentY + rowHeight);
    g.stroke();
  };

  return <pixiGraphics draw={draw} />;
}
