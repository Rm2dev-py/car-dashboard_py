// src/components/FeuxTemplate.tsx
// 💡 Composant générique template pour tout voyant SVG (drag + WebSocket)

import { useEffect, useState, useRef } from "react";
import { useWS } from "../WebSocketProvider";

export default function FeuxTemplate() {
  // 🧠 Change ici la variable liée au WebSocket (ex: voyant_pleinphare)
  const wsData = useWS();
  const isOn = wsData?.NOM_DU_VOYANT === 1 || wsData?.NOM_DU_VOYANT === true;

  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("nom_vue_svg_position");
    return saved ? JSON.parse(saved) : { x: 700, y: 100 }; // 📍 Position par défaut
  });

  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    offset.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging.current) return;
    const clientX = "touches" in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = "touches" in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    const grid = 20; // ⬛ Grille d'alignement
    const snappedX = Math.round((clientX - offset.current.x) / grid) * grid;
    const snappedY = Math.round((clientY - offset.current.y) / grid) * grid;
    setPosition({ x: snappedX, y: snappedY });
  };

  const handleEnd = () => {
    dragging.current = false;
  };

  useEffect(() => {
    localStorage.setItem("nom_vue_svg_position", JSON.stringify(position));
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
        zIndex: 20,
        cursor: "grab",
        touchAction: "none",
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      <svg
        width="50"
        height="28"
        viewBox="0 0 50 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_1144_909)">
          <path
            d="..." // ✏️ Chemin SVG à copier-coller
            fill={isOn ? "blue" : "#FFFFFF"} // 🎨 Change ici la couleur ON
          />
        </g>
        <defs>
          <filter id="filter0_d_1144_909" x="..." y="..." width="..." height="..." ... />
        </defs>
      </svg>
    </div>
  );
}
