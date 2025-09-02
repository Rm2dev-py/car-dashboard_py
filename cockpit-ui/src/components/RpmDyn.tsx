// src/components/RpmDyn.tsx
import React from "react";
import { useWS } from "../WebSocketProvider";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  /** Valeur max RPM utilisée pour la conversion 0–3.3V → 0–maxRPM */
  maxRPM?: number;              // défaut: 8000
  /** Affichage en milliers (ex: 4 pour 4000) ou brut (ex: 4000) */
  displayMode?: "k" | "raw";    // défaut: "k"
  /** Nombre de décimales à l’affichage */
  decimals?: number;            // défaut: 0
  /** Méthode d’arrondi */
  rounding?: "floor" | "round" | "ceil"; // défaut: "floor"
  /** Largeur pratique pour centrer le texte */
  width?: number | string;      // défaut: 120
  /** Couleur/typo par défaut */
  color?: string;               // défaut: "#fff"
  fontSize?: number | string;   // défaut: 32
  fontWeight?: React.CSSProperties["fontWeight"]; // défaut: "bold"
  textAlign?: "left" | "center" | "right";        // défaut: "center"
  /** Formatter custom si besoin (reçoit le rpm brut et le texte final) */
  format?: (rpm: number, display: string) => React.ReactNode;
  /** Libellé a11y */
  title?: string;               // défaut: "Régime moteur"
};

export default function RpmDyn({
  className = "",
  style,
  maxRPM = 8000,
  displayMode = "k",
  decimals = 0,
  rounding = "floor",
  width = 120,
  color = "#FFFFFF",
  fontSize = 32,
  fontWeight = "bold",
  textAlign = "center",
  format,
  //title = "Régime moteur",
}: Props) {
  const wsData = useWS();
  const voltage = wsData?.rpm_moteur ?? 0; // 0–3.3V

  // Conversion linéaire 0–3.3V -> 0–maxRPM
  const raw = Math.max(0, Math.min(maxRPM, (voltage / 3.3) * maxRPM));

  // Affichage (par défaut: milliers comme l’ancien composant)
  const valueForDisplay = displayMode === "k" ? raw / 1000 : raw;

  const applyRound = (v: number) =>
    rounding === "ceil" ? Math.ceil(v) : rounding === "round" ? Math.round(v) : Math.floor(v);

  const rounded = decimals > 0 ? valueForDisplay.toFixed(decimals) : String(applyRound(valueForDisplay));

  const displayText = rounded;

  const mergedStyle: React.CSSProperties = {
    width,
    color,
    fontSize,
    fontWeight,
    textAlign,
    userSelect: "none",
    ...style,
  };

  return (
    <div
      role="text"
      //aria-label={title}
      className={className}
      style={mergedStyle}
      //title={title}
    >
      {format ? format(raw, displayText) : displayText}
    </div>
  );
}
