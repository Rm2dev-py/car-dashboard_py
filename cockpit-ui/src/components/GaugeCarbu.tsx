// src/components/GaugeCarbu.tsx

import { useEffect, useRef, useState } from "react";
import { useDragMode } from "../DragContext";
import { useWS } from "../WebSocketProvider";

export default function GaugeCarbu() {
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("gauge_carbu_position");
    return saved ? JSON.parse(saved) : { x: 400, y: 200 };
  });
  const { dragEnabled } = useDragMode();
  const wsData = useWS();

  const voltage = wsData?.niveau_carbu ?? 0; // 0–3.3V
  const percentage = Math.floor((voltage / 3.3) * 100); // 0–100%

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
    localStorage.setItem("gauge_carbu_position", JSON.stringify(position));
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

  // === PARAMETRE DE DIRECTION (🧭 sens du remplissage SVG) ===
  // Si "true", remplissage dans le sens horaire (gauche → droite)
  // Si "false", sens antihoraire (droite → gauche)
  const sensHoraire = true;

  const dashLength = 350; // longueur approx du chemin visible à 100%
  const dashOffset = sensHoraire
    ? (dashLength * (100 - percentage)) / 100
    : (dashLength * percentage) / 100;

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
        userSelect: "none",
      }}
      onMouseDown={dragEnabled ? handleStart : undefined}
      onTouchStart={dragEnabled ? handleStart : undefined}
    >
      <svg
        width="296"
        height="65"
        viewBox="0 0 296 71"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        transform="scale(-1, 1)" // ⬅️ symétrie horizontale
      >
        <defs>
          {/* Dégradé dynamique de rouge (0%) à vert (100%) */}
          <linearGradient id="carbuGradient" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
            <stop offset="0%" stopColor="red" />
            <stop offset="10%" stopColor="red" />
            <stop offset="25%" stopColor="yellow" />
            <stop offset="100%" stopColor="limegreen" />
          </linearGradient>
        </defs>

        {/* Fond neutre gris */}
        <path
          d="M290.361 5.36102C242.122 54.841 175.481 73.9407 113.035 62.6602C73.7762 55.5682 36.1755 36.4685 5.84824 5.36102"
          stroke="#333"
          strokeWidth="10.3191"
          strokeLinecap="round"
        />

        {/* Barre dynamique avec progression colorée */}
        <path
          d="M290.361 5.36102C242.122 54.841 175.481 73.9407 113.035 62.6602C73.7762 55.5682 36.1755 36.4685 5.84824 5.36102"
          stroke="url(#carbuGradient)"
          strokeWidth="10.3191"
          strokeLinecap="round"
          strokeDasharray={dashLength}
          strokeDashoffset={dashOffset}
        />
      </svg>

      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "white",
        fontSize: "20px",
        fontWeight: "bold",
      }}>
        {percentage}%
      </div>
    </div>
  );
}
