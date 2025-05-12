// src/components/Canvas/hooks/useMousePosition.js
import { useEffect, useRef } from "react";

export function useMousePosition(targetRef) {
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const handleMove = (e) => {
      if (!targetRef.current) return;
      const rect = targetRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [targetRef]);

  console.log(mouseRef);

  return mouseRef;
}
