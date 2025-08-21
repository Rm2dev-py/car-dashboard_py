// src/components/TextLabel.tsx
import React from "react";

type Props = {
  /** Contenu du libellé */
  text?: string;
  className?: string;
  style?: React.CSSProperties;

  /** Style texte */
  color?: string;                          // défaut: blanc
  fontSize?: number | string;              // défaut: 18
  fontWeight?: React.CSSProperties["fontWeight"]; // défaut: "bold"
  align?: "left" | "center" | "right";     // défaut: "left"
};

export default function TextLabel({
  text = "x  1000  tr/min",
  className = "",
  style,
  color = "#FFFFFF",
  fontSize = 18,
  fontWeight = "bold",
  align = "left",
}: Props) {
  return (
    <div
      className={className}
      style={{
        color,
        fontSize,
        fontWeight,
        textAlign: align,
        userSelect: "none",
        ...style,
      }}
    >
      {text}
    </div>
  );
}
