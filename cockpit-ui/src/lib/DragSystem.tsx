import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useDragMode } from "../DragContext";

/** ===== ResponsiveStage =====
 * - Scale proportionnel d'une surface (baseWidth x baseHeight)
 * - Centre la scène
 */
type StageCtx = { scale: number; baseWidth: number; baseHeight: number };
const StageContext = createContext<StageCtx>({ scale: 1, baseWidth: 1920, baseHeight: 1080 });
export function useStage() { return useContext(StageContext); }

type ResponsiveStageProps = {
  baseWidth?: number;
  baseHeight?: number;
  className?: string;
  children: React.ReactNode;
    /** ‘contain’ (par défaut) garde tout visible, ‘cover’ remplit tout l’écran */
  fit?: "contain" | "cover";
  /** Limiter l’upscaling si tu veux éviter que ça grossisse au-delà du 1:1 */
  maxScale?: number; // ex: 1
  minScale?: number; // ex: 0.5
};
export function ResponsiveStage({
  baseWidth = 1920,
  baseHeight = 1080,
  className = "",
  children,
  fit = "contain",
  maxScale = Infinity,
  minScale = 0,
}: ResponsiveStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      const parent = el?.parentElement;
      if (!el || !parent) return;
      const sx = parent.clientWidth / baseWidth;
      const sy = parent.clientHeight / baseHeight;
      const raw = fit === "cover" ? Math.max(sx, sy) : Math.min(sx, sy);
      const clamped = Math.max(minScale, Math.min(raw, maxScale));
      setScale(clamped);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [baseWidth, baseHeight, fit, maxScale, minScale]);

  return (
    <StageContext.Provider value={{ scale, baseWidth, baseHeight }}>
      <div className={`w-full h-full relative overflow-hidden ${className}`}>
        <div
          ref={containerRef}
          className="absolute left-1/2 top-1/2 origin-top-left"
          style={{
            width: baseWidth,
            height: baseHeight,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </StageContext.Provider>
  );
}

/** ===== Draggable =====
 * - Drag (souris + touch)
 * - Snap au grid
 * - Persistance via localStorage (clé = id)
 * - Respecte dragEnabled (DragContext)
 * - Compatible avec scaling (ResponsiveStage)
 */
type DraggableProps = {
  id: string;
  children: React.ReactNode;
  defaultPos?: { x: number; y: number };
  grid?: number;
  zIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  onChangePos?: (pos: { x: number; y: number }) => void;
};

export function Draggable({
  id,
  children,
  defaultPos = { x: 200, y: 200 },
  grid = 5,
  zIndex = 20,
  className = "",
  style = {},
  disabled = false,
  onChangePos,
}: DraggableProps) {
  const { dragEnabled } = useDragMode();
  const { scale } = useStage();
  const storageKey = `pos_${id}`;

  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : defaultPos;
  });

  const dragging = useRef(false);
  const offset = useRef({ dx: 0, dy: 0 });
  const canDrag = dragEnabled && !disabled;

  const snap = (v: number) => Math.round(v / grid) * grid;
  const save = (p: { x: number; y: number }) => {
    localStorage.setItem(storageKey, JSON.stringify(p));
    onChangePos?.(p);
  };

  const getClientXY = (e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
    // @ts-ignore
    const t = e.touches?.[0] ?? e.changedTouches?.[0];
    // @ts-ignore
    const cx = t ? t.clientX : (e as MouseEvent).clientX;
    // @ts-ignore
    const cy = t ? t.clientY : (e as MouseEvent).clientY;
    return { cx, cy };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canDrag) return;
    e.stopPropagation();
    e.preventDefault();
    const { cx, cy } = getClientXY(e);
    // stocker l'écart dans l'espace scalé pour des coords correctes
    offset.current = { dx: cx - pos.x * scale, dy: cy - pos.y * scale };
    dragging.current = true;
    // positionner dès le premier press
    const x = (cx - offset.current.dx) / scale;
    const y = (cy - offset.current.dy) / scale;
    setPos({ x: snap(x), y: snap(y) });
  };

  useEffect(() => {
    const onMove = (ev: MouseEvent | TouchEvent) => {
      if (!dragging.current || !canDrag) return;
      // @ts-ignore
      const t = ev.touches?.[0] ?? ev.changedTouches?.[0];
      const cx = t ? t.clientX : (ev as MouseEvent).clientX;
      const cy = t ? t.clientY : (ev as MouseEvent).clientY;
      const x = (cx - offset.current.dx) / scale;
      const y = (cy - offset.current.dy) / scale;
      setPos({ x: snap(x), y: snap(y) });
    };
    const onEnd = () => {
      if (!dragging.current) return;
      dragging.current = false;
      save(pos);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    window.addEventListener("touchcancel", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [canDrag, scale, pos.x, pos.y]); // pos dans deps pour sauver la dernière valeur

  const mergedStyle: React.CSSProperties = useMemo(
    () => ({
      position: "absolute",
      left: pos.x,
      top: pos.y,
      zIndex,
      cursor: canDrag ? "grab" : "default",
      touchAction: "none",
      ...style,
    }),
    [pos.x, pos.y, zIndex, canDrag, style]
  );

  return (
    <div
      className={className}
      style={mergedStyle}
      onMouseDown={canDrag ? handleStart : undefined}
      onTouchStart={canDrag ? handleStart : undefined}
    >
      {children}
    </div>
  );
}
