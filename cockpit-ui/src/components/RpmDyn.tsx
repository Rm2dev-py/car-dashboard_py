// src/components/RpmDyn.tsx
import { useEffect, useRef, useState } from "react";
import { useWS } from "../WebSocketProvider";

export default function RpmDyn() {
  const wsData = useWS();

  const voltage = wsData?.rpm_moteur ?? 0; // valeur entre 0 et 3.3V
  const rpm = Math.floor((voltage / 3.3) * 8000 / 1000); // conversion linéaire 0–3.3V → 0–8000 tr/min

  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("RpmDyn_position");
    return saved ? JSON.parse(saved) : { x: 500, y: 200 };
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
    localStorage.setItem("RpmDyn_position", JSON.stringify(position));
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
        zIndex: 30,
        cursor: "grab",
        touchAction: "none",
        fontSize: "32px",
        fontWeight: "bold",
        userSelect: "none",
        color: "white",
        textAlign: "center",
        width: "120px", // largeur fixe pour centrage
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      {rpm}
    </div>
  );
}
