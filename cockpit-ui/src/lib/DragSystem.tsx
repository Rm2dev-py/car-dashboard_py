// src/lib/DragSystem.tsx
import React, {
  createContext, useContext, useEffect, useMemo, useRef, useState, useCallback,
} from "react";
import { useDragMode } from "../DragContext";

/* ============================
   Stage (Responsive + Scale)
   ============================ */

type StageCtx = { scale: number; baseWidth: number; baseHeight: number };
const StageContext = createContext<StageCtx>({
  scale: 1,
  baseWidth: 1920,    // Figma par défaut
  baseHeight: 1080,    // Figma par défaut
});

export function useStage() {
  return useContext(StageContext);
}

type ResponsiveStageProps = {
  baseWidth?: number;        // défaut Figma
  baseHeight?: number;       // défaut Figma
  className?: string;
  children: React.ReactNode;
  /** ‘contain’ (par défaut) garde tout visible, ‘cover’ remplit tout l’écran */
  fit?: "contain" | "cover";
  /** Limiter l’upscaling si tu veux éviter > 1:1 */
  maxScale?: number; // ex: 1
  minScale?: number; // ex: 0.5
};

export function ResponsiveStage({
  baseWidth = 1497.24,
  baseHeight = 571.72,
  className = "",
  children,
  fit = "contain",
  maxScale = Infinity,
  minScale = 0,
}: ResponsiveStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current?.parentElement;
    if (!el) return;

    const compute = () => {
      const sx = el.clientWidth / baseWidth;
      const sy = el.clientHeight / baseHeight;
      const raw = fit === "cover" ? Math.max(sx, sy) : Math.min(sx, sy);
      const clamped = Math.max(minScale, Math.min(raw, maxScale));
      setScale(clamped || 1);
    };

    compute();

    // ResizeObserver > window.resize (plus fiable, parents flex etc.)
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
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

/* ============================
   Draggable
   ============================ */

type Pos = { x: number; y: number };

type DraggableProps = {
  id: string;                         // clé de persistance (unique)
  children: React.ReactNode;
  defaultPos?: Pos;                   // position par défaut (repère base)
  grid?: number;                      // snap (px en repère base)
  zIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  /** Restreindre le drag dans la scène (0..baseWidth/baseHeight) */
  boundsStage?: boolean;              // défaut: false
  /** Option: selector d’une poignée : drag seulement quand on down sur cet élément */
  handle?: string;                    // ex: ".header"
  onChangePos?: (pos: Pos) => void;
  onDragStart?: (pos: Pos) => void;
  onDragMove?: (pos: Pos) => void;
  onDragEnd?: (pos: Pos) => void;
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
  boundsStage = false,
  handle,
  onChangePos,
  onDragStart,
  onDragMove,
  onDragEnd,
}: DraggableProps) {
  const { dragEnabled } = useDragMode();
  const { scale, baseWidth, baseHeight } = useStage();
  const storageKey = `pos_${id}`;

  const [pos, setPos] = useState<Pos>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : defaultPos;
  });

  // refs pour éviter les fermetures sur pos/scale pendant le drag
  const posRef = useRef(pos);
  const scaleRef = useRef(scale);
  useEffect(() => { posRef.current = pos; }, [pos]);
  useEffect(() => { scaleRef.current = scale; }, [scale]);

  const canDrag = dragEnabled && !disabled;
  const dragging = useRef(false);
  const offset = useRef({ dx: 0, dy: 0 });

  const snap = (v: number) => Math.round(v / grid) * grid;

  const clampToStage = (p: Pos): Pos => {
    if (!boundsStage) return p;
    const w = baseWidth;
    const h = baseHeight;
    // Ici on ne connaît pas la taille du child, on clamp juste le point d’ancrage.
    return {
      x: Math.max(0, Math.min(p.x, w)),
      y: Math.max(0, Math.min(p.y, h)),
    };
  };

  const save = (p: Pos) => {
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

  const isHandleHit = (evtTarget: EventTarget | null, root: HTMLElement): boolean => {
    if (!handle) return true;
    if (!(evtTarget instanceof Element)) return false;
    // drag autorisé si le target ou l’un de ses parents match le sélecteur
    return !!evtTarget.closest(handle) && root.contains(evtTarget.closest(handle));
  };

  const startListeners = useCallback(() => {
    const onMove = (ev: MouseEvent | TouchEvent) => {
      if (!dragging.current || !canDrag) return;
      const { clientX, clientY } =
        "touches" in ev
          ? { clientX: (ev as TouchEvent).touches[0]?.clientX ?? 0, clientY: (ev as TouchEvent).touches[0]?.clientY ?? 0 }
          : { clientX: (ev as MouseEvent).clientX, clientY: (ev as MouseEvent).clientY };

      const sc = scaleRef.current;
      const x = (clientX - offset.current.dx) / sc;
      const y = (clientY - offset.current.dy) / sc;

      const next = clampToStage({ x: snap(x), y: snap(y) });
      setPos(next);
      onDragMove?.(next);
    };

    const onEnd = () => {
      if (!dragging.current) return;
      dragging.current = false;
      const p = posRef.current;
      save(p);
      onDragEnd?.(p);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onEnd);
      document.removeEventListener("touchmove", onMove as any);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchmove", onMove as any, { passive: false });
    document.addEventListener("touchend", onEnd);
    document.addEventListener("touchcancel", onEnd);

    return onEnd;
  }, [canDrag, onDragEnd, onDragMove]); // scale/pos via refs

  const rootRef = useRef<HTMLDivElement>(null);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canDrag) return;

    // Ignore bouton droit & ctrl/alt/meta (sélection, context menu…)
    // @ts-ignore
    if ("button" in e && e.button !== 0) return;

    const root = rootRef.current!;
    if (!isHandleHit(e.target, root)) return;

    e.stopPropagation();
    e.preventDefault();

    const { cx, cy } = getClientXY(e);
    const sc = scaleRef.current;
    // offset dans l'espace *scalé* pour avoir des coords nettes
    offset.current = { dx: cx - posRef.current.x * sc, dy: cy - posRef.current.y * sc };
    dragging.current = true;

    onDragStart?.(posRef.current);

    // premier positionnement immédiat
    const x = (cx - offset.current.dx) / sc;
    const y = (cy - offset.current.dy) / sc;
    const next = clampToStage({ x: snap(x), y: snap(y) });
    setPos(next);

    // attache les listeners jusqu’au end
    startListeners();
  };

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
      ref={rootRef}
      className={className}
      style={mergedStyle}
      onMouseDown={canDrag ? handleStart : undefined}
      onTouchStart={canDrag ? handleStart : undefined}
    >
      {children}
    </div>
  );
}
