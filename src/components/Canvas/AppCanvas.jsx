import { TapestryView } from "./TapestryView/TapestryView";

export function AppCanvas({ width, height, playheadTime }) {
  return (
    <pixiContainer eventMode="static">
      <TapestryView width={width} height={height} time={playheadTime} />
    </pixiContainer>
  );
}
