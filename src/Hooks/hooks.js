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

export const useKeyPress = (target, once = true) => {
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  function downHandler({ key }) {
    if (key === target) {
      setKeyPressed(true);
      if (once) {
        setKeyPressed(false);
      }
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }) => {
    if (key === target) {
      setKeyPressed(false);
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
};
