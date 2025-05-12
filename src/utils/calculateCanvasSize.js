// src/utils/calculateCanvasSize.js

const ASPECT_RATIO_WIDTH = 16;
const ASPECT_RATIO_HEIGHT = 10;

/**
 * Returns { width, height } for a canvas that fits inside the window
 * while maintaining a 16:10 aspect ratio and reserving space for controls.
 * @param {number} controlBarHeight - height in pixels reserved below the canvas
 */
export function calculateCanvasSize(controlBarHeight = 0) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight - controlBarHeight;

  const aspectRatio = ASPECT_RATIO_WIDTH / ASPECT_RATIO_HEIGHT;

  let width = windowWidth;
  let height = windowWidth / aspectRatio;

  if (height > windowHeight) {
    height = windowHeight;
    width = height * aspectRatio;
  }

  return { width, height };
}
