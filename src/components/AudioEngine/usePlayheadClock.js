import { useEffect, useState } from "react";

/**
 * Returns the currentTime from an audioRef, updated smoothly via requestAnimationFrame.
 */
export function usePlayheadClock(audioRef) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frameId;

    const update = () => {
      if (audioRef.current) {
        setTime(audioRef.current.currentTime);
      }
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [audioRef]);

  return time;
}
