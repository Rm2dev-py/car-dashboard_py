import React, { useEffect, useRef, useState } from "react";
import { useWS } from "../WebSocketProvider";
import { useDragMode } from "../DragContext";

type Props = {
  className?: string;
  containerStyle?: React.CSSProperties; // ✅ renommé
  maxRPM?: number; // défaut: 6000
  displayMode?: "k" | "raw"; // défaut: "k"
  decimals?: number; // défaut: 0
  rounding?: "floor" | "round" | "ceil"; // défaut: "floor"
  color?: string; // défaut: "#fff"
  fontSize?: number | string; // défaut: 32
  fontWeight?: React.CSSProperties["fontWeight"]; // défaut: "bold"
  format?: (rpm: number, display: string) => React.ReactNode;
  showText?: boolean; // défaut: false
};

export default function RpmDyn({
  maxRPM = 6000,
  displayMode = "k",
  decimals = 0,
  rounding = "floor",
  color = "#FFFFFF",
  fontSize = 32,
  fontWeight = "bold",
  format,
  showText = false,
  className,
  containerStyle, // ✅
}: Props) {
  const wsData = useWS();
  const voltage = Number(wsData?.rpm_moteur ?? 0); // 0–3.3V
  const raw = Math.max(0, Math.min(maxRPM, (voltage / 3.3) * maxRPM));

  // valeur pour l'affichage numérique
  const valueForDisplay = displayMode === "k" ? raw / 1000 : raw;
  const applyRound = (v: number) =>
    rounding === "ceil" ? Math.ceil(v) : rounding === "round" ? Math.round(v) : Math.floor(v);
  const rounded = decimals > 0 ? valueForDisplay.toFixed(decimals) : String(applyRound(valueForDisplay));
  const displayText = rounded;

  // mapping valeur -> angle (entre -108° et +108°)
  const MIN_ANGLE = -108;
  const MAX_ANGLE = 108;
  const angle = MIN_ANGLE + (raw / maxRPM) * (MAX_ANGLE - MIN_ANGLE);

  // position drag
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    const saved = localStorage.getItem("rpm_dyn_position");
    return saved ? JSON.parse(saved) : { x: 600, y: 200 };
  });
  const { dragEnabled } = useDragMode();
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    dragging.current = true;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    offset.current = { x: clientX - position.x, y: clientY - position.y };
    // amorce du mouvement
    if ("nativeEvent" in e) {
      const ne = e.nativeEvent as unknown as MouseEvent | TouchEvent;
      handleMove(ne);
    }
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!dragging.current) return;
    const clientX = "touches" in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = "touches" in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
    const grid = 5;
    const snappedX = Math.round((clientX - offset.current.x) / grid) * grid;
    const snappedY = Math.round((clientY - offset.current.y) / grid) * grid;
    setPosition({ x: snappedX, y: snappedY });
  };

  const handleEnd = () => {
    dragging.current = false;
  };

  useEffect(() => {
    localStorage.setItem("rpm_dyn_position", JSON.stringify(position));
  }, [position]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
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
      className={className}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        zIndex: 30,
        cursor: dragEnabled ? "grab" : "default",
        touchAction: "none",
        textAlign: "center",
        ...(containerStyle || {}), // ✅ plus d'erreur TS
      }}
      onMouseDown={dragEnabled ? handleStart : undefined}
      onTouchStart={dragEnabled ? handleStart : undefined}
    >
      {/* SVG cadran + aiguille */}
      <svg width="470" height="470" viewBox="0 0 470 470" xmlns="http://www.w3.org/2000/svg">
        <circle cx="235" cy="235" r="15" fill="#FF0707" stroke="#500" strokeWidth="3" />
        <g transform={`rotate(${angle} 235 235)`}>
          <line x1="235" y1="235" x2="235" y2="40" stroke="#FF0707" strokeWidth="4" strokeLinecap="round" />
          <line x1="235" y1="235" x2="235" y2="260" stroke="#FF0707" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>

      {/* Texte numérique — commenté par défaut */}
      {/* 
      <div
        style={{
          color,
          fontSize,
          fontWeight,
          userSelect: "none",
          marginTop: -210,
        }}
      >
        {format ? format(raw, displayText) : displayText}
      </div>
      */}

      {/* Option d’activation sans décommenter */}
      {showText && (
        <div
          style={{
            color,
            fontSize,
            fontWeight,
            userSelect: "none",
            marginTop: -210,
          }}
        >
          {format ? format(raw, displayText) : displayText}
        </div>
      )}
    </div>
  );
}
