// src/DragContext.tsx
import { createContext, useContext, useState } from "react";

const DragContext = createContext({
  dragEnabled: false,
  toggleDrag: () => {},
});

export function DragProvider({ children }: { children: React.ReactNode }) {
  const [dragEnabled, setDragEnabled] = useState(false);

  const toggleDrag = () => setDragEnabled((prev) => !prev);

  return (
    <DragContext.Provider value={{ dragEnabled, toggleDrag }}>
      {children}
    </DragContext.Provider>
  );
}

export function useDragMode() {
  return useContext(DragContext);
}
