// src/components/EllipseVit.tsx
import React from "react";

/**
 * Disque décoratif (vitesses) — composant pur/statique.
 * Positionné par <Draggable id="ellipse_vit" ...> via le layout JSON.
 */
type Props = {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function EllipseVit({
  width = 331,
  height = 331,
  className = "",
  style,
}: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 331 331"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Disque principal avec conic-gradient (via foreignObject) */}
      <g clipPath="url(#paint0_angular_1144_915_clip_path)" data-figma-skip-parse="true">
        <g transform="matrix(0.0640296 -0.0663347 0.0663347 0.0640296 165.328 165.077)">
          <foreignObject x="-2537.52" y="-2537.52" width="5075.03" height="5075.03">
            {/* ⬇️ Supprimer xmlns ici (provoquait l'erreur TS) */}
            <div
              style={{
                background:
                  "conic-gradient(from 90deg, rgba(36, 10, 73, 1) 0deg, rgba(0, 0, 0, 0) 360deg)",
                height: "100%",
                width: "100%",
                opacity: 1,
              }}
            />
          </foreignObject>
        </g>
      </g>

      {/* Cercle placeholder issu de l'export (optionnel) */}
      <circle cx="165.328" cy="165.077" r="164.94" />

      {/* Cercle radial (ancien 2e SVG), centré dans le grand disque */}
      <g filter="url(#filter0_i_1144_916)" transform="translate(72.256 72.255)">
        <circle cx="93.0721" cy="92.8217" r="92.4588" fill="url(#paint0_radial_1144_916)" />
      </g>

      <defs>
        {/* Clip pour le conic-gradient */}
        <clipPath id="paint0_angular_1144_915_clip_path">
          <circle cx="165.328" cy="165.077" r="164.94" />
        </clipPath>

        {/* Effet d'ombre interne du petit disque */}
        <filter
          id="filter0_i_1144_916"
          x="0.613281"
          y="0.362915"
          width="184.918"
          height="184.918"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="11.0131" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1144_916" />
        </filter>

        {/* Dégradé radial du petit disque */}
        <radialGradient
          id="paint0_radial_1144_916"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(93.3282 93.0778) rotate(-163.233) scale(92.78)"
        >
          <stop stopColor="#490A0A" />
          <stop offset="1" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
