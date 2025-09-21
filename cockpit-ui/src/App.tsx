// src/App.tsx
import { Link, Routes, Route, Navigate } from "react-router-dom";
import { WebSocketProvider } from "./WebSocketProvider";
import { DragProvider } from "./DragContext";
import Cockpit from "./pages/Cockpit";
import TestConfig from "./pages/TestConfig";
import WsStatus from "./components/WsStatus"; // ⬅️ AJOUT

export default function App() {
  return (
    <WebSocketProvider>
      <DragProvider>
        <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
          <nav className="absolute left-4 top-4 z-30 flex items-center gap-3 px-3 py-2 rounded-lg bg-neutral-900/70 border border-neutral-700/60 backdrop-blur pointer-events-none">
            <span className="pointer-events-auto"><Link to="/cockpit" className="hover:underline">Cockpit</Link></span>
            <span className="pointer-events-auto"><Link to="/test" className="hover:underline">Test &amp; Config</Link></span>
          </nav>

          {/* Voyant WS global (5050) */}
          <div className="fixed left-4 bottom-4 z-50 pointer-events-none">
            <div className="pointer-events-auto px-2 py-1 rounded bg-neutral-900/70 border border-neutral-700/60">
              <WsStatus />
            </div>
          </div>

          <div className="absolute inset-0">
            <Routes>
              <Route path="/" element={<Navigate to="/cockpit" replace />} />
              <Route path="/cockpit" element={<Cockpit />} />
              <Route path="/test" element={<TestConfig />} />
              <Route path="*" element={<div className="p-4">404</div>} />
            </Routes>
          </div>
        </div>
      </DragProvider>
    </WebSocketProvider>
  );
}
