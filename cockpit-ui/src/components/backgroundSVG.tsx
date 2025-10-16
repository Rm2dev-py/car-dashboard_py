// src/components/BackgroundSVG.tsx
import { createPortal } from "react-dom";

export default function BackgroundSVG() {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#000",
        pointerEvents: "none",
        zIndex: -1,           // ⬅️ derrière tout
      }}
    />,
    document.body
  );
}
