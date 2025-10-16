import React from "react";
import { useWSAlive } from "../WebSocketProvider";

type Props = {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  onColor?: string;
  offColor?: string;
  title?: string;
  wave?: boolean;
  wavePeriodSec?: number;
  waves?: 1 | 2 | 3;
  glow?: boolean;
};

export default function WsStatus({
  width = 40,
  height = 40,
  className = "",
  style,
  onColor = "#22c55e",
  offColor = "#ef4444",
  title = "Etat WebSocket",
  wave = true,
  wavePeriodSec = 1.2,
  waves = 1,
  glow = true,
}: Props) {
  const alive = useWSAlive(3000);
  const fill = alive ? onColor : offColor;
  const period = `${wavePeriodSec}s`;

  const ripple = (delay: number) => ({
    animation: `ws-ripple ${period} ease-out infinite ${delay}s`,
  });
  const pulse = { animation: `ws-pulse ${Math.max(0.9, wavePeriodSec * 0.85)}s ease-in-out infinite` };

  return (
    <svg
      width={width}
      height={height}
      viewBox="-8 -8 32 32"              // ↙ agrandi, centre (0,0) au milieu, pas de clipping
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: "visible", background: "transparent", ...style }}  // ↙ pas de fond, dépassement autorisé
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{title}</title>

      <defs>
        <filter id="ws-glow" x="-200%" y="-200%" width="400%" height="400%">  {/* ↙ large pour éviter tout bord carré */}
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="b2" />
          <feMerge><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        <radialGradient id="ws-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={fill} stopOpacity="1" />
          <stop offset="60%" stopColor={fill} stopOpacity="0.9" />
          <stop offset="100%" stopColor={fill} stopOpacity="0.55" />
        </radialGradient>

        <style>{`
          @keyframes ws-ripple {
            0%   { opacity: .45; transform: scale(0.55); }
            100% { opacity: 0;   transform: scale(2.1); } /* ↙ max < coins, évite le carré */
          }
          @keyframes ws-pulse {
            0%,100% { transform: scale(1); }
            50%     { transform: scale(1.06); }
          }
          .ws-r {
            fill: none;
            transform-box: fill-box;
            transform-origin: 50% 50%;
          }
          .ws-core {
            transform-box: fill-box;
            transform-origin: 50% 50%;
          }
        `}</style>
      </defs>

      {/* ONDES (aucun fond, aucun carré) */}
      {alive && wave && (
        <>
          <circle className="ws-r" cx="0" cy="0" r="7" stroke={onColor} strokeWidth="1.8" style={ripple(0)} />
          {waves >= 2 && <circle className="ws-r" cx="0" cy="0" r="7" stroke={onColor} strokeWidth="1.4" style={ripple(wavePeriodSec/3)} />}
          {waves >= 3 && <circle className="ws-r" cx="0" cy="0" r="7" stroke={onColor} strokeWidth="1.2" style={ripple((2*wavePeriodSec)/3)} />}
        </>
      )}

      {/* VOYANT — aucun contour/stroke, juste un glow optionnel */}
      <g filter={alive && glow ? "url(#ws-glow)" : undefined}>
        <circle className="ws-core" cx="0" cy="0" r="6.2" fill={alive ? "url(#ws-core)" : fill} style={alive ? pulse : undefined} />
        {/* plus de border stroke => zéro contour */}
      </g>
    </svg>
  );
}
