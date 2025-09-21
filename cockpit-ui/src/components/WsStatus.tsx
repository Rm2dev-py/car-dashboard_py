// src/components/WsStatus.tsx
import React from "react";
import { useWSAlive } from "../WebSocketProvider";

type Props = {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  onColor?: string;   // couleur quand WS est OK
  offColor?: string;  // couleur quand WS est DOWN
  title?: string;     // accessibilité
};

export default function WsStatus({
  width = 16,
  height = 16,
  className = "",
  style,
  onColor = "#22c55e",   // vert
  offColor = "#ef4444",  // rouge
  title = "Etat WebSocket",
}: Props) {
  const alive = useWSAlive(3000); // true si message reçu < 3s
  const fill = alive ? onColor : offColor;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{title}</title>
      {/* cercle simple comme voyant */}
      <circle cx="8" cy="8" r="7" fill={fill} stroke="black" strokeWidth="1" />
    </svg>
  );
}
