// src/components/GaugeCarbu.tsx
import React from "react";
import { useWS } from "../WebSocketProvider";

type Props = {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  /** tension min/max pour le calcul du pourcentage */
  minV?: number;
  maxV?: number;
  /** sens du remplissage: true = gauche→droite (horaire), false = droite→gauche */
  sensHoraire?: boolean;
  /** afficher le pourcentage au centre */
  showPercent?: boolean;
  /** miroir horizontal du tracé (utile si ton asset est inversé dans le layout) */
  flipHorizontally?: boolean;
};

export default function GaugeCarbu({
  width = 296,
  height = 71,
  className = "",
  style,
  minV = 0,
  maxV = 3.3,
  sensHoraire = true,
  showPercent = true,
  flipHorizontally = true,
}: Props) {
  const wsData = useWS();
  const voltage = Number(wsData?.niveau_carbu ?? 0);

  // Clamp + pourcentage
  const clamped = Math.min(Math.max(voltage, minV), maxV);
  const pct = Math.round(((clamped - minV) / Math.max(1e-6, maxV - minV)) * 100);

  // dashOffset sur base pathLength=100 (plus robuste que "350" en dur)
  const dashOffset = sensHoraire ? 100 - pct : pct;

  // Tracé partagé
  const dPath =
    "M290.361 5.36102C242.122 54.841 175.481 73.9407 113.035 62.6602C73.7762 55.5682 36.1755 36.4685 5.84824 5.36102";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 296 71"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      preserveAspectRatio="xMidYMid meet"
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

      {/* Groupe optionnel pour miroiter correctement (le transform sur <svg> n'est pas pris en compte) */}
      <g transform={flipHorizontally ? "scale(-1,1) translate(-296,0)" : undefined}>
        {/* Fond neutre */}
        <path
          d={dPath}
          stroke="#333"
          strokeWidth="10.3191"
          strokeLinecap="round"
          pathLength={100}
        />

        {/* Progression */}
        <path
          d={dPath}
          stroke="url(#carbuGradient)"
          strokeWidth="10.3191"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={dashOffset}
        />
      </g>

      {/* Libellés & pourcentage (dans le SVG, pas en <div> absolument positionné) */}
      {showPercent && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="system-ui, sans-serif"
          fontSize="18"
          fontWeight={700}
          fill="#fff"
        >
          {pct}%
        </text>
      )}
    </svg>
  );
}
