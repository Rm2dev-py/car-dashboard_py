// src/WebSocketProvider.tsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
// @ts-ignore: pas de types
import ReconnectingWebSocket from "reconnecting-websocket";

type WSContextValue = {
  data: any;
  connected: boolean;
  lastMessageAt: number | null;
  sendUpdate: (obj: any) => void;
};

const WSContext = createContext<WSContextValue>({
  data: {},
  connected: false,
  lastMessageAt: null,
  sendUpdate: () => {},
});

function makeWSUrl() {
  const host = window.location.hostname || "localhost";
  const port = 5050;
  const proto = window.location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${host}:${port}`;
}

let socket: ReconnectingWebSocket | null = null;

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>({});
  const [connected, setConnected] = useState(false);
  const [lastMessageAt, setLastMessageAt] = useState<number | null>(null);

  const wsRef = useRef<ReconnectingWebSocket | null>(null);
  const pingTimer = useRef<number | null>(null);

  useEffect(() => {
    const url = makeWSUrl();
    const ws = new ReconnectingWebSocket(url, [], { maxRetries: Infinity, connectionTimeout: 4000 });
    wsRef.current = ws;
    socket = ws;

// src/WebSocketProvider.tsx (garde le reste tel quel)
ws.onopen = () => {
  setConnected(true);
  if (pingTimer.current) window.clearInterval(pingTimer.current);
  pingTimer.current = window.setInterval(() => {
    try { if (ws.readyState === WebSocket.OPEN) ws.send('{"ping":1}'); } catch {}
  }, 20000) as unknown as number;

  // Handshake de mode: applique le mode stocké côté front au connect
  try {
    const preferred = Number(localStorage.getItem("mode") ?? 1); // 1=SIMU par défaut
    if (preferred === 0 || preferred === 1) {
      ws.send(JSON.stringify({ mode: preferred }));
    }
  } catch {}
};


    ws.onmessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data);
        setData(parsed);
        setLastMessageAt(Date.now());
      } catch {}
    };

    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    return () => {
      if (pingTimer.current) window.clearInterval(pingTimer.current);
      ws.close();
      wsRef.current = null;
      socket = null;
    };
  }, []);

  const sendUpdate = (obj: any) => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return console.warn("[WS] not connected", obj);
    ws.send(JSON.stringify(obj));
  };

  const value = useMemo(() => ({ data, connected, lastMessageAt, sendUpdate }), [data, connected, lastMessageAt]);
  return <WSContext.Provider value={value}>{children}</WSContext.Provider>;
}

export const useWS = () => useContext(WSContext).data;
export const useWSMeta = () => {
  const { connected, lastMessageAt, sendUpdate } = useContext(WSContext);
  return { connected, lastMessageAt, sendUpdate };
};

// rétrocompat globale
export function sendUpdate(update: Record<string, any>) {
  if (socket && socket.readyState === 1) socket.send(JSON.stringify(update));
  else console.warn("[WS] not connected, cannot send", update);
}

// Ajoute en bas du fichier:
export const useWSAlive = (timeoutMs = 3000) => {
  const { connected, lastMessageAt } = useWSMeta();
  const now = Date.now();
  const alive = connected && lastMessageAt != null && (now - lastMessageAt) < timeoutMs;
  return alive;
};

// Utilitaire pour changer de mode depuis l’UI
export function setMode(mode: 0 | 1) {
  localStorage.setItem("mode", String(mode));
  try {
    if (socket && socket.readyState === 1) {
      socket.send(JSON.stringify({ mode }));
    }
  } catch {}
}
