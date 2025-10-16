// src/App.tsx
import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { WebSocketProvider } from "./WebSocketProvider";
import { DragProvider } from "./DragContext";
import Cockpit from "./pages/Cockpit";
import TestConfig from "./pages/TestConfig";

type AppProps = { showNav?: boolean };

export default function App({ showNav = false }: AppProps) {
  const location = useLocation();
  const navParam = new URLSearchParams(location.search).get("nav");
  const hideByParam = navParam === "0" || navParam === "false";
  const navVisible = showNav && !hideByParam;

  return (
    <WebSocketProvider>
      <DragProvider>
        <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
          {navVisible && (
            <nav className="absolute left-4 top-4 z-30 flex items-center gap-3 px-3 py-2 rounded-lg bg-neutral-900/70 border border-neutral-700/60 backdrop-blur">
              <Link to="/cockpit" className="hover:underline">Cockpit</Link>
              <Link to="/test" className="hover:underline">Test &amp; Config</Link>
            </nav>
          )}

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
