// src/lib/layout.ts
export type LayoutItem = {
  component: string;
  x: number;
  y: number;
  zIndex?: number;
  grid?: number;
  visible?: boolean;
  locked?: boolean;
};
export type LayoutMap = Record<string, LayoutItem>;

const BASE_KEY = "layout_base_v1";
const OVERR_KEY = "layout_overrides_v1";

let baseLayout: LayoutMap = {};
let overrides: Partial<Record<string, Partial<LayoutItem>>> = {};

export async function loadBaseLayout(url = "/layout.base.json") {
  try {
    const res = await fetch(url, { cache: "no-cache" });
    baseLayout = await res.json();
    localStorage.setItem(BASE_KEY, JSON.stringify(baseLayout));
  } catch {
    const cached = localStorage.getItem(BASE_KEY);
    baseLayout = cached ? JSON.parse(cached) : {};
  }
  const ov = localStorage.getItem(OVERR_KEY);
  overrides = ov ? JSON.parse(ov) : {};
}

export function getLayout(): LayoutMap {
  const merged: LayoutMap = { ...baseLayout };
  for (const id of Object.keys(overrides)) {
    merged[id] = { ...(merged[id] ?? { component: "", x: 0, y: 0 }), ...(overrides[id] as any) };
  }
  return merged;
}

export function setItem(id: string, partial: Partial<LayoutItem>) {
  overrides[id] = { ...(overrides[id] ?? {}), ...partial };
  localStorage.setItem(OVERR_KEY, JSON.stringify(overrides));
}

export function resetOverrides() {
  overrides = {};
  localStorage.removeItem(OVERR_KEY);
}

export function exportLayout(): LayoutMap {
  return getLayout();
}
