// src/components/VitSimu.tsx
import { sendUpdate } from "../WebSocketProvider";
import { useState } from "react";

export default function VitSimu() {
  const [value, setValue] = useState(0); // 0–330

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setValue(val);
    const voltage = parseFloat((val / 100).toFixed(2)); // simulate 0–3.3V
    sendUpdate({ niveau_vitesse: voltage });
  };

  return (
    <div style={{ margin: "10px", color: "white" }}>
      <label>Niveau Vitesse</label>
      <input
        type="range"
        min={0}
        max={330}
        value={value}
        onChange={handleChange}
      />
      <span> {Math.round((value / 330) * 100)}%</span>
    </div>
  );
}
