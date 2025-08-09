// src/components/ButtonToggle.tsx
import { useWS, sendUpdate } from "../WebSocketProvider";
import { LedIndicator } from "./LedIndicator";

export function ButtonToggle({ variable }: { variable: string }) {
  const value = useWS()[variable] || false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    sendUpdate({ [variable]: e.target.checked });
  };

  return (
    <div className="flex items-center gap-4">
      <label className="flex items-center gap-2 text-white">
        <input
          type="checkbox"
          checked={value}
          onChange={handleChange}
          className="w-5 h-5 accent-blue-500"
        />
        {variable.toUpperCase()}
      </label>
      <LedIndicator label="" variable={variable} />
    </div>
  );
}