// src/WebSocketProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
// @ts-ignore : pas de types pour cette lib
import ReconnectingWebSocket from "reconnecting-websocket";

const WSContext = createContext({} as Record<string, any>);
export const useWS = () => useContext(WSContext);

let socket: ReconnectingWebSocket;

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Record<string, any>>({});

  useEffect(() => {
    socket = new ReconnectingWebSocket("ws://localhost:5050");
    socket.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData(parsed);
      } catch (e) {
        console.error("❌ WS parsing error:", e);
      }
    };
    return () => socket.close();
  }, []);

  return <WSContext.Provider value={data}>{children}</WSContext.Provider>;
}

export function sendUpdate(update: Record<string, any>) {
  if (socket && socket.readyState === 1) {
    socket.send(JSON.stringify(update));
  }
}
