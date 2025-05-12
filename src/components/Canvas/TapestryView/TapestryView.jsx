import { Playhead } from "./Playhead";
import { VocalVisuals } from "./VocalVisuals/VocalVisuals";

function BackgroundLayer({ width, height }) {
  const draw = (g) => {
    g.clear();
    g.fill(0xffffff).rect(0, 0, width, height).fill();
  };
  return <pixiGraphics draw={draw} />;
}

export function TapestryView({ width, height, time }) {
  return (
    <pixiContainer>
      <BackgroundLayer width={width} height={height} />
      <VocalVisuals width={width} height={height} />
      <Playhead width={width} height={height} time={time} />
    </pixiContainer>
  );
}
