// src/components/RailDivider.tsx
import React, { useId } from "react";

type Props = {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;

  /** Épaisseur du trait (px) */
  strokeWidth?: number;
  /** Opacité du trait (0–1) */
  opacity?: number;

  /** Couleurs du dégradé (ligne) */
  colorFrom?: string;
  colorTo?: string;

  /** Utiliser une couleur pleine au lieu du dégradé */
  solidColor?: string | null;
};

export default function RailDivider({
  width = 840,
  height = 48,
  className = "",
  style,
  strokeWidth = 2.16357,
  opacity = 1,
  colorFrom = "#242424",
  colorTo = "#181818",
  solidColor = null,
}: Props) {
  const gid = useId();

  const d =
    "M838.081 1.64301L613.596 44.5533C608.575 45.513 603.431 45.9961 598.319 45.9961C460.338 45.9961 379.605 45.9961 241.624 45.9961C236.513 45.9961 231.368 45.513 226.347 44.5533L1.86206 1.64296";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 840 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      preserveAspectRatio="xMidYMid meet"
      aria-label="rail-divider-static"
    >
      {!solidColor && (
        <defs>
          <linearGradient
            id={`grad-${gid}`}
            x1="419.972"
            y1="45.9961"
            x2="419.972"
            y2="1.64295"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={colorFrom} />
            <stop offset="1" stopColor={colorTo} />
          </linearGradient>
        </defs>
      )}

      <path
        d={d}
        stroke={solidColor ?? `url(#grad-${gid})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity={opacity}
      />
    </svg>
  );
}
