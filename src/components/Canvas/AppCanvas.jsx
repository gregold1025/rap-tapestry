import { TapestryView } from "./TapestryView/TapestryView";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";

extend({ Container, Graphics, Text });

export function AppCanvas({ width, height, playheadTime }) {
  return (
    <pixiContainer>
      <TapestryView width={width} height={height} time={playheadTime} />
    </pixiContainer>
  );
}
