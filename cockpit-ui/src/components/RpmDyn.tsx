import React, { useMemo } from "react";
import { useWS } from "../WebSocketProvider";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  maxRPM?: number;                         // 6000 ou 7000 selon ta calib backend
  displayMode?: "k" | "raw";               // "k" par défaut
  decimals?: number;                       // 0 par défaut
  rounding?: "floor" | "round" | "ceil";
  showText?: boolean;                      // false par défaut
  format?: (rpm: number, display: string) => React.ReactNode;
  color?: string;                          // "#fff"
  fontSize?: number | string;              // 32
  fontWeight?: React.CSSProperties["fontWeight"]; // "bold"

  // ⚡ Micro-transition pure CSS (pas de lissage des valeurs)
  transitionMs?: number;                   // 60–120 ms conseillé — défaut 90
};

export default function RpmDyn({
  maxRPM = 6000,
  displayMode = "k",
  decimals = 0,
  rounding = "floor",
  showText = false,
  format,
  color = "#FFFFFF",
  fontSize = 32,
  fontWeight = "bold",
  className,
  style,
  transitionMs = 1000,
}: Props) {
  const wsData = useWS();

  // Valeur métier directe (déjà en RPM) + garde-fous
  const rpm = useMemo(() => {
    const v = Number(wsData?.rpm_moteur ?? 0);
    const safe = Number.isFinite(v) ? v : 0;
    return Math.max(0, Math.min(maxRPM, safe));
  }, [wsData?.rpm_moteur, maxRPM]);

  // Mapping angle linéaire –108° → +108°
  const MIN_ANGLE = -108;
  const MAX_ANGLE = 108;
  const ratio = rpm / maxRPM;
  const angle = Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, MIN_ANGLE + ratio * (MAX_ANGLE - MIN_ANGLE)));

  // Texte optionnel
  const roundFn =
    rounding === "ceil" ? Math.ceil : rounding === "round" ? Math.round : Math.floor;
  const valueForDisplay = displayMode === "k" ? rpm / 1000 : rpm;
  const displayText =
    decimals > 0 ? valueForDisplay.toFixed(decimals) : String(roundFn(valueForDisplay));

  return (
    <div className={className} style={style}>
      <svg
        width="470"
        height="470"
        viewBox="0 0 470 470"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Régime ${roundFn(rpm)} RPM`}
        style={{ display: "block" }}
      >
        <circle cx="235" cy="235" r="15" fill="#FF0707" stroke="#500" strokeWidth="3" />
        {/* ✅ Transition CSS ultra-courte pour la fluidité, sans lissage de données */}
        <g
          transform={`rotate(${angle} 235 235)`}
          style={{
            transition: `transform ${Math.max(0, transitionMs)}ms linear`,
            willChange: "transform",
          }}
        >
          <line x1="235" y1="235" x2="235" y2="40" stroke="#FF0707" strokeWidth="4" strokeLinecap="round" />
          <line x1="235" y1="235" x2="235" y2="260" stroke="#FF0707" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>

      {showText && (
        <div
          style={{
            color,
            fontSize,
            fontWeight,
            userSelect: "none",
            marginTop: -210,
            textAlign: "center",
          }}
        >
          {format ? format(rpm, displayText) : displayText}
        </div>
      )}
    </div>
  );
}
