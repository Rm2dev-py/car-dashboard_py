// src/components/RailDivider450.tsx
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

  /** Dégradé (ligne) */
  colorFrom?: string;
  colorTo?: string;

  /** Couleur pleine (si définie, remplace le dégradé) */
  solidColor?: string | null;
};

export default function RailDivider450({
  width = 450,
  height = 30,
  className = "",
  style,
  strokeWidth = 2.16357,
  opacity = 1,
  colorFrom = "#363636",
  colorTo = "#181818",
  solidColor = null,
}: Props) {
  const gid = useId();

  const d =
    "M1.2066 28.0461L116.792 3.33533C122.367 2.14338 128.052 1.54242 133.754 1.54242L315.436 1.54243C321.138 1.54243 326.823 2.14339 332.399 3.33534L447.984 28.0461";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 450 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      preserveAspectRatio="xMidYMid meet"
      aria-label="rail-divider-450-static"
    >
      {!solidColor && (
        <defs>
          <linearGradient
            id={`grad-${gid}`}
            x1="224.595"
            y1="1.54242"
            x2="224.595"
            y2="28.0461"
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
