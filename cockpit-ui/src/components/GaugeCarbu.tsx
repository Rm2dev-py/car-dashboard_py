// src/components/GaugeCarbu.tsx
import React, { useEffect, useId, useMemo, useState } from "react";
import { useWS } from "../WebSocketProvider";

type Props = {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;

  minV?: number;
  maxV?: number;

  /** true = gauche→droite visuellement, false = droite→gauche */
  sensHoraire?: boolean;

  /** miroir horizontal (si asset inversé dans le layout) */
  flipHorizontally?: boolean;

  showPercent?: boolean;

  strokeWidth?: number;
  backgroundStroke?: string;

  lowColor?: string;   // < seuil (et clignote si activé)
  midColor?: string;
  highColor?: string;

  blinkWhenLow?: boolean;
  lowThresholdPct?: number; // 0–100
  blinkMs?: number;
};

export default function GaugeCarbu({
  width = 296,
  height = 71,
  className = "",
  style,

  minV = 0,
  maxV = 3.3,

  sensHoraire = true,
  flipHorizontally = true,
  showPercent = true,

  strokeWidth = 10.3191,
  backgroundStroke = "#333",

  lowColor = "#ff3b30",
  midColor = "#ffcc00",
  highColor = "#32d74b",

  blinkWhenLow = true,
  lowThresholdPct = 10,
  blinkMs = 700,
}: Props) {
  const wsData = useWS();
  const voltage = Number(wsData?.niveau_carbu ?? 0);

  // % sécurisé
  const span = Math.max(1e-6, maxV - minV);
  const pct = Math.round(((Math.min(Math.max(voltage, minV), maxV) - minV) / span) * 100);

  // dashOffset (0 = plein; 100 = vide)
  const dashOffset = sensHoraire ? 100 - pct : pct;

  // Tracé
  const dPath =
    "M290.361 5.36102C242.122 54.841 175.481 73.9407 113.035 62.6602C73.7762 55.5682 36.1755 36.4685 5.84824 5.36102";

  // Le sens visuel du remplissage (gauche→droite ?) = XOR entre sensHoraire et flip
  const leftToRight = sensHoraire !== flipHorizontally;

  const gradId = useId();

  // Blink bas niveau
  const isLow = pct <= lowThresholdPct;
  const [blinkOn, setBlinkOn] = useState(true);
  useEffect(() => {
    if (!(blinkWhenLow && isLow)) {
      setBlinkOn(true);
      return;
    }
    const t = setInterval(() => setBlinkOn(v => !v), Math.max(200, blinkMs / 2));
    return () => clearInterval(t);
  }, [blinkWhenLow, isLow, blinkMs]);

  const progressStroke = isLow ? lowColor : `url(#grad-${gradId})`;
  const progressOpacity = isLow && blinkWhenLow ? (blinkOn ? 1 : 0.25) : 1;

  const stops = useMemo(
    () => [
      { offset: "0%", color: lowColor },
      { offset: "10%", color: lowColor },
      { offset: "25%", color: midColor },
      { offset: "100%", color: highColor }, // ✅ vert à 100%
    ],
    [lowColor, midColor, highColor]
  );

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
        {/* On inverse la direction du gradient en jouant sur x1/x2 */}
        <linearGradient
          id={`grad-${gradId}`}
          x1={leftToRight ? "0" : "1"}
          y1="0"
          x2={leftToRight ? "1" : "0"}
          y2="0"
          gradientUnits="objectBoundingBox"
        >
          {stops.map((s, i) => (
            <stop key={i} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>

      {/* Miroir si nécessaire */}
      <g transform={flipHorizontally ? "scale(-1,1) translate(-296,0)" : undefined}>
        {/* Fond neutre */}
        <path
          d={dPath}
          stroke={backgroundStroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength={100}
        />

        {/* Progression */}
        <path
          d={dPath}
          stroke={progressStroke}
          strokeOpacity={progressOpacity}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={dashOffset}
        />
      </g>

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
