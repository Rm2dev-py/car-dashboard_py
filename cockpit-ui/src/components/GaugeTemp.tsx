// src/components/GaugeTemp.tsx
import React, { useEffect, useId, useMemo, useState } from "react";
import { useWS } from "../WebSocketProvider";

type Props = {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;

  /** Valeur min/max du capteur (°C, ou V si tu bosses en 0–3.3V — on ajustera après) */
  minV?: number;
  maxV?: number;

  /** true = gauche→droite visuellement, false = droite→gauche */
  sensHoraire?: boolean;

  /** miroir horizontal (si asset inversé dans le layout) */
  flipHorizontally?: boolean;

  /** Afficher la valeur numérique au centre */
  showValue?: boolean;

  strokeWidth?: number;
  backgroundStroke?: string;

  /** Couleurs progression (froid → chaud) */
  coldColor?: string;   // bleu
  midColor?: string;    // ambre
  hotColor?: string;    // rouge

  /** Clignoter quand chaud */
  blinkWhenHot?: boolean;
  /** Seuil “chaud” exprimé en % (0–100) de la jauge */
  hotThresholdPct?: number;
  blinkMs?: number;

  /** (Optionnel) override de la valeur source si tu ne veux pas lire le WS */
  valueOverride?: number; // dans le même repère que minV/maxV (ex: °C)
  /** (Optionnel) clé WS à lire si ton backend n’utilise pas "temp_moteur" */
  wsKey?: string; // ex: "tempEau" | "temp_moteur" | "adc_temp"
};

export default function GaugeTemp({
  width = 296,
  height = 71,
  className = "",
  style,

  // Par défaut on suppose un capteur en °C (ajuste après)
  minV = 60,   // 60°C mini (ex. moteur froid)
  maxV = 120,  // 120°C maxi (zone rouge)

  sensHoraire = true,
  flipHorizontally = false,
  showValue = true,

  strokeWidth = 10.3191,
  backgroundStroke = "#333",

  coldColor = "#0ea5e9",  // bleu
  midColor = "#f59e0b",   // ambre
  hotColor = "#ef4444",   // rouge

  blinkWhenHot = true,
  hotThresholdPct = 85,   // >=85% → chaud
  blinkMs = 700,

  valueOverride,
  wsKey = "temp_moteur",
}: Props) {
  const wsData = useWS();
  // Valeur brute : priorité au valueOverride, sinon lecture WS
  const rawVal =
    valueOverride ??
    Number(wsData?.[wsKey] ??
      wsData?.temp_moteur ??
      wsData?.temperature_moteur ??
      wsData?.tempEau ??
      0);

  // % sécurisé
  const span = Math.max(1e-6, maxV - minV);
  const pct = Math.round(((Math.min(Math.max(rawVal, minV), maxV) - minV) / span) * 100);

  // dashOffset (0 = plein; 100 = vide)
  const dashOffset = sensHoraire ? 100 - pct : pct;

  // Tracé (même arc que GaugeCarbu → layout compatible)
  const dPath =
    "M290.361 5.36102C242.122 54.841 175.481 73.9407 113.035 62.6602C73.7762 55.5682 36.1755 36.4685 5.84824 5.36102";

  // Sens visuel de gauche à droite = XOR sensHoraire/flip
  const leftToRight = sensHoraire !== flipHorizontally;

  const gradId = useId();

  // Blink haut niveau (chaud)
  const isHot = pct >= hotThresholdPct;
  const [blinkOn, setBlinkOn] = useState(true);
  useEffect(() => {
    if (!(blinkWhenHot && isHot)) {
      setBlinkOn(true);
      return;
    }
    const t = setInterval(() => setBlinkOn(v => !v), Math.max(200, blinkMs / 2));
    return () => clearInterval(t);
  }, [blinkWhenHot, isHot, blinkMs]);

  const progressStroke = isHot ? hotColor : `url(#grad-${gradId})`;
  const progressOpacity = isHot && blinkWhenHot ? (blinkOn ? 1 : 0.25) : 1;

  const stops = useMemo(
    () => [
      { offset: "0%", color: coldColor },
      { offset: "35%", color: coldColor },
      { offset: "65%", color: midColor },
      { offset: "100%", color: hotColor },
    ],
    [coldColor, midColor, hotColor]
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

      {showValue && (
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
          {Math.round(((Math.min(Math.max(rawVal, minV), maxV) - minV) / span) * (maxV - minV) + minV)}°C
        </text>
      )}
    </svg>
  );
}
