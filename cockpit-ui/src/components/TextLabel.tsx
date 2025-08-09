import { useEffect, useRef, useState } from "react";

export default function TextLabel() {
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("text_label_position");
    return saved ? JSON.parse(saved) : { x: 100, y: 100 };
  });

  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const grid = 5;
  const ref = useRef<HTMLDivElement>(null);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    offset.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };

    dragging.current = true;
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging.current) return;
    const clientX = "touches" in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = "touches" in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

    const snappedX = Math.round((clientX - offset.current.x) / grid) * grid;
    const snappedY = Math.round((clientY - offset.current.y) / grid) * grid;
    setPosition({ x: snappedX, y: snappedY });
  };

  const handleEnd = () => {
    dragging.current = false;
  };

  useEffect(() => {
    localStorage.setItem("text_label_position", JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        zIndex: 50,
        cursor: "grab",
        touchAction: "none",
        color: "white",
        fontSize: "18px",
        fontWeight: "bold",
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
         x  1000  tr/min 
    </div>
  );
}
