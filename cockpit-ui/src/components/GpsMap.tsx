// src/components/GpsMap.tsx
import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useWS } from "../WebSocketProvider";

type GpsPayload = {
  gps_lat?: number | null;
  gps_lon?: number | null;
  gps_mode?: number | null;     // 0/1 = NO FIX, 2 = 2D, 3 = 3D
  gps_heading?: number | null;  // cap en degrés (0 = nord)
};

type Props = {
  widthPx?: number;          // largeur (px)
  heightPx?: number;         // hauteur (px)
  borderRadiusPx?: number;   // arrondi coins (px)
  borderWidthPx?: number;    // épaisseur bordure (px)
  borderColor?: string;      // couleur bordure
  borderStyle?: "solid" | "dashed" | "dotted" | "double" | "none";
  boxShadow?: string;        // ombre CSS
};

// Valeurs par défaut
const DEFAULT_WIDTH = 520;
const DEFAULT_HEIGHT = 360;
// ⚠️ on neutralise l’arrondi par défaut
const DEFAULT_RADIUS = 0;

// (anim blink dispo si besoin ailleurs)
(() => {
  const id = "__gps_blink__";
  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `@keyframes blink { from {opacity:1;} to {opacity:0.2;} }`;
    document.head.appendChild(style);
  }
})();

// Rendre Leaflet transparent + supprimer focus/cheveux, une seule fois
(() => {
  const id = "__leaflet_transparent__";
  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      .leaflet-container { background: transparent !important; outline: none !important; }
      .leaflet-container *:focus { outline: none !important; }
      .leaflet-tile { border: 0 !important; box-shadow: none !important; }
    `;
    document.head.appendChild(style);
  }
})();

function makeGPSUrl() {
  const host = window.location.hostname || "localhost";
  const proto = window.location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${host}:5050`;
}

function useGpsData() {
  const [pos, setPos] = useState<GpsPayload>({});
  const lastMsgAt = useRef<number>(Date.now());

  useEffect(() => {
    let ws: WebSocket | null = null;
    let retry: number | null = null;
    const connect = () => {
      ws = new WebSocket(makeGPSUrl());
      ws.onmessage = (ev) => {
        try {
          const d = JSON.parse(ev.data) as GpsPayload;
          setPos(d);
          lastMsgAt.current = Date.now();
        } catch {}
      };
      ws.onclose = () => {
        retry = window.setTimeout(connect, 1500) as unknown as number;
      };
      ws.onerror = () => {
        try { ws?.close(); } catch {}
      };
    };
    connect();
    return () => {
      if (retry) window.clearTimeout(retry);
      ws?.close();
    };
  }, []);

  return { pos, lastMsgAt };
}

function RecenterMap({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 18);
  }, [lat, lon, map]);
  return null;
}

// Icône flèche Material Symbols
function useArrowIcon(headingDeg?: number | null, disconnected?: boolean, hasFix?: boolean) {
  return useMemo(() => {
    const angle = typeof headingDeg === "number" ? headingDeg : 0;
    const color = disconnected ? "red" : hasFix ? "#60a5fa" : "orange";
    const html = `
      <div style="transform: rotate(${angle}deg); transform-origin: 50% 50%;">
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="${color}" style="filter: drop-shadow(0 0 6px rgba(0,0,0,0.6));">
          <path d="m319-280 161-73 161 73 15-15-176-425-176 425 15 15ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
        </svg>
      </div>`;
    return new L.DivIcon({
      html,
      className: "",
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  }, [headingDeg, disconnected, hasFix]);
}

export default function GpsMap({
  widthPx = DEFAULT_WIDTH,
  heightPx = DEFAULT_HEIGHT,
  // ⚠️ par défaut on rend tout invisible
  borderRadiusPx = DEFAULT_RADIUS,
  borderWidthPx = 0,
  borderColor = "transparent",
  borderStyle = "none",
  boxShadow = "none",
}: Props) {
  const { pos, lastMsgAt } = useGpsData();
  const wsData = useWS();

  // GPS state
  const hasLat = typeof pos.gps_lat === "number";
  const hasLon = typeof pos.gps_lon === "number";
  const hasFix = (pos.gps_mode ?? 0) >= 2 && hasLat && hasLon;

  const lat = hasLat ? (pos.gps_lat as number) : 47.2476;
  const lon = hasLon ? (pos.gps_lon as number) : 0.4781;

  const disconnected = Date.now() - lastMsgAt.current > 5000;
  const arrowIcon = useArrowIcon(pos.gps_heading, disconnected, hasFix);

  // Dark/Light via feux de code (accepte deux clés possibles)
  const codeOn  = wsData?.voyant_code === 1 || wsData?.voyant_code === true;
  const inputOn = wsData?.feux_code   === 1 || wsData?.feux_code   === true;
  const darkOn  = codeOn || inputOn;

  const tilesUrl = darkOn
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  const tilesKey = darkOn ? "tiles-dark" : "tiles-light";

  // Wrapper (garde ta structure, mais sans chrome)
  const wrapStyle: React.CSSProperties = {
    width: `${widthPx}px`,
    height: `${heightPx}px`,
    borderRadius: `${borderRadiusPx}px`,
    overflow: "hidden",
    boxShadow, // "none" par défaut
    border: borderStyle === "none" ? "none" : `${borderWidthPx}px ${borderStyle} ${borderColor}`,
  };

  return (
    <div style={wrapStyle}>
      <MapContainer
        center={[lat, lon]}
        zoom={18}
        style={{ width: "100%", height: "100%", background: "transparent", outline: "none" }}
        scrollWheelZoom
        zoomControl={false}
        attributionControl={false}
        className={darkOn ? "leaflet-skin-dark" : "leaflet-skin-light"}  // ⬅️ fond adapté
      >
        <TileLayer key={tilesKey} url={tilesUrl} detectRetina={false} />
        <Marker position={[lat, lon]} icon={arrowIcon} />
        {hasFix && <RecenterMap lat={lat} lon={lon} />}
      </MapContainer>
    </div>
  );
}
