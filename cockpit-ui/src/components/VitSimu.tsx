// src/components/VitSimu.tsx
import { useState } from "react";
import { sendUpdate } from "../WebSocketProvider";

const KMH_MAX = 240;

export default function VitSimu() {
  const [kmh, setKmh] = useState(0); // 0–240 km/h

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10) || 0;
    setKmh(v);
    const voltage = +((v / KMH_MAX) * 3.3).toFixed(2); // 0–3.3V
    sendUpdate({ vitesse: voltage });
  };

  return (
    <div style={{ margin: "10px", color: "white" }}>
      <label style={{ display: "block", marginBottom: 6 }}>
        Vitesse (km/h)
      </label>
      <input
        type="range"
        min={0}
        max={KMH_MAX}
        step={1}
        value={kmh}
        onChange={handleChange}
        style={{ width: 280 }}
      />
      <div style={{ marginTop: 6, fontSize: 14 }}>
        {kmh} km/h — {( (kmh / KMH_MAX) * 3.3 ).toFixed(2)} V
      </div>
    </div>
  );
}
