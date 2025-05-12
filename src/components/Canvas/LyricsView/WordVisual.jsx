const lineHeight = 100;

export function WordVisual({ width, lines, time }) {
  return (
    <pixiContainer>
      {lines.map((line, idx) => {
        const currentStart = line.words?.[0]?.start ?? Infinity;
        const nextStart = lines[idx + 1]?.words?.[0]?.start ?? Infinity;

        const isCurrent = time >= currentStart && time < nextStart;

        const text = line.words?.map((w) => w.text).join(" ") ?? "";

        return (
          <pixiText
            key={idx}
            text={text}
            x={16}
            y={idx * lineHeight + 15}
            style={{
              fill: isCurrent ? "#ffffff" : "#666666",
              fontWeight: isCurrent ? "bold" : "normal",
              fontSize: 32,
              wordWrap: true,
              wordWrapWidth: width - 16,
            }}
          />
        );
      })}
    </pixiContainer>
  );
}
