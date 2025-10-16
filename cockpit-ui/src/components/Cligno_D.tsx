// src/components/Cligno_D.tsx
import React, { useEffect, useState } from "react";
import { useWS } from "../WebSocketProvider";

type Props = {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  blinkMs?: number; // durée du clignotement
};

export default function Cligno_D({
  width = 770,
  height = 53,
  className = "",
  style,
  blinkMs = 1000,
}: Props) {
  const wsData = useWS();
  const isActive = wsData?.voyant_cligno_d === 1 || wsData?.voyant_cligno_d === true;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const id = setInterval(() => setVisible((v) => !v), blinkMs);
    return () => clearInterval(id);
  }, [isActive, blinkMs]);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 770 53"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: "scaleX(-1)", ...style }} // symétrie horizontale
      preserveAspectRatio="xMidYMid meet"
    >
      <mask
        id="path-1-outside-1_1144_901"
        maskUnits="userSpaceOnUse"
        x="717.457"
        y="4.85025"
        width="51"
        height="44"
        fill="black"
      >
        <rect fill="#565656" x="717.457" y="4.85025" width="51" height="44" />
        <path
          d="M766.086 26.5954C766.086 27.4194 765.727 28.4125 764.903 29.1942L748.127 44.8928C746.965 45.9703 745.993 46.4563 744.788 46.4563C743.014 46.4563 741.682 45.1463 741.682 43.3715V35.7441H725.244C721.822 35.7441 719.836 33.8003 719.836 30.4197V22.8556C719.836 19.4962 721.822 17.5312 725.244 17.5312H741.682V9.92493C741.682 8.15013 743.014 6.73452 744.81 6.73452C745.993 6.73452 746.838 7.22047 748.127 8.40368L764.903 23.9966C765.748 24.7995 766.086 25.7291 766.086 26.5954Z"
          fill={visible ? "lime" : "#111"}
        />
      </mask>
      <path
        d="M23.3786 5.98819C25.6721 5.98819 27.3171 7.79611 27.3171 9.99014V16.7851H42.944C44.8087 16.7851 46.3876 17.3227 47.5016 18.4208C48.6172 19.5205 49.1638 21.0812 49.1638 22.9208V30.4853C49.1637 32.334 48.6175 33.8952 47.5007 34.9931C46.3856 36.089 44.8064 36.621 42.944 36.621H27.3171V43.4364C27.3171 45.6593 25.6435 47.3329 23.4206 47.3329C21.9185 47.3328 20.7584 46.7108 19.5095 45.5526L19.5075 45.5507L2.73114 29.8515L2.72723 29.8476C1.74174 28.9125 1.29084 27.7072 1.29071 26.661C1.29071 25.5706 1.72132 24.4283 2.72626 23.4735L2.73309 23.4677L19.5095 7.87491L19.5124 7.871C20.8476 6.64521 21.8858 5.98823 23.3786 5.98819Z"
        fill={visible ? "lime" : "#111"}
        stroke="#565656"
        strokeWidth="1.62268"
      />
    </svg>
  );
}
