import { useComputeVisibleWords } from "./computeVisibleWords";
import { WordVisual } from "./WordVisual";

const nLines = 3;

export function LyricsView({ x = 0, width, height, time }) {
  function BackgroundLayer({ width, height }) {
    const draw = (g) => {
      g.clear();
      g.fill(0xffffff).rect(0, 0, width, height).fill(); // Solid white background
    };
  }
  const visibleLines = useComputeVisibleWords(time, nLines);

  return (
    <pixiContainer x={x} y={0}>
      {/* Background first */}
      <BackgroundLayer width={width} height={height} />

      <WordVisual width={width} lines={visibleLines} time={time} />
    </pixiContainer>
  );
}
