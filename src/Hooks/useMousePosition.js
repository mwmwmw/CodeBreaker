import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  Suspense
} from "react";

export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const { innerHeight, innerWidth } = window;
    const setFromEvent = e =>
      setPosition({
        x: e.clientX,
        y: e.clientY,
        cx: ((e.clientX - innerWidth * 0.5) / innerWidth) * 2,
        cy: ((e.clientY - innerHeight * 0.5) / innerHeight) * 2
      });
    window.addEventListener("mousemove", setFromEvent);
    return () => {
      window.removeEventListener("mousemove", setFromEvent);
    };
  }, []);
  return position;
};
