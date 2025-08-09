// src/components/LedIndicator.tsx
import { useWS } from "../WebSocketProvider";

export function LedIndicator({ label, variable }: { label: string; variable: string }) {
  const data = useWS();
  const on = !!data[variable];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-6 h-6 rounded-full border-2 ${on ? "bg-green-500 border-green-700" : "bg-red-600 border-red-800"}`}
      ></div>
      <span className="text-white text-sm">{label}</span>
    </div>
  );
}
