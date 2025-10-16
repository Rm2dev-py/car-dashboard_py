// src/lib/DragSystem.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useDragMode } from "../DragContext";

/* ============================
   Stage (Responsive + Scale)
   ============================ */

type StageCtx = { scale: number; baseWidth: number; baseHeight: number };
const StageContext = createContext<StageCtx>({
  scale: 1,
  baseWidth: 1024,
  baseHeight: 600,
});

export function useStage() {
  return useContext(StageContext);
}

type ResponsiveStageProps = {
  baseWidth?: number;
  baseHeight?: number;
  className?: string;
  children: React.ReactNode;
  /** ‘contain’ garde tout visible, ‘cover’ remplit tout l’écran (peut rogner) */
  fit?: "contain" | "cover";
  /** Limiter l’upscaling si tu veux éviter > 1:1 */
  maxScale?: number;
  minScale?: number;
  /** Contrôle d’alignement de la Stage dans son wrapper */
  align?: "center" | "top-left";
  /** ✅ Nouveau : facteur de zoom global (ex: 0.85 pour réduire de 15%) */
  userScale?: number;
};

export function ResponsiveStage({
  baseWidth = 1024,
  baseHeight = 600,
  className = "",
  children,
  fit = "contain",
  maxScale = Infinity,
  minScale = 0,
  align = "center", // défaut: centré
  userScale = 1,    // ✅ défaut: pas de zoom
}: ResponsiveStageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const compute = () => {
      const w = Math.max(0, el.clientWidth);
      const h = Math.max(0, el.clientHeight);
      const sx = w / baseWidth;
      const sy = h / baseHeight;
      const raw = fit === "cover" ? Math.max(sx, sy) : Math.min(sx, sy);
      const clamped = Math.max(minScale, Math.min(raw || 0, maxScale));
      setScale(clamped > 0 ? clamped : 1);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth, baseHeight, fit, maxScale, minScale]);

  // ✅ applique le zoom utilisateur SUR l’échelle calculée
  const finalScale = scale * (userScale ?? 1);

  const ctx = useMemo(
    () => ({ scale: finalScale, baseWidth, baseHeight }),
    [finalScale, baseWidth, baseHeight]
  );

  // Positionnement selon align (inchangé, on remplace juste scale -> finalScale)
  const innerStyle: React.CSSProperties =
    align === "center"
      ? {
          position: "absolute",
          left: "44%",            // 👈 tu avais 59% : je ne touche pas
          top: "44%",
          width: baseWidth,
          height: baseHeight,
          transform: `translate(-50%, -50%) scale(${finalScale})`, // ✅
          transformOrigin: "top left",
        }
      : {
          position: "absolute",
          left: 0,
          top: 0,
          width: baseWidth,
          height: baseHeight,
          transform: `scale(${finalScale})`, // ✅
          transformOrigin: "top left",
        };

  return (
    <StageContext.Provider value={ctx}>
      <div
        ref={wrapperRef}
        className={`w-full h-full relative overflow-hidden ${className}`}
      >
        <div style={innerStyle}>{children}</div>
      </div>
    </StageContext.Provider>
  );
}

/* ============================
   Draggable
   ============================ */

type Pos = { x: number; y: number };

type DraggableProps = {
  id: string; // clé de persistance (unique)
  children: React.ReactNode;
  /** Position par défaut (coords dans le repère baseWidth×baseHeight) */
  defaultPos?: Pos;
  /** Snap en px (dans le repère base). 0 = pas de snap */
  grid?: number;
  zIndex?: number;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  /** Restreindre le drag dans la scène (0..baseWidth/baseHeight) */
  boundsStage?: boolean;
  /** Drag seulement si le mousedown cible ce sélecteur (ex: ".handle") */
  handle?: string;
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
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultPos;
    } catch {
      return defaultPos;
    }
  });

  // refs pour éviter les fermetures pendant le drag
  const posRef = useRef(pos);
  const scaleRef = useRef(scale);
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  const canDrag = dragEnabled && !disabled;
  const dragging = useRef(false);
  const offset = useRef({ dx: 0, dy: 0 });

  const snap = (v: number) => (grid > 0 ? Math.round(v / grid) * grid : v);

  const clampToStage = (p: Pos): Pos => {
    if (!boundsStage) return p;
    return {
      x: Math.max(0, Math.min(p.x, baseWidth)),
      y: Math.max(0, Math.min(p.y, baseHeight)),
    };
  };

  const save = (p: Pos) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(p));
    } catch { /* private-mode/quota, on ignore */ }
    onChangePos?.(p);
  };

  const getClientXY = (
    e:
      | MouseEvent
      | TouchEvent
      | React.MouseEvent
      | React.TouchEvent
  ): { cx: number; cy: number } => {
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
    const h = evtTarget.closest(handle);
    return !!h && root.contains(h);
  };

  const startListeners = useCallback(() => {
    const onMove = (ev: MouseEvent | TouchEvent) => {
      if (!dragging.current || !canDrag) return;

      const { clientX, clientY } =
        "touches" in ev
          ? {
              clientX: (ev as TouchEvent).touches[0]?.clientX ?? 0,
              clientY: (ev as TouchEvent).touches[0]?.clientY ?? 0,
            }
          : { clientX: (ev as MouseEvent).clientX, clientY: (ev as MouseEvent).clientY };

      const sc = scaleRef.current || 1;
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
  }, [canDrag, onDragEnd, onDragMove]);

  const rootRef = useRef<HTMLDivElement>(null);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canDrag) return;
    // @ts-ignore — ignore bouton droit
    if ("button" in e && e.button !== 0) return;

    const root = rootRef.current!;
    if (!isHandleHit(e.target, root)) return;

    e.stopPropagation();
    e.preventDefault();

    const { cx, cy } = getClientXY(e);
    const sc = scaleRef.current || 1;

    // offset dans l'espace *scalé* pour un delta propre
    offset.current = { dx: cx - posRef.current.x * sc, dy: cy - posRef.current.y * sc };
    dragging.current = true;

    onDragStart?.(posRef.current);

    // premier positionnement immédiat
    const x = (cx - offset.current.dx) / sc;
    const y = (cy - offset.current.dy) / sc;
    const next = clampToStage({ x: snap(x), y: snap(y) });
    setPos(next);

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
