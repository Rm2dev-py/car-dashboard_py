// src/components/Speedometer.tsx
import { useWS } from "../WebSocketProvider";

export function Speedometer() {
  const { vitesse = 0 } = useWS();
  const angle = (vitesse / 160) * 270 - 135;

  return (
    <div className="flex flex-col items-center text-white">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" stroke="gray" strokeWidth="10" fill="none" />
        <line
          x1="100"
          y1="100"
          x2={100 + 70 * Math.cos((angle * Math.PI) / 180)}
          y2={100 + 70 * Math.sin((angle * Math.PI) / 180)}
          stroke="red"
          strokeWidth="4"
        />
      </svg>
      <p className="text-xl">Vitesse: {vitesse} km/h</p>
    </div>
  );
}