// src/pages/Cockpit.tsx
import { useEffect, useState } from "react";
import { ResponsiveStage, Draggable } from "../lib/DragSystem";
import { COMPONENTS } from "../components/registry";

type ItemCfg = {
  component: string;
  x: number;
  y: number;
  zIndex?: number;
  grid?: number;
  visible?: boolean;
  locked?: boolean;
};

type LayoutSchema = {
  _meta?: { baseWidth?: number; baseHeight?: number; version?: number };
  background?: ItemCfg & { x?: number; y?: number };
  items: Record<string, ItemCfg>;
};

export default function Cockpit() {
  const [layout, setLayout] = useState<LayoutSchema>({ items: {} });

  useEffect(() => {
    (async () => {
      const res = await fetch("/layout.base.json", { cache: "no-cache" });
      const data = (await res.json()) as LayoutSchema;
      setLayout(data);
    })();
  }, []);

  const baseW = layout._meta?.baseWidth ?? 1366;
  const baseH = layout._meta?.baseHeight ?? 768;

  // Background (non draggable si locked)
  const BgComp =
    layout.background?.component ? COMPONENTS[layout.background.component] : null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white">
      <ResponsiveStage baseWidth={baseW} baseHeight={baseH}>
        {/* Background */}
        {BgComp &&
          (layout.background?.locked ? (
            <div
              style={{
                position: "absolute",
                left: layout.background.x ?? 0,
                top: layout.background.y ?? 0,
                zIndex: layout.background.zIndex ?? 0,
                pointerEvents: "none",
              }}
            >
              <BgComp />
            </div>
          ) : (
            <Draggable
              id="_background"
              defaultPos={{
                x: layout.background?.x ?? 0,
                y: layout.background?.y ?? 0,
              }}
              grid={layout.background?.grid ?? 0}
              zIndex={layout.background?.zIndex ?? 0}
            >
              <BgComp />
            </Draggable>
          ))}

        {/* Items */}
        {Object.entries(layout.items).map(([id, cfg]) => {
          if (cfg.visible === false) return null;
          const Comp = COMPONENTS[cfg.component];
          if (!Comp) return null;

          if (cfg.locked) {
            return (
              <div
                key={id}
                style={{
                  position: "absolute",
                  left: cfg.x,
                  top: cfg.y,
                  zIndex: cfg.zIndex ?? 20,
                }}
              >
                <Comp />
              </div>
            );
          }

          return (
            <Draggable
              key={id}
              id={id}
              defaultPos={{ x: cfg.x, y: cfg.y }}
              grid={cfg.grid ?? 5}
              zIndex={cfg.zIndex ?? 20}
            >
              <Comp />
            </Draggable>
          );
        })}
      </ResponsiveStage>
    </div>
  );
}
