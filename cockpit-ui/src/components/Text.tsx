// src/components/Text.tsx
import React from "react";

type AsTag = "div" | "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = {
  /** Balise HTML à utiliser (par défaut: div) */
  as?: AsTag;

  /** Contenu texte; `children` l’emporte si fourni */
  text?: React.ReactNode;
  children?: React.ReactNode;

  className?: string;
  style?: React.CSSProperties;

  /** Style typographique */
  color?: string;                          // défaut: "#FFFFFF"
  opacity?: number;                        // 0..1
  fontSize?: number | string;              // défaut: 18
  fontWeight?: React.CSSProperties["fontWeight"]; // défaut: "bold"
  fontFamily?: string;                     // ex: "system-ui, sans-serif"
  align?: "left" | "center" | "right";     // défaut: "left"
  italic?: boolean;                        // défaut: false
  uppercase?: boolean;                     // défaut: false
  letterSpacing?: number | string;         // tracking
  lineHeight?: number | string;            // leading

  /** Effets */
  strokeColor?: string;                    // contour (webkit)
  strokeWidth?: number;                    // en px
  glow?: boolean | { color?: string; blur?: number }; // text-shadow simple

  /** Gestion de la coupure / troncature */
  wrap?: "normal" | "nowrap" | "truncate"; // défaut: "normal"
};

export default function Text({
  as = "div",
  text,
  children,
  className = "",
  style,

  color = "#FFFFFF",
  opacity,
  fontSize = 18,
  fontWeight = "bold",
  fontFamily,
  align = "left",
  italic = false,
  uppercase = false,
  letterSpacing,
  lineHeight,

  strokeColor,
  strokeWidth,
  glow,
  wrap = "normal",
}: Props) {
  const Component = as as any;

  // stroke (contour du texte)
  const strokeStyle: React.CSSProperties = {};
  if (strokeColor && strokeWidth) {
    // Compat webkit
    strokeStyle.WebkitTextStrokeColor = strokeColor;
    strokeStyle.WebkitTextStrokeWidth = `${strokeWidth}px`;
  }

  // glow (halo)
  const textShadow =
    glow === true
      ? "0 0 8px rgba(255,255,255,0.5)"
      : typeof glow === "object"
      ? `0 0 ${glow.blur ?? 8}px ${glow.color ?? "rgba(255,255,255,0.5)"}`
      : undefined;

  // gestion du wrap / truncate
  const wrapStyle: React.CSSProperties =
    wrap === "nowrap"
      ? { whiteSpace: "nowrap" }
      : wrap === "truncate"
      ? {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }
      : {};

  const finalStyle: React.CSSProperties = {
    color,
    opacity,
    fontSize,
    fontWeight,
    fontFamily,
    textAlign: align,
    fontStyle: italic ? "italic" : undefined,
    textTransform: uppercase ? "uppercase" : undefined,
    letterSpacing,
    lineHeight,
    textShadow,
    userSelect: "none",
    ...strokeStyle,
    ...wrapStyle,
    ...style,
  };

  return (
    <Component className={className} style={finalStyle}>
      {children ?? text}
    </Component>
  );
}
