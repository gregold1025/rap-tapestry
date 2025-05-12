// Simple mapping for now: x = time * scale, y = fixed

const TIME_SCALE = 100; // pixels per second
const BASE_Y = 50; // fixed vertical position for now

export function renderLayout(startTime, endTime) {
  const x = startTime * TIME_SCALE;
  const width = (endTime - startTime) * TIME_SCALE;
  const height = 10; // fixed height for word rectangles

  return { x, y: BASE_Y, width, height };
}
